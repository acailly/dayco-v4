/**
 * @typedef {import('../types.mjs').DaycoUserAnswers} DaycoUserAnswers
 */

import { showToast } from '../../shared/toast/toast.component.mjs'
import { storage } from '../storage/storage.mjs'
import { FEED } from '../types.mjs'

/**
 * @param {DaycoUserAnswers} userAnswers
 * @returns {Promise<void>}
 */
export const supprimerAbonnement = async (userAnswers) => {
  const abonnement = userAnswers.get('abonnements')

  if (abonnement) {
    await storage.deleteThing(FEED, abonnement)

    showToast('Abonnement supprimé ✅')
  }
}
