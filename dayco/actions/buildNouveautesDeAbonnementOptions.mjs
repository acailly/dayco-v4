/**
 * @typedef {import('../../framework/models/user-choices.mjs').ChoiceOption} ChoiceOption
 * @typedef {import('../../framework/models/user-choices.mjs').UserAnswers} UserAnswers
 * @typedef {import('../types.mjs').Post} Post
 */

import { storage } from '../storage/storage.mjs'
import { POST } from '../types.mjs'

/**
 * @param {UserAnswers} userAnswers
 * @returns {Promise<ChoiceOption[]>}
 */
export const buildNouveautesDeAbonnementOptions = async (userAnswers) => {
  const abonnement = userAnswers['nouveautesParAbonnement']

  /** @type {Post[]} */
  const posts = await storage.findAllThings(POST)

  return posts
    .filter((post) => post.feedId === abonnement)
    .map(
      (post) =>
        /** @type {ChoiceOption} */ ({
          value: post.id,
          label: post.title,
          url: post.url,
          tags: ['list-item'],
          goto: 'nouveaute',
        })
    )
}
