/* eslint-disable @typescript-eslint/no-explicit-any */
import { SimObject } from '../world/simObject';
import { IBehavior } from './interfaces/IBehavior';
import { IBehaviorData } from './interfaces/IBehaviorData';

export abstract class BaseBehavior implements IBehavior {
  protected m_data: IBehaviorData;
  protected m_owner!: SimObject;

  public name: string;

  constructor(data: IBehaviorData) {
    this.m_data = data;
    this.name = data.name;
  }

  public setOwner(owner: SimObject): void {
    this.m_owner = owner;
  }
  public update(deltaTime: number): void {}
  public apply(userData: any): void {}
}
