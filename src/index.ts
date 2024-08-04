export class Engine {
  public constructor() {}

  private m_count: number = 0

  public start(): void {
    this.loop()
  }

  private loop(): void {
    this.m_count++
    document.title = `Game loop running ! ${this.m_count}`
    requestAnimationFrame(() => this.loop())
  }
}

window.onload = () => {
  const engine = new Engine()
  engine.start()
}
