import {
  engine,
  Transform,
  MeshRenderer,
  Material,
  Tween,
  TextureWrapMode,
  Entity,
  Schemas,
  TweenSequence,
  TweenLoop,
  TextureMovementType
} from '@dcl/sdk/ecs'
import { Vector3, Color4, Vector2 } from '@dcl/sdk/math'
import { createPlatform, createLabel } from '../utils/helpers'

// Custom component to track texture move tween data
const TextureMoveReadback = engine.defineComponent('TextureMoveReadback', {
  entity: Schemas.Entity
})

function setupTextureMoveContinuousEntity(
  label: string,
  x: number,
  z: number,
  direction: Vector2,
  color: Color4
): Entity {
  const entity = engine.addEntity()
  Transform.create(entity, {
    position: Vector3.create(x, 2.5, z),
    scale: Vector3.create(4, 4, 0.2)
  })
  MeshRenderer.setPlane(entity)
  Material.setPbrMaterial(entity, {
    albedoColor: color,
    texture: Material.Texture.Common({
      src: 'images/scene-thumbnail.png',
      wrapMode: TextureWrapMode.TWM_REPEAT
    })
  })
  Tween.setTextureMoveContinuous(entity, direction, 0.2)
  createLabel(label, Vector3.create(x, 6, z), 0.9)
  return entity;
}

/**
 * TEST 11: TEXTURE TWEENS TEST (ADR-255)
 * Testing TextureMove and TextureMoveContinuous
 */
