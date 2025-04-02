/* eslint-disable @typescript-eslint/no-explicit-any */
import { IBehavior } from './interfaces/IBehavior';
import { IBehaviorBuilder } from './interfaces/IBehaviorBuilder';

export class BehaviorManager {
  // private methods and attributes:
  private static m_registeredBuilders: { [type: string]: IBehaviorBuilder } = {};

  // public methods and attributes:
  public static registerBehaviorBuilder(builder: IBehaviorBuilder): void {
    BehaviorManager.m_registeredBuilders[builder.type] = builder;
  }

  public static extractBehavior(json: any): IBehavior {
    if (json.type) {
      if (BehaviorManager.m_registeredBuilders[json.type]) {
        return BehaviorManager.m_registeredBuilders[String(json.type)].buildFromJSON(json);
      }
      throw new Error('Behavior Manager: behavior type is not registered.');
    }
    throw new Error('Behavior Manager: behavior type is required.');
  }
}
