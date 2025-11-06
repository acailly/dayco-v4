/**
 * @typedef {import('../types.mjs').BreizhCampUserAnswers} BreizhCampUserAnswers
 * @typedef {import('../types.mjs').BreizhCampChoiceOption} BreizhCampChoiceOption
 * @typedef {import('../types.mjs').Jour} Jour
 */

import { CHIP } from '../../framework/components/dynamic-form.component.mjs'
import { getHorairesDuJour } from '../schedule.mjs'

/**
 * @param {BreizhCampUserAnswers} userAnswers
 * @returns {Promise<BreizhCampChoiceOption[]>}
 */
export const buildHeuresOptions = async (userAnswers) => {
  const jour = /** @type {Jour} */ (userAnswers.get('jour'))

  const horaires = getHorairesDuJour(jour)

  return horaires.map((horaire) => ({
    value: horaire,
    label: horaire,
    goto: 'talks',
    tags: [CHIP],
  }))
}
