/**
 * @typedef {import('../types.mjs').DaycoUserAnswers} DaycoUserAnswers
 */

import { storage } from '../storage/storage.mjs'
import { POST } from '../types.mjs'

/**
 * @param {DaycoUserAnswers} userAnswers
 * @returns {Promise<void>}
 */
export const marquerCommeLu = async (userAnswers) => {
  const nouveauté = userAnswers.get('nouveautesDeAbonnement')
  if (nouveauté) {
    storage.deleteThing(POST, nouveauté)
  }
}
