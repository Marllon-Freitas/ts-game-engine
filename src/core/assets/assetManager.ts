import { MESSAGE_ASSET_LOADER_ASSET_LOADED } from '../../utils';
import { Message } from '../messages/message';
import { ImageAssetLoader } from './imageAssetLoader';
import { IAsset } from './interfaces/IAsset';
import { IAssetLoader } from './interfaces/IAssetLoader';

export class AssetManager {
  // private methods and attributes:
  private static m_loaders: IAssetLoader[] = [];
  private static m_loadedAssets: { [name: string]: IAsset } = {};

  private constructor() {}

  // public methods and attributes:
  public static initialize(): void {
    AssetManager.m_loaders.push(new ImageAssetLoader());
  }

  public static registerAssetLoader(loader: IAssetLoader): void {
    this.m_loaders.push(loader);
  }

  public static onAssetLoaded(asset: IAsset): void {
    AssetManager.m_loadedAssets[asset.name] = asset;
    Message.send(MESSAGE_ASSET_LOADER_ASSET_LOADED + asset.name, this, asset);
  }

  public static loadAsset(assetName: string): void {
    let extension = assetName.split('.').pop()?.toLowerCase();
    if (!extension) {
      // eslint-disable-next-line no-console
      console.error(`AssetManager: Cannot load asset ${assetName}. No file extension found.`);
      return;
    }

    for (let loader of this.m_loaders) {
      if (loader.supportedFileExtensions.indexOf(extension) !== -1) {
        loader.loadAsset(assetName);
        return;
      }
    }
    // eslint-disable-next-line no-console
    console.error(
      `AssetManager: Cannot load asset ${assetName}. No loader found for file extension ${extension}.`
    );
  }

  public static isAssetLoaded(assetName: string): boolean {
    return this.m_loadedAssets[assetName] !== undefined;
  }

  public static getAsset(assetName: string): IAsset | undefined {
    if (this.m_loadedAssets[assetName] !== undefined) {
      return this.m_loadedAssets[assetName];
    } else {
      this.loadAsset(assetName);
    }

    return undefined;
  }
}
