import { Engine } from "./engine";

// This is the main entry point for the application.
window.onload = () => {
  const engine = new Engine();
  engine.start();
}