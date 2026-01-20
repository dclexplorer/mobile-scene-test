import {
  engine,
  Transform,
  MeshRenderer,
  MeshCollider,
  Material,
  PointerEvents,
  PointerEventType,
  InputAction,
  VirtualCamera,
  InputModifier,
  MainCamera,
  NftShape,
  NftFrameType,
  Entity
} from '@dcl/sdk/ecs'
import { Vector3, Color4, Quaternion, Color3 } from '@dcl/sdk/math'
import { createPlatform, createLabel } from '../utils/helpers'

// State tracking
let virtualCameraActive = false
let inputModifierActive = false
let orbitingCameraActive = false

/**
 * TEST 15: MISC TEST - VirtualCamera and InputModifier
 * Located in parcel 3,2 (X = 48 to 64, Z = 32 to 48)
 */
export function setupMiscTest() {
  const miscCenterX = 56
  const miscCenterZ = 40

  // Main platform
  createPlatform(
    Vector3.create(miscCenterX, 0.1, miscCenterZ),
    Vector3.create(16, 0.2, 16),
    Color4.create(0.2, 0.2, 0.3, 1)
  )

  createLabel('MISC TEST\n(VirtualCamera & InputModifier)', Vector3.create(miscCenterX, 4, miscCenterZ - 6), 1.2)

  // =========================================================================
  // VIRTUAL CAMERA TEST
  // =========================================================================
  const vcTestX = miscCenterX - 4
  const vcTestZ = miscCenterZ

  createLabel('VIRTUAL CAMERA\nClick to toggle', Vector3.create(vcTestX, 3, vcTestZ - 2.5), 0.8)

  // Create a VirtualCamera entity with a fixed position
  const virtualCameraEntity = engine.addEntity()
  Transform.create(virtualCameraEntity, {
    position: Vector3.create(miscCenterX, 8, miscCenterZ - 10),
    rotation: Quaternion.fromEulerDegrees(30, 0, 0)
  })

  // Add VirtualCamera component - try without transition first
  VirtualCamera.create(virtualCameraEntity, {})

  console.log('VirtualCamera entity created:', virtualCameraEntity)
  console.log('VirtualCamera has component:', VirtualCamera.has(virtualCameraEntity))
  console.log('engine.CameraEntity:', engine.CameraEntity)

  // Button to toggle VirtualCamera
  const vcButton = engine.addEntity()
  Transform.create(vcButton, {
    position: Vector3.create(vcTestX, 1, vcTestZ),
    scale: Vector3.create(2, 2, 2)
  })
  MeshRenderer.setBox(vcButton)
  MeshCollider.setBox(vcButton)
  Material.setPbrMaterial(vcButton, {
    albedoColor: Color4.create(0.2, 0.5, 0.8, 1)
  })
  PointerEvents.create(vcButton, {
    pointerEvents: [
      {
        eventType: PointerEventType.PET_DOWN,
        eventInfo: {
          button: InputAction.IA_POINTER,
          hoverText: 'Toggle VirtualCamera'
        }
      }
    ]
  })

  // Status indicator for VirtualCamera
  const vcStatusLabel = engine.addEntity()
  Transform.create(vcStatusLabel, {
    position: Vector3.create(vcTestX, 3.5, vcTestZ)
  })

  // Create visual marker at camera position
  const cameraMarker = engine.addEntity()
  Transform.create(cameraMarker, {
    position: Vector3.create(miscCenterX, 8, miscCenterZ - 10),
    scale: Vector3.create(0.5, 0.5, 0.5)
  })
  MeshRenderer.setBox(cameraMarker)
  Material.setPbrMaterial(cameraMarker, {
    albedoColor: Color4.create(1, 1, 0, 1),
    emissiveColor: Color4.create(1, 1, 0, 1),
    emissiveIntensity: 2
  })
  createLabel('Fixed Camera\nPosition', Vector3.create(miscCenterX, 9, miscCenterZ - 10), 0.6)

  // =========================================================================
  // ORBITING VIRTUAL CAMERA TEST
  // =========================================================================
  const orbitTestX = miscCenterX
  const orbitTestZ = miscCenterZ - 4

  createLabel('ORBITING CAMERA\nCamera moves around you', Vector3.create(orbitTestX, 3, orbitTestZ - 2), 0.8)

  // Orbit parameters
  const orbitCenterX = miscCenterX
  const orbitCenterZ = miscCenterZ
  const orbitRadius = 8
  const orbitHeight = 5
  const orbitSpeed = 0.5 // radians per second
  let orbitAngle = 0

  // Create the orbiting camera entity (NO parent - we'll update position manually)
  const orbitingCameraEntity = engine.addEntity()
  Transform.create(orbitingCameraEntity, {
    position: Vector3.create(orbitCenterX, orbitHeight, orbitCenterZ - orbitRadius),
    rotation: Quaternion.Identity()
  })

  // Create a target entity at the center for the camera to look at
  const lookAtTarget = engine.addEntity()
  Transform.create(lookAtTarget, {
    position: Vector3.create(orbitCenterX, 1.5, orbitCenterZ)
  })

  // Add VirtualCamera component - simple setup
  VirtualCamera.create(orbitingCameraEntity, {
    lookAtEntity: lookAtTarget
  })

  console.log('Orbiting VirtualCamera entity created:', orbitingCameraEntity)
  console.log('Orbiting VirtualCamera has component:', VirtualCamera.has(orbitingCameraEntity))

  // Visual marker that follows the orbiting camera
  const orbitCameraMarker = engine.addEntity()
  Transform.create(orbitCameraMarker, {
    position: Vector3.create(orbitCenterX, orbitHeight, orbitCenterZ - orbitRadius),
    scale: Vector3.create(0.4, 0.4, 0.8)
  })
  MeshRenderer.setBox(orbitCameraMarker)
  Material.setPbrMaterial(orbitCameraMarker, {
    albedoColor: Color4.create(0, 1, 1, 1),
    emissiveColor: Color4.create(0, 1, 1, 1),
    emissiveIntensity: 2
  })

  // Visual marker for the look-at target
  const lookAtMarker = engine.addEntity()
  Transform.create(lookAtMarker, {
    position: Vector3.create(orbitCenterX, 1.5, orbitCenterZ),
    scale: Vector3.create(0.3, 0.3, 0.3)
  })
  MeshRenderer.setSphere(lookAtMarker)
  Material.setPbrMaterial(lookAtMarker, {
    albedoColor: Color4.create(1, 0, 1, 1),
    emissiveColor: Color4.create(1, 0, 1, 1),
    emissiveIntensity: 1
  })
  createLabel('Look At\nTarget', Vector3.create(orbitCenterX, 2.5, orbitCenterZ), 0.5)

  // System to update the orbiting camera position
  engine.addSystem((dt: number) => {
    if (!orbitingCameraActive) return

    // Update angle
    orbitAngle += orbitSpeed * dt

    // Calculate new position on the orbit circle
    const newX = orbitCenterX + Math.sin(orbitAngle) * orbitRadius
    const newZ = orbitCenterZ + Math.cos(orbitAngle) * orbitRadius

    // Update camera position
    const cameraTransform = Transform.getMutable(orbitingCameraEntity)
    cameraTransform.position = Vector3.create(newX, orbitHeight, newZ)

    // Update visual marker to match
    const markerTransform = Transform.getMutable(orbitCameraMarker)
    markerTransform.position = Vector3.create(newX, orbitHeight, newZ)
  })

  // Button to toggle orbiting camera
  const orbitButton = engine.addEntity()
  Transform.create(orbitButton, {
    position: Vector3.create(orbitTestX, 1, orbitTestZ),
    scale: Vector3.create(2, 2, 2)
  })
  MeshRenderer.setBox(orbitButton)
  MeshCollider.setBox(orbitButton)
  Material.setPbrMaterial(orbitButton, {
    albedoColor: Color4.create(0.2, 0.7, 0.7, 1)
  })
  PointerEvents.create(orbitButton, {
    pointerEvents: [
      {
        eventType: PointerEventType.PET_DOWN,
        eventInfo: {
          button: InputAction.IA_POINTER,
          hoverText: 'Toggle Orbiting Camera'
        }
      }
    ]
  })

  // =========================================================================
  // INPUT MODIFIER TEST
  // =========================================================================
  const imTestX = miscCenterX + 4
  const imTestZ = miscCenterZ

  createLabel('INPUT MODIFIER\nClick to toggle movement', Vector3.create(imTestX, 3, imTestZ - 2.5), 0.8)

  // Button to toggle InputModifier
  const imButton = engine.addEntity()
  Transform.create(imButton, {
    position: Vector3.create(imTestX, 1, imTestZ),
    scale: Vector3.create(2, 2, 2)
  })
  MeshRenderer.setBox(imButton)
  MeshCollider.setBox(imButton)
  Material.setPbrMaterial(imButton, {
    albedoColor: Color4.create(0.8, 0.3, 0.2, 1)
  })
  PointerEvents.create(imButton, {
    pointerEvents: [
      {
        eventType: PointerEventType.PET_DOWN,
        eventInfo: {
          button: InputAction.IA_POINTER,
          hoverText: 'Toggle InputModifier (Block Movement)'
        }
      }
    ]
  })

  // Separate buttons for specific input blocks
  createInputModifierButtons(miscCenterX, miscCenterZ)

  // =========================================================================
  // TEXTURE FORMAT TEST
  // =========================================================================
  const texTestZ = miscCenterZ + 10

  createLabel('TEXTURE FORMATS\nTesting different image formats', Vector3.create(miscCenterX, 4, texTestZ + 4), 0.8)

  const textureFormats = [
    { format: 'PNG', file: 'images/test-texture.png', x: -9 },
    { format: 'JPEG', file: 'images/test-texture.jpg', x: -6 },
    { format: 'GIF', file: 'images/test-texture.gif', x: -3 },
    { format: 'WEBP', file: 'images/test-texture.webp', x: 0 },
    { format: 'AVIF', file: 'images/test-texture.avif', x: 3 },
    { format: 'HEIC', file: 'images/test-texture.heic', x: 6 },
    { format: 'KTX2', file: 'images/test-texture.ktx2', x: 9 }
  ]

  textureFormats.forEach(({ format, file, x }) => {
    // Create a plane to display the texture
    const texturePlane = engine.addEntity()
    Transform.create(texturePlane, {
      position: Vector3.create(miscCenterX + x, 2, texTestZ),
      scale: Vector3.create(2, 2, 0.1)
    })
    MeshRenderer.setPlane(texturePlane)
    Material.setPbrMaterial(texturePlane, {
      texture: Material.Texture.Common({
        src: file
      })
    })

    // Label for the format
    createLabel(format, Vector3.create(miscCenterX + x, 3.5, texTestZ), 0.6)
  })

  console.log('Texture format tests created: PNG, JPEG, GIF, WEBP, AVIF, HEIC, KTX2')

  // =========================================================================
  // NFT SHAPE TEST (OpenSea NFTs) - All URNs with click support
  // =========================================================================
  const nftTestZ = miscCenterZ - 10

  createLabel('NFT SHAPES (Click to open)\nAll URNs from NFT Museum', Vector3.create(miscCenterX, 5, nftTestZ - 2), 0.8)

  // ALL NFT URNs from the NFT Museum
  const allNftUrns = [
    'urn:decentraland:ethereum:erc721:0xecf7ef42b57ee37a959bf507183c5dd6bf182081:100',
    'urn:decentraland:ethereum:erc721:0x41a322b28d0ff354040e2cbc676f0320d8c8850d:3734',
    'urn:decentraland:matic:erc721:0x7552589075e94b41819ddfef622f07160b5b813c:32',
    'urn:decentraland:matic:erc721:0x2d58a44d6c0a355de25761fb33a1f6269a97e2c5:1855',
    'urn:decentraland:matic:erc721:0xe89758f01d76e1f76bc900f6749f56e1e5edc7fc:896',
    'urn:decentraland:ethereum:erc721:0x06012c8cf97bead5deae237070f9587f8e7a266d:1540722',
    'urn:decentraland:matic:erc721:0xd27a967ee4f66226d49a18d4f9fd98f4aa0b26df:9567',
    'urn:decentraland:ethereum:erc721:0x22c1f6050e56d2876009903609a2cc3fef83b415:13726',
    'urn:decentraland:matic:erc721:0x0520501f5fec9ada8198b40524ce1decac303ca7:9886',
    'urn:decentraland:ethereum:erc721:0x7e6027a6a84fc1f6db6782c523efe62c923e46ff:26435179062837234498192774682918990336524160459589740286407496683957895479890',
    'urn:decentraland:ethereum:erc721:0x22c1f6050e56d2876009903609a2cc3fef83b415:15726',
    'urn:decentraland:ethereum:erc721:0x22c1f6050e56d2876009903609a2cc3fef83b415:13655',
    'urn:decentraland:ethereum:erc721:0x22c1f6050e56d2876009903609a2cc3fef83b415:11975',
    'urn:decentraland:ethereum:erc721:0x495f947276749ce646f68ac8c248420045cb7b5e:51297453693788132298669809830038636826071347270421607062891710071363946414095',
    'urn:decentraland:ethereum:erc721:0x22c1f6050e56d2876009903609a2cc3fef83b415:12673',
    'urn:decentraland:ethereum:erc721:0x22c1f6050e56d2876009903609a2cc3fef83b415:13493',
    'urn:decentraland:ethereum:erc721:0x22c1f6050e56d2876009903609a2cc3fef83b415:13294'
  ]

  // All available frame types to cycle through
  const frameTypes = [
    NftFrameType.NFT_CLASSIC,
    NftFrameType.NFT_BAROQUE_ORNAMENT,
    NftFrameType.NFT_DIAMOND_ORNAMENT,
    NftFrameType.NFT_MINIMAL_WIDE,
    NftFrameType.NFT_MINIMAL_GREY,
    NftFrameType.NFT_BLOCKY,
    NftFrameType.NFT_GOLD_EDGES,
    NftFrameType.NFT_GOLD_CARVED,
    NftFrameType.NFT_GOLD_WIDE,
    NftFrameType.NFT_GOLD_ROUNDED,
    NftFrameType.NFT_METAL_MEDIUM,
    NftFrameType.NFT_METAL_WIDE,
    NftFrameType.NFT_METAL_SLIM,
    NftFrameType.NFT_METAL_ROUNDED,
    NftFrameType.NFT_PINS,
    NftFrameType.NFT_MINIMAL_BLACK,
    NftFrameType.NFT_MINIMAL_WHITE,
    NftFrameType.NFT_TAPE,
    NftFrameType.NFT_WOOD_SLIM,
    NftFrameType.NFT_WOOD_WIDE,
    NftFrameType.NFT_WOOD_TWIGS,
    NftFrameType.NFT_CANVAS,
    NftFrameType.NFT_NONE
  ]

  // Store NFT entities for click handling
  const nftEntities: { entity: Entity; urn: string }[] = []

  // Create NFTs in a wall grid layout (6 columns x 3 rows on same wall)
  const nftsPerRow = 6
  const xSpacing = 3.2
  const ySpacing = 3.2

  allNftUrns.forEach((urn, index) => {
    const row = Math.floor(index / nftsPerRow)
    const col = index % nftsPerRow
    const x = (col - (nftsPerRow - 1) / 2) * xSpacing
    const y = 8 - row * ySpacing  // Row 0: Y=8, Row 1: Y=4.8, Row 2: Y=1.6

    const nftEntity = engine.addEntity()
    Transform.create(nftEntity, {
      position: Vector3.create(miscCenterX + x, y, nftTestZ),
      scale: Vector3.create(2.5, 2.5, 2.5),
      rotation: Quaternion.fromEulerDegrees(0, 180, 0)
    })

    // Add collider for click detection
    MeshCollider.setPlane(nftEntity)

    // Add NFT shape with cycling frame types
    const frameType = frameTypes[index % frameTypes.length]
    NftShape.create(nftEntity, {
      urn: urn,
      color: Color3.White(),
      style: frameType
    })

    // Add pointer events for click
    PointerEvents.create(nftEntity, {
      pointerEvents: [
        {
          eventType: PointerEventType.PET_DOWN,
          eventInfo: {
            button: InputAction.IA_POINTER,
            hoverText: 'View NFT'
          }
        }
      ]
    })

    // Store for click handling
    nftEntities.push({ entity: nftEntity, urn: urn })

    // Label with index number below each NFT
    createLabel(`#${index + 1}`, Vector3.create(miscCenterX + x, y - 1.8, nftTestZ + 0.1), 0.35)
  })

  // Import and setup click handlers for NFTs
  import('~system/RestrictedActions').then(({ openNftDialog }) => {
    import('@dcl/sdk/ecs').then(({ pointerEventsSystem }) => {
      nftEntities.forEach(({ entity, urn }) => {
        pointerEventsSystem.onPointerDown(
          {
            entity: entity,
            opts: { button: InputAction.IA_POINTER, hoverText: 'View NFT' }
          },
          () => {
            console.log('Opening NFT dialog for:', urn)
            openNftDialog({ urn: urn })
          }
        )
      })
    })
  })

  console.log(`NFT Shape tests created: ${allNftUrns.length} NFTs with click support`)

  // =========================================================================
  // POINTER EVENT HANDLERS
  // =========================================================================

  // Using pointerEventsSystem for button interactions
  import('@dcl/sdk/ecs').then(({ pointerEventsSystem }) => {
    // VirtualCamera button click handler (fixed position)
    pointerEventsSystem.onPointerDown(
      {
        entity: vcButton,
        opts: { button: InputAction.IA_POINTER, hoverText: 'Toggle Fixed VirtualCamera' }
      },
      () => {
        virtualCameraActive = !virtualCameraActive
        // Disable orbiting if enabling fixed
        if (virtualCameraActive && orbitingCameraActive) {
          orbitingCameraActive = false
          Material.setPbrMaterial(orbitButton, {
            albedoColor: Color4.create(0.2, 0.7, 0.7, 1)
          })
        }

        if (virtualCameraActive) {
          // Activate VirtualCamera - set MainCamera to use it
          console.log('Activating VirtualCamera...')
          console.log('  virtualCameraEntity:', virtualCameraEntity)
          console.log('  engine.CameraEntity:', engine.CameraEntity)
          console.log('  VirtualCamera.has(virtualCameraEntity):', VirtualCamera.has(virtualCameraEntity))

          MainCamera.createOrReplace(engine.CameraEntity, {
            virtualCameraEntity: virtualCameraEntity
          })

          console.log('  MainCamera.has(engine.CameraEntity):', MainCamera.has(engine.CameraEntity))
          const mainCamData = MainCamera.getOrNull(engine.CameraEntity)
          console.log('  MainCamera data:', mainCamData)

          Material.setPbrMaterial(vcButton, {
            albedoColor: Color4.create(0.2, 0.8, 0.3, 1),
            emissiveColor: Color4.create(0.2, 0.8, 0.3, 1),
            emissiveIntensity: 1
          })
          console.log('Fixed VirtualCamera ACTIVATED')
        } else {
          // Deactivate VirtualCamera - remove MainCamera or set to undefined
          MainCamera.deleteFrom(engine.CameraEntity)

          Material.setPbrMaterial(vcButton, {
            albedoColor: Color4.create(0.2, 0.5, 0.8, 1)
          })
          console.log('Fixed VirtualCamera DEACTIVATED')
        }
      }
    )

    // Orbiting Camera button click handler
    pointerEventsSystem.onPointerDown(
      {
        entity: orbitButton,
        opts: { button: InputAction.IA_POINTER, hoverText: 'Toggle Orbiting Camera' }
      },
      () => {
        orbitingCameraActive = !orbitingCameraActive
        // Disable fixed camera if enabling orbiting
        if (orbitingCameraActive && virtualCameraActive) {
          virtualCameraActive = false
          Material.setPbrMaterial(vcButton, {
            albedoColor: Color4.create(0.2, 0.5, 0.8, 1)
          })
        }

        if (orbitingCameraActive) {
          // Activate orbiting camera
          MainCamera.createOrReplace(engine.CameraEntity, {
            virtualCameraEntity: orbitingCameraEntity
          })

          Material.setPbrMaterial(orbitButton, {
            albedoColor: Color4.create(0.2, 0.9, 0.9, 1),
            emissiveColor: Color4.create(0.2, 0.9, 0.9, 1),
            emissiveIntensity: 1
          })
          console.log('Orbiting Camera ACTIVATED')
        } else {
          // Deactivate orbiting camera
          MainCamera.deleteFrom(engine.CameraEntity)

          Material.setPbrMaterial(orbitButton, {
            albedoColor: Color4.create(0.2, 0.7, 0.7, 1)
          })
          console.log('Orbiting Camera DEACTIVATED')
        }
      }
    )

    // InputModifier button click handler - blocks ALL movement
    pointerEventsSystem.onPointerDown(
      {
        entity: imButton,
        opts: { button: InputAction.IA_POINTER, hoverText: 'Toggle InputModifier (Block Movement)' }
      },
      () => {
        inputModifierActive = !inputModifierActive

        if (inputModifierActive) {
          // Block all player movement
          InputModifier.createOrReplace(engine.PlayerEntity, {
            mode: InputModifier.Mode.Standard({
              disableAll: true
            })
          })

          Material.setPbrMaterial(imButton, {
            albedoColor: Color4.create(0.8, 0.2, 0.2, 1),
            emissiveColor: Color4.create(0.8, 0.2, 0.2, 1),
            emissiveIntensity: 1
          })
          console.log('InputModifier ACTIVATED - Movement BLOCKED')
        } else {
          // Re-enable movement
          InputModifier.deleteFrom(engine.PlayerEntity)

          Material.setPbrMaterial(imButton, {
            albedoColor: Color4.create(0.8, 0.3, 0.2, 1)
          })
          console.log('InputModifier DEACTIVATED - Movement ENABLED')
        }
      }
    )
  })
}

