/**
 * @typedef {import('../../user-choices.mjs').UserAnswers} UserAnswers
 */

import { showToast } from '../../../shared/toast/toast.component.mjs'
import { storage } from '../storage/storage.mjs'
import { FEED } from '../types.mjs'

/**
 *
 * @param {UserAnswers} userAnswers
 * @returns {Promise<void>}
 */
export const supprimerAbonnement = async (userAnswers) => {
  const abonnement = userAnswers['abonnements']

  await storage.deleteThing(FEED, abonnement)

  showToast('Abonnement supprimé ✅')
}
