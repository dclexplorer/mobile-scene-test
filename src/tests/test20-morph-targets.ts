import {
  engine,
  Transform,
  GltfContainer
} from '@dcl/sdk/ecs'
import { Vector3, Color4 } from '@dcl/sdk/math'
import { createPlatform, createLabel } from '../utils/helpers'

/**
 * TEST 20: Morph Targets
 * Display models with morph target (blend shape) animations
 * Location: X:-40, Z:-35 (Row 1, Column 2 of visual test grid)
 */
export function setupMorphTargetsTest() {
  // Grid position: Row 1, Column 2
  const baseX = -40
  const baseZ = -35
  const yPos = 1

  // Platform
  createPlatform(
    Vector3.create(baseX, 0.05, baseZ),
    Vector3.create(35, 0.1, 25),
    Color4.create(0.2, 0.22, 0.2, 1)
  )

  createLabel('TEST 20: MORPH TARGETS\n(Blend Shape Animations)', Vector3.create(baseX, 5, baseZ - 10), 1.2)

  // AnimatedCubeMorph
  const cubeMorph = engine.addEntity()
  Transform.create(cubeMorph, {
    position: Vector3.create(baseX - 8, yPos, baseZ),
    scale: Vector3.create(1.5, 1.5, 1.5)
  })
  GltfContainer.create(cubeMorph, { src: 'assets/models/animated/AnimatedCubeMorph.glb' })
  createLabel('GltfContainer:\nAnimatedCubeMorph.glb\n(morphing cube shape)', Vector3.create(baseX - 8, yPos + 2.5, baseZ), 0.35)

  // AnimatedSphereMorph
  const sphereMorph = engine.addEntity()
  Transform.create(sphereMorph, {
    position: Vector3.create(baseX + 8, yPos, baseZ),
    scale: Vector3.create(1.5, 1.5, 1.5)
  })
  GltfContainer.create(sphereMorph, { src: 'assets/models/animated/AnimatedSphereMorph.glb' })
  createLabel('GltfContainer:\nAnimatedSphereMorph.glb\n(morphing sphere shape)', Vector3.create(baseX + 8, yPos + 2.5, baseZ), 0.35)

  // Explanation label
  createLabel(
    'Morph targets (blend shapes)\nallow smooth vertex transitions\nbetween mesh shapes using\nweights from 0.0 to 1.0',
    Vector3.create(baseX, yPos + 1, baseZ + 6),
    0.4
  )

  console.log('Test 20: Morph Targets initialized at X:', baseX, 'Z:', baseZ)
}
