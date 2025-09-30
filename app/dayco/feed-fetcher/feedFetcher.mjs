/** @typedef {import('../httpClient/httpClient.mjs').HTTPClient} HTTPClient */
/** @typedef {import("../types.mjs").Feed} Feed */
/** @typedef {import("../types.mjs").Post} Post */

import parseRssFeed from './parseRssFeed.mjs'
import { POST } from '../types.mjs'
import MutableListenableData from '../../../shared/listenable-data/listenableData.mjs'

/**
 * @typedef {Object} FetchLoading
 * @property {'LOADING'} type
 * @property {Feed} feed
 */

/**
 * @typedef {Object} FetchSuccess
 * @property {'SUCCESS'} type
 * @property {Feed} feed
 * @property {Post[]} posts
 */

/**
 * @typedef {Object} FetchError
 * @property {'ERROR'} type
 * @property {Feed} feed
 * @property {string} error
 */

/**
 * @typedef {FetchLoading | FetchSuccess | FetchError} FetchStatus
 */

export default class FeedFetcher {
  $status

  /**
   * @constructor
   * @param {HTTPClient} httpClient
   * @param {Feed} feed
   */
  constructor(httpClient, feed) {
    this._httpClient = httpClient
    this._feed = feed
    this._status = new MutableListenableData(/** @type {FetchStatus} */ ({ type: 'LOADING', feed }))
    this.$status = this._status.asReadonly()
  }

  /**
   * Start fetching a feed
   *
   */
  startFetching = () => {
    const { url } = this._feed

    this._httpClient
      .fetchContent(url)
      .then((text) => parseRssFeed(text))
      .then((posts) =>
        posts.map((post) => {
          /** @type {Post} */
          const newPost = {
            ...post,
            type: POST,
            id: post.url,
            feedId: this._feed.id,
          }
          return newPost
        })
      )
      .then((posts) => {
        this._status.set({ type: 'SUCCESS', feed: this._feed, posts })
      })
      .catch((error) => {
        this._status.set({ type: 'ERROR', feed: this._feed, error })
      })
  }
}
