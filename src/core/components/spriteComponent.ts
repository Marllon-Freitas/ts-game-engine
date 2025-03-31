/* eslint-disable @typescript-eslint/no-explicit-any */
import { Sprite } from '../graphics/sprite';
import { Shader } from '../webGL/shader';
import { BaseComponent } from './baseComponent';
import { IComponent } from './interfaces/IComponent';
import { IComponentBuilder } from './interfaces/IComponentBuilder';
import { IComponentData } from './interfaces/IComponentData';

export class SpriteComponentData implements IComponentData {
  public name!: string;
  public materialName!: string;

  public setFromJSON(json: any): void {
    if (json.name) this.name = String(json.name);
    if (json.material) this.materialName = String(json.material);
  }
}

export class SpriteComponentBuilder implements IComponentBuilder {
  public get type(): string {
    return 'sprite';
  }

  public buildFromJSON(json: any): IComponent {
    let data = new SpriteComponentData();
    data.setFromJSON(json);
    return new SpriteComponent(data);
  }
}

export class SpriteComponent extends BaseComponent {
  // private methods and attributes:
  private m_sprite: Sprite;

  // public methods and attributes:
  constructor(data: SpriteComponentData) {
    super(data);
    this.m_sprite = new Sprite(data.name, data.materialName);
  }

  public load(): void {
    this.m_sprite.load();
  }

  public render(shader: Shader): void {
    this.m_sprite.draw(shader, this.m_owner.worldMatrix);
    super.render(shader);
  }
}
