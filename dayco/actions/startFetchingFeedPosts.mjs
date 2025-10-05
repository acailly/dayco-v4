/**
 * @typedef {import('../../framework/models/user-choices.mjs').UserAnswers} UserAnswers
 * @typedef {import('../types.mjs').Feed} Feed
 * @typedef {import('../types.mjs').Post} Post
 * @typedef {import('../feed-fetcher/feedFetcher.mjs').FetchStatus} FetchStatus
 */

/**
 * @template T
 * @typedef {import('../../shared/listenable-data/listenableData.mjs').MutableListenableDataEvent<T>} MutableListenableDataEvent<T>
 */

import { getFeedsFetcher } from '../main.mjs'
import { storage } from '../storage/storage.mjs'
import { FEED, POST } from '../types.mjs'

/**
 * @returns {Promise<void>}
 */
export const startFetchingFeedPosts = async () => {
  /** @type {Feed[]} */
  const feeds = await storage.findAllThings(FEED)
  getFeedsFetcher().startFetching(feeds)

  getFeedsFetcher().$lastFetchStatus.onChange(storeFetchedPosts)
}

/**
 *
 * @param {MutableListenableDataEvent<FetchStatus | undefined>} event
 * @returns {Promise<void>}
 */
const storeFetchedPosts = async ({ currentValue }) => {
  if (!currentValue || currentValue.type !== 'SUCCESS') {
    return
  }

  const { feed, posts } = currentValue
  let currentLastFetchTimestamp = feed.lastFetchTimestamp
  let newLastFetchTimestamp = currentLastFetchTimestamp

  for (const element of posts) {
    const newPost = element

    if (!currentLastFetchTimestamp || newPost.timestamp > currentLastFetchTimestamp) {
      /** @type {Post} */
      const postToStore = {
        type: POST,
        id: newPost.url,
        title: newPost.title,
        url: newPost.url,
        timestamp: newPost.timestamp,
        feedId: feed.id,
      }

      await storage.storeThing(postToStore)
    }

    if (!newLastFetchTimestamp || (newPost.timestamp && newPost.timestamp > newLastFetchTimestamp)) {
      newLastFetchTimestamp = newPost.timestamp
    }
  }

  /** @type {Feed} */
  const feedToStore = {
    ...feed,
    lastFetchTimestamp: newLastFetchTimestamp,
  }

  await storage.storeThing(feedToStore)
}
