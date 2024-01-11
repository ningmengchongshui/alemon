import {
  APPS,
  type EventEnum,
  type TypingEnum,
  type MessageBingdingOption
} from '../../../core/index.js'
import { segmentVILLA } from '../segment.js'
import { ABotConfig } from '../../../config/index.js'
import { replyController } from '../reply.js'
import { Controllers } from '../controller.js'

/**
 * 审核事件
 * @param event 回调数据
 */
export async function MESSAGE_AUDIT(event: {
  // 机器人相关信息
  robot: {
    template: {
      id: string
      name: string
      desc: string
      icon: string
      customSettings: any[]
      commands: Array<{
        name: string // 指令
        desc: string // 指令说明
      }>
    }
    villaId: number // 事件所属的大别野 id
  }
  type: number // 消息类型
  extendData: {
    auditCallback: {
      auditId: string // 审核事件 id
      botTplId: string // 机器人 id
      villaId: number // 大别野 id
      roomId: number // 房间 id（和审核接口调用方传入的值一致）
      userId: number // 用户 id（和审核接口调用方传入的值一致）
      passThrough: string // 透传数据（和审核接口调用方传入的值一致）
      auditResult: number // 审核结果，0作兼容，1审核通过，2审核驳回
    }
  }
  createdAt: number // 创建事件编号
  id: string // 消息编号
  sendAt: number // 发送事件编号
}) {
  const AuditCallback = event.extendData.auditCallback
  const masterID = ABotConfig.get('villa').masterID

  const msg_id = `${AuditCallback.auditId}.${event.sendAt}`

  /**
   * 制作e消息对象
   */
  const e = {
    platform: 'villa',
    event: 'AUDIT' as (typeof EventEnum)[number],
    typing: 'CREATE' as (typeof TypingEnum)[number],
    boundaries: 'publick' as 'publick' | 'private',
    attribute: 'group' as 'group' | 'single',
    bot: {
      id: event.robot.template.id,
      name: event.robot.template.name,
      avatar: event.robot.template.icon
    },
    isMaster: Array.isArray(masterID)
      ? masterID.includes(String(AuditCallback.userId))
      : masterID == String(AuditCallback.userId),
    guild_id: String(AuditCallback.villaId),
    guild_name: '',
    guild_avatar: '',
    channel_name: '',
    channel_id: String(AuditCallback.roomId),
    attachments: [],
    specials: [],
    //
    at: false,
    at_user: undefined,
    at_users: [],
    msg: '',
    msg_id: msg_id,
    msg_txt: '',
    quote: '',
    open_id: '',

    //
    user_id: String(AuditCallback.userId),
    user_name: '', // dodo 可权限获得
    user_avatar: '', // dodo 可权限获得
    //
    send_at: event.sendAt,
    segment: segmentVILLA,
    /**
     * 消息回复
     * @param msg
     * @param select
     * @returns
     */
    reply: async (
      msg: Buffer | string | number | (Buffer | number | string)[],
      select?: MessageBingdingOption
    ): Promise<any> => {
      if (select?.open_id && select?.open_id != '') {
        console.error('VILLA 无私信')
        return false
      }
      const villaId = select?.guild_id ?? AuditCallback.villaId
      const roomId = select?.channel_id ?? AuditCallback.roomId
      return await replyController(villaId, roomId, msg, {
        quote: select?.quote
      })
    },
    Controllers
  }

  APPS.responseEventType(e)
  return
}
