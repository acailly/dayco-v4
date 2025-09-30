/**
 * @typedef {import('../../user-choices.mjs').UserAnswers} UserAnswers
 */

import { storage } from '../storage/storage.mjs'
import { showToast } from '../../../shared/toast/toast.component.mjs'

/**
 *
 * @returns {Promise<void>}
 */
export const viderBaseDeDonnees = async () => {
  if (window.confirm('Souhaitez-vous vraiment supprimer la base de données ?')) {
    await storage.deleteAll()
    showToast('Base de données supprimée ✅')
  }
}
