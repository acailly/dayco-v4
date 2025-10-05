/**
 * @typedef {import('../../framework/models/user-choices.mjs').UserAnswers} UserAnswers
 */

import { showToast } from '../../shared/toast/toast.component.mjs'
import { storage } from '../storage/storage.mjs'
import { FEED } from '../types.mjs'

/**
 *
 * @param {UserAnswers} userAnswers
 * @returns {Promise<void>}
 */
export const enregistrerNouvelAbonnement = async (userAnswers) => {
  const nomNouvelAbonnement = userAnswers['nomNouvelAbonnement']
  const urlNouvelAbonnement = userAnswers['urlNouvelAbonnement']

  if (nomNouvelAbonnement && urlNouvelAbonnement) {
    await storage.storeThing({
      type: FEED,
      id: Date.now().toString(),
      title: nomNouvelAbonnement,
      url: urlNouvelAbonnement,
    })
    showToast('Nouvel abonnement créé ✅')
  }
}
