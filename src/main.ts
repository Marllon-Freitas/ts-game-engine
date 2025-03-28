
export class Engine {
  // private methods and attributes:
  private m_count: number = 0;
  
  private loop(): void {
    console.log('Engine loop running');
    this.m_count++;
    document.body.innerHTML = `Hello World! ${this.m_count}`;
    requestAnimationFrame(this.loop.bind(this));
  }
  
  // public methods and attributes:
  public constructor() {
    console.log('Engine initialized');
  }

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