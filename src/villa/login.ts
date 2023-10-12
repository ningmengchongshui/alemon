import { setBotConfigByKey, getBotConfigByKey } from '../config/index.js'
/**
 * 登录配置
 * @param Bcf
 * @param val
 * @returns
 */
export async function checkRobotByVilla() {
  // 启动
  const config = getBotConfigByKey('villa')
  // 存在
  if (
    (config ?? '') !== '' &&
    (config.bot_id ?? '') !== '' &&
    (config.secret ?? '') !== ''
  ) {
    setBotConfigByKey('villa', config)
    return true
  }
  console.info('[LOGIN]', '-----------------------')
  console.info('[LOGIN]', 'villa配置加载失败~')
  process.exit()
}
