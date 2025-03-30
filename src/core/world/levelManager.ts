import { Shader } from '../webGL/shader';
import { Level } from './level';
import { TestLevel } from './testLevel';

export class LevelManager {
  // private methods and attributes:
  private static m_levels: { [id: number]: Level } = {};
  private static m_globalLevelId: number = -1;
  private static m_activeLevel: Level;

  private constructor() {}

  // public methods and attributes:
  public static createLevel(name: string, description: string): number {
    LevelManager.m_globalLevelId++;
    const level = new Level(LevelManager.m_globalLevelId, name, description);
    LevelManager.m_levels[LevelManager.m_globalLevelId] = level;
    return LevelManager.m_globalLevelId;
  }

  // temp:
  public static createTestLevel(): number {
    LevelManager.m_globalLevelId++;

    const level = new TestLevel(LevelManager.m_globalLevelId, 'TestLevel', 'TestLevel');
    LevelManager.m_levels[LevelManager.m_globalLevelId] = level;
    return LevelManager.m_globalLevelId;
  }

  public static changeLevel(id: number): void {
    if (LevelManager.m_activeLevel) {
      LevelManager.m_activeLevel.onDeactivated();
      LevelManager.m_activeLevel.unload();
    }

    if (LevelManager.m_levels[id]) {
      LevelManager.m_activeLevel = LevelManager.m_levels[id];
      LevelManager.m_activeLevel.onActivated();
      LevelManager.m_activeLevel.load();
    }
  }

  public static update(deltaTime: number): void {
    if (LevelManager.m_activeLevel) LevelManager.m_activeLevel.update(deltaTime);
  }

  public static render(shader: Shader): void {
    if (LevelManager.m_activeLevel) LevelManager.m_activeLevel.render(shader);
  }
}
