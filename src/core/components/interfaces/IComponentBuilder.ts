/* eslint-disable @typescript-eslint/no-explicit-any */
import { IComponent } from './IComponent';

export interface IComponentBuilder {
  readonly type: string;

  buildFromJSON(json: any): IComponent;
}