/**
 * Creates individual buttons to test specific input blocks
 */
function createInputModifierButtons(centerX: number, centerZ: number) {
  const buttonConfigs = [
    { name: 'Walk', prop: 'disableWalk', x: -3, z: 4, color: Color4.create(0.6, 0.3, 0.1, 1) },
    { name: 'Jog', prop: 'disableJog', x: -1, z: 4, color: Color4.create(0.6, 0.4, 0.1, 1) },
    { name: 'Run', prop: 'disableRun', x: 1, z: 4, color: Color4.create(0.6, 0.5, 0.1, 1) },
    { name: 'Jump', prop: 'disableJump', x: 3, z: 4, color: Color4.create(0.6, 0.6, 0.1, 1) },
    { name: 'Emote', prop: 'disableEmote', x: 0, z: 6, color: Color4.create(0.5, 0.3, 0.6, 1) }
  ]

  createLabel('INDIVIDUAL CONTROLS', Vector3.create(centerX, 2.5, centerZ + 3.5), 0.7)

  const buttonStates: { [key: string]: boolean } = {}

  import('@dcl/sdk/ecs').then(({ pointerEventsSystem }) => {
    buttonConfigs.forEach(config => {
      const button = engine.addEntity()
      Transform.create(button, {
        position: Vector3.create(centerX + config.x, 0.6, centerZ + config.z),
        scale: Vector3.create(1.5, 1, 1.5)
      })
      MeshRenderer.setBox(button)
      MeshCollider.setBox(button)
      Material.setPbrMaterial(button, {
        albedoColor: config.color
      })

      createLabel(`Disable\n${config.name}`, Vector3.create(centerX + config.x, 2, centerZ + config.z), 0.5)

      buttonStates[config.prop] = false

      pointerEventsSystem.onPointerDown(
        {
          entity: button,
          opts: { button: InputAction.IA_POINTER, hoverText: `Toggle Disable ${config.name}` }
        },
        () => {
          buttonStates[config.prop] = !buttonStates[config.prop]

          // Build the modifier options from current states
          const modifierOptions: any = {}
          if (buttonStates['disableWalk']) modifierOptions.disableWalk = true
          if (buttonStates['disableJog']) modifierOptions.disableJog = true
          if (buttonStates['disableRun']) modifierOptions.disableRun = true
          if (buttonStates['disableJump']) modifierOptions.disableJump = true
          if (buttonStates['disableEmote']) modifierOptions.disableEmote = true

          const hasAnyDisabled = Object.values(buttonStates).some(v => v)

          if (hasAnyDisabled) {
            InputModifier.createOrReplace(engine.PlayerEntity, {
              mode: InputModifier.Mode.Standard(modifierOptions)
            })
          } else {
            InputModifier.deleteFrom(engine.PlayerEntity)
          }

          // Update button appearance
          const newColor = buttonStates[config.prop]
            ? Color4.create(config.color.r * 0.5, config.color.g * 0.5, config.color.b * 0.5, 1)
            : config.color

          Material.setPbrMaterial(button, {
            albedoColor: newColor,
            emissiveColor: buttonStates[config.prop] ? Color4.Red() : undefined,
            emissiveIntensity: buttonStates[config.prop] ? 0.5 : 0
          })

          console.log(`Disable ${config.name}: ${buttonStates[config.prop]}`)
        }
      )
    })
  })
}
