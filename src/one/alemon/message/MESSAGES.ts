import { EventGroup } from '../../sdk/types.js'
import { getBotConfigByKey } from '../../../config/index.js'
import {
  EventEnum,
  EventType,
  InstructionMatching,
  PlatformEnum,
  getUrlbuffer
} from '../../../core/index.js'
import { getBotMsgByONE } from '../bot.js'
import { segmentONE } from '../segment.js'
import { AlemonJSError, AlemonJSLog } from '../../../log/index.js'
import { ClientController } from '../controller.js'
import { replyController } from '../reply.js'
/**
 * 公信事件
 * @param socket
 * @param event
 * @returns
 */
export async function MESSAGES(event: EventGroup) {
  const cfg = getBotConfigByKey('one')
  const masterID = cfg.masterID

  const Message = ClientController({
    guild_id: event.group_id,
    channel_id: '0',
    msg_id: event.message_id,
    send_at: new Date().getTime()
  })

  const e = {
    platform: 'one' as (typeof PlatformEnum)[number],
    event: 'MESSAGES' as (typeof EventEnum)[number],
    eventType: 'CREATE' as (typeof EventType)[number],
    boundaries: 'publick' as 'publick' | 'private',
    attribute:
      event.detail_type == 'private'
        ? 'single'
        : ('group' as 'group' | 'single'),
    bot: getBotMsgByONE(),
    isMaster: event.user_id == masterID ? true : false,
    msg_txt: event.raw_message,
    user_id: event.user_id,
    user_avatar:
      event.platform == 'qq'
        ? `https://q1.qlogo.cn/g?b=qq&s=0&nk=${event.user_id}`
        : 'https://q1.qlogo.cn/g?b=qq&s=0&nk=1715713638',
    user_name: event.sender.nickname,
    guild_id: event.group_id,
    guild_name: event.group_name,
    guild_avatar: '',
    channel_name: '',
    channel_id: event.group_id,
    at: false,
    at_user: undefined,
    at_users: [],
    attachments: [],
    specials: [],
    msg: event.raw_message.trim(),
    msg_id: event.message_id,
    segment: segmentONE,
    Message,
    send_at: new Date().getTime(),
    /**
     * 消息发送机制
     * @param msg 消息
     * @param img
     * @returns
     */
    reply: async (
      msg: Buffer | string | number | (Buffer | number | string)[],
      select?: {
        quote?: string
        withdraw?: number
        guild_id?: string
        channel_id?: string
      }
    ): Promise<any> => {
      const guild_id = select.guild_id ?? event.group_id
      return await replyController(msg, guild_id)
    }
  }

  const arr: {
    qq: number
    text: string
    user_id: number
  }[] = []

  for (const item of event.message) {
    if (item.type == 'mention') {
      arr.push(item.data)
      e.at_users.push({
        avatar: '',
        bot: false,
        id: item.data.user_id,
        name: item.data.text.replace(/^@/, '')
      })
    }
  }

  for (const item of arr) {
    e.msg = e.msg.replace(item.text, '').trim()
  }

  /**
   * 存在at
   */
  if (e.at) {
    /**
     * 得到第一个艾特
     */
    e.at_user = e.at_users.find(item => item.bot != true)
  }

  /**
   * 业务处理
   */
  return await InstructionMatching(e)
    .then(() => AlemonJSLog(e.channel_id, e.user_name, e.msg_txt))
    .catch(err => AlemonJSError(err, e.channel_id, e.user_name, e.msg_txt))
}
