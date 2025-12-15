import { Vector3, Color4 } from '@dcl/sdk/math'
import { createPlatform, createLabel } from '../utils/helpers'

/**
 * TEST 1: FINE SCALE STAIRCASE - 2.0m to 2.5m in 0.05m increments
 * Solid pillars from floor, testing exact jump height limit
 */
export function setupStaircaseTest() {
  const fineScaleHeights = [2.0, 2.05, 2.1, 2.15, 2.2, 2.25, 2.3, 2.35, 2.4, 2.45, 2.5]
  const fineScaleStartX = 2
  const fineScaleZ = 6

  createLabel('FINE SCALE STAIRCASE\n(2.0m - 2.5m)', Vector3.create(8, 4, fineScaleZ), 1.2)

  fineScaleHeights.forEach((height, index) => {
    const x = fineScaleStartX + index * 1.3

    // Solid pillar from floor (top surface at 'height')
    createPlatform(
      Vector3.create(x, height / 2, fineScaleZ),
      Vector3.create(1.2, height, 1.2),
      Color4.create(0.2 + (index * 0.07), 0.8 - (index * 0.05), 0.2, 1)
    )

    // Height label
    createLabel(
      `${height.toFixed(2)}m`,
      Vector3.create(x, height + 0.5, fineScaleZ),
      0.9
    )
  })
}
