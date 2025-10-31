/**
 * @typedef {import('../types.mjs').DaycoUserAnswers} DaycoUserAnswers
 * @typedef {import('../types.mjs').Feed} Feed
 * @typedef {import('../types.mjs').DaycoChoiceOption} DaycoChoiceOption
 */

import { storage } from '../storage/storage.mjs'
import { FEED } from '../types.mjs'

/**
 * @param {DaycoUserAnswers} userAnswers
 * @returns {Promise<string>}
 */
export const buildNouveautesDeAbonnementTitle = async (userAnswers) => {
  const abonnement = userAnswers.get('nouveautesParAbonnement') ?? ''

  const feed = /** @type {Feed | undefined} */ (await storage.findThingById(FEED, abonnement))

  return `Les nouveautés de l'abonnement ${feed?.title ?? ''}`
}
