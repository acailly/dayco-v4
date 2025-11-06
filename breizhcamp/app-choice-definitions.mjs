/**
 * @typedef {import('./types.mjs').BreizhCampChoiceRegistry} BreizhCampChoiceRegistry
 */

import { CHIP } from '../framework/components/dynamic-form.component.mjs'
import { buildTalkContent } from './content/buildTalkContent.mjs'
import { buildTalksTitle } from './content/buildTalksTitle.mjs'
import { buildTalkTitle } from './content/buildTalkTitle.mjs'
import { buildHeuresOptions } from './options/buildHeuresOptions.mjs'
import { buildTalksOptions } from './options/buildTalksOptions.mjs'
import { JEUDI, MERCREDI, VENDREDI } from './types.mjs'

/** @type {BreizhCampChoiceRegistry} */
export const APP_CHOICES = {
  title: 'Programme du BreizhCamp 2025',
  start: 'jour',
  definitions: {
    jour: {
      staticTitle: 'Quel jour ?',
      staticOptions: [
        {
          value: MERCREDI,
          label: 'Mercredi',
          goto: 'heure',
          tags: [CHIP],
        },
        {
          value: JEUDI,
          label: 'Jeudi',
          goto: 'heure',
          tags: [CHIP],
        },
        {
          value: VENDREDI,
          label: 'Vendredi',
          goto: 'heure',
          tags: [CHIP],
        },
      ],
    },
    heure: {
      staticTitle: 'Quelle heure ?',
      dynamicOptions: buildHeuresOptions,
    },
    talks: {
      dynamicTitle: buildTalksTitle,
      dynamicOptions: buildTalksOptions,
    },
    talk: {
      dynamicTitle: buildTalkTitle,
      dynamicContent: buildTalkContent,
      // TODO ACY option masquer / demasquer
      // dynamicOptions: buildTalkOptions,
    },
  },
}
