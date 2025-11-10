/**
 * @typedef {import('../types.mjs').BreizhCampUserAnswers} BreizhCampUserAnswers
 * @typedef {import('../types.mjs').BreizhCampChoiceOption} BreizhCampChoiceOption
 */

import { CHIP } from '../../framework/components/dynamic-form.component.mjs'
import { marquerCommeFavoris } from '../actions/marquerCommeFavoris.mjs'
import { retirerDesFavoris } from '../actions/retirerDesFavoris.mjs'
import { isFavoriteTalk } from '../storage.mjs'

/**
 * @param {BreizhCampUserAnswers} userAnswers
 * @returns {Promise<BreizhCampChoiceOption[]>}
 */
export const buildTalkOptions = async (userAnswers) => {
  const talkId = userAnswers.get('talks') ?? ''

  const isFavorite = isFavoriteTalk(talkId)

  return isFavorite
    ? [
        {
          value: 'retirerDesFavoris',
          label: 'Retirer des favoris',
          execute: retirerDesFavoris,
          goto: 'talk',
          tags: [CHIP],
        },
      ]
    : [
        {
          value: 'marquerCommeFavoris',
          label: '⭐ Marquer comme favoris',
          execute: marquerCommeFavoris,
          goto: 'talk',
          tags: [CHIP],
        },
      ]
}
