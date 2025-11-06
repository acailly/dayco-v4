/**
 * @typedef {import('../types.mjs').BreizhCampUserAnswers} BreizhCampUserAnswers
 */

/**
 * @param {BreizhCampUserAnswers} userAnswers
 * @returns {Promise<string>}
 */
export const buildTalksTitle = async (userAnswers) => {
  const heure = userAnswers.get('heure') ?? ''

  return `Talks commençant à ${heure}`
}
