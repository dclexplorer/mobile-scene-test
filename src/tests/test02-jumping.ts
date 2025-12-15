import { Vector3, Color4 } from '@dcl/sdk/math'
import { createPlatform, createLabel } from '../utils/helpers'

/**
 * TEST 2: RUNNING JUMP DISTANCE - Long runway with increasing gaps
 * Testing horizontal jump distance while running
 */
export function setupJumpingTest() {
  const runwayZ = 10

  // Long runway to build up speed
  createPlatform(
    Vector3.create(4, 0.5, runwayZ),
    Vector3.create(6, 1, 3),
    Color4.create(0.4, 0.4, 0.4, 1)
  )
  createLabel('RUNWAY\n(build speed)', Vector3.create(2, 1.5, runwayZ), 1)

  // Gap test platforms with fine increments
  const gapSizes = [12.0, 12.5, 13.0, 13.5, 14.0, 14.5, 15.0, 15.5, 16.0]
  let currentX = 7  // Start after runway

  createLabel('RUNNING JUMP TEST\n(horizontal distance)', Vector3.create(12, 2.5, runwayZ - 2), 1.2)

  gapSizes.forEach((gap, index) => {
    // Landing platform (longer for easier landing)
    createPlatform(
      Vector3.create(currentX + gap + 1.5, 0.5, runwayZ),
      Vector3.create(3, 1, 3),
      Color4.create(0.5, 0.3 + (index * 0.05), 0.2, 1)
    )

    // Gap label
    createLabel(
      `${gap.toFixed(1)}m`,
      Vector3.create(currentX + gap / 2, 1.5, runwayZ),
      1
    )

    currentX = currentX + gap + 3
  })
}
