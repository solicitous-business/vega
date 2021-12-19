import * as T from "three";
import { BufferGeometry, Material } from "three";
import { VideoAsset } from "../assets";
import { IVector3 } from "../math/Vector3";
import { IStrip, Strip } from "./Strip";
import { PlayMode, PLAY_EVERY_FRAME } from "~/plugins/config";
import { VegaError } from "~/plugins/error";

const FPS_ERROR_TOLERANCE = 0.01;
const ASSET_SEEK_TIMEOUT_MS = 10000;

export type IVideoStrip = IStrip & {
  id?: string;
  start?: number;
  length?: number;
  position: IVector3;
  layer?: number;
  type?: string;
  videoOffset: number;
  readonly assetId: string;
};

export class VideoStrip extends Strip {
  position: T.Vector3 = new T.Vector3(0, 0, 0);
  type: string = "Video";

  videoOffset: number = 0;

  canvas?: HTMLCanvasElement;
  obj!: T.Mesh;
  ctx?: CanvasRenderingContext2D | null;
  tex?: T.Texture;
  mat?: Material;
  geo?: BufferGeometry;

  playRequests: number[] = [];
  videoDuration: number = 0;

  event: EventTarget = new EventTarget();

  videoAsset?: VideoAsset;

  get src() {
    return this.videoAsset?.video.src;
  }

  get video() {
    return this.videoAsset?.video;
  }

  constructor(iface: IVideoStrip, videoAsset?: VideoAsset) {
    super();
    this.videoAsset = videoAsset;
    this.videoOffset = iface.videoOffset;
    this.position = new T.Vector3(
      iface.position.x,
      iface.position.y,
      iface.position.z
    );
    if (iface.length) this.length = iface.length;
    if (iface.layer) this.layer = iface.layer;
    if (iface.start) this.start = iface.start;

    this.canvas = document.createElement("canvas");

    this.ctx = this.canvas.getContext("2d");
    if (!this.ctx) throw new Error("context2d error");
    this.ctx.fillStyle = "#ffffff";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.id = iface.id;
    this.updateAsset(videoAsset);
    this.obj?.position.copy(this.position);
  }

  public toInterface(): IVideoStrip {
    return {
      id: this.id,
      length: this.length,
      position: {
        x: this.position.x,
        y: this.position.y,
        z: this.position.z,
      },
      start: this.start,
      videoOffset: this.videoOffset,
      type: this.type,
      layer: this.layer,
      assetId: this.videoAsset?.id || "",
    };
  }

  public updateAsset(asset?: VideoAsset) {
    if (!this.canvas) return;
    if (!asset) return;
    if (this.tex) this.tex.dispose();
    if (this.mat) this.mat.dispose();
    if (this.geo) this.geo.dispose();
    if (this.obj) this.obj.removeFromParent();

    this.videoAsset = asset;

    if (!this.video) return;
    console.log(this.video.videoHeight, this.video.videoWidth);

    this.videoDuration = this.video.duration;
    this.canvas.width = this.video.videoWidth;
    this.canvas.height = this.video.videoHeight;

    this.tex = new T.VideoTexture(
      this.videoAsset.video,
      undefined,
      undefined,
      undefined,
      T.LinearFilter,
      T.LinearFilter
    );

    this.mat = new T.MeshBasicMaterial({
      map: this.tex,
      side: T.DoubleSide,
    });

    this.geo = new T.PlaneGeometry(this.canvas.width, this.canvas.height);

    this.obj = new T.Mesh(this.geo, this.mat);
    this.obj.uuid = this.id;

    this.event.dispatchEvent(new CustomEvent("update"));
    console.log(this.tex, this.canvas.width, this.canvas.height);
  }

  public async update(
    time: number,
    delta: number,
    isPlay: boolean,
    playMode: PlayMode,
    fps: number
  ) {
    const lwoFps = delta < 1000 / fps - FPS_ERROR_TOLERANCE;
    if (this.tex) this.tex.needsUpdate = true;
    if (!this.obj) return;
    if (this.ctx && this.video) this.ctx.drawImage(this.video, 0, 0);
    this.obj.position.copy(this.position);
    this.obj.position.setZ(this.layer);

    if (!this.video) return;
    if (this.start < time && time < this.end) {
      this.obj.visible = true;
      this.video.volume = 1;
      if (isPlay && this.video.paused) {
        this.playRequests.push(0);
        this.video.play().then(() => {
          this.playRequests.pop();
        });
        this.video.currentTime = time - this.start + this.videoOffset;
      }
      if (!isPlay) {
        this.video.pause();
      }
      if (lwoFps) {
        this.video.currentTime = time - this.start + this.videoOffset;
      }
      if (playMode == PLAY_EVERY_FRAME) {
        await this.wait(time - this.start + this.videoOffset);
      }
    } else {
      // this.video.volume = 0;
      // if (!this.video.paused) {
      //   this.video.pause();
      // }
      // this.obj.visible = false;
    }
  }

  wait(time: number) {
    return new Promise((resolve, reject) => {
      if (!this.video) return resolve(true);
      const timeout = setTimeout(() => {
        reject(new VegaError("Video Seek Timeout"));
      }, ASSET_SEEK_TIMEOUT_MS);
      this.video.onseeked = () => {
        clearTimeout(timeout);
        resolve(true);
      };
      this.video.currentTime = time + this.videoOffset;
    });
  }
}
