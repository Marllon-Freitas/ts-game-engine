import { Vector2 } from '../math/vector2';
import { Message } from '../messages/message';
import { Keys, MESSAGE_MOUSE_DOWN, MESSAGE_MOUSE_UP } from '../utils';

export class MouseContext {
  public leftDown: boolean;
  public rightDown: boolean;
  public position: Vector2;

  constructor(leftDown: boolean, rightDown: boolean, position: Vector2) {
    this.leftDown = leftDown;
    this.rightDown = rightDown;
    this.position = position;
  }
}

export class InputManager {
  // private methods and attributes:
  private static m_keys: boolean[] = [];
  private static m_mouseX: number = 0;
  private static m_previousMouseX: number = 0;
  private static m_mouseY: number = 0;
  private static m_previousMouseY: number = 0;
  private static m_leftMouseButtonDown: boolean = false;
  private static m_rightMouseButtonDown: boolean = false;

  private static onKeyDown(event: KeyboardEvent): boolean {
    InputManager.m_keys[event.keyCode] = true;
    event.preventDefault();
    event.stopPropagation();
    return false;
  }

  private static onKeyUp(event: KeyboardEvent): boolean {
    InputManager.m_keys[event.keyCode] = false;
    event.preventDefault();
    event.stopPropagation();
    return false;
  }

  private static onMouseMove(event: MouseEvent): void {
    InputManager.m_previousMouseX = InputManager.m_mouseX;
    InputManager.m_previousMouseY = InputManager.m_mouseY;
    InputManager.m_mouseX = event.clientX;
    InputManager.m_mouseY = event.clientY;

    event.preventDefault();
    event.stopPropagation();
  }

  private static onMouseDown(event: MouseEvent): void {
    if (event.button === 0) {
      InputManager.m_leftMouseButtonDown = true;
    }
    if (event.button === 2) {
      InputManager.m_rightMouseButtonDown = true;
    }

    Message.send(
      MESSAGE_MOUSE_DOWN,
      this,
      new MouseContext(
        InputManager.m_leftMouseButtonDown,
        InputManager.m_rightMouseButtonDown,
        InputManager.getMousePosition()
      )
    );
  }

  private static onMouseUp(event: MouseEvent): void {
    if (event.button === 0) {
      InputManager.m_leftMouseButtonDown = false;
    }
    if (event.button === 2) {
      InputManager.m_rightMouseButtonDown = false;
    }

    Message.send(
      MESSAGE_MOUSE_UP,
      this,
      new MouseContext(
        InputManager.m_leftMouseButtonDown,
        InputManager.m_rightMouseButtonDown,
        InputManager.getMousePosition()
      )
    );
  }

  // public methods and attributes:
  public static initialize(): void {
    this.m_keys = new Array(256).fill(false);

    window.addEventListener('keydown', InputManager.onKeyDown);
    window.addEventListener('keyup', InputManager.onKeyUp);

    window.addEventListener('mousemove', InputManager.onMouseMove);
    window.addEventListener('mousedown', InputManager.onMouseDown);
    window.addEventListener('mouseup', InputManager.onMouseUp);
  }

  public static isKeyDown(key: Keys): boolean {
    return InputManager.m_keys[key];
  }

  public static getMousePosition(): Vector2 {
    return new Vector2(InputManager.m_mouseX, InputManager.m_mouseY);
  }
}
