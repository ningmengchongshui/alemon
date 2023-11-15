/**
 * 阿柠檬消息类型
 */
export interface AMessage
  extends EventBase,
    UserBase,
    MsgBase,
    Serverbase,
    BotBase,
    ReplyBase {}

/**
 * 事件相关
 */
interface EventBase {
  /**
   * 平台 qq | kook | villa | ntqq | discord | one
   */
  platform: (typeof PlatformEnum)[number]
  /**
   * 事件类型
   */
  event: (typeof EventEnum)[number]
  /**
   * 消息类型
   */
  eventType: (typeof EventType)[number]
}

/**
 * 平台枚举
 */
export const PlatformEnum = [
  'qq',
  'kook',
  'villa',
  'ntqq',
  'wechat',
  'telegram',
  'dodo',
  'discord',
  'one'
] as const

/**
 * 消息枚举
 */
export const EventEnum = [
  /**
   * **********
   * 频道
   * **********
   */
  'GUILD', // 频道事件
  'GUILD_BOT', // 机器人进出事件
  'CHANNEL', // 子频道事件
  'GUILD_MEMBERS', // 成员进出
  /**
   * ***********
   * 论坛
   * *********
   */
  'FORUMS_THREAD', // 论坛主题
  'FORUMS_POST', // 论坛POST
  'FORUMS_REPLY', // 论坛评论
  /**
   * *********
   * 会话消息
   * ********
   * MESSAGES=message
   * =MESSAGE+DIRECT+PUBLIC
   */
  'MESSAGES',
  'message',
  'GUILD_MESSAGE_REACTIONS',
  /**
   * 互动事件监听
   */
  'INTERACTION',
  /**
   * ***********
   * 音频事件
   * ***********
   */
  'AUDIO_FREQUENCY', // 视频
  'AUDIO_MICROPHONE', // 麦克风
  /**
   * 审核消息
   */
  'MESSAGE_AUDIT'
] as const

/**
 * 消息判断
 */
export const EventType = ['CREATE', 'UPDATE', 'DELETE'] as const

/**
 * 机器人相关
 */
interface BotBase {
  bot: {
    id: string
    name: string
    avatar?: string
  }
}

/***
 * 服务器相关
 */
interface Serverbase {
  /**
   * 频道编号 | 服务器 | 群名
   */
  guild_id: string
  /**
   *  频道名 |  服务器名 | 群号
   */
  guild_name: string
  /**
   * 频道头像
   */
  guild_avatar: string
  /**
   * 子频道名 | 房间名 | 群名
   */
  channel_name: string
  /**
   * 子频道编号 | 房间编号 | 群号
   */
  channel_id: string
  /**
   * 是否是私域
   */
  isPrivate: boolean
  /**
   * 是否是群聊
   */
  isGroup: boolean
  /**
   * 公域 | 私域
   */
  boundaries: 'publick' | 'private'
  /**
   * 群聊 | 私聊
   */
  attribute: 'group' | 'single'
}

/**
 * 消息相关
 */
interface MsgBase {
  /**
   * 是否有@
   */
  at: boolean
  /**
   * 当有艾特时
   * 第一个非机器人用户信息
   * 不管是公域或私域
   */
  at_user: UserType | undefined
  /**
   * 艾特得到的uid即可
   */
  at_users: UserType[]
  /**
   * 消息编号
   */
  msg_id: string
  /**
   * 对话编号
   */
  open_id: string
  /**
   * 消息创建时间
   */
  send_at: number
  /**
   * 原始消息内容
   */
  msg_txt: string
  /**
   * 附件消息
   */
  attachments: any[]
  /**
   * 特殊消息
   */
  specials: any[]
  /**
   * 纯消息
   */
  msg: string
  /**
   * 快捷接口
   */
  segment: SegmentType
  /**
   * 是否是撤回
   */
  isRecall: boolean
}

/**
 * 用户相关
 */
interface UserBase {
  /**
   * 用户编号
   */
  user_id: string
  /**
   * 用户名
   */
  user_name: string
  /**
   * 用户头像
   */
  user_avatar: string
  /**
   * 是否是主人
   */
  isMaster: boolean
}

/**
 * 用户类型
 */
