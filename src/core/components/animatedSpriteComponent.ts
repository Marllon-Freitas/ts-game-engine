/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnimatedSprite } from '../graphics/animatedSprite';
import { Shader } from '../webGL/shader';
import { BaseComponent } from './baseComponent';
import { IComponent } from './interfaces/IComponent';
import { IComponentBuilder } from './interfaces/IComponentBuilder';
import { IComponentData } from './interfaces/IComponentData';
import { SpriteComponentData } from './spriteComponent';

export class AnimatedSpriteComponentData extends SpriteComponentData implements IComponentData {
  public frameWidth!: number;
  public frameHeight!: number;
  public frameCount!: number;
  public frameSequence: number[] = [];

  public setFromJSON(json: any): void {
    super.setFromJSON(json);

    if (
      json.frameWidth === undefined ||
      json.frameHeight === undefined ||
      json.frameCount === undefined ||
      json.frameSequence === undefined
    ) {
      throw new Error(
        "AnimatedSpriteComponentData: 'frameWidth', 'frameHeight', 'frameCount' and 'frameSequence' are required"
      );
    }

    this.frameWidth = Number(json.frameWidth);
    this.frameHeight = Number(json.frameHeight);
    this.frameCount = Number(json.frameCount);

    this.frameSequence = json.frameSequence;
  }
}

export class AnimatedSpriteComponentBuilder implements IComponentBuilder {
  public get type(): string {
    return 'animatedSprite';
  }

  public buildFromJSON(json: any): IComponent {
    let data = new AnimatedSpriteComponentData();
    data.setFromJSON(json);
    return new AnimatedSpriteComponent(data);
  }
}

export class AnimatedSpriteComponent extends BaseComponent {
  // private methods and attributes:
  private m_sprite: AnimatedSprite;

  // public methods and attributes:
  constructor(data: AnimatedSpriteComponentData) {
    super(data);
    this.m_sprite = new AnimatedSprite(
      data.name,
      data.materialName,
      data.frameWidth,
      data.frameHeight,
      data.frameWidth,
      data.frameHeight,
      data.frameCount,
      data.frameSequence
    );
  }

  public load(): void {
    this.m_sprite.load();
  }

  public update(deltaTime: number): void {
    this.m_sprite.update(deltaTime);
    super.update(deltaTime);
  }

  public render(shader: Shader): void {
    this.m_sprite.draw(shader, this.m_owner.worldMatrix);
    super.render(shader);
  }
}
