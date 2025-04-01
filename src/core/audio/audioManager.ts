export class SoundEffect {
  // private methods and attributes:
  private m_player: HTMLAudioElement | null = null;

  // public methods and attributes:
  public assetPath: string = '';

  constructor(assetPath: string, loop: boolean = false) {
    this.m_player = new Audio(assetPath);
    this.m_player.loop = loop;
  }

  public get loop(): boolean {
    return this.m_player ? this.m_player.loop : false;
  }

  public set loop(value: boolean) {
    if (this.m_player) this.m_player.loop = value;
  }

  public play(): void {
    if (!this.m_player) return;
    if (!this.m_player.paused) this.stop();
    this.m_player.play();
  }

  public pause(): void {
    if (this.m_player) this.m_player.pause();
  }

  public stop(): void {
    if (this.m_player) {
      this.m_player.pause();
      this.m_player.currentTime = 0;
    }
  }
  public destroy(): void {
    this.m_player = null;
  }
}

export class AudioManager {
  // private methods and attributes:
  private static m_soundEffects: { [name: string]: SoundEffect } = {};

  // public methods and attributes:
  public static loadSoundFile(name: string, filePath: string, loop: boolean): void {
    AudioManager.m_soundEffects[name] = new SoundEffect(filePath, loop);
  }

  public static playSound(filePath: string): void {
    if (AudioManager.m_soundEffects[filePath]) {
      AudioManager.m_soundEffects[filePath].play();
    } else {
      // eslint-disable-next-line no-console
      console.warn(`Sound effect ${filePath} not found.`);
    }
  }

  public static pauseSound(filePath: string): void {
    if (AudioManager.m_soundEffects[filePath]) {
      AudioManager.m_soundEffects[filePath].pause();
    } else {
      // eslint-disable-next-line no-console
      console.warn(`Sound effect ${filePath} not found.`);
    }
  }

  public static stopSound(filePath: string): void {
    if (AudioManager.m_soundEffects[filePath]) {
      AudioManager.m_soundEffects[filePath].stop();
    } else {
      // eslint-disable-next-line no-console
      console.warn(`Sound effect ${filePath} not found.`);
    }
  }

  public static pauseAllSound(): void {
    for (const soundEffect of Object.values(AudioManager.m_soundEffects)) {
      soundEffect.pause();
    }
  }

  public static stopAllSound(): void {
    for (const soundEffect of Object.values(AudioManager.m_soundEffects)) {
      soundEffect.stop();
    }
  }
}
