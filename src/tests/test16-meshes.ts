import {
  engine,
  Transform,
  MeshRenderer,
  MeshCollider,
  Material
} from '@dcl/sdk/ecs'
import { Vector3, Color4 } from '@dcl/sdk/math'
import { createPlatform, createLabel } from '../utils/helpers'

/**
 * TEST 16: Primitive Meshes
 * Display all primitive mesh types: Box, Sphere, Cylinder, Plane, Cone, Truncated Cylinder
 * Location: X:-90, Z:-35 (Row 1, Column 1 of visual test grid)
 */
export function setupMeshesTest() {
  // Grid position: Row 1, Column 1
  const baseX = -90
  const baseZ = -35
  const yPos = 1

  // Platform
  createPlatform(
    Vector3.create(baseX, 0.05, baseZ),
    Vector3.create(35, 0.1, 25),
    Color4.create(0.2, 0.2, 0.25, 1)
  )

  createLabel('TEST 16: PRIMITIVE MESHES', Vector3.create(baseX, 5, baseZ - 10), 1.5)

  // Mesh configurations in 3x2 grid with compact spacing
  const meshConfigs = [
    { name: 'MeshRenderer.setBox()', col: 0, row: 0, color: Color4.create(0.3, 0.5, 0.7, 1) },
    { name: 'MeshRenderer.setSphere()', col: 1, row: 0, color: Color4.create(0.5, 0.5, 0.7, 1) },
    { name: 'MeshRenderer.setCylinder(1,1)', col: 2, row: 0, color: Color4.create(0.7, 0.5, 0.7, 1) },
    { name: 'MeshRenderer.setPlane()', col: 0, row: 1, color: Color4.create(0.3, 0.5, 0.5, 1) },
    { name: 'MeshRenderer.setCylinder(1,0)\n(cone)', col: 1, row: 1, color: Color4.create(0.5, 0.5, 0.5, 1) },
    { name: 'MeshRenderer.setCylinder(1,0.5)\n(truncated)', col: 2, row: 1, color: Color4.create(0.7, 0.5, 0.5, 1) }
  ]

  meshConfigs.forEach((config) => {
    const x = baseX - 10 + config.col * 10
    const z = baseZ - 3 + config.row * 7

    const entity = engine.addEntity()
    Transform.create(entity, {
      position: Vector3.create(x, yPos, z),
      scale: Vector3.create(1.5, 1.5, 1.5)
    })

    // Apply specific mesh renderer and collider based on type
    switch (config.col + config.row * 3) {
      case 0:
        MeshRenderer.setBox(entity)
        MeshCollider.setBox(entity)
        break
      case 1:
        MeshRenderer.setSphere(entity)
        MeshCollider.setSphere(entity)
        break
      case 2:
        MeshRenderer.setCylinder(entity, 1, 1)
        MeshCollider.setCylinder(entity, 1, 1)
        break
      case 3:
        MeshRenderer.setPlane(entity)
        MeshCollider.setPlane(entity)
        break
      case 4:
        MeshRenderer.setCylinder(entity, 1, 0)
        MeshCollider.setCylinder(entity, 1, 0)
        break
      case 5:
        MeshRenderer.setCylinder(entity, 1, 0.5)
        MeshCollider.setCylinder(entity, 1, 0.5)
        break
    }

    // Apply material
    Material.setPbrMaterial(entity, {
      albedoColor: config.color,
      metallic: 0.3,
      roughness: 0.5
    })

    createLabel(config.name, Vector3.create(x, yPos + 2, z), 0.35)
  })

  console.log('Test 16: Primitive Meshes initialized at X:', baseX, 'Z:', baseZ)
}
