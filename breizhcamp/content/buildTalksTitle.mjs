/**
 * @typedef {import('../types.mjs').BreizhCampUserAnswers} BreizhCampUserAnswers
 */

import { formatHoraire } from '../utils/formatHoraire.mjs'

/**
 * @param {BreizhCampUserAnswers} userAnswers
 * @returns {Promise<string>}
 */
export const buildTalksTitle = async (userAnswers) => {
  const heure = userAnswers.get('heure') ?? ''

  return `Talks commençant à ${formatHoraire(heure)}`
}
