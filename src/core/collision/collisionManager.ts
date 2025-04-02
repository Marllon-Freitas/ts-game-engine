import { CollisionComponent } from '../components/collisionComponent';

class CollisionData {
  public componentA: CollisionComponent;
  public componentB: CollisionComponent;
  public time: number;

  public constructor(time: number, componentA: CollisionComponent, componentB: CollisionComponent) {
    this.time = time;
    this.componentA = componentA;
    this.componentB = componentB;
  }
}

export class CollisionManager {
  // private methods and attributes:
  private static m_collisionComponents: CollisionComponent[] = [];
  private static m_collisionData: CollisionData[] = [];
  private static m_totalTime: number = 0;
  private constructor() {}

  // public methods and attributes:
  public static registerCollisionComponent(collisionComponent: CollisionComponent): void {
    CollisionManager.m_collisionComponents.push(collisionComponent);
  }

  public static unregisterCollisionComponent(collisionComponent: CollisionComponent): void {
    const index = CollisionManager.m_collisionComponents.indexOf(collisionComponent);
    if (index !== -1) CollisionManager.m_collisionComponents.splice(index, 1);
  }

  public static clear(): void {
    CollisionManager.m_collisionComponents = [];
  }

  public static update(deltaTime: number): void {
    CollisionManager.m_totalTime += deltaTime;
    for (let i = 0; i < CollisionManager.m_collisionComponents.length; i++) {
      let component = CollisionManager.m_collisionComponents[i];

      for (let j = 0; j < CollisionManager.m_collisionComponents.length; j++) {
        let otherComponent = CollisionManager.m_collisionComponents[j];

        if (component === otherComponent) continue;

        if (component.shape.intersects(otherComponent.shape)) {
          let exists: boolean = false;

          for (let k = 0; k < CollisionManager.m_collisionData.length; k++) {
            let data = CollisionManager.m_collisionData[k];

            if (
              (data.componentA === component && data.componentB === otherComponent) ||
              (data.componentA === otherComponent && data.componentB === component)
            ) {
              // update existing collision data
              component.onCollisionUpdate(otherComponent);
              otherComponent.onCollisionUpdate(component);
              data.time = CollisionManager.m_totalTime;
              exists = true;
              break;
            }
          }

          if (!exists) {
            // create new collision data
            let collisionData = new CollisionData(
              CollisionManager.m_totalTime,
              component,
              otherComponent
            );
            component.onCollisionEntry(otherComponent);
            otherComponent.onCollisionEntry(component);
            this.m_collisionData.push(collisionData);
          }
        }
      }
    }

    // Remove old collision data
    let removedData: CollisionData[] = [];
    for (let k = 0; k < CollisionManager.m_collisionData.length; k++) {
      let data = CollisionManager.m_collisionData[k];

      if (data.time !== CollisionManager.m_totalTime) {
        removedData.push(data);
        data.componentA.onCollisionExit(data.componentB);
        data.componentB.onCollisionExit(data.componentA);
      }
    }

    while (removedData.length !== 0) {
      let data = removedData.shift();
      if (data) {
        let index = CollisionManager.m_collisionData.indexOf(data);
        CollisionManager.m_collisionData.splice(index, 1);

        data.componentA.onCollisionExit(data.componentB);
        data.componentB.onCollisionExit(data.componentA);
      }
    }

    document.title = `CollisionManager: ${CollisionManager.m_collisionComponents.length} components, ${CollisionManager.m_collisionData.length} collisions`;
  }
}
