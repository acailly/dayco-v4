/**
 * @typedef {import('../../framework/models/user-choices.mjs').UserAnswers} UserAnswers
 */

import { storage } from '../storage/storage.mjs'
import { POST } from '../types.mjs'

/**
 *
 * @param {UserAnswers} userAnswers
 * @returns {Promise<void>}
 */
export const marquerCommeLu = async (userAnswers) => {
  const nouveauté = userAnswers['nouveautesDeAbonnement']

  storage.deleteThing(POST, nouveauté)
}
