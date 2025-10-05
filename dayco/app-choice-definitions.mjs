/**
 * @typedef {import('../framework/engine/user-choices.mjs').ChoiceDefinitionRegistry} ChoiceDefinitionRegistry
 * @typedef {import('../framework/engine/user-choices.mjs').UserAnswers} UserAnswers
 */

import { buildAbonnementsOptions } from './actions/buildAbonnementsOptions.mjs'
import { buildNouveautesDeAbonnementOptions } from './actions/buildNouveautesDeAbonnementOptions.mjs'
import { buildNouveautesParAbonnementOptions } from './actions/buildNouveautesParAbonnementOptions.mjs'
import { importerAbonnements } from './actions/importerAbonnements.mjs'
import { marquerCommeLu } from './actions/marquerCommeLu.mjs'
import { marquerToutCommeLu } from './actions/marquerToutCommeLu.mjs'
import { startFetchingFeedPosts } from './actions/startFetchingFeedPosts.mjs'
import { supprimerAbonnement } from './actions/supprimerAbonnement.mjs'
import { enregistrerNouvelAbonnement } from './actions/enregistrerNouvelAbonnement.mjs'
import { viderBaseDeDonnees } from './actions/viderBaseDeDonnees.mjs'
import { exporterAbonnements } from './actions/exporterAbonnements.mjs'

/** @type {ChoiceDefinitionRegistry} */
export const APP_CHOICES = {
  title: 'Dayco v4',
  start: 'header',
  definitions: {
    header: {
      choiceType: 'optionList',
      prompt: 'Bienvenue, que voulez vous faire ?',
      staticOptions: [
        {
          value: 'nouveautes',
          label: 'Nouveautés',
          goto: 'nouveautesParAbonnement',
          tags: ['chip'],
          selectedByDefault: true,
        },
        {
          value: 'abonnements',
          label: 'Abonnements',
          goto: 'abonnements',
          tags: ['chip'],
        },
        {
          value: 'sauvegarde',
          label: 'Sauvegarde',
          goto: 'sauvegarde',
          tags: ['chip'],
        },
        {
          value: 'recupererNouveautes',
          label: 'Récupérer les nouveautés',
          execute: startFetchingFeedPosts,
          goto: 'recupererNouveautes',
          tags: ['chip'],
        },
      ],
    },
    nouveautesParAbonnement: {
      choiceType: 'optionList',
      prompt: 'Toutes les nouveautés triées par abonnement',
      dynamicOptions: buildNouveautesParAbonnementOptions,
      rememberOptions: false,
    },
    nouveautesDeAbonnement: {
      choiceType: 'optionList',
      prompt: "Les nouveautés de l'abonnement",
      staticOptions: [
        {
          value: 'marquerToutCommeLu',
          label: 'Marquer tout comme lu',
          execute: marquerToutCommeLu,
          goto: 'nouveautesParAbonnement',
          tags: ['chip'],
        },
      ],
      dynamicOptions: buildNouveautesDeAbonnementOptions,
    },
    nouveaute: {
      choiceType: 'optionList',
      prompt: 'Actions possibles sur la nouveauté',
      staticOptions: [
        {
          value: 'marquerCommeLu',
          label: 'Marquer comme lu',
          execute: marquerCommeLu,
          goto: 'nouveautesDeAbonnement',
          tags: ['chip'],
        },
      ],
    },
    abonnements: {
      choiceType: 'optionList',
      prompt: 'Tous les abonnements',
      staticOptions: [
        {
          value: 'ajouterAbonnement',
          label: 'Ajouter un nouvel abonnement',
          goto: 'nomNouvelAbonnement',
          tags: ['chip'],
        },
      ],
      dynamicOptions: buildAbonnementsOptions,
    },
    abonnement: {
      choiceType: 'optionList',
      prompt: "Actions possible sur l'abonnement",
      staticOptions: [
        {
          value: 'supprimerAbonnement',
          label: 'Supprimer',
          execute: supprimerAbonnement,
          goto: 'abonnements',
          tags: ['chip'],
        },
      ],
    },
    nomNouvelAbonnement: {
      choiceType: 'inputText',
      prompt: 'Saisissez le nom du nouvel abonnement',
      staticOptions: [
        {
          value: '*',
          label: 'OK',
          goto: 'urlNouvelAbonnement',
          tags: ['chip'],
        },
        {
          value: 'annuler',
          label: 'Annuler',
          goto: 'abonnements',
          tags: ['chip'],
        },
      ],
    },
    urlNouvelAbonnement: {
      choiceType: 'inputText',
      prompt: "Saisissez l'adresse (URL) du nouvel abonnement",
      staticOptions: [
        {
          value: '*',
          label: 'OK',
          execute: enregistrerNouvelAbonnement,
          goto: 'abonnements',
          tags: ['chip'],
        },
        {
          value: 'annuler',
          label: 'Annuler',
          goto: 'abonnements',
          tags: ['chip'],
        },
      ],
    },
    sauvegarde: {
      choiceType: 'optionList',
      prompt: 'Toutes les actions relatives à la sauvegarde',
      staticOptions: [
        {
          value: 'importerAbonnements',
          label: 'Importer des abonnements',
          goto: 'importerAbonnements',
          tags: ['chip'],
        },
        {
          value: 'exporterAbonnements',
          label: 'Exporter des abonnements',
          execute: exporterAbonnements,
          goto: 'sauvegarde',
          tags: ['chip'],
        },
        {
          value: 'viderBaseDeDonnees',
          label: 'Vider la base de données',
          execute: viderBaseDeDonnees,
          goto: 'sauvegarde',
          tags: ['chip'],
        },
      ],
    },
    importerAbonnements: {
      choiceType: 'inputJson',
      prompt: 'Sélectionnez le fichier JSON contenant les abonnements à importer',
      staticOptions: [
        {
          value: '*',
          label: 'OK',
          execute: importerAbonnements,
          updateUserAnswers: async () => ({ header: 'abonnements' }),
          goto: 'abonnements',
          tags: ['chip'],
        },
        {
          value: 'annuler',
          label: 'Annuler',
          goto: 'sauvegarde',
          tags: ['chip'],
        },
      ],
    },
    recupererNouveautes: {
      choiceType: 'fetchList',
      prompt: 'Récupération des nouveautés en cours...',
      staticOptions: [
        {
          value: 'abonnements',
          label: 'Aller aux nouveautés',
          updateUserAnswers: async () => ({ header: 'nouveautes' }),
          goto: 'nouveautesParAbonnement',
          tags: ['chip'],
        },
      ],
    },
  },
}
