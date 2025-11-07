/**
 * @typedef {import('../types.mjs').BreizhCampUserAnswers} BreizhCampUserAnswers
 */

import html from '../../shared/html/html-tag.mjs'
import { getTalk } from '../schedule.mjs'
import { formatHoraire } from '../utils/formatHoraire.mjs'

/**
 * @param {BreizhCampUserAnswers} userAnswers
 * @returns {Promise<string>}
 */
export const buildTalkContent = async (userAnswers) => {
  const talkID = userAnswers.get('talks') ?? ''

  const talk = getTalk(talkID)

  let result = ''

  if (talk.description) {
    result += html`<p>${talk.description}</p>`
  }

  if (talk.event_start || talk.event_end) {
    result += html`<p><b>Horaires :</b> ${formatHoraire(talk.event_start)} - ${formatHoraire(talk.event_end)}</p>`
  }

  if (talk.venue) {
    result += html`<p><b>Lieu :</b> ${talk.venue}</p>`
  }

  if (talk.speakers) {
    result += html`<p><b>Speaker :</b> ${talk.speakers}</p>`
  }

  if (talk.level) {
    result += html`<p><b>Niveau :</b> ${talk.level}</p>`
  }

  if (talk.format && talk.format !== 'Eat' && talk.format !== 'Keynote') {
    result += html`<p><b>Format :</b> ${talk.format}</p>`
  }

  if (talk.event_type && talk.event_type !== 'Eat' && talk.event_type !== 'Keynote') {
    result += html`<p><b>Catégorie :</b> ${talk.event_type}</p>`
  }

  return result
}
