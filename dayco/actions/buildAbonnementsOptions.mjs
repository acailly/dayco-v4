/**
 * @typedef {import('../../framework/models/user-choices.mjs').ChoiceOption} ChoiceOption
 * @typedef {import('../types.mjs').Feed} Feed
 */

import { storage } from '../storage/storage.mjs'
import { FEED } from '../types.mjs'

/**
 * @returns {Promise<ChoiceOption[]>}
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
    tags: ['list-item'],
  }))
}
