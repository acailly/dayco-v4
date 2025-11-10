/**
 * @typedef {import('./types.mjs').Jour} Jour
 * @typedef {import('./types.mjs').Talk} Talk
 */

/** @type {Talk[]} */
import { SCHEDULE } from './schedule.data.mjs'
import { JEUDI, MERCREDI, VENDREDI } from './types.mjs'

/**
 * @param {Talk} talk
 * @return {Jour}
 */
const getJourDuTalk = (talk) => {
  const date = new Date(talk.event_start)
  if (date.getDay() === 3) {
    return MERCREDI
  }
  if (date.getDay() === 4) {
    return JEUDI
  }
  if (date.getDay() === 5) {
    return VENDREDI
  }
  throw new Error(`jour non reconnu: ${date.getDay()} (${talk.event_start})`)
}

/** @type {Record<Jour, Record<string, Talk[]>>} */
const TALKS_PAR_JOUR_PAR_HEURE = {
  MERCREDI: {},
  JEUDI: {},
  VENDREDI: {},
}

/** @type {Record<string, Talk>} */
const TALKS_PAR_ID = {}

for (const talk of SCHEDULE) {
  const jour = getJourDuTalk(talk)

  TALKS_PAR_JOUR_PAR_HEURE[jour][talk.event_start] ??= []
  TALKS_PAR_JOUR_PAR_HEURE[jour][talk.event_start].push(talk)

  TALKS_PAR_ID[talk.id] = talk
}

/**
 * @param {Jour} jour
 * @return {string[]}
 */
export const getHorairesDuJour = (jour) => {
  const horaires = Object.keys(TALKS_PAR_JOUR_PAR_HEURE[jour])
  return [...horaires].sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
}

/**
 * @param {Jour} jour
 * @param {string} heure
 * @return {Talk[]}
 */
export const getTalksFromHoraire = (jour, heure) => {
  return TALKS_PAR_JOUR_PAR_HEURE[jour][heure]
}

/**
 * @param {string} talkID
 * @return {Talk}
 */
export const getTalk = (talkID) => {
  return TALKS_PAR_ID[talkID]
}