export function setupTextureTweensTest() {
  const textureTweenBaseX = 56
  const textureTweenBaseZ = 136

  createLabel('TEXTURE TWEENS TEST (ADR-255)\nAnimated textures', Vector3.create(textureTweenBaseX, 8, textureTweenBaseZ - 10), 1.5)

  // Platform floor for texture tween test area
  createPlatform(
    Vector3.create(textureTweenBaseX, 0.05, textureTweenBaseZ),
    Vector3.create(64, 0.1, 32),
    Color4.create(0.2, 0.15, 0.25, 1)
  )

  // =========================================================================
  // ROW 1: TextureMoveContinuous - Continuous texture animation
  // =========================================================================
  const ttRow1Z = textureTweenBaseZ - 8

  createLabel('ROW 1: TextureMoveContinuous (continuous loop)', Vector3.create(textureTweenBaseX - 25, 3, ttRow1Z), 1)

  // T1.1 Scroll right continuously
  const texScrollRight = setupTextureMoveContinuousEntity(
    'Scroll Right\nContinuous',
    textureTweenBaseX - 15,
    ttRow1Z,
    Vector2.create(0.5, 0),
    Color4.create(0.3, 0.5, 0.9, 1)
  )

  // T1.2 Scroll left continuously
  const texScrollLeft = setupTextureMoveContinuousEntity(
    'Scroll Left\nContinuous',
    textureTweenBaseX - 5,
    ttRow1Z,
    Vector2.create(-0.5, 0),
    Color4.create(0.5, 0.5, 0.5, 1)
  )

  // T1.3 Scroll up continuously
  const texScrollUp = setupTextureMoveContinuousEntity(
    'Scroll Up\nContinuous',
    textureTweenBaseX + 5,
    ttRow1Z,
    Vector2.create(0, 0.5),
    Color4.create(0.9, 0.7, 0.3, 1)
  )

  // T1.4 Scroll down continuously
  const texScrollDown = setupTextureMoveContinuousEntity(
    'Scroll Down\nContinuous',
    textureTweenBaseX + 15,
    ttRow1Z,
    Vector2.create(0, -0.5),
    Color4.create(0.3, 0.9, 0.7, 1)
  )

  // T1.5 Diagonal scroll continuously
  const texScrollDiag = setupTextureMoveContinuousEntity(
    'Diagonal\nContinuous',
    textureTweenBaseX + 25,
    ttRow1Z,
    Vector2.create(0, -0.5),
    Color4.create(0.3, 0.9, 0.5, 1)
  )

  // =========================================================================
  // ROW 2: TextureMove with looping via component tracking
  // =========================================================================
  const ttRow2Z = textureTweenBaseZ + 4

  createLabel('ROW 2: TextureMove (looping)', Vector3.create(textureTweenBaseX - 25, 3, ttRow2Z), 1)

  // Helper function to create a looping TextureMove entity
  function createLoopingTextureMove(
    position: Vector3,
    color: Color4,
    startUV: Vector2,
    endUV: Vector2,
    duration: number,
    labelText: string,
    textureMovementType: TextureMovementType
  ): Entity {
    const entity = engine.addEntity()
    Transform.create(entity, {
      position: position,
      scale: Vector3.create(4, 4, 0.2)
    })
    MeshRenderer.setPlane(entity)
    Material.setPbrMaterial(entity, {
      albedoColor: color,
      texture: Material.Texture.Common({
        src: 'images/scene-thumbnail.png',
        wrapMode: TextureWrapMode.TWM_REPEAT
      })
    })

    // Start the initial tween
    Tween.setTextureMove(entity, startUV, endUV, duration, textureMovementType)
    TweenSequence.create(entity, {
      loop: TweenLoop.TL_RESTART,
      sequence: [],
    })

    const entity2 = engine.addEntity()
    Transform.create(entity2, {
      position: Vector3.create(position.x, 10, position.z),
      scale: Vector3.create(4, 4, 0.2)
    })
    MeshRenderer.setPlane(entity2)
    Material.setPbrMaterial(entity2, {
      albedoColor: Color4.create(color.r + 0.05, color.g, color.b, color.a),
      texture: Material.Texture.Common({
        src: 'images/scene-thumbnail.png',
        wrapMode: TextureWrapMode.TWM_REPEAT
      })
    })
    TextureMoveReadback.create(entity, {
      entity: entity2
    })

    // Create label
    createLabel(labelText, Vector3.create(position.x, 6, position.z), 0.9)

    return entity
  }

  // T2.1 TextureMove X
  createLoopingTextureMove(
    Vector3.create(textureTweenBaseX - 15, 2.5, ttRow2Z),
    Color4.create(0.7, 0.4, 0.9, 1),
    Vector2.create(0, 0),
    Vector2.create(1, 0),
    4000,
    'X: 0→1',
    TextureMovementType.TMT_OFFSET
  )

  // T2.2 TextureMove Y
  createLoopingTextureMove(
    Vector3.create(textureTweenBaseX - 5, 2.5, ttRow2Z),
    Color4.create(0.4, 0.7, 0.9, 1),
    Vector2.create(0, 0),
    Vector2.create(0, 1),
    4000,
    'Y: 0→1',
    TextureMovementType.TMT_OFFSET
  )

  // T2.3 TextureMove diagonal
  createLoopingTextureMove(
    Vector3.create(textureTweenBaseX + 5, 2.5, ttRow2Z),
    Color4.create(0.9, 0.9, 0.4, 1),
    Vector2.create(0, 0),
    Vector2.create(1, 1),
    4000,
    'Diagonal',
    TextureMovementType.TMT_OFFSET
  )

  // T2.4 TextureMove X reverse
  createLoopingTextureMove(
    Vector3.create(textureTweenBaseX + 15, 2.5, ttRow2Z),
    Color4.create(0.4, 0.9, 0.4, 1),
    Vector2.create(1, 0),
    Vector2.create(0, 0),
    4000,
    'X: 1→0',
    TextureMovementType.TMT_OFFSET
  )

  // T2.5 TextureMove Y reverse
  createLoopingTextureMove(
    Vector3.create(textureTweenBaseX + 25, 2.5, ttRow2Z),
    Color4.create(0.9, 0.5, 0.2, 1),
    Vector2.create(0, 1),
    Vector2.create(0, 0),
    4000,
    'Y: 1→0',
    TextureMovementType.TMT_OFFSET
  )

  // =========================================================================
  // ROW 2: TextureMove with looping via component tracking
  // =========================================================================
  const ttRow3Z = textureTweenBaseZ + 12

  createLabel('ROW 3: Tiling TextureMove (looping)', Vector3.create(textureTweenBaseX - 25, 3, ttRow3Z), 1)

  // T3.1 Tiling TextureMove X
  createLoopingTextureMove(
    Vector3.create(textureTweenBaseX - 15, 2.5, ttRow3Z),
    Color4.create(0.7, 0.4, 0.95, 1),
    Vector2.create(1, 1),
    Vector2.create(2, 1),
    4000,
    'X: 1→2',
    TextureMovementType.TMT_TILING
  )

  // T3.2 Tiling TextureMove Y
  createLoopingTextureMove(
    Vector3.create(textureTweenBaseX - 5, 2.5, ttRow3Z),
    Color4.create(0.4, 0.7, 0.95, 1),
    Vector2.create(1, 1),
    Vector2.create(1, 2),
    4000,
    'Y: 1→2',
    TextureMovementType.TMT_TILING
  )

  // T3.3 Tiling TextureMove diagonal
  createLoopingTextureMove(
    Vector3.create(textureTweenBaseX + 5, 2.5, ttRow3Z),
    Color4.create(0.9, 0.9, 0.45, 1),
    Vector2.create(1, 1),
    Vector2.create(2, 2),
    4000,
    'Diagonal',
    TextureMovementType.TMT_TILING
  )

  // T3.4 Tiling TextureMove X reverse
  createLoopingTextureMove(
    Vector3.create(textureTweenBaseX + 15, 2.5, ttRow3Z),
    Color4.create(0.4, 0.9, 0.45, 1),
    Vector2.create(2, 1),
    Vector2.create(1, 1),
    4000,
    'X: 2→1',
    TextureMovementType.TMT_TILING
  )

  // T3.5 Tiling TextureMove Y reverse
  createLoopingTextureMove(
    Vector3.create(textureTweenBaseX + 25, 2.5, ttRow3Z),
    Color4.create(0.9, 0.5, 0.25, 1),
    Vector2.create(1, 2),
    Vector2.create(1, 1),
    4000,
    'Y: 2→1',
    TextureMovementType.TMT_TILING
  )

  // System to restart TextureMove tweens when they complete
  engine.addSystem(() => {
    for (const [entity, texture_move_readback, readback_material] of engine.getEntitiesWith(TextureMoveReadback, Material)) {
      const material = Material.getMutableOrNull(texture_move_readback.entity)
      if (material) {
        if (readback_material.material && material.material) {
          const readback_material_material = readback_material.material;
          const material_material = material.material;
          if (readback_material_material.$case == "pbr" && material_material.$case == "pbr") {
            const pbr_readback_material = readback_material_material.pbr;
            const pbr_material = material_material.pbr;
            if (pbr_readback_material.texture && pbr_material.texture) {
              const readback_texture = pbr_readback_material.texture;
              const texture = pbr_material.texture;
              if (readback_texture.tex && texture.tex) {
                const readback_tex = readback_texture.tex;
                const tex = texture.tex;
                if (readback_tex.$case == "texture" && tex.$case == "texture") {
                  const readback_texture = readback_tex.texture;
                  const texture = tex.texture;

                  texture.offset = readback_texture.offset;
                  texture.tiling = readback_texture.tiling;
                }
              }
            }
          }
        }
      }
    }
  })
}
