import {
  typeMessage,
  PlatformEnum,
  EventType,
  EventEnum
} from '../../../core/index.js'

import { AlemonJSEventError, AlemonJSEventLog } from '../../../log/index.js'
import { segmentQQ } from '../segment.js'
import { getBotMsgByQQ } from '../bot.js'

interface EventGuildMembersType {
  eventType: string
  eventId: string
  msg: {
    guild_id: string
    joined_at: string
    nick: string
    op_user_id: string
    roles: string[]
    source_type?: string // 加入时就会有
    user: {
      avatar: string
      bot: number
      id: string
      username: string
    }
  }
}

/**
GUILD_MEMBERS (1 << 1)
  - GUILD_MEMBER_ADD       // 当成员加入时
  - GUILD_MEMBER_UPDATE    // 当成员资料变更时
  - GUILD_MEMBER_REMOVE    // 当成员被移除时
 */
export const GUILD_MEMBERS = async (event: EventGuildMembersType) => {
  const Eevent: (typeof EventEnum)[number] = 'GUILD_MEMBERS'
  let eventType: (typeof EventType)[number] = 'CREATE'

  if (new RegExp(/ADD$/).test(event.eventType)) {
    eventType = 'CREATE'
  } else if (new RegExp(/UPDATE$/).test(event.eventType)) {
    eventType = 'UPDATE'
  } else {
    eventType = 'DELETE'
  }

  const e = {
    platform: 'qq' as (typeof PlatformEnum)[number],
    bot: getBotMsgByQQ(),
    event: Eevent,
    eventType: eventType,
    isPrivate: false,
    isRecall: false,
    isGroup: true,
    boundaries: 'publick' as 'publick' | 'private',
    attribute: 'group' as 'group' | 'single',
    attachments: [],
    user_id: event.msg.user.id,
    user_name: event.msg.user.username,
    isMaster: false,
    msg_create_time: new Date(event.msg.joined_at).getTime(),
    user_avatar: event.msg.user.avatar,
    at: false,
    msg_id: '',
    msg_txt: '',
    segment: segmentQQ,
    msg: '',
    guild_id: event.msg.guild_id,
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
      }
    ): Promise<any> => {}
  }

  return await typeMessage(e)
    .then(() => AlemonJSEventLog(e.event, e.eventType))
    .catch(err => AlemonJSEventError(err, e.event, e.eventType))
}
