import { IOpenAPI, IGuild } from 'qq-guild-bot'
import { EventEmitter } from 'ws'
import { AvailableIntentsEventsEnum } from 'qq-guild-bot'
import { BotType, EventType, EType, typeMessage, BotConfigType } from 'alemon'

/* 非依赖引用 */
import { AlemonMsgType } from '../types'

declare global {
  //接口对象
  var client: IOpenAPI
  //连接对象
  var ws: EventEmitter
  //机器人信息
  var robot: BotType
  //频道管理
  var guilds: Array<IGuild>
  //机器人配置
  var cfg: BotConfigType
}

/**
GUILDS (1 << 0)
  - 主频道
  - GUILD_CREATE           // 当机器人加入新guild时
  - GUILD_UPDATE           // 当guild资料发生变更时
  - GUILD_DELETE           // 当机器人退出guild时
  - 子频道
  - CHANNEL_CREATE         // 当channel被创建时
  - CHANNEL_UPDATE         // 当channel被更新时
  - CHANNEL_DELETE         // 当channel被删除时
 */
export const GUILDS = () => {
  ws.on(AvailableIntentsEventsEnum.GUILDS, (e: AlemonMsgType) => {
    /* 拆分事件 */
    if (new RegExp(e.event).test('/^GUILD.*$/')) {
      e.event = EType.GUILD
    } else {
      e.event = EType.CHANNEL
    }
    if (new RegExp(e.eventType).test('/CREATE$/')) {
      e.eventType = EventType.CREATE
    } else if (new RegExp(e.eventType).test('/UPDATE$/')) {
      e.eventType = EventType.UPDATE
    } else {
      e.eventType = EventType.DELETE
    }
    //只匹配类型
    typeMessage(e)
  })
}
