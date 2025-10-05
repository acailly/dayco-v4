/**
 * @typedef {import('../../framework/models/user-choices.mjs').UserAnswers} UserAnswers
 * @typedef {import('../types.mjs').Post} Post
 */

import { storage } from '../storage/storage.mjs'
import { POST } from '../types.mjs'

/**
 *
 * @param {UserAnswers} userAnswers
 * @returns {Promise<void>}
 */
export const marquerToutCommeLu = async (userAnswers) => {
  const abonnement = userAnswers['nouveautesParAbonnement']

  /** @type {Post[]} */
  const posts = await storage.findAllThings(POST)

  const feedPosts = posts.filter((post) => post.feedId === abonnement)
  feedPosts.forEach((post) => {
    storage.deleteThing(POST, post.id)
  })
}
