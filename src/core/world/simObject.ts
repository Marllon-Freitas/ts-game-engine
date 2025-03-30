import { Matrix4x4 } from '../math/matrix4x4';
import { Transform } from '../math/transform';
import { Shader } from '../webGL/shader';
import { Scene } from './scene';

export class SimObject {
  // private methods and attributes:
  private m_id: number;
  private m_children!: SimObject[];
  private m_parent!: SimObject | null;
  private m_isLoaded: boolean = false;
  private m_scene!: Scene | null;
  private m_localMatrix: Matrix4x4 = Matrix4x4.identity();
  private m_worldMatrix: Matrix4x4 = Matrix4x4.identity();

  protected onAdded(scene: Scene): void {
    this.m_scene = scene;
  }

  // public methods and attributes:
  public name: string;
  public transform: Transform = new Transform();

  constructor(id: number, name: string, scene?: Scene) {
    this.m_id = id;
    this.name = name;
    this.m_scene = scene || null;
  }

  public get id(): number {
    return this.m_id;
  }

  public get parent(): SimObject | null {
    return this.m_parent;
  }

  public get worldMatrix(): Matrix4x4 {
    return this.m_worldMatrix;
  }

  public get isLoaded(): boolean {
    return this.m_isLoaded;
  }

  public addChild(child: SimObject): void {
    child.m_parent = this;
    this.m_children.push(child);
    if (this.m_scene) child.onAdded(this.m_scene);
  }

  public removeChild(child: SimObject): void {
    const index = this.m_children.indexOf(child);
    if (index !== -1) {
      child.m_parent = null;
      this.m_children.splice(index, 1);
    }
  }

  public getObjectByName(name: string): SimObject | null {
    if (this.name === name) return this;

    for (const child of this.m_children) {
      const found = child.getObjectByName(name);
      if (found) return found;
    }

    return null;
  }

  public load(): void {
    this.m_isLoaded = true;

    for (const child of this.m_children) {
      child.load();
    }
  }

  public update(deltaTime: number): void {
    for (const child of this.m_children) {
      child.update(deltaTime);
    }
  }

  public render(shader: Shader): void {
    for (const child of this.m_children) {
      child.render(shader);
    }
  }
}
