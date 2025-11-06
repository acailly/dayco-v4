/**
 * @typedef {import('../types.mjs').BreizhCampUserAnswers} BreizhCampUserAnswers
 * @typedef {import('../types.mjs').BreizhCampChoiceOption} BreizhCampChoiceOption
 * @typedef {import('../types.mjs').Jour} Jour
 */

import { getTalksFromHoraire } from '../schedule.mjs'

/**
 * @param {BreizhCampUserAnswers} userAnswers
 * @returns {Promise<BreizhCampChoiceOption[]>}
 */
export const buildTalksOptions = async (userAnswers) => {
  const jour = /** @type {Jour} */ (userAnswers.get('jour'))
  const heure = userAnswers.get('heure') ?? ''

  const talks = getTalksFromHoraire(jour, heure)

  return talks.map((talk) => ({
    value: talk.id,
    label: talk.name,
    goto: 'talk',
  }))
}
