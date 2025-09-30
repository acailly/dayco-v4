/**
 * @typedef {import('./user-choices.mjs').Choice} Choice
 */

import '../shared/component-loader/component-loader.mjs'
// import { APP_CHOICES } from './example-zenipark.mjs'
import { APP_CHOICES } from './dayco/app-choice-definitions.mjs'
import FeedsFetcher from './dayco/feed-fetcher/feedsFetcher.mjs'
import { httpClient } from './dayco/httpClient/httpClient.mjs'
import { UserChoices } from './user-choices.mjs'

import './dayco/components/fetch-list.component.mjs'
import './components/option-list.component.mjs'
import './components/input-json.component.mjs'
import './components/input-text.component.mjs'
import html from '../shared/html/html-tag.mjs'

const feedsFetcher = new FeedsFetcher(httpClient)
export const getFeedsFetcher = () => feedsFetcher

const userChoices = new UserChoices(APP_CHOICES)
export const getUserChoices = () => userChoices

/** @type {Record<string, (choice: Choice) => string>} */
const viewFactory = {
  optionList: (choice) => html`<option-list choice-id="${choice.choiceID}"></<option-list>`,
  inputJson: (choice) => html`<input-json choice-id="${choice.choiceID}"></<input-json>`,
  inputText: (choice) => html`<input-text choice-id="${choice.choiceID}"></<input-text>`,
  fetchList: (choice) => html`<fetch-list choice-id="${choice.choiceID}"></fetch-list>`,
}
export const getView = (/** @type {Choice} */ choice) => {
  const customViewFactory = choice.choiceType ? viewFactory[choice.choiceType] : undefined
  if (customViewFactory) {
    return customViewFactory(choice)
  }

  return html``
}
