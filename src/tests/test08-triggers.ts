import {
  engine,
  Transform,
  MeshRenderer,
  MeshCollider,
  Material,
  TextShape,
  Billboard,
  TriggerArea,
  triggerAreaEventsSystem,
  MaterialTransparencyMode,
  Entity,
  ColliderLayer,
  Tween,
  EasingFunction,
  TweenSequence,
  TweenLoop,
  AvatarShape
} from '@dcl/sdk/ecs'
import { Vector3, Color4, Quaternion, Color3 } from '@dcl/sdk/math'
import { createPlatform, createLabel, TriggerVisual, TRIGGER_COLOR_OUTSIDE, TRIGGER_COLOR_INSIDE } from '../utils/helpers'

/**
 * TEST 8: TRIGGER AREAS - Testing TriggerArea feature (ADR-258)
 * Located in negative X parcels - comprehensive test of all use cases
 */
export function setupTriggersTest() {
  const triggerBaseX = -48
  const triggerBaseZ = 8

  createLabel('TRIGGER AREA TEST (ADR-258)\nComprehensive Test Suite', Vector3.create(triggerBaseX, 8, triggerBaseZ - 12), 1.5)

  // Platform floor for trigger area test
  createPlatform(
    Vector3.create(-40, 0.05, 41),
    Vector3.create(64, 0.1, 110),
    Color4.create(0.2, 0.2, 0.2, 1)
  )

  // =========================================================================
  // ROW 1: Basic Shape Tests (CL_PLAYER - default)
  // =========================================================================
  const row1Z = triggerBaseZ

  // 1. Box Trigger (CL_PLAYER - any player)
  const boxTrigger = engine.addEntity()
  Transform.create(boxTrigger, {
    position: Vector3.create(triggerBaseX + 30, 2, row1Z),
    scale: Vector3.create(4, 4, 4)
  })
  MeshRenderer.setBox(boxTrigger)
  Material.setPbrMaterial(boxTrigger, {
    albedoColor: TRIGGER_COLOR_OUTSIDE,
    transparencyMode: MaterialTransparencyMode.MTM_ALPHA_BLEND
  })
  TriggerArea.setBox(boxTrigger)
  TriggerVisual.create(boxTrigger, { isPlayerInside: false })
  triggerAreaEventsSystem.onTriggerEnter(boxTrigger, () => {
    TriggerVisual.getMutable(boxTrigger).isPlayerInside = true
    Material.setPbrMaterial(boxTrigger, {
      albedoColor: TRIGGER_COLOR_INSIDE,
      transparencyMode: MaterialTransparencyMode.MTM_ALPHA_BLEND
    })
    console.log('ANY PLAYER TRIGGER: Enter')
  })
  triggerAreaEventsSystem.onTriggerExit(boxTrigger, () => {
    TriggerVisual.getMutable(boxTrigger).isPlayerInside = false
    Material.setPbrMaterial(boxTrigger, {
      albedoColor: TRIGGER_COLOR_OUTSIDE,
      transparencyMode: MaterialTransparencyMode.MTM_ALPHA_BLEND
    })
    console.log('ANY PLAYER TRIGGER: Exit')
  })
  createLabel('ANY PLAYER\nTRIGGER AREA', Vector3.create(triggerBaseX + 30, 5, row1Z), 1)

  // 1b. Box Trigger (ONLY engine.PlayerEntity - checks result.trigger.entity)
  const localPlayerTrigger = engine.addEntity()
  Transform.create(localPlayerTrigger, {
    position: Vector3.create(triggerBaseX + 40, 2, row1Z),
    scale: Vector3.create(4, 4, 4)
  })
  MeshRenderer.setBox(localPlayerTrigger)
  Material.setPbrMaterial(localPlayerTrigger, {
    albedoColor: Color4.create(0.2, 0.5, 0.8, 0.3),
    transparencyMode: MaterialTransparencyMode.MTM_ALPHA_BLEND
  })
  TriggerArea.setBox(localPlayerTrigger)
  TriggerVisual.create(localPlayerTrigger, { isPlayerInside: false })

  triggerAreaEventsSystem.onTriggerEnter(localPlayerTrigger, (result) => {
    // Check if the triggering entity is engine.PlayerEntity (local player only)
    if (result.trigger?.entity !== engine.PlayerEntity) {
      console.log(`PLAYER ENTITY ONLY: Ignored entity ${result.trigger?.entity} (not engine.PlayerEntity)`)
      return
    }
    TriggerVisual.getMutable(localPlayerTrigger).isPlayerInside = true
    Material.setPbrMaterial(localPlayerTrigger, {
      albedoColor: Color4.create(0.2, 1.0, 0.8, 0.3),
      transparencyMode: MaterialTransparencyMode.MTM_ALPHA_BLEND
    })
    console.log('PLAYER ENTITY ONLY: engine.PlayerEntity entered')
  })
  triggerAreaEventsSystem.onTriggerExit(localPlayerTrigger, (result) => {
    // Check if the exiting entity is engine.PlayerEntity (local player only)
    if (result.trigger?.entity !== engine.PlayerEntity) {
      return
    }
    TriggerVisual.getMutable(localPlayerTrigger).isPlayerInside = false
    Material.setPbrMaterial(localPlayerTrigger, {
      albedoColor: Color4.create(0.2, 0.5, 0.8, 0.3),
      transparencyMode: MaterialTransparencyMode.MTM_ALPHA_BLEND
    })
    console.log('PLAYER ENTITY ONLY: engine.PlayerEntity exited')
  })
  createLabel('ONLY PLAYER\nENTITY', Vector3.create(triggerBaseX + 40, 5, row1Z), 1)

  // 2. Sphere Trigger (CL_PLAYER)
  const sphereTrigger = engine.addEntity()
  Transform.create(sphereTrigger, {
    position: Vector3.create(triggerBaseX + 20, 2, row1Z),
    scale: Vector3.create(4, 4, 4)
  })
  MeshRenderer.setSphere(sphereTrigger)
  Material.setPbrMaterial(sphereTrigger, {
    albedoColor: TRIGGER_COLOR_OUTSIDE,
    transparencyMode: MaterialTransparencyMode.MTM_ALPHA_BLEND
  })
  TriggerArea.setSphere(sphereTrigger)
  TriggerVisual.create(sphereTrigger, { isPlayerInside: false })
  triggerAreaEventsSystem.onTriggerEnter(sphereTrigger, () => {
    TriggerVisual.getMutable(sphereTrigger).isPlayerInside = true
    Material.setPbrMaterial(sphereTrigger, {
      albedoColor: TRIGGER_COLOR_INSIDE,
      transparencyMode: MaterialTransparencyMode.MTM_ALPHA_BLEND
    })
    console.log('SPHERE (CL_PLAYER): Enter')
  })
  triggerAreaEventsSystem.onTriggerExit(sphereTrigger, () => {
    TriggerVisual.getMutable(sphereTrigger).isPlayerInside = false
    Material.setPbrMaterial(sphereTrigger, {
      albedoColor: TRIGGER_COLOR_OUTSIDE,
      transparencyMode: MaterialTransparencyMode.MTM_ALPHA_BLEND
    })
    console.log('SPHERE (CL_PLAYER): Exit')
  })
  createLabel('SPHERE\n(CL_PLAYER)', Vector3.create(triggerBaseX + 20, 5, row1Z), 1)

  // =========================================================================
  // ROW 2: Collision Layer Tests
  // =========================================================================
  const row2Z = triggerBaseZ - 10

  // 3. Pointer Hover Trigger (CL_POINTER)
  const pointerTrigger = engine.addEntity()
  Transform.create(pointerTrigger, {
    position: Vector3.create(triggerBaseX + 30, 2, row2Z),
    scale: Vector3.create(4, 4, 4)
  })
  MeshRenderer.setBox(pointerTrigger)
  Material.setPbrMaterial(pointerTrigger, {
    albedoColor: Color4.create(0.0, 0.0, 1.0, 0.3),
    transparencyMode: MaterialTransparencyMode.MTM_ALPHA_BLEND
  })
  TriggerArea.setBox(pointerTrigger, ColliderLayer.CL_POINTER)
  triggerAreaEventsSystem.onTriggerEnter(pointerTrigger, () => {
    Material.setPbrMaterial(pointerTrigger, {
      albedoColor: Color4.create(0.0, 1.0, 1.0, 0.3),
      transparencyMode: MaterialTransparencyMode.MTM_ALPHA_BLEND
    })
    console.log('POINTER TRIGGER: Hover Enter')
  })
  triggerAreaEventsSystem.onTriggerExit(pointerTrigger, () => {
    Material.setPbrMaterial(pointerTrigger, {
      albedoColor: Color4.create(0.0, 0.0, 1.0, 0.3),
      transparencyMode: MaterialTransparencyMode.MTM_ALPHA_BLEND
    })
    console.log('POINTER TRIGGER: Hover Exit')
  })
  createLabel('POINTER HOVER\n(CL_POINTER)', Vector3.create(triggerBaseX + 30, 5, row2Z), 1)

  // 4. Multiple Layers Trigger (CL_PLAYER | CL_POINTER)
  const multiLayerTrigger = engine.addEntity()
  Transform.create(multiLayerTrigger, {
    position: Vector3.create(triggerBaseX + 20, 2, row2Z),
    scale: Vector3.create(4, 4, 4)
  })
  MeshRenderer.setBox(multiLayerTrigger)
  Material.setPbrMaterial(multiLayerTrigger, {
    albedoColor: Color4.create(1.0, 0.5, 0.0, 0.3),
    transparencyMode: MaterialTransparencyMode.MTM_ALPHA_BLEND
  })
  TriggerArea.setBox(multiLayerTrigger, [ColliderLayer.CL_PLAYER, ColliderLayer.CL_POINTER])
  triggerAreaEventsSystem.onTriggerEnter(multiLayerTrigger, (result) => {
    Material.setPbrMaterial(multiLayerTrigger, {
      albedoColor: Color4.create(1.0, 1.0, 0.0, 0.3),
      transparencyMode: MaterialTransparencyMode.MTM_ALPHA_BLEND
    })
    console.log('MULTI-LAYER: Enter - layers:', result.trigger?.layers)
  })
  triggerAreaEventsSystem.onTriggerExit(multiLayerTrigger, () => {
    Material.setPbrMaterial(multiLayerTrigger, {
      albedoColor: Color4.create(1.0, 0.5, 0.0, 0.3),
      transparencyMode: MaterialTransparencyMode.MTM_ALPHA_BLEND
    })
    console.log('MULTI-LAYER: Exit')
  })
  createLabel('MULTI-LAYER\n(PLAYER|POINTER)', Vector3.create(triggerBaseX + 20, 5, row2Z), 1)

  // 5. Physics Layer Trigger (CL_PHYSICS)
  const physicsTrigger = engine.addEntity()
  Transform.create(physicsTrigger, {
    position: Vector3.create(triggerBaseX + 10, 2, row2Z),
    scale: Vector3.create(4, 4, 4)
  })
  MeshRenderer.setBox(physicsTrigger)
  Material.setPbrMaterial(physicsTrigger, {
    albedoColor: Color4.create(0.5, 0.0, 0.5, 0.3),
    transparencyMode: MaterialTransparencyMode.MTM_ALPHA_BLEND
  })
  TriggerArea.setBox(physicsTrigger, ColliderLayer.CL_PHYSICS)
  triggerAreaEventsSystem.onTriggerEnter(physicsTrigger, () => {
    Material.setPbrMaterial(physicsTrigger, {
      albedoColor: Color4.create(1.0, 0.0, 1.0, 0.3),
      transparencyMode: MaterialTransparencyMode.MTM_ALPHA_BLEND
    })
    console.log('PHYSICS TRIGGER: Physics object entered')
  })
  triggerAreaEventsSystem.onTriggerExit(physicsTrigger, () => {
    Material.setPbrMaterial(physicsTrigger, {
      albedoColor: Color4.create(0.5, 0.0, 0.5, 0.3),
      transparencyMode: MaterialTransparencyMode.MTM_ALPHA_BLEND
    })
    console.log('PHYSICS TRIGGER: Physics object exited')
  })
  createLabel('PHYSICS\n(CL_PHYSICS)', Vector3.create(triggerBaseX + 10, 5, row2Z), 1)

  // =========================================================================
  // ROW 3: Event Type Tests
  // =========================================================================
  const row3Z = triggerBaseZ + 10

  // 6. onTriggerStay Test
  const stayTrigger = engine.addEntity()
  Transform.create(stayTrigger, {
    position: Vector3.create(triggerBaseX + 30, 2, row3Z),
    scale: Vector3.create(4, 4, 4)
  })
  MeshRenderer.setBox(stayTrigger)
  Material.setPbrMaterial(stayTrigger, {
    albedoColor: Color4.create(0.0, 0.5, 0.5, 0.3),
    transparencyMode: MaterialTransparencyMode.MTM_ALPHA_BLEND
  })
  TriggerArea.setBox(stayTrigger)

  const stayCounterLabel = engine.addEntity()
  Transform.create(stayCounterLabel, {
    position: Vector3.create(triggerBaseX + 30, 6, row3Z)
  })
  TextShape.create(stayCounterLabel, {
    text: 'Stay: 0',
    fontSize: 2,
    textColor: Color4.White(),
    outlineWidth: 0.2,
    outlineColor: Color3.Black()
  })
  Billboard.create(stayCounterLabel)

  let stayCounter = 0
  triggerAreaEventsSystem.onTriggerEnter(stayTrigger, () => {
    stayCounter = 0
    Material.setPbrMaterial(stayTrigger, {
      albedoColor: Color4.create(0.0, 1.0, 0.5, 0.3),
      transparencyMode: MaterialTransparencyMode.MTM_ALPHA_BLEND
    })
    console.log('STAY TRIGGER: Enter')
  })
  triggerAreaEventsSystem.onTriggerStay(stayTrigger, () => {
    stayCounter++
    TextShape.getMutable(stayCounterLabel).text = `Stay: ${stayCounter}`
  })
  triggerAreaEventsSystem.onTriggerExit(stayTrigger, () => {
    Material.setPbrMaterial(stayTrigger, {
      albedoColor: Color4.create(0.0, 0.5, 0.5, 0.3),
      transparencyMode: MaterialTransparencyMode.MTM_ALPHA_BLEND
    })
    console.log(`STAY TRIGGER: Exit after ${stayCounter} frames`)
  })
  createLabel('onTriggerStay\n(counter)', Vector3.create(triggerBaseX + 30, 5, row3Z), 1)

  // =========================================================================
  // ROW 4: Special Cases from ADR
  // =========================================================================
  const row4Z = triggerBaseZ + 20

  // 7. Blocked Trigger Test
  const blockedTrigger = engine.addEntity()
  Transform.create(blockedTrigger, {
    position: Vector3.create(triggerBaseX + 30, 2, row4Z),
    scale: Vector3.create(4, 4, 4)
  })
  MeshRenderer.setBox(blockedTrigger)
  MeshCollider.setBox(blockedTrigger)
  Material.setPbrMaterial(blockedTrigger, {
    albedoColor: Color4.create(0.5, 0.5, 0.5, 0.5),
    transparencyMode: MaterialTransparencyMode.MTM_ALPHA_BLEND
  })
  TriggerArea.setBox(blockedTrigger)
  triggerAreaEventsSystem.onTriggerEnter(blockedTrigger, () => {
    Material.setPbrMaterial(blockedTrigger, {
      albedoColor: Color4.create(0.0, 1.0, 0.0, 0.5),
      transparencyMode: MaterialTransparencyMode.MTM_ALPHA_BLEND
    })
    console.log('BLOCKED TRIGGER: Entered (unexpected!)')
  })
  triggerAreaEventsSystem.onTriggerExit(blockedTrigger, () => {
    Material.setPbrMaterial(blockedTrigger, {
      albedoColor: Color4.create(0.5, 0.5, 0.5, 0.5),
      transparencyMode: MaterialTransparencyMode.MTM_ALPHA_BLEND
    })
    console.log('BLOCKED TRIGGER: Exit')
  })
  createLabel('BLOCKED\n(collider same shape)', Vector3.create(triggerBaseX + 30, 5, row4Z), 0.9)

  // 8. Rotating Trigger Box
  const rotatingTrigger = engine.addEntity()
  Transform.create(rotatingTrigger, {
    position: Vector3.create(triggerBaseX + 20, 2, row4Z),
    scale: Vector3.create(4, 2, 6)
  })
  MeshRenderer.setBox(rotatingTrigger)
  Material.setPbrMaterial(rotatingTrigger, {
    albedoColor: TRIGGER_COLOR_OUTSIDE,
    transparencyMode: MaterialTransparencyMode.MTM_ALPHA_BLEND
  })
  TriggerArea.setBox(rotatingTrigger)
  TriggerVisual.create(rotatingTrigger, { isPlayerInside: false })
  Tween.create(rotatingTrigger, {
    mode: Tween.Mode.Rotate({
      start: Quaternion.fromEulerDegrees(0, 0, 0),
      end: Quaternion.fromEulerDegrees(0, 180, 0)
    }),
    duration: 2000,
    easingFunction: EasingFunction.EF_LINEAR
  })
  TweenSequence.create(rotatingTrigger, {
    loop: TweenLoop.TL_RESTART,
    sequence: [
      {
        mode: Tween.Mode.Rotate({
          start: Quaternion.fromEulerDegrees(0, 0, 0),
          end: Quaternion.fromEulerDegrees(0, 180, 0)
        }),
        duration: 2000,
        easingFunction: EasingFunction.EF_LINEAR
      },
      {
        mode: Tween.Mode.Rotate({
          start: Quaternion.fromEulerDegrees(0, 180, 0),
          end: Quaternion.fromEulerDegrees(0, 360, 0)
        }),
        duration: 2000,
        easingFunction: EasingFunction.EF_LINEAR
      }
    ]
  })
  triggerAreaEventsSystem.onTriggerEnter(rotatingTrigger, () => {
    TriggerVisual.getMutable(rotatingTrigger).isPlayerInside = true
    Material.setPbrMaterial(rotatingTrigger, {
      albedoColor: TRIGGER_COLOR_INSIDE,
      transparencyMode: MaterialTransparencyMode.MTM_ALPHA_BLEND
    })
    console.log('ROTATING TRIGGER: Enter')
  })
  triggerAreaEventsSystem.onTriggerExit(rotatingTrigger, () => {
    TriggerVisual.getMutable(rotatingTrigger).isPlayerInside = false
    Material.setPbrMaterial(rotatingTrigger, {
      albedoColor: TRIGGER_COLOR_OUTSIDE,
      transparencyMode: MaterialTransparencyMode.MTM_ALPHA_BLEND
    })
    console.log('ROTATING TRIGGER: Exit')
  })
  createLabel('ROTATING\nTRIGGER', Vector3.create(triggerBaseX + 20, 5, row4Z), 1)

  // =========================================================================
  // ROW 5: Moving Triggers
  // =========================================================================
  const row5Z = triggerBaseZ + 30

  // 9. Moving Box Trigger (horizontal)
  const movingBoxTrigger = engine.addEntity()
  const movingBoxStartX = triggerBaseX + 25
  const movingBoxEndX = triggerBaseX + 35
  Transform.create(movingBoxTrigger, {
    position: Vector3.create(movingBoxStartX, 2, row5Z),
    scale: Vector3.create(4, 4, 4)
  })
  MeshRenderer.setBox(movingBoxTrigger)
  Material.setPbrMaterial(movingBoxTrigger, {
    albedoColor: TRIGGER_COLOR_OUTSIDE,
    transparencyMode: MaterialTransparencyMode.MTM_ALPHA_BLEND
  })
  TriggerArea.setBox(movingBoxTrigger, ColliderLayer.CL_PLAYER)
  TriggerVisual.create(movingBoxTrigger, { isPlayerInside: false })
  Tween.create(movingBoxTrigger, {
    mode: Tween.Mode.Move({
      start: Vector3.create(movingBoxStartX, 2, row5Z),
      end: Vector3.create(movingBoxEndX, 2, row5Z)
    }),
    duration: 2000,
    easingFunction: EasingFunction.EF_LINEAR
  })
  TweenSequence.create(movingBoxTrigger, {
    loop: TweenLoop.TL_YOYO,
    sequence: []
  })
  triggerAreaEventsSystem.onTriggerEnter(movingBoxTrigger, () => {
    TriggerVisual.getMutable(movingBoxTrigger).isPlayerInside = true
    Material.setPbrMaterial(movingBoxTrigger, {
      albedoColor: TRIGGER_COLOR_INSIDE,
      transparencyMode: MaterialTransparencyMode.MTM_ALPHA_BLEND
    })
    console.log('MOVING BOX: Enter')
  })
  triggerAreaEventsSystem.onTriggerExit(movingBoxTrigger, () => {
    TriggerVisual.getMutable(movingBoxTrigger).isPlayerInside = false
    Material.setPbrMaterial(movingBoxTrigger, {
      albedoColor: TRIGGER_COLOR_OUTSIDE,
      transparencyMode: MaterialTransparencyMode.MTM_ALPHA_BLEND
    })
    console.log('MOVING BOX: Exit')
  })
  createLabel('MOVING BOX\n(horizontal)', Vector3.create(triggerBaseX + 30, 5, row5Z), 1)

  // 10. Moving Sphere Trigger (vertical)
  const movingSphereTrigger = engine.addEntity()
  const sphereStartY = 2
  const sphereEndY = 6
  Transform.create(movingSphereTrigger, {
    position: Vector3.create(triggerBaseX + 20, sphereStartY, row5Z),
    scale: Vector3.create(4, 4, 4)
  })
  MeshRenderer.setSphere(movingSphereTrigger)
  Material.setPbrMaterial(movingSphereTrigger, {
    albedoColor: TRIGGER_COLOR_OUTSIDE,
    transparencyMode: MaterialTransparencyMode.MTM_ALPHA_BLEND
  })
  TriggerArea.setSphere(movingSphereTrigger, ColliderLayer.CL_PLAYER)
  TriggerVisual.create(movingSphereTrigger, { isPlayerInside: false })
  Tween.create(movingSphereTrigger, {
    mode: Tween.Mode.Move({
      start: Vector3.create(triggerBaseX + 20, sphereStartY, row5Z),
      end: Vector3.create(triggerBaseX + 20, sphereEndY, row5Z)
    }),
    duration: 1500,
    easingFunction: EasingFunction.EF_LINEAR
  })
  TweenSequence.create(movingSphereTrigger, {
    loop: TweenLoop.TL_YOYO,
    sequence: []
  })
  triggerAreaEventsSystem.onTriggerEnter(movingSphereTrigger, () => {
    TriggerVisual.getMutable(movingSphereTrigger).isPlayerInside = true
    Material.setPbrMaterial(movingSphereTrigger, {
      albedoColor: TRIGGER_COLOR_INSIDE,
      transparencyMode: MaterialTransparencyMode.MTM_ALPHA_BLEND
    })
    console.log('MOVING SPHERE: Enter')
  })
  triggerAreaEventsSystem.onTriggerExit(movingSphereTrigger, () => {
    TriggerVisual.getMutable(movingSphereTrigger).isPlayerInside = false
    Material.setPbrMaterial(movingSphereTrigger, {
      albedoColor: TRIGGER_COLOR_OUTSIDE,
      transparencyMode: MaterialTransparencyMode.MTM_ALPHA_BLEND
    })
    console.log('MOVING SPHERE: Exit')
  })
  createLabel('MOVING SPHERE\n(vertical)', Vector3.create(triggerBaseX + 20, 8, row5Z), 1)

  // 11. Scaling Box Trigger (balloon effect)
  const scalingBoxTrigger = engine.addEntity()
  const scaleMin = 2
  const scaleMax = 5
  Transform.create(scalingBoxTrigger, {
    position: Vector3.create(triggerBaseX + 10, 2, row5Z),
    scale: Vector3.create(scaleMin, scaleMin, scaleMin)
  })
  MeshRenderer.setBox(scalingBoxTrigger)
  Material.setPbrMaterial(scalingBoxTrigger, {
    albedoColor: Color4.create(1.0, 0.3, 0.5, 0.3),
    transparencyMode: MaterialTransparencyMode.MTM_ALPHA_BLEND
  })
  TriggerArea.setBox(scalingBoxTrigger, ColliderLayer.CL_PLAYER)
  TriggerVisual.create(scalingBoxTrigger, { isPlayerInside: false })
  Tween.create(scalingBoxTrigger, {
    mode: Tween.Mode.Scale({
      start: Vector3.create(scaleMin, scaleMin, scaleMin),
      end: Vector3.create(scaleMax, scaleMax, scaleMax)
    }),
    duration: 2000,
    easingFunction: EasingFunction.EF_LINEAR
  })
  TweenSequence.create(scalingBoxTrigger, {
    loop: TweenLoop.TL_YOYO,
    sequence: []
  })
  triggerAreaEventsSystem.onTriggerEnter(scalingBoxTrigger, () => {
    TriggerVisual.getMutable(scalingBoxTrigger).isPlayerInside = true
    Material.setPbrMaterial(scalingBoxTrigger, {
      albedoColor: Color4.create(0.3, 1.0, 0.5, 0.3),
      transparencyMode: MaterialTransparencyMode.MTM_ALPHA_BLEND
    })
    console.log('SCALING BOX: Enter')
  })
  triggerAreaEventsSystem.onTriggerExit(scalingBoxTrigger, () => {
    TriggerVisual.getMutable(scalingBoxTrigger).isPlayerInside = false
    Material.setPbrMaterial(scalingBoxTrigger, {
      albedoColor: Color4.create(1.0, 0.3, 0.5, 0.3),
      transparencyMode: MaterialTransparencyMode.MTM_ALPHA_BLEND
    })
    console.log('SCALING BOX: Exit')
  })
  createLabel('SCALING BOX\n(balloon)', Vector3.create(triggerBaseX + 10, 6, row5Z), 1)

  // 12. Create/Delete Loop Test
  const createDeletePos = Vector3.create(triggerBaseX, 2, row5Z)
  let createDeleteEntity: Entity | null = null
  let createDeleteTimer = 0
  let isPlayerInsideCreateDelete = false
  const CREATE_DELETE_INTERVAL = 1

  function createTestBox() {
    createDeleteEntity = engine.addEntity()
    Transform.create(createDeleteEntity, {
      position: createDeletePos,
      scale: Vector3.create(3, 3, 3)
    })
    MeshRenderer.setBox(createDeleteEntity)
    Material.setPbrMaterial(createDeleteEntity, {
      albedoColor: isPlayerInsideCreateDelete ? TRIGGER_COLOR_INSIDE : TRIGGER_COLOR_OUTSIDE,
      transparencyMode: MaterialTransparencyMode.MTM_ALPHA_BLEND
    })
    TriggerArea.setBox(createDeleteEntity, ColliderLayer.CL_PLAYER)

    triggerAreaEventsSystem.onTriggerEnter(createDeleteEntity, () => {
      isPlayerInsideCreateDelete = true
      if (createDeleteEntity !== null) {
        Material.setPbrMaterial(createDeleteEntity, {
          albedoColor: TRIGGER_COLOR_INSIDE,
          transparencyMode: MaterialTransparencyMode.MTM_ALPHA_BLEND
        })
      }
      console.log('CREATE/DELETE: Player entered')
    })
    triggerAreaEventsSystem.onTriggerExit(createDeleteEntity, () => {
      isPlayerInsideCreateDelete = false
      if (createDeleteEntity !== null) {
        Material.setPbrMaterial(createDeleteEntity, {
          albedoColor: TRIGGER_COLOR_OUTSIDE,
          transparencyMode: MaterialTransparencyMode.MTM_ALPHA_BLEND
        })
      }
      console.log('CREATE/DELETE: Player exited')
    })

    console.log('CREATE/DELETE: Box created')
  }

  function deleteTestBox() {
    if (createDeleteEntity !== null) {
      engine.removeEntity(createDeleteEntity)
      createDeleteEntity = null
      isPlayerInsideCreateDelete = false
      console.log('CREATE/DELETE: Box deleted')
    }
  }

  engine.addSystem((dt: number) => {
    createDeleteTimer += dt
    if (createDeleteTimer >= CREATE_DELETE_INTERVAL) {
      createDeleteTimer = 0
      if (createDeleteEntity === null) {
        createTestBox()
      } else {
        deleteTestBox()
      }
    }
  })

  createLabel('CREATE/DELETE\n(1s loop)', Vector3.create(triggerBaseX, 6, row5Z), 1)

  // =========================================================================
  // ROW 6: Physics Ball Test Track
  // =========================================================================
  const row6Z = triggerBaseZ + 42
  const ballTrackStartX = triggerBaseX - 10
  const ballTrackEndX = triggerBaseX + 40

  createLabel('PHYSICS BALL TRACK\n(ball triggers obstacles)', Vector3.create(triggerBaseX + 15, 8, row6Z - 5), 1.2)

  // Physics ball
  const physicsBall = engine.addEntity()
  Transform.create(physicsBall, {
    position: Vector3.create(ballTrackStartX, 2, row6Z),
    scale: Vector3.create(1.5, 1.5, 1.5)
  })
  MeshRenderer.setSphere(physicsBall)
  MeshCollider.setSphere(physicsBall, ColliderLayer.CL_PHYSICS)
  Material.setPbrMaterial(physicsBall, {
    albedoColor: Color4.create(1.0, 1.0, 0.0, 1)
  })
  Tween.create(physicsBall, {
    mode: Tween.Mode.Move({
      start: Vector3.create(ballTrackStartX, 2, row6Z),
      end: Vector3.create(ballTrackEndX, 2, row6Z)
    }),
    duration: 3000,
    easingFunction: EasingFunction.EF_LINEAR
  })
  TweenSequence.create(physicsBall, {
    loop: TweenLoop.TL_YOYO,
    sequence: []
  })
  createLabel('YELLOW BALL\n(CL_PHYSICS)', Vector3.create(ballTrackStartX, 4.5, row6Z), 0.8)

  // Obstacle 1: Box Trigger (CL_PHYSICS only)
  const obsBox = engine.addEntity()
  Transform.create(obsBox, {
    position: Vector3.create(triggerBaseX, 2, row6Z),
    scale: Vector3.create(3, 3, 3)
  })
  MeshRenderer.setBox(obsBox)
  Material.setPbrMaterial(obsBox, {
    albedoColor: Color4.create(0.8, 0.4, 0.0, 0.3),
    transparencyMode: MaterialTransparencyMode.MTM_ALPHA_BLEND
  })
  TriggerArea.setBox(obsBox, ColliderLayer.CL_PHYSICS)
  triggerAreaEventsSystem.onTriggerEnter(obsBox, () => {
    Material.setPbrMaterial(obsBox, {
      albedoColor: Color4.create(0.0, 1.0, 0.0, 0.3),
      transparencyMode: MaterialTransparencyMode.MTM_ALPHA_BLEND
    })
    console.log('OBS BOX: Ball entered')
  })
  triggerAreaEventsSystem.onTriggerExit(obsBox, () => {
    Material.setPbrMaterial(obsBox, {
      albedoColor: Color4.create(0.8, 0.4, 0.0, 0.3),
      transparencyMode: MaterialTransparencyMode.MTM_ALPHA_BLEND
    })
  })
  createLabel('BOX\n(ball only)', Vector3.create(triggerBaseX, 4.5, row6Z), 0.8)

  // Obstacle 2: Sphere Trigger (CL_PHYSICS only)
  const obsSphere = engine.addEntity()
  Transform.create(obsSphere, {
    position: Vector3.create(triggerBaseX + 10, 2, row6Z),
    scale: Vector3.create(3, 3, 3)
  })
  MeshRenderer.setSphere(obsSphere)
  Material.setPbrMaterial(obsSphere, {
    albedoColor: Color4.create(0.0, 0.6, 0.8, 0.3),
    transparencyMode: MaterialTransparencyMode.MTM_ALPHA_BLEND
  })
  TriggerArea.setSphere(obsSphere, ColliderLayer.CL_PHYSICS)
  triggerAreaEventsSystem.onTriggerEnter(obsSphere, () => {
    Material.setPbrMaterial(obsSphere, {
      albedoColor: Color4.create(0.0, 1.0, 0.0, 0.3),
      transparencyMode: MaterialTransparencyMode.MTM_ALPHA_BLEND
    })
    console.log('OBS SPHERE: Ball entered')
  })
  triggerAreaEventsSystem.onTriggerExit(obsSphere, () => {
    Material.setPbrMaterial(obsSphere, {
      albedoColor: Color4.create(0.0, 0.6, 0.8, 0.3),
      transparencyMode: MaterialTransparencyMode.MTM_ALPHA_BLEND
    })
  })
  createLabel('SPHERE\n(ball only)', Vector3.create(triggerBaseX + 10, 4.5, row6Z), 0.8)

  // Obstacle 3: Jumping Box Trigger (CL_PHYSICS)
  const obsJumpingBox = engine.addEntity()
  const jumpStartY = 2
  const jumpEndY = 8
  Transform.create(obsJumpingBox, {
    position: Vector3.create(triggerBaseX + 20, jumpStartY, row6Z),
    scale: Vector3.create(3, 3, 3)
  })
  MeshRenderer.setBox(obsJumpingBox)
  Material.setPbrMaterial(obsJumpingBox, {
    albedoColor: Color4.create(0.8, 0.0, 0.8, 0.3),
    transparencyMode: MaterialTransparencyMode.MTM_ALPHA_BLEND
  })
  TriggerArea.setBox(obsJumpingBox, ColliderLayer.CL_PHYSICS)
  Tween.create(obsJumpingBox, {
    mode: Tween.Mode.Move({
      start: Vector3.create(triggerBaseX + 20, jumpStartY, row6Z),
      end: Vector3.create(triggerBaseX + 20, jumpEndY, row6Z)
    }),
    duration: 1000,
    easingFunction: EasingFunction.EF_LINEAR
  })
  TweenSequence.create(obsJumpingBox, {
    loop: TweenLoop.TL_YOYO,
    sequence: []
  })
  triggerAreaEventsSystem.onTriggerEnter(obsJumpingBox, () => {
    Material.setPbrMaterial(obsJumpingBox, {
      albedoColor: Color4.create(0.0, 1.0, 0.0, 0.3),
      transparencyMode: MaterialTransparencyMode.MTM_ALPHA_BLEND
    })
    console.log('JUMPING BOX: Ball entered')
  })
  triggerAreaEventsSystem.onTriggerExit(obsJumpingBox, () => {
    Material.setPbrMaterial(obsJumpingBox, {
      albedoColor: Color4.create(0.8, 0.0, 0.8, 0.3),
      transparencyMode: MaterialTransparencyMode.MTM_ALPHA_BLEND
    })
  })
  createLabel('JUMPING BOX\n(ball only)', Vector3.create(triggerBaseX + 20, 6, row6Z), 0.8)

  // Obstacle 4: Multi-collision trigger (CL_PLAYER | CL_PHYSICS)
  const obsMulti = engine.addEntity()
  Transform.create(obsMulti, {
    position: Vector3.create(triggerBaseX + 30, 2, row6Z),
    scale: Vector3.create(3, 3, 3)
  })
  MeshRenderer.setBox(obsMulti)
  Material.setPbrMaterial(obsMulti, {
    albedoColor: Color4.create(1.0, 0.5, 0.0, 0.3),
    transparencyMode: MaterialTransparencyMode.MTM_ALPHA_BLEND
  })
  TriggerArea.setBox(obsMulti, [ColliderLayer.CL_PLAYER, ColliderLayer.CL_PHYSICS])

  const multiHitLabel = engine.addEntity()
  Transform.create(multiHitLabel, {
    position: Vector3.create(triggerBaseX + 30, 5, row6Z)
  })
  TextShape.create(multiHitLabel, {
    text: 'Hits: 0',
    fontSize: 2,
    textColor: Color4.White(),
    outlineWidth: 0.2,
    outlineColor: Color3.Black()
  })
  Billboard.create(multiHitLabel)

  let multiHitCount = 0
  triggerAreaEventsSystem.onTriggerEnter(obsMulti, (result) => {
    multiHitCount++
    TextShape.getMutable(multiHitLabel).text = `Hits: ${multiHitCount}`
    Material.setPbrMaterial(obsMulti, {
      albedoColor: Color4.create(0.0, 1.0, 0.0, 0.3),
      transparencyMode: MaterialTransparencyMode.MTM_ALPHA_BLEND
    })
    console.log(`MULTI TRIGGER: Enter (layer: ${result.trigger?.layers}) - Total: ${multiHitCount}`)
  })
  triggerAreaEventsSystem.onTriggerExit(obsMulti, () => {
    Material.setPbrMaterial(obsMulti, {
      albedoColor: Color4.create(1.0, 0.5, 0.0, 0.3),
      transparencyMode: MaterialTransparencyMode.MTM_ALPHA_BLEND
    })
  })
  createLabel('PLAYER + BALL\n(both trigger)', Vector3.create(triggerBaseX + 30, 4.5, row6Z), 0.8)

  // =========================================================================
  // ROW 7: Trigger Layer Change Test
  // Testing what happens when a TriggerArea's collision layer changes dynamically
  // =========================================================================
  const row7Z = triggerBaseZ + 58

  createLabel('TRIGGER LAYER CHANGE TEST\nDynamic collision layer switching', Vector3.create(triggerBaseX + 15, 8, row7Z - 5), 1.2)

  // Layer cycle configuration
  const layerConfigs = [
    { layer: ColliderLayer.CL_PLAYER, name: 'CL_PLAYER', color: Color4.create(0.2, 0.8, 0.2, 0.3) },
    { layer: ColliderLayer.CL_PHYSICS, name: 'CL_PHYSICS', color: Color4.create(0.8, 0.8, 0.2, 0.3) },
    { layer: ColliderLayer.CL_POINTER, name: 'CL_POINTER', color: Color4.create(0.2, 0.2, 0.8, 0.3) },
    { layer: [ColliderLayer.CL_PLAYER, ColliderLayer.CL_PHYSICS], name: 'PLAYER|PHYSICS', color: Color4.create(0.8, 0.2, 0.8, 0.3) }
  ]
  let currentLayerIdx = 0
  let layerTimer = 0
  const LAYER_INTERVAL = 5

  // Main trigger area that changes layers
  const layerChangeTrigger = engine.addEntity()
  Transform.create(layerChangeTrigger, {
    position: Vector3.create(triggerBaseX + 15, 3, row7Z),
    scale: Vector3.create(8, 6, 8)
  })
  MeshRenderer.setBox(layerChangeTrigger)
  Material.setPbrMaterial(layerChangeTrigger, {
    albedoColor: layerConfigs[0].color,
    transparencyMode: MaterialTransparencyMode.MTM_ALPHA_BLEND
  })
  TriggerArea.setBox(layerChangeTrigger, layerConfigs[0].layer)

  // Current layer label
  const layerNameLabel = engine.addEntity()
  Transform.create(layerNameLabel, {
    position: Vector3.create(triggerBaseX + 15, 8, row7Z)
  })
  TextShape.create(layerNameLabel, {
    text: `Current Layer: ${layerConfigs[0].name}`,
    fontSize: 3,
    textColor: Color4.White(),
    outlineWidth: 0.2,
    outlineColor: Color3.Black()
  })
  Billboard.create(layerNameLabel)

  // Timer label
  const layerTimerLabel = engine.addEntity()
  Transform.create(layerTimerLabel, {
    position: Vector3.create(triggerBaseX + 15, 7, row7Z)
  })
  TextShape.create(layerTimerLabel, {
    text: `Next change in: ${LAYER_INTERVAL}s`,
    fontSize: 2,
    textColor: Color4.Yellow(),
    outlineWidth: 0.2,
    outlineColor: Color3.Black()
  })
  Billboard.create(layerTimerLabel)

  // Event log label
  const layerEventLog = engine.addEntity()
  Transform.create(layerEventLog, {
    position: Vector3.create(triggerBaseX + 28, 5, row7Z)
  })
  TextShape.create(layerEventLog, {
    text: 'EVENT LOG:\n(waiting...)',
    fontSize: 1.2,
    textColor: Color4.White(),
    outlineWidth: 0.2,
    outlineColor: Color3.Black()
  })
  Billboard.create(layerEventLog)

  // Event log storage
  const layerEvents: string[] = []
  const MAX_EVENTS = 8

  function addLayerEvent(event: string) {
    const timestamp = Math.floor(layerTimer * 10) / 10
    layerEvents.unshift(`[${timestamp}s] ${event}`)
    if (layerEvents.length > MAX_EVENTS) {
      layerEvents.pop()
    }
    TextShape.getMutable(layerEventLog).text = 'EVENT LOG:\n' + layerEvents.join('\n')
  }

  // Trigger events
  triggerAreaEventsSystem.onTriggerEnter(layerChangeTrigger, () => {
    const layerName = layerConfigs[currentLayerIdx].name
    addLayerEvent(`ENTER (${layerName})`)
    Material.setPbrMaterial(layerChangeTrigger, {
      albedoColor: Color4.create(
        layerConfigs[currentLayerIdx].color.r + 0.3,
        layerConfigs[currentLayerIdx].color.g + 0.3,
        layerConfigs[currentLayerIdx].color.b + 0.3,
        0.5
      ),
      transparencyMode: MaterialTransparencyMode.MTM_ALPHA_BLEND
    })
  })

  triggerAreaEventsSystem.onTriggerExit(layerChangeTrigger, () => {
    const layerName = layerConfigs[currentLayerIdx].name
    addLayerEvent(`EXIT (${layerName})`)
    Material.setPbrMaterial(layerChangeTrigger, {
      albedoColor: layerConfigs[currentLayerIdx].color,
      transparencyMode: MaterialTransparencyMode.MTM_ALPHA_BLEND
    })
  })

  // Physics ball for CL_PHYSICS testing (moves through trigger)
  const layerTestBall = engine.addEntity()
  Transform.create(layerTestBall, {
    position: Vector3.create(triggerBaseX + 5, 2, row7Z - 6),
    scale: Vector3.create(1.5, 1.5, 1.5)
  })
  MeshRenderer.setSphere(layerTestBall)
  MeshCollider.setSphere(layerTestBall, ColliderLayer.CL_PHYSICS)
  Material.setPbrMaterial(layerTestBall, {
    albedoColor: Color4.Yellow()
  })
  Tween.create(layerTestBall, {
    mode: Tween.Mode.Move({
      start: Vector3.create(triggerBaseX + 5, 2, row7Z - 6),
      end: Vector3.create(triggerBaseX + 25, 2, row7Z + 6)
    }),
    duration: 6000,
    easingFunction: EasingFunction.EF_LINEAR
  })
  TweenSequence.create(layerTestBall, {
    loop: TweenLoop.TL_YOYO,
    sequence: []
  })
  createLabel('Physics Ball', Vector3.create(triggerBaseX + 5, 4.5, row7Z - 6), 0.8)

  // Layer change system
  engine.addSystem((dt: number) => {
    layerTimer += dt
    const timeUntilChange = LAYER_INTERVAL - (layerTimer % LAYER_INTERVAL)
    TextShape.getMutable(layerTimerLabel).text = `Next change in: ${timeUntilChange.toFixed(1)}s`

    if (layerTimer >= LAYER_INTERVAL) {
      layerTimer = 0

      const prevName = layerConfigs[currentLayerIdx].name
      currentLayerIdx = (currentLayerIdx + 1) % layerConfigs.length
      const newConfig = layerConfigs[currentLayerIdx]

      addLayerEvent(`LAYER: ${prevName} -> ${newConfig.name}`)

      // Update trigger collision layer
      TriggerArea.deleteFrom(layerChangeTrigger)
      if (Array.isArray(newConfig.layer)) {
        TriggerArea.setBox(layerChangeTrigger, newConfig.layer)
      } else {
        TriggerArea.setBox(layerChangeTrigger, newConfig.layer)
      }

      // Update visuals
      Material.setPbrMaterial(layerChangeTrigger, {
        albedoColor: newConfig.color,
        transparencyMode: MaterialTransparencyMode.MTM_ALPHA_BLEND
      })
      TextShape.getMutable(layerNameLabel).text = `Current Layer: ${newConfig.name}`
    }
  })

  createLabel(
    'INSTRUCTIONS:\n1. Stand inside the trigger\n2. Watch layer cycle every 5s\n3. Check ENTER/EXIT events on change',
    Vector3.create(triggerBaseX, 1, row7Z - 8),
    0.8
  )

  // =========================================================================
  // ROW 8: AvatarShape NPC Walking Through Trigger
  // Testing if CL_PLAYER trigger detects AvatarShape entities
  // =========================================================================
  const row8Z = triggerBaseZ + 74

  createLabel('AVATARSHAPE NPC TEST\nDoes CL_PLAYER detect NPCs?', Vector3.create(triggerBaseX + 15, 8, row8Z - 5), 1.2)

  // Trigger area for NPC to walk through
  const npcTrigger = engine.addEntity()
  Transform.create(npcTrigger, {
    position: Vector3.create(triggerBaseX + 15, 2, row8Z),
    scale: Vector3.create(6, 4, 6)
  })
  MeshRenderer.setBox(npcTrigger)
  Material.setPbrMaterial(npcTrigger, {
    albedoColor: TRIGGER_COLOR_OUTSIDE,
    transparencyMode: MaterialTransparencyMode.MTM_ALPHA_BLEND
  })
  TriggerArea.setBox(npcTrigger, ColliderLayer.CL_PLAYER)

  // Status label for NPC trigger
  const npcTriggerStatus = engine.addEntity()
  Transform.create(npcTriggerStatus, {
    position: Vector3.create(triggerBaseX + 15, 6, row8Z)
  })
  TextShape.create(npcTriggerStatus, {
    text: 'NPC TRIGGER: Waiting...',
    fontSize: 2,
    textColor: Color4.White(),
    outlineWidth: 0.2,
    outlineColor: Color3.Black()
  })
  Billboard.create(npcTriggerStatus)

  let npcEnterCount = 0
  let npcExitCount = 0

  triggerAreaEventsSystem.onTriggerEnter(npcTrigger, (result) => {
    npcEnterCount++
    const entityId = result.trigger?.entity ?? 'unknown'
    TextShape.getMutable(npcTriggerStatus).text = `NPC TRIGGER: ENTER #${npcEnterCount}\nEntity: ${entityId}`
    TextShape.getMutable(npcTriggerStatus).textColor = Color4.Green()
    Material.setPbrMaterial(npcTrigger, {
      albedoColor: TRIGGER_COLOR_INSIDE,
      transparencyMode: MaterialTransparencyMode.MTM_ALPHA_BLEND
    })
    console.log(`NPC TRIGGER: ENTER - entity ${entityId}`)
  })

  triggerAreaEventsSystem.onTriggerExit(npcTrigger, (result) => {
    npcExitCount++
    const entityId = result.trigger?.entity ?? 'unknown'
    TextShape.getMutable(npcTriggerStatus).text = `NPC TRIGGER: EXIT #${npcExitCount}\nEntity: ${entityId}`
    TextShape.getMutable(npcTriggerStatus).textColor = Color4.Red()
    Material.setPbrMaterial(npcTrigger, {
      albedoColor: TRIGGER_COLOR_OUTSIDE,
      transparencyMode: MaterialTransparencyMode.MTM_ALPHA_BLEND
    })
    console.log(`NPC TRIGGER: EXIT - entity ${entityId}`)
  })

  // Create NPC with AvatarShape that walks through the trigger
  const npcAvatar = engine.addEntity()
  const npcStartPos = Vector3.create(triggerBaseX, 0, row8Z)
  const npcEndPos = Vector3.create(triggerBaseX + 30, 0, row8Z)

  Transform.create(npcAvatar, {
    position: npcStartPos
  })

  // Add AvatarShape to make it look like a player
  AvatarShape.create(npcAvatar, {
    id: 'npc-test-avatar',
    name: 'Test NPC',
    bodyShape: 'urn:decentraland:off-chain:base-avatars:BaseFemale',
    wearables: [
      'urn:decentraland:off-chain:base-avatars:f_eyes_00',
      'urn:decentraland:off-chain:base-avatars:f_eyebrows_00',
      'urn:decentraland:off-chain:base-avatars:f_mouth_00',
      'urn:decentraland:off-chain:base-avatars:standard_hair',
      'urn:decentraland:off-chain:base-avatars:f_simple_yellow_tshirt',
      'urn:decentraland:off-chain:base-avatars:f_brown_trousers',
      'urn:decentraland:off-chain:base-avatars:bun_shoes'
    ],
    emotes: []
  })

  // NO extra collider - testing if AvatarShape alone triggers CL_PLAYER

  // Move NPC back and forth through the trigger
  Tween.create(npcAvatar, {
    mode: Tween.Mode.Move({
      start: npcStartPos,
      end: npcEndPos
    }),
    duration: 6000,
    easingFunction: EasingFunction.EF_LINEAR
  })
  TweenSequence.create(npcAvatar, {
    loop: TweenLoop.TL_YOYO,
    sequence: []
  })

  // Label for NPC start position
  createLabel('NPC Start\n(AvatarShape)', Vector3.create(triggerBaseX, 3, row8Z), 0.8)
  createLabel('NPC End', Vector3.create(triggerBaseX + 30, 3, row8Z), 0.8)

  createLabel(
    'TEST: AvatarShape NPC walks through\nCL_PLAYER trigger. Does it detect?',
    Vector3.create(triggerBaseX + 15, 1, row8Z + 6),
    0.7
  )

  // Row labels
  createLabel('ROW 1: Basic Shapes', Vector3.create(triggerBaseX - 15, 3, row1Z), 1)
  createLabel('ROW 2: Collision Layers', Vector3.create(triggerBaseX - 15, 3, row2Z), 1)
  createLabel('ROW 3: Event Types', Vector3.create(triggerBaseX - 15, 3, row3Z), 1)
  createLabel('ROW 4: Special Cases', Vector3.create(triggerBaseX - 15, 3, row4Z), 1)
  createLabel('ROW 5: Moving Triggers', Vector3.create(triggerBaseX - 15, 3, row5Z), 1)
  createLabel('ROW 6: Physics Ball Track', Vector3.create(triggerBaseX - 15, 3, row6Z), 1)
  createLabel('ROW 7: Layer Change', Vector3.create(triggerBaseX - 15, 3, row7Z), 1)
  createLabel('ROW 8: AvatarShape NPC', Vector3.create(triggerBaseX - 15, 3, row8Z), 1)
}
