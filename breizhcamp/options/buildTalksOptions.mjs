/**
 * @typedef {import('../types.mjs').BreizhCampUserAnswers} BreizhCampUserAnswers
 * @typedef {import('../types.mjs').BreizhCampChoiceOption} BreizhCampChoiceOption
 * @typedef {import('../types.mjs').Jour} Jour
 */

import html from '../../shared/html/html-tag.mjs'
import { getTalksFromHoraire } from '../schedule.mjs'
import { isFavoriteTalk } from '../storage.mjs'
import { formatHoraire } from '../utils/formatHoraire.mjs'

/**
 * @param {BreizhCampUserAnswers} userAnswers
 * @returns {Promise<BreizhCampChoiceOption[]>}
 */
export const buildTalksOptions = async (userAnswers) => {
  const jour = /** @type {Jour} */ (userAnswers.get('jour'))
  const heure = userAnswers.get('heure') ?? ''

  const talks = getTalksFromHoraire(jour, heure)

  const sortedTalks = [...talks].sort((a, b) => a.venue_id.localeCompare(b.venue_id))

  return sortedTalks.map((talk) => {
    const isFavorite = isFavoriteTalk(talk.id)
    return {
      value: talk.id,
      label: html`${isFavorite ? '⭐ ' : ''}${talk.name} -
        <i>${talk.venue} (${formatHoraire(talk.event_start)} - ${formatHoraire(talk.event_end)})</i>`,
      goto: 'talk',
    }
  })
}
