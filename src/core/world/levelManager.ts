import { AssetManager } from '../assets/assetManager';
import { JSONAsset } from '../assets/jsonAssetLoader';
import { IMessageHandler } from '../messages/interfaces/IMessageHandler';
import { Message } from '../messages/message';
import { MESSAGE_ASSET_LOADER_ASSET_LOADED } from '../utils';
import { Shader } from '../webGL/shader';
import { Level } from './level';

export class LevelManager implements IMessageHandler {
  // private methods and attributes:
  private static m_registeredLevels: { [id: number]: string } = {};
  private static m_globalLevelId: number = -1;
  private static m_activeLevel: Level | null = null;
  private static m_instance: LevelManager;

  private constructor() {}

  private static loadZones(asset: JSONAsset): void {
    let levelData = asset.data;
    let id: number = Number(levelData.id);
    if (isNaN(id)) throw new Error(`Invalid level ID: ${levelData.id}`);

    let levelName: string;
    if (!levelData.name) throw new Error('Level name not found in asset data.');
    levelName = String(levelData.name);

    let levelDescription: string = '';
    if (levelData.description) levelDescription = String(levelData.description);

    LevelManager.m_activeLevel = new Level(id, levelName, levelDescription);
    LevelManager.m_activeLevel.initialize(levelData);
    LevelManager.m_activeLevel.onActivated();
    LevelManager.m_activeLevel.load();
  }

  // public methods and attributes:
  public static initialize(): void {
    LevelManager.m_instance = new LevelManager();
    LevelManager.m_registeredLevels[0] = 'src/assets/levels/testLevel.json';
  }

  public static changeLevel(id: number): void {
    if (LevelManager.m_activeLevel) {
      LevelManager.m_activeLevel.onDeactivated();
      LevelManager.m_activeLevel.unload();
      LevelManager.m_activeLevel = null;
    }

    if (LevelManager.m_registeredLevels[id]) {
      if (AssetManager.isAssetLoaded(LevelManager.m_registeredLevels[id])) {
        let asset = AssetManager.getAsset(LevelManager.m_registeredLevels[id]);
        if (asset) {
          LevelManager.loadZones(asset as JSONAsset);
        } else {
          throw new Error(`Asset for level ID ${id} not found.`);
        }
      } else {
        Message.subscribe(
          MESSAGE_ASSET_LOADER_ASSET_LOADED + LevelManager.m_registeredLevels[id],
          LevelManager.m_instance
        );
        AssetManager.loadAsset(LevelManager.m_registeredLevels[id]);
      }
    } else {
      throw new Error(`Level with ID ${id} not found.`);
    }
  }

  public static update(deltaTime: number): void {
    if (LevelManager.m_activeLevel) LevelManager.m_activeLevel.update(deltaTime);
  }

  public static render(shader: Shader): void {
    if (LevelManager.m_activeLevel) LevelManager.m_activeLevel.render(shader);
  }

  public onMessage(message: Message): void {
    if (message.code.indexOf(MESSAGE_ASSET_LOADER_ASSET_LOADED) !== -1) {
      let asset = message.context as JSONAsset;
      LevelManager.loadZones(asset);
    }
  }
}
