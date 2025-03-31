/* eslint-disable @typescript-eslint/no-explicit-any */
import { IBehavior } from './interfaces/IBehavior';
import { IBehaviorBuilder } from './interfaces/IBehaviorBuilder';

export class BehaviorManager {
  // private methods and attributes:
  private static m_registeredBuilders: { [type: string]: IBehaviorBuilder } = {};

  // public methods and attributes:
  public static registerBehaviorBuilder(builder: IBehaviorBuilder): void {
    this.m_registeredBuilders[builder.type] = builder;
  }

  public static extractBehavior(json: any): IBehavior {
    if (json.type) {
      if (this.m_registeredBuilders[json.type]) {
        return this.m_registeredBuilders[String(json.type)].buildFromJSON(json);
      }
      throw new Error('Behavior type not found in JSON.');
    }
    throw new Error('JSON does not contain a behavior type.');
  }
}
