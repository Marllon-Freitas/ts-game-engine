import { SimObject } from '../../world/simObject';

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IBehavior {
  name: string;

  setOwner(owner: SimObject): void;
  updateReady(): void;
  update(deltaTime: number): void;
  apply(userData: any): void;
}
