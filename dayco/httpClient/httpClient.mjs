/**
 * @typedef {Object} HTTPClient
 * @property {(url: string) => Promise<string>} fetchContent
 */

import { fetchContent } from './httpClient.corsProxy.mjs'

/** @type {HTTPClient} */
export const httpClient = {
  fetchContent,
}