export interface UserType {
  /**
   * 用户编号
   */
  id: string
  /**
   * 用户名称
   */
  name: string
  /**
   * 用户头像地址
   */
  avatar: string
  /**
   * 是否是机器人
   */
  bot: boolean
}

/**
 * segment
 */
export interface SegmentType {
  /**
   * 艾特用户
   * @param uid
   */
  at(uid: string): string
  /**
   * 艾特全体
   */
  atAll(): string
  /**
   * @param dir 本地图片地址
   */
  img(dir: string): Buffer | false
  /**
   * 标注GET请求
   * @param rul
   */
  http(rul: string, body?: any): string
  /**
   * 艾特频道
   * @param channel_id
   */
  atChannel?(channel_id: string): string
  /**
   *
   * @param role_id 角色
   */
  role?(role_id: string): string
  /**
   *  点击后才显示
   * @param content 内容
   */
  spoiler?(content: string): string
  /**
   *
   * @param name  服务器表情名
   * @param id   服务器表情id
   */
  expression?(name: string, id: string): string
  /**
   * @param txt 链接文字
   * @param url 链接地址
   */
  link?(txt: string, url: string): string
  /**
   * 加粗
   * @param txt
   */
  Bold?(txt: string): string
  /**
   * 斜体
   * @param txt
   */
  italic?(txt: string): string
  /**
   * 加粗斜体
   */
  boldItalic?(txt: string): string
  /**
   * 删除线
   * @param txt
   */
  strikethrough?(txt: string): string
  /**
   * 代码块
   * @param txt
   */
  block?(txt: string): string
}

interface ReplyBase {
  /**
   * 消息发送机制
   * @param content 消息
   * @param select.quote 引用消息编号,默认无引用
   * @param select.withdraw 撤回消息,默认不撤回
   * 文件名会进行解析后得到正确文件后缀
   */
  reply(
    /**
     * 消息内容
     */
    content: Buffer | string | number | (Buffer | number | string)[],
    /**
     * 选择
     */
    select?: {
      /**
       * 引用消息编号,默认不引用
       */
      quote?: string
      /**
       * 撤回毫秒数,默认不撤回
       */
      withdraw?: number
      /**
       * 频道号
       */
      guild_id?: string
      /**
       * 子频道号
       */
      channel_id?: string
      /**
       *
       */
      msg_id?: string
    }
  ): Promise<any>

  /**
   * 控制器
   * @param select 选择绑定
   */
  Message(select?: {
    /**
     * 频道号
     */
    guild_id?: string
    /**
     * 子频道号
     */
    channel_id?: string
    /**
     * 消息编号
     */
    msg_id?: string
    /**
     * 消息创建时间
     */
    send_at?: number
  }): {
    /**
     * 回复消息
     * @param content
     */
    reply(
      content: Buffer | string | number | (Buffer | number | string)[]
    ): Promise<any>
    /**
     * 引用消息
     * @param content
     */
    quote(
      content: Buffer | string | number | (Buffer | number | string)[]
    ): Promise<any>
    /**
     * 撤回
     * @param time 撤回时间
     */
    withdraw(hideTip?: boolean): Promise<any>
    /**
     * 钉选---别野顶置--频道精华
     * @param cancel 取消
     */
    pinning(cancel?: boolean): Promise<any>
    /**
     * 喇叭--别野-精选--频道全局公告
     * @param cancel 取消
     */
    horn(cancel?: boolean): Promise<any>
    /**
     * 转发
     */
    forward(): Promise<any>
    /**
     * 表态
     * @param msg 表情
     * @param cancel 取消
     */
    emoji(msg: any[], cancel?: boolean): Promise<any>
    /**
     * 发送卡片
     */
    card(msg: CardType[]): Promise<any>
    /**
     * 该消息所有表态
     */
    allEmoji(): Promise<any>
    /**
     * 得到指定消息的 指定 表情 下的 所有用户
     * @param msg
     */
    byEmoji?(msg: any, options: any): Promise<any>
  }
}

/**
 * 卡片枚举
 */
export const CacrdEnum = [
  /**
   * qq频道
   */
  'qq_embed',
  /**
   * QQ频道
   */
  'qq_ark',
  /**
   * kook
   */
  'kook_card'
] as const

/**
 * 卡片类型
 */
export interface CardType {
  type: (typeof CacrdEnum)[number]
  card: any
}
