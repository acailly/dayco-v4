/**
 * @typedef {import('./types.mjs').BreizhCampChoiceRegistry} BreizhCampChoiceRegistry
 */

import { CHIP } from '../framework/components/dynamic-form.component.mjs'
import { buildTalkContent } from './content/buildTalkContent.mjs'
import { buildTalksTitle } from './content/buildTalksTitle.mjs'
import { buildTalkTitle } from './content/buildTalkTitle.mjs'
import { buildHeuresOptions } from './options/buildHeuresOptions.mjs'
import { buildTalkOptions } from './options/buildTalkOptions.mjs'
import { buildTalksOptions } from './options/buildTalksOptions.mjs'
import { JEUDI, MERCREDI, VENDREDI } from './types.mjs'

// TODO ACY ICI ajouter la fonction de stockage des réponses dans l'URL (?)
// TODO ACY ICI ajouter une option "Maintenant" dans le choix du jour qui selectionne automatiquement jour + horaire
// TODO ACY ICI en faire une PWA

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
      dynamicOptions: buildTalkOptions,
    },
  },
}
