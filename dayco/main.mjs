/**
 * @typedef {import('../framework/engine/user-choices.mjs').Choice} Choice
 */

import { getUserChoices } from '../framework/globals/user-choices.mjs'

import FeedsFetcher from './feed-fetcher/feedsFetcher.mjs'
import { httpClient } from './httpClient/httpClient.mjs'
import './components/fetch-list.component.mjs'
import { APP_CHOICES } from './app-choice-definitions.mjs'

const feedsFetcher = new FeedsFetcher(httpClient)
export const getFeedsFetcher = () => feedsFetcher

const userChoices = getUserChoices()
userChoices.initialize(APP_CHOICES)
