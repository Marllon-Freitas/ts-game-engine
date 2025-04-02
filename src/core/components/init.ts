import { BehaviorManager } from '../behaviors/behaviorManager';
import { KeyboardMovementBehaviorBuilder } from '../behaviors/keyboardMovementBehavior';
import { RotationBehaviorBuilder } from '../behaviors/rotationBehavior';
import { AnimatedSpriteComponentBuilder } from './animatedSpriteComponent';
import { CollisionComponentBuilder } from './collisionComponent';
import { ComponentManager } from './componentManager';
import { SpriteComponentBuilder } from './spriteComponent';

export function initializeComponents(): void {
  ComponentManager.registerComponentBuilder(new AnimatedSpriteComponentBuilder());
  ComponentManager.registerComponentBuilder(new SpriteComponentBuilder());
  ComponentManager.registerComponentBuilder(new CollisionComponentBuilder());
  BehaviorManager.registerBehaviorBuilder(new RotationBehaviorBuilder());
  BehaviorManager.registerBehaviorBuilder(new KeyboardMovementBehaviorBuilder());
}
