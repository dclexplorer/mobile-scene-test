import { Vector3, Color4 } from '@dcl/sdk/math'
import { createRamp, createLabel } from '../utils/helpers'

/**
 * TEST 5: INCLINED RAMPS - Testing climbable angles
 * Located in parcels 1,0 to 4,0 (X = 16 to 80)
 */
export function setupRampsTest() {
  const rampAngles = [45, 50, 55, 60, 65, 70]
  const rampBaseZ = 4
  const rampLength = 6

  createLabel('RAMP ANGLE TEST\n(climb without jumping)', Vector3.create(40, 4, rampBaseZ - 2), 1.2)

  rampAngles.forEach((angle, index) => {
    const x = 24 + index * 8  // Start at X=24, space 8m apart

    const radians = (angle * Math.PI) / 180
    const halfDepth = 1.5  // Half of ramp depth (3m along Z)
    const halfThickness = 0.1  // Half of ramp thickness (0.2)

    // X-axis rotation: Y and Z are affected, X stays fixed
    // Position so bottom edge touches floor
    const centerX = x
    const centerY = Math.sin(radians) * halfDepth + Math.cos(radians) * halfThickness - 0.2
    const centerZ = rampBaseZ + Math.cos(radians) * halfDepth

    createRamp(
      Vector3.create(centerX, centerY, centerZ),
      Vector3.create(rampLength, 0.2, 3),
      -angle,
      Color4.create(0.3, 0.5 + (index * 0.06), 0.7, 1)
    )

    // Angle label higher up
    createLabel(
      `${angle}°`,
      Vector3.create(x, 3, rampBaseZ),
      1.5
    )
  })
}
