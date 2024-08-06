import { AssetManager } from './assetManager'
import { IAsset } from './iAsset'
import { IAssetLoader } from './iAssetLoader'

export class ImageAsset implements IAsset {
  public name: string
  public data: HTMLImageElement

  constructor(name: string, data: HTMLImageElement) {
    this.name = name
    this.data = data
  }

  public getWidth(): number {
    return this.data.width
  }

  public getHeight(): number {
    return this.data.height
  }
}

export class ImageAssetLoader implements IAssetLoader {
  public get supportedExtensions(): string[] {
    return ['png', 'jpg', 'jpeg', 'gif']
  }

  public loadAsset(assetName: string): void {
    const image: HTMLImageElement = new Image()
    image.onload = () => this.onImageLoaded(assetName, image)
    image.src = assetName
  }

  private onImageLoaded(assetName: string, image: HTMLImageElement): void {
    console.log(`[ImageAssetLoader] Image loaded: ${assetName}`)
    const asset = new ImageAsset(assetName, image)
    AssetManager.onAssetLoaded(asset)
  }
}
