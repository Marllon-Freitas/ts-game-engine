import { BehaviorManager } from '../behaviors/behaviorManager';
import { RotationBehaviorBuilder } from '../behaviors/rotationBehavior';
import { ComponentManager } from './componentManager';
import { SpriteComponentBuilder } from './spriteComponent';

export function initializeComponents(): void {
  ComponentManager.registerComponentBuilder(new SpriteComponentBuilder());
  BehaviorManager.registerBehaviorBuilder(new RotationBehaviorBuilder());
}
