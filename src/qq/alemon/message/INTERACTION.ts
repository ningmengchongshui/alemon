import { AlemonJSEventError, AlemonJSEventLog } from '../../../log/event.js'
import {
  typeMessage,
  PlatformEnum,
  EventEnum,
  EventType
} from '../../../core/index.js'
import { getBotMsgByQQ } from '../bot.js'
import { segmentQQ } from '../segment.js'
import { ClientController, ClientControllerOnMember } from '../controller.js'

/**
 * TUDO
 */

/**
INTERACTION (1 << 26)
  - INTERACTION_CREATE     // 互动事件创建时
 */
export const INTERACTION = async event => {
  const Message = ClientController({
    guild_id: event.msg.guild_id,
    channel_id: event.msg.channel_id,
    msg_id: '0'
  })

  const Member = ClientControllerOnMember({
    guild_id: event.msg.guild_id,
    channel_id: event.msg.channel_id,
    user_id: ''
  })

  const e = {
    platform: 'qq' as (typeof PlatformEnum)[number],
    event: 'INTERACTION' as (typeof EventEnum)[number],
    eventType: 'CREATE' as (typeof EventType)[number],
    boundaries: 'publick' as 'publick' | 'private',
    attribute: 'group' as 'group' | 'single',
    bot: getBotMsgByQQ(),
    isMaster: false,
    attachments: [],
    specials: [],
    guild_id: event.msg.guild_id,
    guild_name: '',
    guild_avatar: '',
    channel_name: '',
    channel_id: event.msg.channel_id,
    //
    at: false,
    at_user: undefined,
    at_users: [],
    msg: '',
    msg_id: '',
    msg_txt: '',

    //
    user_id: '',
    user_name: '',
    user_avatar: '',
    segment: segmentQQ,
    send_at: new Date().getTime(),
    /**
     * 发现消息
     * @param msg
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
    ): Promise<any> => {},
    Message,
    Member
  }

  /**
   * 事件匹配
   */
  if (!new RegExp(/CREATE$/).test(event.eventType)) {
    e.eventType = 'DELETE'
  }

  return await typeMessage(e)
    .then(() => AlemonJSEventLog(e.event, e.eventType))
    .catch(err => AlemonJSEventError(err, e.event, e.eventType))
}
