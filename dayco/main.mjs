/**
 * @typedef {import('../framework/engine/user-choices.mjs').Choice} Choice
 */

import html from '../shared/html/html-tag.mjs'

import { getUserChoices } from '../framework/globals/user-choices.mjs'
import { registerChoiceViewFactory } from '../framework/components/dynamic-form.component.mjs'
import '../framework/components/option-list.component.mjs'
import '../framework/components/input-json.component.mjs'
import '../framework/components/input-text.component.mjs'

import FeedsFetcher from './feed-fetcher/feedsFetcher.mjs'
import { httpClient } from './httpClient/httpClient.mjs'
import './components/fetch-list.component.mjs'
import { APP_CHOICES } from './app-choice-definitions.mjs'

const feedsFetcher = new FeedsFetcher(httpClient)
export const getFeedsFetcher = () => feedsFetcher

const userChoices = getUserChoices()
userChoices.initialize(APP_CHOICES)

registerChoiceViewFactory('fetchList', (choice) => html`<fetch-list choice-id="${choice.choiceID}"></fetch-list>`)
