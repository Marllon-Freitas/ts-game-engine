export interface IAssetLoader {
  readonly supportedExtensions: string[]
  // eslint-disable-next-line no-unused-vars
  loadAsset(assetName: string): void
}
