import { Asset, IAsset } from "./Asset";

export type IVideoAsset = IAsset;

const supportTypes = ["video/mp4", "video/webm", "video/quicktime"];

export class VideoAsset extends Asset implements IVideoAsset {
  type: string = "Video";
  valid: boolean = false;
  video!: HTMLVideoElement;

  public static isSupportType(type: string) {
    return supportTypes.includes(type);
  }

  constructor(id: string, name: string, path: string) {
    super(id, name, path);
    this.init();
  }

  init() {
    this.video = document.createElement("video");
    return new Promise((resolve, reject) => {
      if (this.video.src == this.path) {
        return resolve(true);
      }
      const i = setTimeout(() => {
        reject(new Error("Timeout"));
      }, 5000);
      const onLoad = () => {
        clearTimeout(i);
        resolve(true);
      };
      this.video.onloadedmetadata = () => onLoad();
      this.video.src = this.path;
      this.video.addEventListener("error", () => {
        onLoad();
      });
      this.video.load();
    });
  }
}
