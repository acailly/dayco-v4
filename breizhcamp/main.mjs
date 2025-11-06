/**
 * @typedef {import('../framework/engine/user-choices.mjs').Choice} Choice
 */
import { getUserChoices } from '../framework/globals/user-choices.mjs'
import '../framework/components/dynamic-form.component.mjs'

import { APP_CHOICES } from './app-choice-definitions.mjs'

const userChoices = getUserChoices()
userChoices.initialize(APP_CHOICES)
