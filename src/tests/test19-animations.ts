import {
  engine,
  Transform,
  GltfContainer,
  Animator
} from '@dcl/sdk/ecs'
import { Vector3, Color4 } from '@dcl/sdk/math'
import { createPlatform, createLabel } from '../utils/helpers'

/**
 * TEST 19: GLTF Animations
 * Display animated GLTF models using the Animator component
 * Location: X:-40, Z:-75 (Row 2, Column 2 of visual test grid)
 */
export function setupAnimationsTest() {
  // Grid position: Row 2, Column 2
  const baseX = -40
  const baseZ = -75
  const yPos = 1

  // Platform
  createPlatform(
    Vector3.create(baseX, 0.05, baseZ),
    Vector3.create(45, 0.1, 35),
    Color4.create(0.22, 0.2, 0.25, 1)
  )

  createLabel('TEST 19: GLTF ANIMATIONS', Vector3.create(baseX, 6, baseZ - 15), 1.5)

  // Row 1: Auto-play animations (embedded in GLTF)
  createLabel('Auto-play animations (embedded in GLTF)', Vector3.create(baseX - 18, yPos + 0.5, baseZ - 10), 0.4)

  // AnimatedCube - keyframe animation
  const animatedCube = engine.addEntity()
  Transform.create(animatedCube, {
    position: Vector3.create(baseX - 12, yPos, baseZ - 10),
    scale: Vector3.create(0.8, 0.8, 0.8)
  })
  GltfContainer.create(animatedCube, { src: 'assets/models/animated/AnimatedCube.glb' })
  createLabel('GltfContainer:\nAnimatedCube.glb\n(keyframe animation)', Vector3.create(baseX - 12, yPos + 2.5, baseZ - 10), 0.3)

  // RiggedAnimation - skeletal animation
  const riggedAnim = engine.addEntity()
  Transform.create(riggedAnim, {
    position: Vector3.create(baseX, yPos - 1, baseZ - 10),
    scale: Vector3.create(0.8, 0.8, 0.8)
  })
  GltfContainer.create(riggedAnim, { src: 'assets/models/animated/RiggedAnimation.glb' })
  createLabel('GltfContainer:\nRiggedAnimation.glb\n(skeletal animation)', Vector3.create(baseX, yPos + 2.5, baseZ - 10), 0.3)

  // RiggedDracoAnimation - Draco compressed
  const riggedDraco = engine.addEntity()
  Transform.create(riggedDraco, {
    position: Vector3.create(baseX + 12, yPos - 1, baseZ - 10),
    scale: Vector3.create(0.8, 0.8, 0.8)
  })
  GltfContainer.create(riggedDraco, { src: 'assets/models/animated/RiggedDracoAnimation.glb' })
  createLabel('GltfContainer:\nRiggedDracoAnimation.glb\n(Draco compressed)', Vector3.create(baseX + 12, yPos + 2.5, baseZ - 10), 0.3)

  // Row 2: Animator component controlled
  createLabel('Animator component (explicit clip control)', Vector3.create(baseX - 18, yPos + 0.5, baseZ - 2), 0.4)

  // Zombie Walking
  const zombieWalking = engine.addEntity()
  Transform.create(zombieWalking, {
    position: Vector3.create(baseX - 12, yPos - 1, baseZ - 2),
    scale: Vector3.create(0.8, 0.8, 0.8)
  })
  GltfContainer.create(zombieWalking, { src: 'assets/models/gltf/zombie.glb' })
  Animator.create(zombieWalking, {
    states: [
      { clip: 'Walking', playing: true, loop: true }
    ]
  })
  createLabel('Animator.create:\nclip="Walking"\nloop=true', Vector3.create(baseX - 12, yPos + 2, baseZ - 2), 0.3)

  // Zombie Attacking
  const zombieAttacking = engine.addEntity()
  Transform.create(zombieAttacking, {
    position: Vector3.create(baseX, yPos - 1, baseZ - 2),
    scale: Vector3.create(0.8, 0.8, 0.8)
  })
  GltfContainer.create(zombieAttacking, { src: 'assets/models/gltf/zombie.glb' })
  Animator.create(zombieAttacking, {
    states: [
      { clip: 'Attacking', playing: true, loop: true }
    ]
  })
  createLabel('Animator.create:\nclip="Attacking"\nloop=true', Vector3.create(baseX, yPos + 2, baseZ - 2), 0.3)

  // Zombie Idle
  const zombieIdle = engine.addEntity()
  Transform.create(zombieIdle, {
    position: Vector3.create(baseX + 12, yPos - 1, baseZ - 2),
    scale: Vector3.create(0.8, 0.8, 0.8)
  })
  GltfContainer.create(zombieIdle, { src: 'assets/models/gltf/zombie.glb' })
  Animator.create(zombieIdle, {
    states: [
      { clip: 'Idle', playing: true, loop: true }
    ]
  })
  createLabel('Animator.create:\nclip="Idle"\nloop=true', Vector3.create(baseX + 12, yPos + 2, baseZ - 2), 0.3)

  // Info label
  createLabel(
    'Use Animator component to control\nanimation clips by name.\nSet playing=true and loop=true/false',
    Vector3.create(baseX, yPos + 0.5, baseZ + 6),
    0.4
  )

  console.log('Test 19: GLTF Animations initialized at X:', baseX, 'Z:', baseZ)
}
