import { LevelStates } from '../utils';
import { Shader } from '../webGL/shader';
import { Scene } from './scene';

export class Level {
  // private methods and attributes:
  private m_id: number;
  private m_name: string;
  private m_description: string;
  private m_scene: Scene;
  private m_state: LevelStates = LevelStates.UNINITIALIZED;

  // public methods and attributes:
  constructor(id: number, name: string, description: string) {
    this.m_id = id;
    this.m_name = name;
    this.m_description = description;
    this.m_scene = new Scene();
  }

  public get id(): number {
    return this.m_id;
  }

  public get name(): string {
    return this.m_name;
  }

  public get description(): string {
    return this.m_description;
  }

  public get scene(): Scene {
    return this.m_scene;
  }

  public load(): void {
    this.m_state = LevelStates.LOADING;
    this.m_scene.load();
    this.m_state = LevelStates.UPDATING;
  }

  public unload(): void {}

  public update(deltaTime: number): void {
    if (this.m_state === LevelStates.UPDATING) this.m_scene.update(deltaTime);
  }

  public render(shader: Shader): void {
    if (this.m_state === LevelStates.UPDATING) this.m_scene.render(shader);
  }

  // TODO:
  public onActivated(): void {}

  // TODO:
  public onDeactivated(): void {}
}
