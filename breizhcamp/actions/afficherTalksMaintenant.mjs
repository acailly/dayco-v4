/**
 * @typedef {import('../types.mjs').BreizhCampUserAnswers} BreizhCampUserAnswers
 * @typedef {import('../types.mjs').Jour} Jour
 */

import { getHorairesDuJour, getJourDeDate } from '../schedule.mjs'
import { MERCREDI } from '../types.mjs'

/**
 * @param {BreizhCampUserAnswers} userAnswers
 * @returns {Promise<void>}
 */
export const afficherTalksMaintenant = async (userAnswers) => {
  const now = new Date()

  /** @type {Jour} */
  let aujourdhui = MERCREDI
  let breizhcampAujourdHui = false
  try {
    aujourdhui = getJourDeDate(now)
    breizhcampAujourdHui = true
  } catch {
    // DO NOTHING
  }

  const horaires = getHorairesDuJour(aujourdhui)
  let horaire = horaires.find((h) => isDateAAfterDateB(new Date(h), now))

  if (!horaire) {
    if (breizhcampAujourdHui) {
      horaire = horaires[horaires.length - 1]
    } else {
      horaire = horaires[0]
    }
  }

  userAnswers.set('jour', aujourdhui)
  userAnswers.set('heure', horaire)
}

/**
 *
 * @param {Date} dateA
 * @param {Date} dateB
 * @returns {boolean}
 */
const isDateAAfterDateB = (dateA, dateB) => {
  return dateA.getHours() >= dateB.getHours() && dateA.getMinutes() >= dateB.getMinutes()
}
