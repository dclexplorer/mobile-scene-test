import { Vector3, Color4 } from '@dcl/sdk/math'
import { createPlatform, createLabel } from '../utils/helpers'

/**
 * TEST 4: STEP HEIGHT STAIRCASE - Fine scale 0.4m to 0.5m
 * Testing exact step height limit
 */
export function setupStepHeightTest() {
  const stepHeights = [0.40, 0.41, 0.42, 0.43, 0.44, 0.45, 0.46, 0.47, 0.48, 0.49, 0.50]
  const stepZ = 0
  let stepCurrentHeight = 0

  createLabel('STEP HEIGHT TEST\n(0.4m - 0.5m)', Vector3.create(8, 3, stepZ + 2), 1.2)

  // Starting platform
  createPlatform(
    Vector3.create(2, 0.1, stepZ + 1),
    Vector3.create(3, 0.2, 2),
    Color4.create(0.3, 0.3, 0.3, 1)
  )
  createLabel('START', Vector3.create(2, 0.8, stepZ + 1), 0.8)

  stepHeights.forEach((stepHeight, index) => {
    const x = 4 + index * 1.2
    stepCurrentHeight += stepHeight

    // Each step rises by stepHeight from the previous
    createPlatform(
      Vector3.create(x, stepCurrentHeight / 2, stepZ + 1),
      Vector3.create(1, stepCurrentHeight, 2),
      Color4.create(0.6, 0.4 + (index * 0.05), 0.2, 1)
    )

    // Label showing the step increment
    createLabel(
      `+${stepHeight.toFixed(2)}m`,
      Vector3.create(x, stepCurrentHeight + 0.5, stepZ + 1),
      0.7
    )
  })
}
