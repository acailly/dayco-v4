/**
 * @typedef {import('../types.mjs').BreizhCampUserAnswers} BreizhCampUserAnswers
 */

import { getTalk } from '../schedule.mjs'

/**
 * @param {BreizhCampUserAnswers} userAnswers
 * @returns {Promise<string>}
 */
export const buildTalkContent = async (userAnswers) => {
  const talkID = userAnswers.get('talks') ?? ''

  const talk = getTalk(talkID)

  return talk.description ?? ''
}
