import {
  engine,
  Transform,
  GltfContainer
} from '@dcl/sdk/ecs'
import { Vector3, Color4 } from '@dcl/sdk/math'
import { createPlatform, createLabel } from '../utils/helpers'

/**
 * TEST 18: GLTF/GLB Models (Static)
 * Display static GLTF/GLB models including sample scenes and simple models
 * Location: X:-65, Z:-115 (Row 3, spanning both columns of visual test grid)
 */
export function setupGltfModelsTest() {
  // Grid position: Row 3, spanning full width
  const baseX = -65
  const baseZ = -115
  const yPos = 1

  // Large platform for full-size models
  createPlatform(
    Vector3.create(baseX, 0.05, baseZ),
    Vector3.create(90, 0.1, 30),
    Color4.create(0.2, 0.18, 0.22, 1)
  )

  createLabel('TEST 18: GLTF/GLB MODELS (Static)', Vector3.create(baseX, 8, baseZ - 12), 1.8)

  // Small models row
  createLabel('Small static models:', Vector3.create(baseX - 40, yPos + 0.5, baseZ - 6), 0.45)

  const smallModels = [
    { src: 'assets/models/static/avocado.glb', name: 'GltfContainer:\navocado.glb', scale: 15 },
    { src: 'assets/models/gltf/star-coin.glb', name: 'GltfContainer:\nstar-coin.glb', scale: 1.5 },
    { src: 'assets/models/gltf/zombie.glb', name: 'GltfContainer:\nzombie.glb\n(static pose)', scale: 0.8 }
  ]

  smallModels.forEach((model, index) => {
    const x = baseX - 30 + index * 15

    const entity = engine.addEntity()
    Transform.create(entity, {
      position: Vector3.create(x, yPos, baseZ - 6),
      scale: Vector3.create(model.scale, model.scale, model.scale)
    })
    GltfContainer.create(entity, { src: model.src })
    createLabel(model.name, Vector3.create(x, yPos + 3, baseZ - 6), 0.35)
  })

  // Large sample scenes at full size (spread apart)
  createLabel('Large scene models (full size):', Vector3.create(baseX - 40, yPos + 0.5, baseZ + 4), 0.45)

  const sampleScene = engine.addEntity()
  Transform.create(sampleScene, {
    position: Vector3.create(baseX - 25, 0, baseZ + 4),
    scale: Vector3.create(1, 1, 1)
  })
  GltfContainer.create(sampleScene, { src: 'assets/models/static/SampleScene.glb' })
  createLabel('GltfContainer:\nSampleScene.glb\n(full size, scale=1)', Vector3.create(baseX - 25, 6, baseZ + 4), 0.4)

  const sampleScene02 = engine.addEntity()
  Transform.create(sampleScene02, {
    position: Vector3.create(baseX + 5, 0, baseZ + 4),
    scale: Vector3.create(1, 1, 1)
  })
  GltfContainer.create(sampleScene02, { src: 'assets/models/static/SampleScene_02.glb' })
  createLabel('GltfContainer:\nSampleScene_02.glb\n(full size, scale=1)', Vector3.create(baseX + 5, 6, baseZ + 4), 0.4)

  const sampleScene03 = engine.addEntity()
  Transform.create(sampleScene03, {
    position: Vector3.create(baseX + 35, 0, baseZ + 4),
    scale: Vector3.create(1, 1, 1)
  })
  GltfContainer.create(sampleScene03, { src: 'assets/models/static/SampleScene_03.glb' })
  createLabel('GltfContainer:\nSampleScene_03.glb\n(full size, scale=1)', Vector3.create(baseX + 35, 6, baseZ + 4), 0.4)

  console.log('Test 18: GLTF/GLB Models initialized at X:', baseX, 'Z:', baseZ)
}
