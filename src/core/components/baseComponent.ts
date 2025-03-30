import { Shader } from '../webGL/shader';
import { SimObject } from '../world/simObject';

export abstract class BaseComponent {
  protected m_owner!: SimObject;

  public name: string;

  constructor(name: string) {
    this.name = name;
  }

  public setOwner(owner: SimObject) {
    this.m_owner = owner;
  }

  public get owner(): SimObject {
    return this.m_owner;
  }

  // TODO:
  public update(deltaTime: number): void {}

  // TODO:
  public render(shader: Shader): void {}

  // TODO:
  public load(): void {}
}
