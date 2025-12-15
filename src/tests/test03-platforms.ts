import { Vector3, Color4 } from '@dcl/sdk/math'
import { createPlatform, createLabel } from '../utils/helpers'

/**
 * TEST 3: DESCENDING PLATFORMS - Test fall & jump recovery
 */
export function setupPlatformsTest() {
  const descendHeights = [3, 2.5, 2, 1.5, 1, 0.5]
  const descendZ = 4
  const descendStartX = 12

  createLabel('DESCEND TEST\n(can you jump back up?)', Vector3.create(13, 4.5, descendZ), 1.2)

  descendHeights.forEach((height, index) => {
    const x = descendStartX + index * 1.5

    createPlatform(
      Vector3.create(x, height / 2, descendZ),
      Vector3.create(1.2, height, 1.2),
      Color4.create(0.3, 0.3, 0.6 + (index * 0.05), 1)
    )

    createLabel(
      `${height}m`,
      Vector3.create(x, height + 0.5, descendZ),
      0.8
    )
  })
}
