/**
 * 客户端配置
 */
export interface ServerOptions {
  /**
   * 协议
   */
  http?: string
  /**
   * 地址
   */
  ip?: string
  /**
   * 端口
   */
  port?: number
  /**
   * 图片随机度
   */
  imgSize?: number
  /**
   * 挂载路由
   */
  imgRouter?: string
  /**
   * 本地缓存地址
   */
  imgDir?: string
  /**
   * 当前服务状态
   */
  state?: boolean
  /**
   * 定时清除是否开启
   * 默认关闭
   */
  clear?: boolean
}
