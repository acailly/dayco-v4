/** @typedef {import('../httpClient/httpClient.mjs').HTTPClient} HTTPClient */
/** @typedef {import("../types.mjs").Feed} Feed */
/** @typedef {import("../types.mjs").Post} Post */
/** @typedef {import('./feedFetcher.mjs').FetchStatus} FetchStatus */
/**
 * @template T
 * @typedef {import('../../shared/listenable-data/listenableData.mjs').ListenableData<T>} ListenableData<T>
 */

import MutableListenableData from '../../shared/listenable-data/listenableData.mjs'
import FeedFetcher from './feedFetcher.mjs'

/**
 * @typedef {Object} FetchSuccess
 * @property {Feed} feed
 * @property {Post[]} posts
 */

export default class FeedsFetcher {
  $fetchStatuses
  $lastFetchStatus

  /**
   * @constructor
   * @param {HTTPClient} httpClient
   */
  constructor(httpClient) {
    this._httpClient = httpClient

    this._fetchStatuses = new MutableListenableData(/** @type {ListenableData<FetchStatus>[]} */ ([]))
    this.$fetchStatuses = this._fetchStatuses.asReadonly()

    this._lastFetchStatus = new MutableListenableData(/** @type {FetchStatus | undefined} */ (undefined))
    this.$lastFetchStatus = this._lastFetchStatus.asReadonly()
  }

  /**
   * @param {Feed[]} feeds
   */
  startFetching = (feeds) => {
    const fetchStatuses = feeds.map((feed) => {
      const feedFetcher = new FeedFetcher(this._httpClient, feed)
      feedFetcher.$status.onChange(({ currentValue }) => this._lastFetchStatus.set(currentValue))
      feedFetcher.startFetching()
      return feedFetcher.$status
    })
    this._fetchStatuses.set(fetchStatuses)
  }
}
