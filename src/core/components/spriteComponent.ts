import { Sprite } from '../graphics/sprite';
import { Shader } from '../webGL/shader';
import { BaseComponent } from './baseComponent';

export class SpriteComponent extends BaseComponent {
  // private methods and attributes:
  private m_sprite: Sprite;

  // public methods and attributes:
  constructor(name: string, materialName: string) {
    super(name);
    this.m_sprite = new Sprite(name, materialName);
  }

  public load(): void {
    this.m_sprite.load();
  }

  public render(shader: Shader): void {
    this.m_sprite.draw(shader, this.m_owner.worldMatrix);
    super.render(shader);
  }
}
