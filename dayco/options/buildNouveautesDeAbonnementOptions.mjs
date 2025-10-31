/**
 * @typedef {import('../types.mjs').DaycoUserAnswers} DaycoUserAnswers
 * @typedef {import('../types.mjs').Post} Post
 * @typedef {import('../types.mjs').DaycoChoiceOption} DaycoChoiceOption
 */

import { storage } from '../storage/storage.mjs'
import { POST } from '../types.mjs'

/**
 * @param {DaycoUserAnswers} userAnswers
 * @returns {Promise<DaycoChoiceOption[]>}
 */
export const buildNouveautesDeAbonnementOptions = async (userAnswers) => {
  const abonnement = userAnswers.get('nouveautesParAbonnement')

  /** @type {Post[]} */
  const posts = await storage.findAllThings(POST)

  return posts
    .filter((post) => post.feedId === abonnement)
    .map(
      (post) =>
        /** @type {DaycoChoiceOption} */ ({
          value: post.id,
          label: post.title,
          url: post.url,
          goto: 'nouveaute',
        })
    )
}
