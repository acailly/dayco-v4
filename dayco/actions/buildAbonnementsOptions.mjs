/**
 * @typedef {import('../../framework/engine/user-choices.mjs').ChoiceOption} ChoiceOption
 * @typedef {import('../types.mjs').Feed} Feed
 * @typedef {import('../types.mjs').DaycoChoiceOption} DaycoChoiceOption
 */

import { storage } from '../storage/storage.mjs'
import { FEED } from '../types.mjs'

/**
 * @returns {Promise<DaycoChoiceOption[]>}
 */
export const buildAbonnementsOptions = async () => {
  /** @type {Feed[]} */
  const feeds = await storage.findAllThings(FEED)
  feeds.sort((a, b) => a.title.localeCompare(b.title))

  return feeds.map((feed) => ({
    value: feed.id,
    label: feed.title,
    url: feed.url,
    goto: 'abonnement',
  }))
}
