import ReactEcs, { ReactEcsRenderer, UiEntity, Label } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { engine, Transform, PlayerIdentityData } from '@dcl/sdk/ecs'

// ============================================================================
// TRACKING STATE
// ============================================================================

// Current position
let currentAltitude = 0
let currentX = 0
let maxAltitude = 0

// Jump tracking
let isJumping = false
let jumpStartX = 0
let jumpStartY = 0
let jumpDeltaX = 0
let jumpDeltaY = 0
let maxJumpHeight = 0
let maxJumpDistance = 0
let lastY = 0

// ============================================================================
// UI COMPONENTS
// ============================================================================

function AltitudePanel() {
  const altitudeColor = currentAltitude > 1.5
    ? Color4.create(0, 1, 0.5, 1)
    : currentAltitude > 0.5
      ? Color4.Yellow()
      : Color4.White()

  return (
    <UiEntity
      uiTransform={{
        width: 220,
        height: 'auto',
        positionType: 'absolute',
        position: { top: 20, right: 20 },
        padding: { top: 12, bottom: 12, left: 15, right: 15 },
        flexDirection: 'column'
      }}
      uiBackground={{ color: Color4.create(0, 0, 0, 0.85) }}
    >
      {/* Title */}
      <UiEntity
        uiTransform={{
          width: '100%',
          height: 30,
          margin: { bottom: 10 },
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Label
          value="POSITION & JUMP"
          fontSize={16}
          color={Color4.Yellow()}
          textAlign="middle-center"
        />
      </UiEntity>

      {/* Current altitude */}
      <UiEntity
        uiTransform={{
          width: '100%',
          height: 40,
          margin: { bottom: 8 },
          justifyContent: 'center',
          alignItems: 'center'
        }}
        uiBackground={{ color: Color4.create(0.1, 0.1, 0.1, 0.8) }}
      >
        <Label
          value={`Y: ${currentAltitude.toFixed(2)}m`}
          fontSize={24}
          color={altitudeColor}
          textAlign="middle-center"
        />
      </UiEntity>

      {/* Max altitude */}
      <UiEntity
        uiTransform={{
          width: '100%',
          height: 22,
          margin: { bottom: 12 },
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: { left: 5, right: 5 }
        }}
      >
        <Label
          value="Max Y:"
          fontSize={11}
          color={Color4.create(0.7, 0.7, 0.7, 1)}
          textAlign="middle-left"
        />
        <Label
          value={`${maxAltitude.toFixed(2)}m`}
          fontSize={12}
          color={Color4.create(0, 1, 0.5, 1)}
          textAlign="middle-right"
        />
      </UiEntity>

      {/* Jump section title */}
      <UiEntity
        uiTransform={{
          width: '100%',
          height: 25,
          margin: { bottom: 6 },
          justifyContent: 'center',
          alignItems: 'center'
        }}
        uiBackground={{ color: Color4.create(0.2, 0.2, 0.3, 0.9) }}
      >
        <Label
          value={isJumping ? "JUMPING!" : "ON GROUND"}
          fontSize={12}
          color={isJumping ? Color4.create(0, 1, 0.5, 1) : Color4.Gray()}
          textAlign="middle-center"
        />
      </UiEntity>

      {/* Current jump delta Y */}
      <UiEntity
        uiTransform={{
          width: '100%',
          height: 22,
          margin: { bottom: 4 },
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: { left: 5, right: 5 }
        }}
      >
        <Label
          value="Jump Height:"
          fontSize={11}
          color={Color4.create(0.7, 0.7, 0.7, 1)}
          textAlign="middle-left"
        />
        <Label
          value={`${jumpDeltaY.toFixed(2)}m`}
          fontSize={12}
          color={Color4.create(1, 0.8, 0, 1)}
          textAlign="middle-right"
        />
      </UiEntity>

      {/* Current jump delta X */}
      <UiEntity
        uiTransform={{
          width: '100%',
          height: 22,
          margin: { bottom: 8 },
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: { left: 5, right: 5 }
        }}
      >
        <Label
          value="Jump Distance:"
          fontSize={11}
          color={Color4.create(0.7, 0.7, 0.7, 1)}
          textAlign="middle-left"
        />
        <Label
          value={`${jumpDeltaX.toFixed(2)}m`}
          fontSize={12}
          color={Color4.create(0, 0.8, 1, 1)}
          textAlign="middle-right"
        />
      </UiEntity>

      {/* Max jump stats */}
      <UiEntity
        uiTransform={{
          width: '100%',
          height: 'auto',
          padding: 8,
          flexDirection: 'column'
        }}
        uiBackground={{ color: Color4.create(0.15, 0.15, 0.2, 0.9) }}
      >
        <Label
          value="Best Jump:"
          fontSize={10}
          color={Color4.create(0.6, 0.6, 0.6, 1)}
          textAlign="middle-left"
        />
        <UiEntity
          uiTransform={{
            width: '100%',
            height: 20,
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}
        >
          <Label
            value={`Height: ${maxJumpHeight.toFixed(2)}m`}
            fontSize={11}
            color={Color4.create(1, 0.8, 0, 1)}
            textAlign="middle-left"
          />
          <Label
            value={`Dist: ${maxJumpDistance.toFixed(2)}m`}
            fontSize={11}
            color={Color4.create(0, 0.8, 1, 1)}
            textAlign="middle-right"
          />
        </UiEntity>
      </UiEntity>
    </UiEntity>
  )
}

// ============================================================================
// SETUP FUNCTION
// ============================================================================

export function setupUI() {
  console.log('✅ Position & Jump UI initialized')

  ReactEcsRenderer.setUiRenderer(AltitudePanel)

  engine.addSystem(() => {
    for (const [entity] of engine.getEntitiesWith(Transform, PlayerIdentityData)) {
      const transform = Transform.get(entity)
      if (transform && transform.position) {
        const newY = transform.position.y
        const newX = transform.position.x

        currentAltitude = newY
        currentX = newX

        // Track max altitude
        if (currentAltitude > maxAltitude) {
          maxAltitude = currentAltitude
        }

        // Jump detection: player is rising and not on ground
        const isRising = newY > lastY + 0.01
        const isFalling = newY < lastY - 0.01
        const onGround = newY < 1.8 && !isRising && !isFalling

        if (!isJumping && isRising && lastY < 1.8) {
          // Jump started
          isJumping = true
          jumpStartX = newX
          jumpStartY = newY
          jumpDeltaX = 0
          jumpDeltaY = 0
        }

        if (isJumping) {
          // Update jump deltas
          jumpDeltaY = newY - jumpStartY
          jumpDeltaX = Math.abs(newX - jumpStartX)

          // Track max for this jump
          if (jumpDeltaY > maxJumpHeight) {
            maxJumpHeight = jumpDeltaY
          }
          if (jumpDeltaX > maxJumpDistance) {
            maxJumpDistance = jumpDeltaX
          }

          // Check if landed
          if (onGround || (isFalling && newY <= jumpStartY)) {
            isJumping = false
          }
        }

        lastY = newY
      }
    }
  })
}
