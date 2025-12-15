import {
  engine,
  Transform,
  MeshRenderer,
  MeshCollider,
  Material,
  PointerEvents,
  PointerEventType,
  inputSystem,
  InputAction,
  Entity
} from '@dcl/sdk/ecs'
import { Vector3, Color4 } from '@dcl/sdk/math'
import { movePlayerTo } from '~system/RestrictedActions'
import { createPlatform, createLabel } from '../utils/helpers'

/**
 * TEST 9: WALL TELEPORT TEST - Testing movePlayerTo into solid objects
 * Located in negative Z parcels
 */
export function setupTeleportTest() {
  const wallTestX = 8
  const wallTestZ = -40
  const wallSize = 6

  createLabel('WALL TELEPORT TEST\n(teleport into solid box)', Vector3.create(wallTestX, 8, wallTestZ), 1.5)

  // Platform for the test area
  createPlatform(
    Vector3.create(wallTestX + 10, 0.05, wallTestZ),
    Vector3.create(50, 0.1, 30),
    Color4.create(0.25, 0.25, 0.25, 1)
  )

  // The solid wall/box to teleport into
  const wallBox = engine.addEntity()
  Transform.create(wallBox, {
    position: Vector3.create(wallTestX, wallSize / 2, wallTestZ),
    scale: Vector3.create(wallSize, wallSize, wallSize)
  })
  MeshRenderer.setBox(wallBox)
  MeshCollider.setBox(wallBox)
  Material.setPbrMaterial(wallBox, {
    albedoColor: Color4.create(0.6, 0.2, 0.2, 1)
  })
  createLabel('SOLID BOX', Vector3.create(wallTestX, wallSize + 1, wallTestZ), 1)

  // Safe area marker
  const safeAreaPos = Vector3.create(wallTestX, 1, wallTestZ + 15)
  const safeMarker = engine.addEntity()
  Transform.create(safeMarker, {
    position: Vector3.create(safeAreaPos.x, 0.1, safeAreaPos.z),
    scale: Vector3.create(3, 0.1, 3)
  })
  MeshRenderer.setBox(safeMarker)
  Material.setPbrMaterial(safeMarker, {
    albedoColor: Color4.create(0.2, 0.8, 0.2, 1)
  })
  createLabel('SAFE AREA\n(return here)', Vector3.create(safeAreaPos.x, 1.5, safeAreaPos.z), 0.8)

  // 14 teleport depths: from 1m outside to 4m inside (past center)
  const teleportDepths = [
    { label: '-1.0m\nOUTSIDE', depth: -1.0 },
    { label: '-0.5m\nOUTSIDE', depth: -0.5 },
    { label: '0m\nEDGE', depth: 0 },
    { label: '0.25m', depth: 0.25 },
    { label: '0.5m', depth: 0.5 },
    { label: '0.75m', depth: 0.75 },
    { label: '1.0m', depth: 1.0 },
    { label: '1.5m', depth: 1.5 },
    { label: '2.0m', depth: 2.0 },
    { label: '2.5m', depth: 2.5 },
    { label: '3.0m\nCENTER', depth: 3.0 },
    { label: '3.5m', depth: 3.5 },
    { label: '4.0m', depth: 4.0 },
    { label: '5.0m\nTHROUGH', depth: 5.0 }
  ]

  // Store all button entities and their target positions
  const teleportButtons: { entity: Entity, targetX: number, targetY: number, targetZ: number }[] = []

  // Create teleport buttons arranged in a line on the +X side of the box
  const buttonStartX = wallTestX + wallSize / 2 + 2
  const buttonY = 0.5
  const buttonSpacing = 1.8

  teleportDepths.forEach((tp, index) => {
    const buttonX = buttonStartX + index * buttonSpacing
    const buttonZ = wallTestZ

    // Create button
    const button = engine.addEntity()
    Transform.create(button, {
      position: Vector3.create(buttonX, buttonY, buttonZ),
      scale: Vector3.create(1.2, 0.8, 1.2)
    })
    MeshRenderer.setBox(button)
    MeshCollider.setBox(button)

    // Color based on position: green outside, yellow at edge, red inside
    let buttonColor: Color4
    if (tp.depth < 0) {
      buttonColor = Color4.create(0.2, 0.7, 0.2, 1)  // Green - outside
    } else if (tp.depth === 0) {
      buttonColor = Color4.create(0.8, 0.8, 0.2, 1)  // Yellow - edge
    } else {
      buttonColor = Color4.create(0.7, 0.2, 0.2, 1)  // Red - inside
    }
    Material.setPbrMaterial(button, { albedoColor: buttonColor })

    // Calculate target position
    const targetX = wallTestX + wallSize / 2 - tp.depth
    const targetY = 1
    const targetZ = wallTestZ

    // Store button info
    teleportButtons.push({ entity: button, targetX, targetY, targetZ })

    // Add pointer events
    PointerEvents.create(button, {
      pointerEvents: [
        {
          eventType: PointerEventType.PET_DOWN,
          eventInfo: {
            button: InputAction.IA_POINTER,
            hoverText: `Teleport: ${tp.label.replace('\n', ' ')}`
          }
        }
      ]
    })

    // Label for the button
    createLabel(tp.label, Vector3.create(buttonX, buttonY + 1.5, buttonZ), 0.6)
  })

  // Single system to handle all teleport button clicks
  engine.addSystem(() => {
    for (const btn of teleportButtons) {
      const cmd = inputSystem.getInputCommand(
        InputAction.IA_POINTER,
        PointerEventType.PET_DOWN,
        btn.entity
      )

      if (cmd) {
        console.log(`Teleporting to X=${btn.targetX.toFixed(2)}...`)

        movePlayerTo({
          newRelativePosition: Vector3.create(btn.targetX, btn.targetY, btn.targetZ)
        })
      }
    }
  })
}
