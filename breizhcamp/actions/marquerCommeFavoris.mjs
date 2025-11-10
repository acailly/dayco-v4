/**
 * @typedef {import('../types.mjs').BreizhCampUserAnswers} BreizhCampUserAnswers
 */

import { showToast } from '../../shared/toast/toast.component.mjs'
import { addFavoriteTalk } from '../storage.mjs'

/**
 * @param {BreizhCampUserAnswers} userAnswers
 * @returns {Promise<void>}
 */
export const marquerCommeFavoris = async (userAnswers) => {
  const talkId = userAnswers.get('talks')

  if (talkId) {
    addFavoriteTalk(talkId)
    showToast('Marqué comme favoris ✅')
  }
}
