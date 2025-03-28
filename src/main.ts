import { Engine } from './core/engine';

let engine: Engine;

// This is the main entry point for the application.
window.onload = () => {
  engine = new Engine();
  engine.start();
};

window.onresize = () => {
  if (engine) engine.resize();
};
