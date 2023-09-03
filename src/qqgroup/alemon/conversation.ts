import { AMessage, UserType, EventEnum, EventType, PlatformEnum, InstructionMatching } from 'alemon'
import { getBotConfigQQGroup } from '../config.js'
import { GroupEventType } from './types.js'
import { segmentQQGroup } from './segment.js'
import { getBotMsgByQQGroup } from './bot.js'
// icqq
import { segmentIcqq } from '../icqq/segment.js'
import { getUserAvatar } from '../icqq/user.js'

/**
 * 为了能够让插件拿到实际的数据包，而为almeon
 *
 * 需要增加字段eventData ?
 */

/**
 * 回复和撤回分两种
 *
 * 一种是直接撤回 一种是指定撤回
 */

function parseMsg(msg) {
  const regex = /<@(\d+)>/g // 匹配 <@xxx> 格式的字符串
  let match
  let lastIndex = 0
  const arr = []

  while ((match = regex.exec(msg)) !== null) {
    const startIndex = match.index
    const endIndex = regex.lastIndex

    // 提取 <@xxx> 前的部分
    const segmentBefore = msg.slice(lastIndex, startIndex).trim()
    if (segmentBefore.length > 0) {
      arr.push(segmentBefore)
    }

    // 提取 <@xxx> 中的 xxx
    const userId = match[1]

    // 根据 userId 调用 segmentIcqq.at() API，生成 @柠檬冲水 表达式，并添加到数组中
    const segmentAt = segmentIcqq.at(userId)
    arr.push(segmentAt)

    lastIndex = endIndex
  }

  // 提取最后一个 <@xxx> 后的部分
  const segmentAfter = msg.slice(lastIndex).trim()
  if (segmentAfter.length > 0) {
    arr.push(segmentAfter)
  }

  return arr
}

/**
 * 响应普通消息
 * @param event
 * @returns
 */
export async function callBack(event: GroupEventType) {
  // 消息监听
  // console.log('message=', event)
  /**
   * 重点关注字段
   * atall
   */
  const bot = getBotMsgByQQGroup()
  /**
   * 艾特消息处理
   */
  const at_users: UserType[] = []
  /**
   * 艾特处理
   */
  let at = false
  /**
   * 清除 @ 相关
   */
  let msg = ''
  /**
   *
   */
  for (const item of event.message) {
    if (item.type == 'text') {
      msg = item.text
    }
    if (item.type == 'image') {
      // 把图片地址当成消息
      msg = item.url
    }
    if (item.type == 'json') {
      msg = item.data
    }
    if (item.type == 'at') {
      // 如果存在 atme 而且 id与qq相等 自己就是bot
      let isBot = false
      if (item.qq == bot.id && event.message_type == 'group' && event.atme) {
        isBot = true
      }
      at_users.push({
        id: String(item.qq),
        name: msg.replace('@', '').trim(),
        avatar: getUserAvatar(item.qq),
        // qq 如何判断是否是 bot 只能靠主人主动收集,就把对方视为bot
        // 或者说,主人用指令添加bot标记
        bot: isBot
      })
    }
  }

  let at_user: UserType | undefined = undefined
  if (at_users.some(item => item.bot != true)) {
    at = true
  }
  if (at) {
    at_user = at_users.find(item => item.bot != true)
  }

  /**
   * 主人处理
   */
  let isMaster = false

  /**
   * 得到登录配置
   */
  const cfg = getBotConfigQQGroup()

  /**
   * 检查身份
   */
  if (event.sender.user_id == cfg.masterID) {
    /**
     * 是主人
     */
    isMaster = true
  }

  let group_id = 0
  if (event.message_type == 'group') {
    // console.log(event.group_name)
    group_id = event.group_id
  }

  /**
   * 构造e对象
   */
  const e = {
    platform: PlatformEnum.qqgroup,
    /**
     * 机器人信息  tudo
     */
    bot,
    /**
     * 频道
     */
    guild_id: String(group_id),
    channel_id: String(group_id),
    isPrivate: true,
    isRecall: false,
    isMaster: isMaster,
    isGroup: event.message_type == 'group' ? true : false,
    /**
     * 消息事件
     */
    event: EventEnum.message, // message
    eventType: EventType.CREATE,
    msg_txt: msg, // icqq做了处理 无法重新扁平化
    msg_id: event.message_id,
    msg: msg,
    /**
     * 艾特消息
     */
    at,
    at_user,
    at_users,
    msg_create_time: new Date().getTime(),
    /**
     * 用户
     */
    user_id: String(event.sender.user_id),
    user_name: event.sender.nickname,
    user_avatar: getUserAvatar(event.sender.user_id),
    /**
     * 模板函数
     */
    segment: segmentQQGroup,
    /**
     * 消息发送机制
     * @param content 消息内容
     * @param img 额外消息 可选
     */
    reply: async (msg?: string | string[] | Buffer, img?: Buffer): Promise<boolean> => {
      if (Buffer.isBuffer(msg)) {
        try {
          event.reply(segmentIcqq.image(msg))
          return true
        } catch (err) {
          console.error(err)
          return false
        }
      }
      const content = Array.isArray(msg) ? msg.join('') : typeof msg === 'string' ? msg : undefined
      if (Buffer.isBuffer(img)) {
        try {
          event.reply([content, segmentIcqq.image(img)])
          return true
        } catch (err) {
          console.error(err)
          return false
        }
      }
      try {
        event.reply(parseMsg(content), true)
        return true
      } catch {
        return false
      }
    },
    replyByMid: async (mid: string, msg?: string | string[] | Buffer, img?: Buffer) => {
      try {
        if (Buffer.isBuffer(msg)) {
          try {
            event.reply(segmentIcqq.image(msg), true)
            return true
          } catch (err) {
            console.error(err)
            return false
          }
        }
        const content = Array.isArray(msg)
          ? msg.join('')
          : typeof msg === 'string'
          ? msg
          : undefined
        if (Buffer.isBuffer(img)) {
          try {
            event.reply([content, segmentIcqq.image(img)], true)
            return true
          } catch (err) {
            console.error(err)
            return false
          }
        }
        try {
          event.reply(parseMsg(content), true)
          return true
        } catch {
          return false
        }
      } catch {
        return false
      }
    },
    replyCard: (obj: any) => {
      event.reply(segmentIcqq.json(obj))
    }
  }

  /**
   * 消息处理
   */
  await InstructionMatching(e as AMessage)
    .then(() => {
      console.info(`\n[${e.channel_id}] [${e.user_name}] [${true}] ${e.msg_txt}`)
      return true
    })
    .catch((err: any) => {
      console.error(err)
      console.info(`\n[${e.channel_id}] [${e.user_name}] [${false}] ${e.msg_txt}`)
      return false
    })

  return false
}

/**
 * 响应群消息
 */
