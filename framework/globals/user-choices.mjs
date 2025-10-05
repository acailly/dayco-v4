import { UserChoices } from '../engine/user-choices.mjs'

/** @type {UserChoices} */
let __userChoices = new UserChoices()

/**
 * @returns {UserChoices}
 */
export const getUserChoices = () => {
  return __userChoices
}
