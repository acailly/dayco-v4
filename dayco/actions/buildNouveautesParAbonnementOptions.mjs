/**
 * @typedef {import('../../framework/models/user-choices.mjs').ChoiceOption} ChoiceOption
 * @typedef {import('../types.mjs').Feed} Feed
 * @typedef {import('../types.mjs').Post} Post
 */

import compareString from '../../shared/strings/compareString.mjs'
import { storage } from '../storage/storage.mjs'
import { FEED, POST } from '../types.mjs'

/**
 * @returns {Promise<ChoiceOption[]>}
 */
export const buildNouveautesParAbonnementOptions = async () => {
  /** @type {Feed[]} */
  const feeds = await storage.findAllThings(FEED)
  /** @type {Post[]} */
  const posts = await storage.findAllThings(POST)

  /** @type {Record<string, number>} */
  const postCountByFeed = {}
  posts.forEach((post) => {
    const feedId = post.feedId
    postCountByFeed[feedId] = (postCountByFeed[feedId] ?? 0) + 1
  })

  return feeds
    .sort((feedA, feedB) => compareString(feedA.title, feedB.title))
    .map((feed) => {
      const feedPostCount = postCountByFeed[feed.id]
      if (!feedPostCount) {
        return null
      }

      /**
       * @type {ChoiceOption}
       */
      const choiceOption = {
        value: feed.id,
        label: `${feed.title} (${feedPostCount})`,
        goto: 'nouveautesDeAbonnement',
        tags: ['list-item'],
      }
      return choiceOption
    })
    .filter(
      /**
       * @param {unknown} v
       * @returns {v is ChoiceOption}
       */
      (v) => Boolean(v)
    )
}
