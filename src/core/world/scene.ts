import { Shader } from '../webGL/shader';
import { SimObject } from './simObject';

export class Scene {
  // private methods and attributes:
  private m_rootNode: SimObject;

  // public methods and attributes:
  constructor() {
    this.m_rootNode = new SimObject(0, '__root__', this);
  }

  public get rootNode(): SimObject {
    return this.m_rootNode;
  }

  public get isLoaded(): boolean {
    return this.m_rootNode.isLoaded;
  }

  public addObject(object: SimObject): void {
    this.m_rootNode.addChild(object);
  }

  public getObjectByName(name: string): SimObject | null {
    return this.m_rootNode.getObjectByName(name);
  }

  public load(): void {
    this.m_rootNode.load();
  }

  public update(deltaTime: number): void {
    this.m_rootNode.update(deltaTime);
  }

  public render(shader: Shader): void {
    this.m_rootNode.render(shader);
  }
}
