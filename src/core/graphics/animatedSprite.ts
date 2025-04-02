import { AssetManager } from '../assets/assetManager';
import { ImageAsset } from '../assets/imageAssetLoader';
import { Vector2 } from '../math/vector2';
import { IMessageHandler } from '../messages/interfaces/IMessageHandler';
import { Message } from '../messages/message';
import { MESSAGE_ASSET_LOADER_ASSET_LOADED } from '../utils';
import { MaterialManager } from './materialManager';
import { Sprite } from './sprite';

class UVInfo {
  public min: Vector2;
  public max: Vector2;

  constructor(min: Vector2, max: Vector2) {
    this.min = min;
    this.max = max;
  }
}

export class AnimatedSprite extends Sprite implements IMessageHandler {
  // private methods and attributes:
  private m_frameWidth: number;
  private m_frameHeight: number;
  private m_frameCount: number;
  private m_frameSequence: number[];
  private m_currentFrame: number = 0;
  private m_currentTime: number = 0;
  private m_frameTime: number = 93; // the time in milliseconds between frames
  private m_frameUVs: UVInfo[] = [];
  private m_assetLoaded: boolean = false;
  private m_asseWidth: number = 2;
  private m_assetHeight: number = 2;
  private m_isPlaying: boolean = true;

  private calculateUVs(): void {
    let totalWidth: number = 0;
    let yValue: number = 0;

    for (let i = 0; i < this.m_frameCount; i++) {
      totalWidth = i * this.m_frameWidth;
      if (totalWidth >= this.m_asseWidth) {
        yValue++;
        totalWidth = 0;
      }

      let uMin = (i * this.m_frameWidth) / this.m_asseWidth;
      let vMin = (yValue * this.m_frameHeight) / this.m_assetHeight;
      let minUV: Vector2 = new Vector2(uMin, vMin);

      let uMax = (i * this.m_frameWidth + this.m_frameWidth) / this.m_asseWidth;
      let vMax = (yValue * this.m_frameHeight + this.m_frameHeight) / this.m_assetHeight;
      let maxUV: Vector2 = new Vector2(uMax, vMax);

      this.m_frameUVs.push(new UVInfo(minUV, maxUV));
    }
  }

  private setupFromMaterial(): void {
    if (!this.m_assetLoaded) {
      let material = MaterialManager.getMaterial(this.m_materialName);
      if (material?.diffuseTexture?.isLoaded) {
        if (AssetManager.isAssetLoaded(material.diffuseTextureName)) {
          this.m_assetHeight = material.diffuseTexture.height;
          this.m_asseWidth = material.diffuseTexture.width;
          this.m_assetLoaded = true;
          this.calculateUVs();
        }
      }
    }
  }

  // public methods and attributes:
  constructor(
    name: string,
    materialName: string,
    width: number = 100,
    height: number = 100,
    frameWidth: number = 32,
    frameHeight: number = 32,
    frameCount: number = 1,
    frameSequence: number[] = []
  ) {
    super(name, materialName, width, height);

    this.m_frameWidth = frameWidth;
    this.m_frameHeight = frameHeight;
    this.m_frameCount = frameCount;
    this.m_frameSequence = frameSequence;

    if (this.m_material?.diffuseTextureName) {
      Message.subscribe(
        MESSAGE_ASSET_LOADER_ASSET_LOADED + this.m_material.diffuseTextureName,
        this
      );

      const asset = AssetManager.getAsset(this.m_material?.diffuseTextureName) as ImageAsset;
      if (asset) {
        this.m_assetLoaded = true;
        this.m_asseWidth = asset.width;
        this.m_assetHeight = asset.height;
        this.calculateUVs();
      }
    }
  }

  public play(): void {
    this.m_isPlaying = true;
  }

  public stop(): void {
    this.m_isPlaying = false;
  }

  public setFrame(frameNumber: number): void {
    if (frameNumber >= this.m_frameCount)
      throw new Error(`Frame ${frameNumber} out of range, frame count: ${this.m_frameCount}`);
    this.m_currentFrame = frameNumber;
  }

  public get isPlaying(): boolean {
    return this.m_isPlaying;
  }

  public destroy(): void {
    super.destroy();
  }

  public load(): void {
    super.load();
    if (!this.m_assetLoaded) this.setupFromMaterial();
  }

  public update(deltaTime: number): void {
    if (!this.m_assetLoaded) {
      this.setupFromMaterial();
      return;
    }

    if (!this.m_isPlaying) return;

    this.m_currentTime += deltaTime;
    if (this.m_currentTime >= this.m_frameTime) {
      this.m_currentFrame++;
      this.m_currentTime = 0;
      if (this.m_currentFrame >= this.m_frameSequence.length) this.m_currentFrame = 0;

      let frameUvs = this.m_frameSequence[this.m_currentFrame];

      this.m_vertices[0].textureCoordinates.copyFrom(this.m_frameUVs[frameUvs].min);
      this.m_vertices[1].textureCoordinates = new Vector2(
        this.m_frameUVs[frameUvs].min.x,
        this.m_frameUVs[frameUvs].max.y
      );
      this.m_vertices[2].textureCoordinates.copyFrom(this.m_frameUVs[frameUvs].max);
      this.m_vertices[3].textureCoordinates.copyFrom(this.m_frameUVs[frameUvs].max);
      this.m_vertices[4].textureCoordinates = new Vector2(
        this.m_frameUVs[frameUvs].max.x,
        this.m_frameUVs[frameUvs].min.y
      );
      this.m_vertices[5].textureCoordinates.copyFrom(this.m_frameUVs[frameUvs].min);

      this.m_buffer.clearData();

      for (let vertices of this.m_vertices) {
        this.m_buffer.pushBackData(vertices.toArray());
      }

      this.m_buffer.uploadData();
      this.m_buffer.unbind();
    }
    super.update(deltaTime);
  }

  public onMessage(message: Message): void {
    if (
      this.m_material?.diffuseTextureName &&
      message.code === MESSAGE_ASSET_LOADER_ASSET_LOADED + this.m_material.diffuseTextureName
    ) {
      this.m_assetLoaded = true;
      let asset = message.context as ImageAsset;
      this.m_asseWidth = asset.width;
      this.m_assetHeight = asset.height;
      this.calculateUVs();
    }
  }
}
