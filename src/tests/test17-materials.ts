import {
  engine,
  Transform,
  MeshRenderer,
  Material,
  MaterialTransparencyMode
} from '@dcl/sdk/ecs'
import { Vector3, Color4 } from '@dcl/sdk/math'
import { createPlatform, createLabel } from '../utils/helpers'

/**
 * TEST 17: PBR & Unlit Materials
 * Comprehensive display of PBR material properties and Unlit materials
 * Location: X:-90, Z:-75 (Row 2, Column 1 of visual test grid)
 */
export function setupMaterialsTest() {
  // Grid position: Row 2, Column 1
  const baseX = -90
  const baseZ = -75
  const spacing = 2.2
  const scale = 0.7
  const yPos = 1

  // Platform
  createPlatform(
    Vector3.create(baseX, 0.05, baseZ),
    Vector3.create(50, 0.1, 35),
    Color4.create(0.12, 0.12, 0.15, 1)
  )

  createLabel('TEST 17: PBR & UNLIT MATERIALS', Vector3.create(baseX, 6, baseZ - 15), 1.5)

  let rowZ = baseZ - 12

  // =========================================================================
  // ROW 1: METALLIC VARIATIONS
  // =========================================================================
  createLabel('PBR metallic property (0=plastic, 1=metal)', Vector3.create(baseX - 22, yPos + 0.5, rowZ), 0.35)
  for (let i = 0; i <= 10; i++) {
    const metallic = i / 10
    const x = baseX - 10 + i * spacing

    const entity = engine.addEntity()
    Transform.create(entity, {
      position: Vector3.create(x, yPos, rowZ),
      scale: Vector3.create(scale, scale, scale)
    })
    MeshRenderer.setSphere(entity)
    Material.setPbrMaterial(entity, {
      albedoColor: Color4.create(0.9, 0.3, 0.3, 1),
      metallic: metallic,
      roughness: 0.3
    })
    createLabel(`metallic=${metallic.toFixed(1)}`, Vector3.create(x, yPos + 1, rowZ), 0.2)
  }

  rowZ += 3

  // =========================================================================
  // ROW 2: ROUGHNESS VARIATIONS
  // =========================================================================
  createLabel('PBR roughness property (0=smooth, 1=matte)', Vector3.create(baseX - 22, yPos + 0.5, rowZ), 0.35)
  for (let i = 0; i <= 10; i++) {
    const roughness = i / 10
    const x = baseX - 10 + i * spacing

    const entity = engine.addEntity()
    Transform.create(entity, {
      position: Vector3.create(x, yPos, rowZ),
      scale: Vector3.create(scale, scale, scale)
    })
    MeshRenderer.setSphere(entity)
    Material.setPbrMaterial(entity, {
      albedoColor: Color4.create(0.3, 0.5, 0.9, 1),
      metallic: 0.9,
      roughness: roughness
    })
    createLabel(`roughness=${roughness.toFixed(1)}`, Vector3.create(x, yPos + 1, rowZ), 0.2)
  }

  rowZ += 3

  // =========================================================================
  // ROW 3: EMISSIVE INTENSITY
  // =========================================================================
  createLabel('PBR emissiveIntensity (glow strength)', Vector3.create(baseX - 22, yPos + 0.5, rowZ), 0.35)
  const emissiveIntensities = [0, 1, 2, 3, 5, 8, 10, 15, 20, 30, 50]
  emissiveIntensities.forEach((intensity, i) => {
    const x = baseX - 10 + i * spacing

    const entity = engine.addEntity()
    Transform.create(entity, {
      position: Vector3.create(x, yPos, rowZ),
      scale: Vector3.create(scale, scale, scale)
    })
    MeshRenderer.setSphere(entity)
    Material.setPbrMaterial(entity, {
      albedoColor: Color4.create(0.2, 0.8, 0.2, 1),
      emissiveColor: Color4.create(0.2, 0.8, 0.2, 1),
      emissiveIntensity: intensity
    })
    createLabel(`emissiveIntensity=${intensity}`, Vector3.create(x, yPos + 1, rowZ), 0.18)
  })

  rowZ += 3

  // =========================================================================
  // ROW 4: SPECULAR INTENSITY
  // =========================================================================
  createLabel('PBR specularIntensity (highlight strength)', Vector3.create(baseX - 22, yPos + 0.5, rowZ), 0.35)
  for (let i = 0; i <= 10; i++) {
    const specular = i / 10
    const x = baseX - 10 + i * spacing

    const entity = engine.addEntity()
    Transform.create(entity, {
      position: Vector3.create(x, yPos, rowZ),
      scale: Vector3.create(scale, scale, scale)
    })
    MeshRenderer.setSphere(entity)
    Material.setPbrMaterial(entity, {
      albedoColor: Color4.create(0.8, 0.8, 0.8, 1),
      metallic: 0,
      roughness: 0.2,
      specularIntensity: specular
    })
    createLabel(`specularIntensity=${specular.toFixed(1)}`, Vector3.create(x, yPos + 1, rowZ), 0.18)
  }

  rowZ += 3

  // =========================================================================
  // ROW 5: ALPHA BLEND VALUES
  // =========================================================================
  createLabel('PBR albedoColor alpha (opacity)', Vector3.create(baseX - 22, yPos + 0.5, rowZ), 0.35)
  for (let i = 0; i <= 10; i++) {
    const alpha = i / 10
    const x = baseX - 10 + i * spacing

    const entity = engine.addEntity()
    Transform.create(entity, {
      position: Vector3.create(x, yPos, rowZ),
      scale: Vector3.create(scale, scale, scale)
    })
    MeshRenderer.setBox(entity)
    Material.setPbrMaterial(entity, {
      albedoColor: Color4.create(0.8, 0.4, 0.9, alpha),
      transparencyMode: MaterialTransparencyMode.MTM_ALPHA_BLEND
    })
    createLabel(`alpha=${alpha.toFixed(1)}`, Vector3.create(x, yPos + 1, rowZ), 0.2)
  }

  rowZ += 3

  // =========================================================================
  // ROW 6: TRANSPARENCY MODES + NORMAL MAP + TEXTURES
  // =========================================================================
  createLabel('PBR transparencyMode', Vector3.create(baseX - 22, yPos + 0.5, rowZ), 0.35)
  const transparencyModes = [
    { name: 'OPAQUE', mode: MaterialTransparencyMode.MTM_OPAQUE },
    { name: 'ALPHA_TEST', mode: MaterialTransparencyMode.MTM_ALPHA_TEST },
    { name: 'ALPHA_BLEND', mode: MaterialTransparencyMode.MTM_ALPHA_BLEND },
    { name: 'AUTO', mode: MaterialTransparencyMode.MTM_AUTO }
  ]
  transparencyModes.forEach((tm, i) => {
    const x = baseX - 10 + i * 4

    const entity = engine.addEntity()
    Transform.create(entity, {
      position: Vector3.create(x, yPos, rowZ),
      scale: Vector3.create(0.9, 0.9, 0.9)
    })
    MeshRenderer.setBox(entity)
    Material.setPbrMaterial(entity, {
      albedoColor: Color4.create(0.3, 0.7, 1, 0.5),
      transparencyMode: tm.mode
    })
    createLabel(`transparencyMode=\n${tm.name}`, Vector3.create(x, yPos + 1.3, rowZ), 0.2)
  })

  // Normal Map comparison
  const noNormal = engine.addEntity()
  Transform.create(noNormal, {
    position: Vector3.create(baseX + 8, yPos, rowZ),
    scale: Vector3.create(0.9, 0.9, 0.9)
  })
  MeshRenderer.setSphere(noNormal)
  Material.setPbrMaterial(noNormal, {
    albedoColor: Color4.create(0.6, 0.6, 0.6, 1),
    metallic: 0.5,
    roughness: 0.3
  })
  createLabel('bumpTexture=\nnone', Vector3.create(baseX + 8, yPos + 1.3, rowZ), 0.2)

  const withNormal = engine.addEntity()
  Transform.create(withNormal, {
    position: Vector3.create(baseX + 12, yPos, rowZ),
    scale: Vector3.create(0.9, 0.9, 0.9)
  })
  MeshRenderer.setSphere(withNormal)
  Material.setPbrMaterial(withNormal, {
    albedoColor: Color4.create(0.6, 0.6, 0.6, 1),
    metallic: 0.5,
    roughness: 0.3,
    bumpTexture: Material.Texture.Common({
      src: 'assets/textures/normal_mapping_normal_map.png'
    })
  })
  createLabel('bumpTexture=\nnormal_map.png', Vector3.create(baseX + 12, yPos + 1.3, rowZ), 0.2)

  rowZ += 3.5

  // =========================================================================
  // ROW 7: UNLIT MATERIALS
  // =========================================================================
  createLabel('UNLIT Material.setBasicMaterial()', Vector3.create(baseX - 22, yPos + 0.5, rowZ), 0.35)

  const unlitColors = [
    { name: 'diffuseColor=\nRed', color: Color4.create(1, 0, 0, 1) },
    { name: 'diffuseColor=\nGreen', color: Color4.create(0, 1, 0, 1) },
    { name: 'diffuseColor=\nBlue', color: Color4.create(0, 0, 1, 1) },
    { name: 'diffuseColor=\nYellow', color: Color4.create(1, 1, 0, 1) },
    { name: 'diffuseColor=\nWhite', color: Color4.create(1, 1, 1, 1) }
  ]
  unlitColors.forEach((c, i) => {
    const x = baseX - 10 + i * 3

    const entity = engine.addEntity()
    Transform.create(entity, {
      position: Vector3.create(x, yPos, rowZ),
      scale: Vector3.create(scale, scale, scale)
    })
    MeshRenderer.setBox(entity)
    Material.setBasicMaterial(entity, {
      diffuseColor: c.color
    })
    createLabel(c.name, Vector3.create(x, yPos + 1.2, rowZ), 0.18)
  })

  // Unlit with alphaTexture
  const unlitAlpha = engine.addEntity()
  Transform.create(unlitAlpha, {
    position: Vector3.create(baseX + 8, yPos, rowZ),
    scale: Vector3.create(1, 1, 1)
  })
  MeshRenderer.setBox(unlitAlpha)
  Material.setBasicMaterial(unlitAlpha, {
    diffuseColor: Color4.create(1, 0.5, 0, 1),
    alphaTexture: Material.Texture.Common({
      src: 'images/test-texture.png'
    })
  })
  createLabel('diffuseColor +\nalphaTexture', Vector3.create(baseX + 8, yPos + 1.3, rowZ), 0.2)

  const unlitTexAlpha = engine.addEntity()
  Transform.create(unlitTexAlpha, {
    position: Vector3.create(baseX + 12, yPos, rowZ),
    scale: Vector3.create(1, 1, 1)
  })
  MeshRenderer.setPlane(unlitTexAlpha)
  Material.setBasicMaterial(unlitTexAlpha, {
    texture: Material.Texture.Common({
      src: 'images/test-texture.png'
    }),
    alphaTexture: Material.Texture.Common({
      src: 'images/test-texture.png'
    })
  })
  createLabel('texture +\nalphaTexture\n(plane mesh)', Vector3.create(baseX + 12, yPos + 1.5, rowZ), 0.18)

  console.log('Test 17: PBR & Unlit Materials initialized at X:', baseX, 'Z:', baseZ)
}
