/* eslint-disable @typescript-eslint/no-explicit-any */
import { LevelStates } from '../utils';
import { Shader } from '../webGL/shader';
import { Scene } from './scene';
import { SimObject } from './simObject';

export class Level {
  // private methods and attributes:
  private m_id: number;
  private m_name: string;
  private m_description: string;
  private m_scene: Scene;
  private m_state: LevelStates = LevelStates.UNINITIALIZED;
  private m_globalId: number = -1;

  private loadSimObject(dataSection: any, parent: SimObject | null): void {
    let name: string = dataSection.name || 'UnnamedObject';

    this.m_globalId++;
    let simObject = new SimObject(this.m_globalId, name, this.m_scene);

    if (dataSection.transform) {
      simObject.transform.setFromJson(dataSection.transform);
    }

    if (dataSection.object) {
      for (let objectData in dataSection.children) {
        let object = dataSection.children[objectData];
        this.loadSimObject(object, simObject);
      }
    }

    if (parent) {
      parent.addChild(simObject);
    }
  }

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

  public initialize(levelData: any): void {
    if (!levelData.object) throw new Error('Level data does not contain object information.');

    for (const objectData in levelData.object) {
      const object = levelData.object[objectData];

      this.loadSimObject(object, this.m_scene.rootNode);
    }
  }
}
