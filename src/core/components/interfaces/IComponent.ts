import { Shader } from '../../webGL/shader';
import { SimObject } from '../../world/simObject';

export interface IComponent {
  name: string;
  readonly owner: SimObject;

  setOwner(owner: SimObject): void;
  updateReady(): void;
  update(deltaTime: number): void;
  render(shader: Shader): void;
  load(): void;
}
