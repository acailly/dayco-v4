/**
 * @typedef {import('./types.mjs').DaycoUserAnswers} DaycoUserAnswers
 * @typedef {import('./types.mjs').DaycoChoice} DaycoChoice
 * @typedef {import('./types.mjs').DaycoChoiceRegistry} DaycoChoiceRegistry
 */

import { buildAbonnementsOptions } from './options/buildAbonnementsOptions.mjs'
import { buildNouveautesDeAbonnementOptions } from './options/buildNouveautesDeAbonnementOptions.mjs'
import { buildNouveautesParAbonnementOptions } from './options/buildNouveautesParAbonnementOptions.mjs'
import { importerAbonnements } from './actions/importerAbonnements.mjs'
import { marquerCommeLu } from './actions/marquerCommeLu.mjs'
import { marquerToutCommeLu } from './actions/marquerToutCommeLu.mjs'
import { startFetchingFeedPosts } from './actions/startFetchingFeedPosts.mjs'
import { supprimerAbonnement } from './actions/supprimerAbonnement.mjs'
import { enregistrerNouvelAbonnement } from './actions/enregistrerNouvelAbonnement.mjs'
import { viderBaseDeDonnees } from './actions/viderBaseDeDonnees.mjs'
import { exporterAbonnements } from './actions/exporterAbonnements.mjs'
import html from '../shared/html/html-tag.mjs'
import { FORM_SUMIT_OPTION_VALUE } from '../framework/engine/user-choices.mjs'
import { AFTER_TITLE, CHIP } from '../framework/components/dynamic-form.component.mjs'
import { buildNouveautesDeAbonnementTitle } from './content/buildNouveautesDeAbonnementTitle.mjs'
import { buildNomAbonnementForm } from './forms/buildNomAbonnementForm.mjs'
import { buildUrlAbonnementForm } from './forms/buildUrlAbonnementForm.mjs'

