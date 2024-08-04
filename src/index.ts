import { Engine } from './core/engine'

let engine = new Engine()

window.onload = () => {
  engine = new Engine()
  engine.start()
}

window.onresize = () => {
  engine.resize()
}
