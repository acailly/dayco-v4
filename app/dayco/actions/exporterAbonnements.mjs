/**
 * @typedef {import('../../user-choices.mjs').UserAnswers} UserAnswers
 */

import { storage } from '../storage/storage.mjs'
import { FEED } from '../types.mjs'

/**
 *
 * @returns {Promise<void>}
 */
export const exporterAbonnements = async () => {
  // Inspired by https://stackoverflow.com/a/30800715
  const things = await storage.findAllThings(FEED)
  const json = JSON.stringify(things, null, 2)
  const databaseContentDownloadUrl = 'data:text/json;charset=utf-8,' + encodeURIComponent(json)
  const downloadAnchorNode = document.createElement('a')
  downloadAnchorNode.setAttribute('href', databaseContentDownloadUrl)
  downloadAnchorNode.setAttribute('download', 'feeds.json')
  downloadAnchorNode.style.display = 'none'
  document.body.appendChild(downloadAnchorNode) // required for firefox
  downloadAnchorNode.click()
  downloadAnchorNode.remove()
}
