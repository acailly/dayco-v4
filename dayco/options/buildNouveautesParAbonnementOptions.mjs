/**
 * @typedef {import('../types.mjs').Feed} Feed
 * @typedef {import('../types.mjs').Post} Post
 * @typedef {import('../types.mjs').DaycoChoiceOption} DaycoChoiceOption
 */

import compareString from '../../shared/strings/compareString.mjs'
import { storage } from '../storage/storage.mjs'
import { FEED, POST } from '../types.mjs'

/**
 * @returns {Promise<DaycoChoiceOption[]>}
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
       * @type {DaycoChoiceOption}
       */
      const choiceOption = {
        value: feed.id,
        label: `${feed.title} (${feedPostCount})`,
        goto: 'nouveautesDeAbonnement',
      }
      return choiceOption
    })
    .filter(
      /**
       * @param {unknown} v
       * @returns {v is DaycoChoiceOption}
       */
      (v) => Boolean(v)
    )
}
