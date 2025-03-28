
export class Engine {
  constructor() {
    console.log('Engine initialized');
  }

  private m_count: number = 0;

  // private methods
  private loop(): void {
    console.log('Engine loop running');
    this.m_count++;
    document.body.innerHTML = `Hello World! ${this.m_count}`;
    requestAnimationFrame(this.loop.bind(this));
  }

  // public methods
  public start(): void {
    console.log('Engine started');
    this.loop();
  }
}

window.onload = () => {
  document.body.innerHTML = 'Hello World!'
  const engine = new Engine();
  // engine.start();
  console.log('Engine instance created:', engine);
}