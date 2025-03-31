import { Shader } from '../webGL/shader';
import { SimObject } from '../world/simObject';
import { IComponent } from './interfaces/IComponent';
import { IComponentData } from './interfaces/IComponentData';

export abstract class BaseComponent implements IComponent {
  protected m_owner!: SimObject;
  protected m_data: IComponentData;

  public name: string;

  constructor(data: IComponentData) {
    this.m_data = data;
    this.name = data.name;
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
