/**
 * @typedef {import('../types.mjs').BreizhCampUserAnswers} BreizhCampUserAnswers
 */

import { getTalk } from '../schedule.mjs'
import { isFavoriteTalk } from '../storage.mjs'

/**
 * @param {BreizhCampUserAnswers} userAnswers
 * @returns {Promise<string>}
 */
export const buildTalkTitle = async (userAnswers) => {
  const talkID = userAnswers.get('talks') ?? ''

  const talk = getTalk(talkID)

  const isFavorite = isFavoriteTalk(talkID)

  return `${isFavorite ? '⭐ ' : ''}${talk.name}`
}
