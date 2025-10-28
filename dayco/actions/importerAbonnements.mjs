/**
 * @typedef {import('../types.mjs').DaycoUserAnswers} DaycoUserAnswers
 * @typedef {import('../types.mjs').Feed} Feed
 */

import { showToast } from '../../shared/toast/toast.component.mjs'
import { storage } from '../storage/storage.mjs'

/**
 * @param {DaycoUserAnswers} userAnswers
 * @returns {Promise<void>}
 */
export const importerAbonnements = async (userAnswers) => {
  const fichierAbonnement = userAnswers.get('importerAbonnements.file')
  if (fichierAbonnement) {
    const feeds = /** @type {Feed[]} */ (JSON.parse(fichierAbonnement))
    for (const feed of feeds) {
      await storage.storeThing(feed)
    }
    showToast('Abonnements importés ✅')
  }
}
