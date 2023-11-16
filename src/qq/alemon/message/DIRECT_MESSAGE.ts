import { IOpenAPI } from 'qq-guild-bot'
import {
  typeMessage,
  InstructionMatching,
  EventEnum,
  PlatformEnum,
  EventType
} from '../../../core/index.js'
import { segmentQQ } from '../segment.js'
import { getBotMsgByQQ } from '../bot.js'
import {
  AlemonJSError,
  AlemonJSLog,
  AlemonJSEventError,
  AlemonJSEventLog
} from '../../../log/index.js'
import { getBotConfigByKey } from '../../../config/index.js'
import {
  ClientDirectController,
  directController,
  ClientControllerOnMember
} from '../direct.js'

declare global {
  //接口对象
  var ClientQQ: IOpenAPI
}

interface directEventData {
  eventType: 'AT_MESSAGE_CREATE'
  eventId: string
  msg: {
    attachments?: {
      content_type: string
      filename: string
      height: number
      id: string
      size: number
      url: string
      width: number
    }[]
    author: {
      avatar: string
      bot: boolean
      id: string
      username: string
    }
    channel_id: string
    content: string
    direct_message: boolean
    guild_id: string
    id: string
    member: { joined_at: string }
    seq: number
    seq_in_channel: string
    src_guild_id: string
    timestamp: string
  }
}

/**
 * *
 * 私信
 * *
 */

/**
DIRECT_MESSAGE (1 << 12)
  - DIRECT_MESSAGE_CREATE   // 当收到用户发给机器人的私信消息时
  - DIRECT_MESSAGE_DELETE   // 删除（撤回）消息事件
 */
export const DIRECT_MESSAGE = async (event: directEventData) => {
  const Message = ClientDirectController({
    guild_id: event.msg?.guild_id ?? '',
    msg_id: event.msg?.id ?? ''
  })

  const Member = ClientControllerOnMember()

  const cfg = getBotConfigByKey('qq')
  const masterID = cfg.masterID
  const e = {
    platform: 'qq' as (typeof PlatformEnum)[number],
    event: 'MESSAGES' as (typeof EventEnum)[number],
    eventType: 'CREATE' as (typeof EventType)[number],
    boundaries: 'publick' as 'publick' | 'private',
    attribute: 'single' as 'group' | 'single',
    bot: getBotMsgByQQ(),
    isMaster: event.msg.author.id == masterID ? true : false,
    guild_id: event.msg.guild_id,
    guild_name: '',
    guild_avatar: '',
    channel_name: '',
    channel_id: event.msg.channel_id,
    attachments: event?.msg?.attachments ?? [],
    specials: [],
    //
    at: false,
    at_users: [],
    at_user: undefined,
    msg: event.msg?.content ?? '',
    msg_txt: event.msg?.content ?? '',
    msg_id: event.msg.id,
    //
    user_id: event.msg.author.id,
    user_name: event.msg.author.username,
    user_avatar: event.msg.author.avatar,
    segment: segmentQQ,
    send_at: new Date().getTime(),
    reply: async (
      msg: Buffer | string | number | (Buffer | number | string)[],
      select?: {
        quote?: string
        withdraw?: number
        guild_id?: string
        channel_id?: string
        msg_id?: string
      }
    ): Promise<any> => {
      const guild_id = select?.channel_id ?? event.msg.guild_id
      const channel_id = select?.channel_id ?? event.msg.channel_id
      const msg_id = select?.msg_id ?? event.msg.id
      const withdraw = select?.withdraw ?? 0
      return await directController(msg, guild_id, msg_id, {
        withdraw
      })
    },
    Message,
    Member
  }

  /**
   * 撤回事件
   */
  if (new RegExp(/^DIRECT_MESSAGE_DELETE$/).test(event.eventType)) {
    e.eventType = 'DELETE'
    /**
     * 只匹配类型
     */
    return await typeMessage(e)
      .then(() => AlemonJSEventLog(e.event, e.eventType))
      .catch(err => AlemonJSEventError(err, e.event, e.eventType))
  }

  /**
   * 业务处理
   */
  return await InstructionMatching(e)
    .then(() => AlemonJSLog(e.channel_id, e.user_name, e.msg_txt))
    .catch(err => AlemonJSError(err, e.channel_id, e.user_name, e.msg_txt))
}
