/* eslint-disable @typescript-eslint/no-explicit-any */
import { Vector3 } from '../math/vector3';
import { BaseBehavior } from './baseBehavior';
import { IBehavior } from './interfaces/IBehavior';
import { IBehaviorBuilder } from './interfaces/IBehaviorBuilder';
import { IBehaviorData } from './interfaces/IBehaviorData';

export class RotationBehaviorData implements IBehaviorData {
  public name!: string;
  public rotation: Vector3 = Vector3.zero;

  public setFromJSON(json: any): void {
    if (!json.name) throw new Error('RotationBehaviorData: name is required');

    this.name = String(json.name);

    if (json.rotation) this.rotation.setFromJson(json.rotation);
  }
}

export class RotationBehaviorBuilder implements IBehaviorBuilder {
  public get type(): string {
    return 'rotation';
  }

  public buildFromJSON(json: any): IBehavior {
    let data = new RotationBehaviorData();
    data.setFromJSON(json);
    return new RotationBehavior(data);
  }
}

export class RotationBehavior extends BaseBehavior {
  // private methods and attributes:
  private m_rotation: Vector3;

  // public methods and attributes:
  constructor(data: RotationBehaviorData) {
    super(data);

    this.m_rotation = data.rotation;
  }

  public update(deltaTime: number): void {
    this.m_owner.transform.rotation.add(this.m_rotation);
    super.update(deltaTime);
  }
}
