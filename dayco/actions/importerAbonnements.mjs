/**
 * @typedef {import('../../framework/models/user-choices.mjs').UserAnswers} UserAnswers
 * @typedef {import('../types.mjs').Feed} Feed
 */

import { showToast } from '../../shared/toast/toast.component.mjs'
import { storage } from '../storage/storage.mjs'

export const importerAbonnements = async (/** @type {UserAnswers} */ userAnswers) => {
  const fichierAbonnement = userAnswers['importerAbonnements']

  const feeds = /** @type {Feed[]} */ (JSON.parse(fichierAbonnement))
  for (const feed of feeds) {
    await storage.storeThing(feed)
  }
  showToast('Abonnements importés ✅')
}
