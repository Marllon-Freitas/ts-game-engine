/* eslint-disable @typescript-eslint/no-explicit-any */
import { IBehavior } from './IBehavior';

export interface IBehaviorBuilder {
  readonly type: string;

  buildFromJSON(json: any): IBehavior;
}
