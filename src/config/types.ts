import { type PuppeteerLaunchOptions } from 'puppeteer'
import { type MysqlOptions, type RedisOptions } from '../default/index.js'
import { type EmailOptions } from '../email/types.js'
import { type ServerOptions } from '../koa/types.js'
import { type KOOKOptions } from '../platform/kook/sdk/wss.js'
import { type VILLAOptions } from '../platform/villa/sdk/wss.js'
import { type QQOptions } from '../platform/qq/sdk/wss.js'
import { type NTQQOptions } from '../platform/ntqq/sdk/wss.js'
import { type DISOCRDOptions } from '../platform/discord/sdk/wss.js'
/**
 * ******
 * config
 * ******
 */
export interface BotConfigType {
  [key: string]: any
  redis: RedisOptions
  mysql: MysqlOptions
  kook: KOOKOptions
  villa: VILLAOptions
  qq: QQOptions
  server: ServerOptions
  puppeteer: PuppeteerLaunchOptions
  ntqq: NTQQOptions
  discord: DISOCRDOptions
  email: EmailOptions
}
