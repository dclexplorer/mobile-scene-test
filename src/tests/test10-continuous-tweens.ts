import {
  engine,
  Transform,
  MeshRenderer,
  Material,
  Tween,
  EasingFunction,
  TweenSequence,
  TweenLoop
} from '@dcl/sdk/ecs'
import { Vector3, Color4, Quaternion } from '@dcl/sdk/math'
import { createPlatform, createLabel } from '../utils/helpers'

/**
 * TEST 10: CONTINUOUS TWEENS TEST (ADR-285)
 * Testing RotateContinuous, MoveContinuous, TextureMoveContinuous
 * Located in positive Z parcels (2,5 to 5,7)
 */
export function setupContinuousTweensTest() {
  const continuousTweenBaseX = 56
  const continuousTweenBaseZ = 104

  createLabel('CONTINUOUS TWEENS TEST (ADR-285)\nInfinite motion without reset', Vector3.create(continuousTweenBaseX, 8, continuousTweenBaseZ - 10), 1.5)

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
    scale: Vector3.create(3, 3, 3)
  })
  MeshRenderer.setBox(rotateY30)
  Material.setPbrMaterial(rotateY30, {
    albedoColor: Color4.create(0.8, 0.3, 0.3, 1)
  })
  Tween.setRotateContinuous(rotateY30, Quaternion.create(0, 1, 0, 0), 30)
  createLabel('Y-Axis\n30°/sec', Vector3.create(continuousTweenBaseX - 15, 5, ctRow1Z), 0.9)

  // 1.2 Rotate Y-axis at 90 deg/sec
  const rotateY90 = engine.addEntity()
  Transform.create(rotateY90, {
    position: Vector3.create(continuousTweenBaseX - 5, 2, ctRow1Z),
    scale: Vector3.create(3, 3, 3)
  })
  MeshRenderer.setBox(rotateY90)
  Material.setPbrMaterial(rotateY90, {
    albedoColor: Color4.create(0.8, 0.5, 0.3, 1)
  })
  Tween.setRotateContinuous(rotateY90, Quaternion.create(0, 1, 0, 0), 90)
  createLabel('Y-Axis\n90°/sec', Vector3.create(continuousTweenBaseX - 5, 5, ctRow1Z), 0.9)

  // 1.3 Rotate X-axis at 45 deg/sec
  const rotateX45 = engine.addEntity()
  Transform.create(rotateX45, {
    position: Vector3.create(continuousTweenBaseX + 5, 2, ctRow1Z),
    scale: Vector3.create(3, 3, 3)
  })
  MeshRenderer.setBox(rotateX45)
  Material.setPbrMaterial(rotateX45, {
    albedoColor: Color4.create(0.3, 0.8, 0.3, 1)
  })
  Tween.setRotateContinuous(rotateX45, Quaternion.create(1, 0, 0, 0), 45)
  createLabel('X-Axis\n45°/sec', Vector3.create(continuousTweenBaseX + 5, 5, ctRow1Z), 0.9)

  // 1.4 Rotate Z-axis at 60 deg/sec
  const rotateZ60 = engine.addEntity()
  Transform.create(rotateZ60, {
    position: Vector3.create(continuousTweenBaseX + 15, 2, ctRow1Z),
    scale: Vector3.create(3, 3, 3)
  })
  MeshRenderer.setBox(rotateZ60)
  Material.setPbrMaterial(rotateZ60, {
    albedoColor: Color4.create(0.3, 0.3, 0.8, 1)
  })
  Tween.setRotateContinuous(rotateZ60, Quaternion.create(0, 0, 1, 0), 60)
  createLabel('Z-Axis\n60°/sec', Vector3.create(continuousTweenBaseX + 15, 5, ctRow1Z), 0.9)

  // 1.5 Multi-axis rotation
  const rotateMulti = engine.addEntity()
  Transform.create(rotateMulti, {
    position: Vector3.create(continuousTweenBaseX + 25, 2, ctRow1Z),
    scale: Vector3.create(3, 3, 3)
  })
  MeshRenderer.setBox(rotateMulti)
  Material.setPbrMaterial(rotateMulti, {
    albedoColor: Color4.create(0.8, 0.3, 0.8, 1)
  })
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
    scale: Vector3.create(3, 3, 3)
  })
  MeshRenderer.setBox(rotateSlow)
  Material.setPbrMaterial(rotateSlow, {
    albedoColor: Color4.create(0.9, 0.6, 0.2, 1)
  })
  Tween.setRotateContinuous(rotateSlow, Quaternion.create(0, 1, 0, 0), 10)
  createLabel('Y-Axis\n10°/sec', Vector3.create(continuousTweenBaseX - 15, 5, ctRow2Z), 0.9)

  // 2.2 Medium rotation 60 deg/sec
  const rotateMedium = engine.addEntity()
  Transform.create(rotateMedium, {
    position: Vector3.create(continuousTweenBaseX - 5, 2, ctRow2Z),
    scale: Vector3.create(3, 3, 3)
  })
  MeshRenderer.setBox(rotateMedium)
  Material.setPbrMaterial(rotateMedium, {
    albedoColor: Color4.create(0.2, 0.9, 0.6, 1)
  })
  Tween.setRotateContinuous(rotateMedium, Quaternion.create(0, 1, 0, 0), 60)
  createLabel('Y-Axis\n60°/sec', Vector3.create(continuousTweenBaseX - 5, 5, ctRow2Z), 0.9)

  // 2.3 Fast rotation 180 deg/sec
  const rotateFast = engine.addEntity()
  Transform.create(rotateFast, {
    position: Vector3.create(continuousTweenBaseX + 5, 2, ctRow2Z),
    scale: Vector3.create(3, 3, 3)
  })
  MeshRenderer.setBox(rotateFast)
  Material.setPbrMaterial(rotateFast, {
    albedoColor: Color4.create(0.6, 0.2, 0.9, 1)
  })
  Tween.setRotateContinuous(rotateFast, Quaternion.create(0, 1, 0, 0), 180)
  createLabel('Y-Axis\n180°/sec', Vector3.create(continuousTweenBaseX + 5, 5, ctRow2Z), 0.9)

  // 2.4 Very fast rotation 360 deg/sec
  const rotateVeryFast = engine.addEntity()
  Transform.create(rotateVeryFast, {
    position: Vector3.create(continuousTweenBaseX + 15, 2, ctRow2Z),
    scale: Vector3.create(3, 3, 3)
  })
  MeshRenderer.setBox(rotateVeryFast)
  Material.setPbrMaterial(rotateVeryFast, {
    albedoColor: Color4.create(0.9, 0.2, 0.6, 1)
  })
  Tween.setRotateContinuous(rotateVeryFast, Quaternion.create(0, 1, 0, 0), 360)
  createLabel('Y-Axis\n360°/sec', Vector3.create(continuousTweenBaseX + 15, 5, ctRow2Z), 0.9)

  // =========================================================================
  // ROW 3: Move - Bounded movement with YOYO
  // =========================================================================
  const ctRow3Z = continuousTweenBaseZ + 12

  createLabel('ROW 3: Move with YOYO (bounded)', Vector3.create(continuousTweenBaseX - 25, 3, ctRow3Z), 1)

  // 3.1 Move along X-axis
  const moveX = engine.addEntity()
  const moveXStart = Vector3.create(continuousTweenBaseX - 20, 2, ctRow3Z)
  const moveXEnd = Vector3.create(continuousTweenBaseX - 10, 2, ctRow3Z)
  Transform.create(moveX, {
    position: moveXStart,
    scale: Vector3.create(2, 2, 2)
  })
  MeshRenderer.setSphere(moveX)
  Material.setPbrMaterial(moveX, {
    albedoColor: Color4.create(1.0, 0.4, 0.4, 1)
  })
  Tween.create(moveX, {
    mode: Tween.Mode.Move({ start: moveXStart, end: moveXEnd }),
    duration: 2000,
    easingFunction: EasingFunction.EF_LINEAR
  })
  TweenSequence.create(moveX, { loop: TweenLoop.TL_YOYO, sequence: [] })
  createLabel('X-Axis\n10m range', Vector3.create(continuousTweenBaseX - 15, 5, ctRow3Z), 0.9)

  // 3.2 Move along Z-axis
  const moveZ = engine.addEntity()
  const moveZStart = Vector3.create(continuousTweenBaseX - 5, 2, ctRow3Z - 5)
  const moveZEnd = Vector3.create(continuousTweenBaseX - 5, 2, ctRow3Z + 5)
  Transform.create(moveZ, {
    position: moveZStart,
    scale: Vector3.create(2, 2, 2)
  })
  MeshRenderer.setSphere(moveZ)
  Material.setPbrMaterial(moveZ, {
    albedoColor: Color4.create(0.4, 1.0, 0.4, 1)
  })
  Tween.create(moveZ, {
    mode: Tween.Mode.Move({ start: moveZStart, end: moveZEnd }),
    duration: 1500,
    easingFunction: EasingFunction.EF_LINEAR
  })
  TweenSequence.create(moveZ, { loop: TweenLoop.TL_YOYO, sequence: [] })
  createLabel('Z-Axis\n10m range', Vector3.create(continuousTweenBaseX - 5, 5, ctRow3Z), 0.9)

  // 3.3 Move diagonally
  const moveDiag = engine.addEntity()
  const moveDiagStart = Vector3.create(continuousTweenBaseX, 2, ctRow3Z - 5)
  const moveDiagEnd = Vector3.create(continuousTweenBaseX + 10, 2, ctRow3Z + 5)
  Transform.create(moveDiag, {
    position: moveDiagStart,
    scale: Vector3.create(2, 2, 2)
  })
  MeshRenderer.setSphere(moveDiag)
  Material.setPbrMaterial(moveDiag, {
    albedoColor: Color4.create(0.4, 0.4, 1.0, 1)
  })
  Tween.create(moveDiag, {
    mode: Tween.Mode.Move({ start: moveDiagStart, end: moveDiagEnd }),
    duration: 2500,
    easingFunction: EasingFunction.EF_LINEAR
  })
  TweenSequence.create(moveDiag, { loop: TweenLoop.TL_YOYO, sequence: [] })
  createLabel('Diagonal\n14m range', Vector3.create(continuousTweenBaseX + 5, 5, ctRow3Z), 0.9)

  // 3.4 Move upward (Y-axis)
  const moveY = engine.addEntity()
  const moveYStart = Vector3.create(continuousTweenBaseX + 15, 1, ctRow3Z)
  const moveYEnd = Vector3.create(continuousTweenBaseX + 15, 6, ctRow3Z)
  Transform.create(moveY, {
    position: moveYStart,
    scale: Vector3.create(2, 2, 2)
  })
  MeshRenderer.setSphere(moveY)
  Material.setPbrMaterial(moveY, {
    albedoColor: Color4.create(1.0, 1.0, 0.4, 1)
  })
  Tween.create(moveY, {
    mode: Tween.Mode.Move({ start: moveYStart, end: moveYEnd }),
    duration: 1500,
    easingFunction: EasingFunction.EF_LINEAR
  })
  TweenSequence.create(moveY, { loop: TweenLoop.TL_YOYO, sequence: [] })
  createLabel('Y-Axis\n5m range', Vector3.create(continuousTweenBaseX + 15, 8, ctRow3Z), 0.9)

  // 3.5 Circular-ish path (X+Y combined with easing)
  const moveCircle = engine.addEntity()
  const moveCircleStart = Vector3.create(continuousTweenBaseX + 25, 1, ctRow3Z)
  const moveCircleEnd = Vector3.create(continuousTweenBaseX + 30, 5, ctRow3Z)
  Transform.create(moveCircle, {
    position: moveCircleStart,
    scale: Vector3.create(2, 2, 2)
  })
  MeshRenderer.setSphere(moveCircle)
  Material.setPbrMaterial(moveCircle, {
    albedoColor: Color4.create(1.0, 0.4, 1.0, 1)
  })
  Tween.create(moveCircle, {
    mode: Tween.Mode.Move({ start: moveCircleStart, end: moveCircleEnd }),
    duration: 2000,
    easingFunction: EasingFunction.EF_EASEQUAD
  })
  TweenSequence.create(moveCircle, { loop: TweenLoop.TL_YOYO, sequence: [] })
  createLabel('X+Y Arc\nEased', Vector3.create(continuousTweenBaseX + 27, 8, ctRow3Z), 0.9)
}
