import {
  engine,
  Transform,
  MeshRenderer,
  Material,
  Tween,
  Entity
} from '@dcl/sdk/ecs'
import { Vector3, Color4, Quaternion } from '@dcl/sdk/math'
import { createPlatform, createLabel } from '../utils/helpers'

/**
 * TEST 10: CONTINUOUS TWEENS TEST (ADR-285)
 * Testing RotateContinuous, MoveContinuous, TextureMoveContinuous
 * Located in positive Z parcels (2,5 to 5,7)
 */

/**
 * Creates orientation markers for a rotating cube.
 * Adds visual indicators so users can see the rotation direction:
 * - A white stripe on the +X face
 * - A yellow stripe on the +Z face
 * - A cyan dot on the +Y (top) face
 * This allows comparison across different engines.
 */
function addOrientationMarkers(parentEntity: Entity, cubeScale: number) {
  const halfSize = cubeScale / 2
  const stripeThickness = 0.05
  const stripeWidth = cubeScale * 0.15
  const stripeLength = cubeScale * 0.8

  // White stripe on +X face (right side)
  const stripeX = engine.addEntity()
  Transform.create(stripeX, {
    position: Vector3.create(halfSize + stripeThickness / 2, 0, 0),
    scale: Vector3.create(stripeThickness, stripeLength, stripeWidth),
    parent: parentEntity
  })
  MeshRenderer.setBox(stripeX)
  Material.setPbrMaterial(stripeX, {
    albedoColor: Color4.create(1, 1, 1, 1),
    emissiveColor: Color4.create(0.5, 0.5, 0.5),
    emissiveIntensity: 2
  })

  // Yellow stripe on +Z face (front side)
  const stripeZ = engine.addEntity()
  Transform.create(stripeZ, {
    position: Vector3.create(0, 0, halfSize + stripeThickness / 2),
    scale: Vector3.create(stripeWidth, stripeLength, stripeThickness),
    parent: parentEntity
  })
  MeshRenderer.setBox(stripeZ)
  Material.setPbrMaterial(stripeZ, {
    albedoColor: Color4.create(1, 1, 0, 1),
    emissiveColor: Color4.create(0.5, 0.5, 0),
    emissiveIntensity: 2
  })

  // Cyan dot on +Y face (top)
  const dotY = engine.addEntity()
  Transform.create(dotY, {
    position: Vector3.create(0, halfSize + stripeThickness / 2, 0),
    scale: Vector3.create(stripeWidth * 1.5, stripeThickness, stripeWidth * 1.5),
    parent: parentEntity
  })
  MeshRenderer.setBox(dotY)
  Material.setPbrMaterial(dotY, {
    albedoColor: Color4.create(0, 1, 1, 1),
    emissiveColor: Color4.create(0, 0.5, 0.5),
    emissiveIntensity: 2
  })

  // Small arrow/pointer on -X face to show initial "front" direction
  const arrowBase = engine.addEntity()
  Transform.create(arrowBase, {
    position: Vector3.create(-halfSize - stripeThickness * 2, 0, 0),
    scale: Vector3.create(stripeThickness * 3, stripeWidth, stripeWidth),
    parent: parentEntity
  })
  MeshRenderer.setBox(arrowBase)
  Material.setPbrMaterial(arrowBase, {
    albedoColor: Color4.create(1, 0.5, 0, 1),
    emissiveColor: Color4.create(0.5, 0.25, 0),
    emissiveIntensity: 2
  })
}
export function setupContinuousTweensTest() {
  const continuousTweenBaseX = 56
  const continuousTweenBaseZ = 104

  createLabel('CONTINUOUS TWEENS TEST (ADR-285)\nInfinite motion without reset', Vector3.create(continuousTweenBaseX, 8, continuousTweenBaseZ - 10), 1.5)

  // Orientation legend - helps users compare rotation direction across engines
  createLabel(
    'ORIENTATION KEY:\nWhite stripe = +X face\nYellow stripe = +Z face\nCyan dot = +Y (top)\nOrange pointer = -X face',
    Vector3.create(continuousTweenBaseX + 30, 6, continuousTweenBaseZ - 10),
    0.8
  )

  // Platform floor for continuous tween test area
  createPlatform(
    Vector3.create(continuousTweenBaseX, 0.05, continuousTweenBaseZ),
    Vector3.create(64, 0.1, 48),
    Color4.create(0.15, 0.2, 0.25, 1)
  )

  // =========================================================================
  // ROW 1: RotateContinuous - Infinite rotation (different axes)
  // =========================================================================
  const ctRow1Z = continuousTweenBaseZ - 12

  createLabel('ROW 1: RotateContinuous (different axes)', Vector3.create(continuousTweenBaseX - 25, 3, ctRow1Z), 1)

  // 1.1 Rotate Y-axis at 30 deg/sec
  const rotateY30 = engine.addEntity()
  Transform.create(rotateY30, {
    position: Vector3.create(continuousTweenBaseX - 15, 2, ctRow1Z),
    scale: Vector3.create(1, 1, 1)
  })
  MeshRenderer.setBox(rotateY30)
  Material.setPbrMaterial(rotateY30, {
    albedoColor: Color4.create(0.8, 0.3, 0.3, 1)
  })
  addOrientationMarkers(rotateY30, 1)
  Tween.setRotateContinuous(rotateY30, Quaternion.create(0, 1, 0, 0), 30)
  createLabel('Y-Axis\n30°/sec', Vector3.create(continuousTweenBaseX - 15, 5, ctRow1Z), 0.9)

  // 1.2 Rotate Y-axis at 90 deg/sec
  const rotateY90 = engine.addEntity()
  Transform.create(rotateY90, {
    position: Vector3.create(continuousTweenBaseX - 5, 2, ctRow1Z),
    scale: Vector3.create(1, 1, 1)
  })
  MeshRenderer.setBox(rotateY90)
  Material.setPbrMaterial(rotateY90, {
    albedoColor: Color4.create(0.8, 0.5, 0.3, 1)
  })
  addOrientationMarkers(rotateY90, 1)
  Tween.setRotateContinuous(rotateY90, Quaternion.create(0, 1, 0, 0), 90)
  createLabel('Y-Axis\n90°/sec', Vector3.create(continuousTweenBaseX - 5, 5, ctRow1Z), 0.9)

  // 1.3 Rotate X-axis at 45 deg/sec
  const rotateX45 = engine.addEntity()
  Transform.create(rotateX45, {
    position: Vector3.create(continuousTweenBaseX + 5, 2, ctRow1Z),
    scale: Vector3.create(1, 1, 1)
  })
  MeshRenderer.setBox(rotateX45)
  Material.setPbrMaterial(rotateX45, {
    albedoColor: Color4.create(0.3, 0.8, 0.3, 1)
  })
  addOrientationMarkers(rotateX45, 1)
  Tween.setRotateContinuous(rotateX45, Quaternion.create(1, 0, 0, 0), 45)
  createLabel('X-Axis\n45°/sec', Vector3.create(continuousTweenBaseX + 5, 5, ctRow1Z), 0.9)

  // 1.4 Rotate Z-axis at 60 deg/sec
  const rotateZ60 = engine.addEntity()
  Transform.create(rotateZ60, {
    position: Vector3.create(continuousTweenBaseX + 15, 2, ctRow1Z),
    scale: Vector3.create(1, 1, 1)
  })
  MeshRenderer.setBox(rotateZ60)
  Material.setPbrMaterial(rotateZ60, {
    albedoColor: Color4.create(0.3, 0.3, 0.8, 1)
  })
  addOrientationMarkers(rotateZ60, 1)
  Tween.setRotateContinuous(rotateZ60, Quaternion.create(0, 0, 1, 0), 60)
  createLabel('Z-Axis\n60°/sec', Vector3.create(continuousTweenBaseX + 15, 5, ctRow1Z), 0.9)

  // 1.5 Multi-axis rotation
  const rotateMulti = engine.addEntity()
  Transform.create(rotateMulti, {
    position: Vector3.create(continuousTweenBaseX + 25, 2, ctRow1Z),
    scale: Vector3.create(1, 1, 1)
  })
  MeshRenderer.setBox(rotateMulti)
  Material.setPbrMaterial(rotateMulti, {
    albedoColor: Color4.create(0.8, 0.3, 0.8, 1)
  })
  addOrientationMarkers(rotateMulti, 1)
  Tween.setRotateContinuous(rotateMulti, Quaternion.create(0.707, 0.707, 0, 0), 40)
  createLabel('X+Y Axis\n40°/sec', Vector3.create(continuousTweenBaseX + 25, 5, ctRow1Z), 0.9)

  // =========================================================================
  // ROW 2: RotateContinuous - Different speeds
  // =========================================================================
  const ctRow2Z = continuousTweenBaseZ

  createLabel('ROW 2: RotateContinuous (different speeds)', Vector3.create(continuousTweenBaseX - 25, 3, ctRow2Z), 1)

  // 2.1 Very slow rotation 10 deg/sec
  const rotateSlow = engine.addEntity()
  Transform.create(rotateSlow, {
    position: Vector3.create(continuousTweenBaseX - 15, 2, ctRow2Z),
    scale: Vector3.create(1, 1, 1)
  })
  MeshRenderer.setBox(rotateSlow)
  Material.setPbrMaterial(rotateSlow, {
    albedoColor: Color4.create(0.9, 0.6, 0.2, 1)
  })
  addOrientationMarkers(rotateSlow, 1)
  Tween.setRotateContinuous(rotateSlow, Quaternion.create(0, 1, 0, 0), 10)
  createLabel('Y-Axis\n10°/sec', Vector3.create(continuousTweenBaseX - 15, 5, ctRow2Z), 0.9)

  // 2.2 Medium rotation 60 deg/sec
  const rotateMedium = engine.addEntity()
  Transform.create(rotateMedium, {
    position: Vector3.create(continuousTweenBaseX - 5, 2, ctRow2Z),
    scale: Vector3.create(1, 1, 1)
  })
  MeshRenderer.setBox(rotateMedium)
  Material.setPbrMaterial(rotateMedium, {
    albedoColor: Color4.create(0.2, 0.9, 0.6, 1)
  })
  addOrientationMarkers(rotateMedium, 1)
  Tween.setRotateContinuous(rotateMedium, Quaternion.create(0, 1, 0, 0), 60)
  createLabel('Y-Axis\n60°/sec', Vector3.create(continuousTweenBaseX - 5, 5, ctRow2Z), 0.9)

  // 2.3 Fast rotation 180 deg/sec
  const rotateFast = engine.addEntity()
  Transform.create(rotateFast, {
    position: Vector3.create(continuousTweenBaseX + 5, 2, ctRow2Z),
    scale: Vector3.create(1, 1, 1)
  })
  MeshRenderer.setBox(rotateFast)
  Material.setPbrMaterial(rotateFast, {
    albedoColor: Color4.create(0.6, 0.2, 0.9, 1)
  })
  addOrientationMarkers(rotateFast, 1)
  Tween.setRotateContinuous(rotateFast, Quaternion.create(0, 1, 0, 0), 180)
  createLabel('Y-Axis\n180°/sec', Vector3.create(continuousTweenBaseX + 5, 5, ctRow2Z), 0.9)

  // 2.4 Very fast rotation 360 deg/sec
  const rotateVeryFast = engine.addEntity()
  Transform.create(rotateVeryFast, {
    position: Vector3.create(continuousTweenBaseX + 15, 2, ctRow2Z),
    scale: Vector3.create(1, 1, 1)
  })
  MeshRenderer.setBox(rotateVeryFast)
  Material.setPbrMaterial(rotateVeryFast, {
    albedoColor: Color4.create(0.9, 0.2, 0.6, 1)
  })
  addOrientationMarkers(rotateVeryFast, 1)
  Tween.setRotateContinuous(rotateVeryFast, Quaternion.create(0, 1, 0, 0), 360)
  createLabel('Y-Axis\n360°/sec', Vector3.create(continuousTweenBaseX + 15, 5, ctRow2Z), 0.9)

  // =========================================================================
  // ROW 3: MoveContinuous - Bullet spawner (create, move, delete)
  // =========================================================================
  const ctRow3Z = continuousTweenBaseZ + 12

  createLabel('ROW 3: MoveContinuous (bullet spawner)', Vector3.create(continuousTweenBaseX - 25, 3, ctRow3Z), 1)

  // Bullet spawner state (direction is normalized, speed is m/s)
  const bulletSpawners = [
    {
      spawnPos: Vector3.create(continuousTweenBaseX - 15, 2, ctRow3Z),
      direction: Vector3.create(1, 0, 0),  // +X direction
      speed: 8,
      color: Color4.create(1, 0.3, 0.1, 1),
      label: '+X Direction\n8 m/s',
      interval: 1.5,
      lifetime: 3
    },
    {
      spawnPos: Vector3.create(continuousTweenBaseX - 5, 2, ctRow3Z),
      direction: Vector3.create(0, 0, 1),  // +Z direction
      speed: 5,
      color: Color4.create(0.1, 1, 0.3, 1),
      label: '+Z Direction\n5 m/s',
      interval: 2,
      lifetime: 4
    },
    {
      spawnPos: Vector3.create(continuousTweenBaseX + 5, 2, ctRow3Z),
      direction: Vector3.normalize(Vector3.create(5, 3, 0)),  // Diagonal up
      speed: 6,
      color: Color4.create(0.3, 0.5, 1, 1),
      label: 'Diagonal Up\n6 m/s',
      interval: 1,
      lifetime: 2.5
    },
    {
      spawnPos: Vector3.create(continuousTweenBaseX + 15, 2, ctRow3Z),
      direction: Vector3.normalize(Vector3.create(-6, 0, 3)),  // -X +Z
      speed: 7,
      color: Color4.create(1, 1, 0.2, 1),
      label: '-X +Z\n7 m/s',
      interval: 0.8,
      lifetime: 2
    },
    {
      spawnPos: Vector3.create(continuousTweenBaseX + 25, 2, ctRow3Z),
      direction: Vector3.create(0, 1, 0),  // +Y up
      speed: 10,
      color: Color4.create(1, 0.2, 1, 1),
      label: '+Y Up\n10 m/s',
      interval: 0.5,
      lifetime: 1.5
    }
  ]

  // Track active bullets
  const activeBullets: { entity: Entity, deathTime: number }[] = []
  const spawnerTimers: number[] = bulletSpawners.map(() => 0)

  // Create labels for spawners
  bulletSpawners.forEach((spawner, index) => {
    // Spawn point marker
    const marker = engine.addEntity()
    Transform.create(marker, {
      position: spawner.spawnPos,
      scale: Vector3.create(0.5, 0.5, 0.5)
    })
    MeshRenderer.setBox(marker)
    Material.setPbrMaterial(marker, {
      albedoColor: Color4.create(0.3, 0.3, 0.3, 1)
    })
    createLabel(spawner.label, Vector3.create(spawner.spawnPos.x, 5, spawner.spawnPos.z), 0.8)
  })

  // System to spawn and manage bullets
  let globalTime = 0
  engine.addSystem((dt: number) => {
    globalTime += dt

    // Spawn new bullets
    bulletSpawners.forEach((spawner, index) => {
      spawnerTimers[index] += dt
      if (spawnerTimers[index] >= spawner.interval) {
        spawnerTimers[index] = 0

        // Create bullet entity
        const bullet = engine.addEntity()
        Transform.create(bullet, {
          position: Vector3.create(spawner.spawnPos.x, spawner.spawnPos.y, spawner.spawnPos.z),
          scale: Vector3.create(0.4, 0.4, 0.4)
        })
        MeshRenderer.setSphere(bullet)
        Material.setPbrMaterial(bullet, {
          albedoColor: spawner.color
        })

        // Use MoveContinuous - moves indefinitely in the direction at given speed
        Tween.setMoveContinuous(bullet, spawner.direction, spawner.speed)

        // Track bullet for deletion
        activeBullets.push({
          entity: bullet,
          deathTime: globalTime + spawner.lifetime
        })
      }
    })

    // Delete expired bullets
    for (let i = activeBullets.length - 1; i >= 0; i--) {
      if (globalTime >= activeBullets[i].deathTime) {
        engine.removeEntity(activeBullets[i].entity)
        activeBullets.splice(i, 1)
      }
    }
  })

  createLabel(
    'Bullets spawn, move continuously,\nthen delete after lifetime',
    Vector3.create(continuousTweenBaseX, 1, ctRow3Z - 6),
    0.7
  )
}
