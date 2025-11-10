/**
 * @typedef {import('../types.mjs').BreizhCampUserAnswers} BreizhCampUserAnswers
 */

import { showToast } from '../../shared/toast/toast.component.mjs'
import { removeFavoriteTalk } from '../storage.mjs'

/**
 * @param {BreizhCampUserAnswers} userAnswers
 * @returns {Promise<void>}
 */
export const retirerDesFavoris = async (userAnswers) => {
  const talkId = userAnswers.get('talks')

  if (talkId) {
    removeFavoriteTalk(talkId)
    showToast('Retiré des favoris ✅')
  }
}
