/** @typedef {import("../types.mjs").Thing} Thing */
/** @typedef {import("../types.mjs").Type} Type */

/**
 * @typedef {Object} Storage
 * @property {(type: Type, id: string) => Promise<Thing | undefined>} findThingById
 * @property {<T extends Thing>(type: Type) => Promise<T[]>} findAllThings
 * @property {(type: Type, id: string) => Promise<unknown>} deleteThing
 * @property {<T extends Thing>(thing: T) => Promise<unknown>} storeThing
 * @property {() => Promise<unknown>} deleteAll
 */

import { storeThing, deleteThing, findAllThings, findThingById, deleteDatabase } from './storage.indexedDb.mjs'

/** @type {Storage} */
export const storage = {
  storeThing,
  deleteThing,
  findAllThings,
  findThingById,
  deleteAll: deleteDatabase,
}
