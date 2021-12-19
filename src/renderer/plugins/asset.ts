import {
  AudioAsset,
  FontAsset,
  IAsset,
  VideoAsset,
  ImageAsset,
  Asset,
} from "~/models/assets";

export class AssetUtil {
  public static async interfacesToInstances(assets: IAsset[]) {
    const as: Asset[] = [];
    for (let i = 0; i < assets.length; i++) {
      const a = assets[i];
      if (a.type == "Audio") {
        const aa = new AudioAsset(a.id, a.name, a.path);
        as.push(aa);
      } else if (a.type == "Video") {
        const v = new VideoAsset(a.id, a.name, a.path);
        await v.init();
        as.push(v);
      } else if (a.type == "Font") {
        const fa = new FontAsset(a.id, a.name, a.path);
        as.push(fa);
      } else if (a.type == "Image") {
        const ia = new ImageAsset(a.id, a.name, a.path);
        as.push(ia);
      }
    }

    return as;
  }
}
