// components/init.ts

import { ComponentManager } from './componentManager';
import { SpriteComponentBuilder } from './spriteComponent';

export function initializeComponents(): void {
  ComponentManager.registerComponentBuilder(new SpriteComponentBuilder());
}
