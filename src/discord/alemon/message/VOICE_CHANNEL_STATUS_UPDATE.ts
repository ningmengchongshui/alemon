import {
  APPS,
  type EventEnum,
  type TypingEnum,
  type MessageBingdingOption,
  type UserType
} from '../../../core/index.js'
import { ABotConfig } from '../../../config/index.js'

import { BotMessage } from '../bot.js'
import { segmentDISCORD } from '../segment.js'
import { replyController } from '../reply.js'
import { ClientDISOCRD } from '../../sdk/index.js'

/**
 * 音频子频道状态更新
 * @param event
 */
export async function VOICE_CHANNEL_STATUS_UPDATE(event: {
  status: null
  id: string
  guild_id: string
}) {
  const masterID = ABotConfig.get('discord').masterID

  const e = {
    platform: 'qq',
    event: 'REACTIONS' as (typeof EventEnum)[number],
    typing: 'CREATE' as (typeof TypingEnum)[number],
    boundaries: 'publick' as 'publick' | 'private',
    attribute: 'group' as 'group' | 'single',
    bot: BotMessage.get(),
    isMaster: false,
    attachments: [],
    specials: [],
    guild_id: event.guild_id,
    guild_name: '',
    guild_avatar: '',
    channel_name: '',
    channel_id: '',
    //
    at: false,
    at_user: undefined,
    at_users: [],
    msg_id: event.id,
    msg_txt: '',
    msg: '',
    quote: '',
    open_id: '',

    //
    user_id: '',
    user_name: '',
    user_avatar: '',
    segment: segmentDISCORD,
    send_at: new Date().getTime(),
    /**
     * 发送消息
     * @param msg
     * @param img
     * @returns
     */
    reply: async (
      msg: Buffer | string | number | (Buffer | number | string)[],
      select?: MessageBingdingOption
    ): Promise<any> => {
      const withdraw = select?.withdraw ?? 0
      if (select?.open_id && select?.open_id != '') {
        return false
      }
      const channel_id = select?.channel_id ?? ''
      return await replyController(msg, channel_id, {
        quote: select?.quote,
        withdraw
      })
    }
  }

  APPS.responseEventType(e)
  return
}