/** @type {DaycoChoiceRegistry} */
export const APP_CHOICES = {
  title: 'Dayco v4',
  start: 'header',
  definitions: {
    header: {
      staticTitle: 'Bienvenue, que voulez vous faire ?',
      staticOptions: [
        {
          value: 'nouveautes',
          label: 'Nouveautés',
          goto: 'nouveautesParAbonnement',
          tags: [CHIP],
          selectedByDefault: true,
        },
        {
          value: 'abonnements',
          label: 'Abonnements',
          goto: 'abonnements',
          tags: [CHIP],
        },
        {
          value: 'sauvegarde',
          label: 'Sauvegarde',
          goto: 'sauvegarde',
          tags: [CHIP],
        },
        {
          value: 'recupererNouveautes',
          label: 'Récupérer les nouveautés',
          execute: startFetchingFeedPosts,
          goto: 'recupererNouveautes',
          tags: [CHIP],
        },
      ],
    },
    nouveautesParAbonnement: {
      staticTitle: 'Toutes les nouveautés triées par abonnement',
      dynamicOptions: buildNouveautesParAbonnementOptions,
      rememberOptions: false,
    },
    nouveautesDeAbonnement: {
      dynamicTitle: buildNouveautesDeAbonnementTitle,
      staticOptions: [
        {
          value: 'marquerToutCommeLu',
          label: 'Marquer tout comme lu',
          execute: marquerToutCommeLu,
          goto: 'nouveautesParAbonnement',
          tags: [CHIP],
        },
      ],
      dynamicOptions: buildNouveautesDeAbonnementOptions,
    },
    nouveaute: {
      staticTitle: 'Actions possibles sur la nouveauté',
      staticOptions: [
        {
          value: 'marquerCommeLu',
          label: 'Marquer comme lu',
          execute: marquerCommeLu,
          goto: 'nouveautesDeAbonnement',
          tags: [CHIP],
        },
      ],
    },
    abonnements: {
      staticTitle: 'Tous les abonnements',
      staticOptions: [
        {
          value: 'ajouterAbonnement',
          label: 'Ajouter un nouvel abonnement',
          goto: 'nomNouvelAbonnement',
          tags: [CHIP],
        },
      ],
      dynamicOptions: buildAbonnementsOptions,
    },
    abonnement: {
      staticTitle: "Actions possible sur l'abonnement",
      staticOptions: [
        {
          value: 'supprimerAbonnement',
          label: 'Supprimer',
          execute: supprimerAbonnement,
          goto: 'abonnements',
          tags: [CHIP],
        },
      ],
    },
    nomNouvelAbonnement: {
      staticTitle: 'Saisissez le nom du nouvel abonnement',
      dynamicForm: buildNomAbonnementForm,
      staticOptions: [
        {
          value: 'annuler',
          label: 'Annuler',
          goto: 'abonnements',
          tags: [CHIP],
        },
        {
          value: FORM_SUMIT_OPTION_VALUE,
          label: 'OK',
          goto: 'urlNouvelAbonnement',
          tags: [CHIP],
        },
      ],
    },
    urlNouvelAbonnement: {
      staticTitle: "Saisissez l'adresse (URL) du nouvel abonnement",
      dynamicForm: buildUrlAbonnementForm,
      staticOptions: [
        {
          value: 'annuler',
          label: 'Annuler',
          goto: 'abonnements',
          tags: [CHIP],
        },
        {
          value: FORM_SUMIT_OPTION_VALUE,
          label: 'OK',
          execute: enregistrerNouvelAbonnement,
          goto: 'abonnements',
          tags: [CHIP],
        },
      ],
    },
    sauvegarde: {
      staticTitle: 'Toutes les actions relatives à la sauvegarde',
      staticOptions: [
        {
          value: 'importerAbonnements',
          label: 'Importer des abonnements',
          goto: 'importerAbonnements',
          tags: [CHIP],
        },
        {
          value: 'exporterAbonnements',
          label: 'Exporter des abonnements',
          execute: exporterAbonnements,
          goto: 'sauvegarde',
          tags: [CHIP],
        },
        {
          value: 'viderBaseDeDonnees',
          label: 'Vider la base de données',
          execute: viderBaseDeDonnees,
          goto: 'sauvegarde',
          tags: [CHIP],
        },
      ],
    },
    importerAbonnements: {
      staticTitle: 'Sélectionnez le fichier JSON contenant les abonnements à importer',
      staticForm: html`<input name="file" type="file" required />`,
      staticOptions: [
        {
          value: 'annuler',
          label: 'Annuler',
          goto: 'sauvegarde',
          tags: [CHIP],
        },
        {
          value: FORM_SUMIT_OPTION_VALUE,
          label: 'OK',
          execute: importerAbonnements,
          // TODO ACY c'est pas ouf ca, faudrait trouver un meilleur moyen de gérer un changement de choix plus haut
          updateUserAnswers:
            /**
             * @param {DaycoUserAnswers} userAnswers
             */
            async (userAnswers) => {
              userAnswers.set('header', 'abonnements')
            },
          goto: 'abonnements',
          tags: [CHIP],
        },
      ],
    },
    recupererNouveautes: {
      staticTitle: 'Récupération des nouveautés en cours...',
      staticContent: html`<fetch-list choice-id="recupererNouveautes"></fetch-list>`,
      staticOptions: [
        {
          value: 'abonnements',
          label: 'Aller aux nouveautés',
          // TODO ACY c'est pas ouf ca, faudrait trouver un meilleur moyen de gérer un changement de choix plus haut
          updateUserAnswers:
            /**
             * @param {DaycoUserAnswers} userAnswers
             */
            async (userAnswers) => {
              userAnswers.set('header', 'nouveautes')
            },
          goto: 'nouveautesParAbonnement',
          tags: [CHIP, AFTER_TITLE],
        },
      ],
    },
  },
}
