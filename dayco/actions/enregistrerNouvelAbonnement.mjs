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
export const enregistrerNouvelAbonnement = async (userAnswers) => {
  const nomNouvelAbonnement = userAnswers.get('nomNouvelAbonnement.nom') ?? ''
  const urlNouvelAbonnement = userAnswers.get('urlNouvelAbonnement.url') ?? ''

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
