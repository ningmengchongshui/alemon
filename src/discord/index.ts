import { getIntents, createClient, setBotConfig } from './sdk/index.js'
import { conversation } from './alemon/conversation.js'
import { checkRobotByDISCORD } from './login.js'
import { getBotConfigByKey } from '../config/index.js'
export async function createAlemonByDISCORD() {
  if (
    await checkRobotByDISCORD().catch(err => {
      console.error(err)
      return false
    })
  ) {
    // 读取配置
    const cfg = getBotConfigByKey('discord')
    setBotConfig('token', cfg.token)
    setBotConfig('intent', getIntents(cfg.intent))
    // 启动监听
    createClient(conversation, cfg?.shard)
    return true
  }
  return false
}
export { ClientDISOCRD } from './sdk/index.js'
