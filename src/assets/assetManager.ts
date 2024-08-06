import { Message } from '../message/message'
import { IAsset } from './iAsset'
import { IAssetLoader } from './iAssetLoader'
import { ImageAssetLoader } from './imageAssetLoader'

export const MESSAGE_ASSET_LOADER_ASSET_LOADED =
  'MESSAGE_ASSET_LOADER_ASSET_LOADED'

export class AssetManager {
  private static m_loaders: IAssetLoader[] = []
  private static m_loadedAssets: { [key: string]: IAsset } = {}

  public static initialize(): void {
    AssetManager.m_loaders.push(new ImageAssetLoader())
  }

  public static registerLoader(loader: IAssetLoader): void {
    AssetManager.m_loaders.push(loader)
  }

  public static onAssetLoaded(asset: IAsset): void {
    AssetManager.m_loadedAssets[asset.name] = asset
    Message.sendMessage(
      `MESSAGE_ASSET_LOADER_ASSET_LOADED::${asset.name}`,
      this,
      asset
    )
  }

  public static loadAsset(assetName: string): void {
    const extension = assetName.split('.').pop()
    if (!extension) {
      console.error(
        '[AssetManager] Unable to load asset with no extension:',
        assetName
      )
      return
    }

    for (const loader of AssetManager.m_loaders) {
      if (loader.supportedExtensions.indexOf(extension) !== -1) {
        loader.loadAsset(assetName)
        return
      }
    }
  }

  public static isAssetLoaded(assetName: string): boolean {
    return AssetManager.m_loadedAssets[assetName] !== undefined
  }

  public static getAsset(assetName: string): IAsset | undefined {
    if (AssetManager.isAssetLoaded(assetName)) {
      return AssetManager.m_loadedAssets[assetName]
    } else {
      AssetManager.loadAsset(assetName)
    }
    return undefined
  }
}
