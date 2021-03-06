import "reflect-metadata";
import VidaliiService from "./vidalii";
export { VidaliiService }
export type { Context } from "./vidalii.server";
export * as orm from './vidalii.db.orm'
export * as val from './vidalii.db.orm.validator'
export * as api from 'type-graphql'
export { ObjectId } from '@mikro-orm/mongodb'
export * as fetch from './vidalii.server.fetch'
export { getDataLoader } from './vidalii.server.dataLoader'