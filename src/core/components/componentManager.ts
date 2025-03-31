/* eslint-disable @typescript-eslint/no-explicit-any */
import { IComponent } from './interfaces/IComponent';
import { IComponentBuilder } from './interfaces/IComponentBuilder';

export class ComponentManager {
  // private methods and attributes:
  private static m_registeredBuilders: { [type: string]: IComponentBuilder } = {};

  // public methods and attributes:
  public static registerComponentBuilder(builder: IComponentBuilder): void {
    this.m_registeredBuilders[builder.type] = builder;
  }

  public static extractComponent(json: any): IComponent {
    if (json.type) {
      if (this.m_registeredBuilders[json.type]) {
        return this.m_registeredBuilders[String(json.type)].buildFromJSON(json);
      }
      throw new Error('Component type not found in JSON.');
    }
    throw new Error('JSON does not contain a component type.');
  }
}
