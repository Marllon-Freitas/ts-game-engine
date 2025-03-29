export interface IAssetLoader {
  readonly supportedFileExtensions: string[];

  loadAsset(assetName: string): void;
}
