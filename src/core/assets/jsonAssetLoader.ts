/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { AssetManager } from './assetManager';
import { IAsset } from './interfaces/IAsset';
import { IAssetLoader } from './interfaces/IAssetLoader';

export class JSONAsset implements IAsset {
  public readonly name: string;
  public readonly data: any;

  constructor(name: string, data: any) {
    this.name = name;
    this.data = data;
  }
}

export class JSONAssetLoader implements IAssetLoader {
  // private methods and attributes:
  private onJSONLoaded(assetName: string, request: XMLHttpRequest): void {
    if (request.readyState === XMLHttpRequest.DONE) {
      if (request.status === 200) {
        console.log(`JsonAssetLoader: JSON ${assetName} loaded.`);
        let json = JSON.parse(request.responseText);
        let asset: JSONAsset = new JSONAsset(assetName, json);
        AssetManager.onAssetLoaded(asset);
      } else {
        console.error(`JsonAssetLoader: Error loading JSON ${assetName}: ${request.statusText}`);
      }
    }
  }

  // public methods and attributes:
  public get supportedFileExtensions(): string[] {
    return ['json'];
  }

  public loadAsset(assetName: string): void {
    let request: XMLHttpRequest = new XMLHttpRequest();
    request.open('GET', assetName, true);
    request.addEventListener('load', this.onJSONLoaded.bind(this, assetName, request));
    request.send();
  }
}
