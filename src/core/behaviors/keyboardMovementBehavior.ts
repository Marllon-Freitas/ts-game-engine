/* eslint-disable @typescript-eslint/no-explicit-any */
import { InputManager } from '../input/inputManager';
import { Keys } from '../utils';
import { BaseBehavior } from './baseBehavior';
import { IBehavior } from './interfaces/IBehavior';
import { IBehaviorBuilder } from './interfaces/IBehaviorBuilder';
import { IBehaviorData } from './interfaces/IBehaviorData';

export class KeyboardMovementBehaviorData implements IBehaviorData {
  public name!: string;
  public speed: number = 0.1;

  public setFromJSON(json: any): void {
    if (!json.name) throw new Error('RotationBehaviorData: name is required');
    this.name = String(json.name);
    if (json.speed) {
      this.speed = Number(json.speed);
    }
  }
}

export class KeyboardMovementBehaviorBuilder implements IBehaviorBuilder {
  public get type(): string {
    return 'keyboardMovement';
  }

  public buildFromJSON(json: any): IBehavior {
    let data = new KeyboardMovementBehaviorData();
    data.setFromJSON(json);
    return new KeyboardMovementBehavior(data);
  }
}

export class KeyboardMovementBehavior extends BaseBehavior {
  public speed: number = 0.1;
  constructor(data: KeyboardMovementBehaviorData) {
    super(data);

    this.speed = data.speed;
  }

  public update(deltaTime: number): void {
    if (InputManager.isKeyDown(Keys.LEFT)) {
      this.m_owner.transform.position.x -= this.speed * deltaTime;
    }
    if (InputManager.isKeyDown(Keys.RIGHT)) {
      this.m_owner.transform.position.x += this.speed * deltaTime;
    }
    if (InputManager.isKeyDown(Keys.UP)) {
      this.m_owner.transform.position.y -= this.speed * deltaTime;
    }
    if (InputManager.isKeyDown(Keys.DOWN)) {
      this.m_owner.transform.position.y += this.speed * deltaTime;
    }
    super.update(deltaTime);
  }
}
