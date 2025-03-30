/* eslint-disable no-console */
import { Material } from './material';

class MaterialReferenceNode {
  public material: Material | null;
  public referenceCount: number = 1;
  constructor(material: Material) {
    this.material = material;
  }
}

export class MaterialManager {
  // private methods and attributes:
  private static m_materials: { [name: string]: MaterialReferenceNode } = {};

  private constructor() {}

  // public methods and attributes:
  public static registerMaterial(material: Material): void {
    if (!MaterialManager.m_materials[material.name]) {
      MaterialManager.m_materials[material.name] = new MaterialReferenceNode(material);
    }
  }

  public static getMaterial(name: string): Material | null {
    const materialNode = MaterialManager.m_materials[name];
    if (!materialNode) return null;
    materialNode.referenceCount++;
    return materialNode.material;
  }

  public static releaseMaterial(name: string): void {
    const materialNode = MaterialManager.m_materials[name];
    if (!materialNode) console.warn(`Cannot release material ${name}. It is not registered.`);

    materialNode.referenceCount--;
    if (materialNode.referenceCount < 1) {
      if (materialNode.material) materialNode.material.destroy();
      materialNode.material = null;
      delete MaterialManager.m_materials[name];
    }
  }
}
