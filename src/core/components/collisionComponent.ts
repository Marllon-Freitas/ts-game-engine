/* eslint-disable @typescript-eslint/no-explicit-any */
import { CollisionManager } from '../collision/collisionManager';
import { Circle2D } from '../graphics/shapes2D/circle2D';
import { IShape2D } from '../graphics/shapes2D/interfaces/IShape2D';
import { Rectangle2D } from '../graphics/shapes2D/rectangle2D';
import { Shader } from '../webGL/shader';
import { BaseComponent } from './baseComponent';
import { IComponent } from './interfaces/IComponent';
import { IComponentBuilder } from './interfaces/IComponentBuilder';
import { IComponentData } from './interfaces/IComponentData';

export class CollisionComponentData implements IComponentData {
  public name!: string;
  public shape!: IShape2D;

  public setFromJSON(json: any): void {
    if (json.name) this.name = String(json.name);
    if (!json.shape) throw new Error('CollisionComponent: shape is required');
    if (!json.shape.type) throw new Error('CollisionComponent: shape type is required');
    const shapeType = String(json.shape.type).toLowerCase();
    switch (shapeType) {
      case 'circle':
        this.shape = new Circle2D();
        break;
      case 'rectangle':
        this.shape = new Rectangle2D();
        break;
      default:
        throw new Error(`CollisionComponent: shape type ${shapeType} is not supported`);
    }

    this.shape.setFromJSON(json.shape);
  }
}

export class CollisionComponentBuilder implements IComponentBuilder {
  public get type(): string {
    return 'collision';
  }

  public buildFromJSON(json: any): IComponent {
    let data = new CollisionComponentData();
    data.setFromJSON(json);
    return new CollisionComponent(data);
  }
}

export class CollisionComponent extends BaseComponent {
  // private methods and attributes:
  private m_shape: IShape2D;
  private m_originalWidth: number = 0;
  private m_originalHeight: number = 0;
  private m_originalRadius: number = 0;

  /**
   * Updates the size of the collision shape based on the scale of the owner
   * @private
   */
  private updateShapeProperties(): void {
    if (this.m_shape instanceof Rectangle2D) {
      this.m_shape.width = this.m_originalWidth * this.m_owner.transform.scale.x;
      this.m_shape.height = this.m_originalHeight * this.m_owner.transform.scale.y;
    } else if (this.m_shape instanceof Circle2D) {
      const avgScale = (this.m_owner.transform.scale.x + this.m_owner.transform.scale.y) / 2;
      this.m_shape.radius = this.m_originalRadius * avgScale;
    }

    this.m_shape.position.copyFrom(
      this.m_owner.transform.position.toVector2().add(this.m_shape.offset)
    );
  }

  // public methods and attributes:
  constructor(data: CollisionComponentData) {
    super(data);
    this.m_shape = data.shape;

    if (this.m_shape instanceof Rectangle2D) {
      this.m_originalWidth = this.m_shape.width;
      this.m_originalHeight = this.m_shape.height;
    } else if (this.m_shape instanceof Circle2D) {
      this.m_originalRadius = this.m_shape.radius;
    }
  }

  public get shape(): IShape2D {
    return this.m_shape;
  }

  public load(): void {
    super.load();
    this.m_shape.position.copyFrom(
      this.m_owner.transform.position.toVector2().add(this.m_shape.offset)
    );
    CollisionManager.registerCollisionComponent(this);
  }

  public update(deltaTime: number): void {
    // Update the shape with the current position of the owner
    this.m_shape.position.copyFrom(
      this.m_owner.transform.position.toVector2().add(this.m_shape.offset)
    );

    this.updateShapeProperties();

    super.update(deltaTime);
  }

  public render(shader: Shader): void {
    super.render(shader);
  }

  public onCollisionEntry(otherComponent: CollisionComponent): void {
    // Handle collision entry
    console.log(
      `Collision detected between ${this.m_owner.name} and ${otherComponent.m_owner.name}`
    );
  }

  public onCollisionUpdate(otherComponent: CollisionComponent): void {
    // Handle collision stay
    console.log(
      `Collision updated between ${this.m_owner.name} and ${otherComponent.m_owner.name}`
    );
  }

  public onCollisionExit(otherComponent: CollisionComponent): void {
    // Handle collision exit
    console.log(`Collision exited between ${this.m_owner.name} and ${otherComponent.m_owner.name}`);
  }
}
