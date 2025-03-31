// messages
export enum MessagePriority {
  NORMAL,
  HIGH
}

// assets
export const MESSAGE_ASSET_LOADER_ASSET_LOADED = 'MESSAGE_ASSET_LOADER_ASSET_LOADED:: ';
export const SUPPORTED_FILE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif'];

// levels
export enum LevelStates {
  UNINITIALIZED,
  LOADING,
  UPDATING
}

// input
export enum Keys {
  LEFT = 37,
  UP = 38,
  RIGHT = 39,
  DOWN = 40
}

export const MESSAGE_MOUSE_UP = 'MOUSE_UP';
export const MESSAGE_MOUSE_DOWN = 'MOUSE_DOWN';
