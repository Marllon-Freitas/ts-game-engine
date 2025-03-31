// import { SpriteComponent } from '../components/spriteComponent';
// import { Level } from './level';
// import { SimObject } from './simObject';

// export class TestLevel extends Level {
//   // private methods and attributes:
//   private m_parentObject!: SimObject;
//   private n_parentSprite!: SpriteComponent;

//   private m_testObject!: SimObject;
//   private n_testSprite!: SpriteComponent;

//   // public methods and attributes:
//   public load(): void {
//     this.m_parentObject = new SimObject(0, 'parentObject');
//     this.m_parentObject.transform.position.x = 300;
//     this.m_parentObject.transform.position.y = 300;
//     this.n_parentSprite = new SpriteComponent('TestSprite', 'testMaterial');
//     this.m_parentObject.addComponent(this.n_parentSprite);

//     this.m_testObject = new SimObject(0, 'TestObject');
//     this.n_testSprite = new SpriteComponent('TestSprite', 'testMaterial');
//     this.m_testObject.addComponent(this.n_testSprite);

//     this.m_testObject.transform.position.x = 120;
//     this.m_testObject.transform.position.y = 120;

//     this.m_parentObject.addChild(this.m_testObject);

//     this.scene.addObject(this.m_parentObject);

//     super.load();
//   }

//   public update(deltaTime: number): void {
//     this.m_parentObject.transform.rotation.z += 0.01;
//     this.m_testObject.transform.rotation.z += 0.01;
//     super.update(deltaTime);
//   }
// }
