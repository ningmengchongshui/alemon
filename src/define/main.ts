import { compilationTools } from 'alemon-rollup'
import PupOptions from '../default/pup.js'
import { AlemonOptions } from './types.js'
import { rebotMap } from './map.js'
import { nodeScripts } from './child_process.js'
import { ClientAPIByQQ as ClientByNTQQ } from '../ntqq/sdk/index.js'
import {
  createApp,
  loadInit,
  setBotConfigByKey,
  setLanchConfig,
  getPupPath,
  getBotConfigByKey,
  setAppRegex
} from '../index.js'
import { command } from './command.js'
import { AvailableIntentsEventsEnum } from 'qq-guild-bot'

// 设置ntqq独立鉴权路径
export const setAuthenticationByNtqq = ClientByNTQQ.setAuthentication

let appDir = 'application'

/**
 * 应用模块集成
 * @param AppName
 * @param name
 * @returns
 */
export function ApplicationTools(AppName: string, name = 'apps') {
  return compilationTools({
    aInput: `${appDir}/${AppName}/${name}/**/*.ts`,
    aOutput: `${appDir}/${AppName}/apps.js`
  })
}

let OptionsCache: AlemonOptions

/**
 * 得到载入配置
 * @returns
 */
export function getAlemonConfig() {
  return OptionsCache
}

/**
 * 机器人配置
 * @param Options
 */
export async function defineAlemonConfig(Options?: AlemonOptions) {
  if (!Options) return
  OptionsCache = Options

  /**
   * *******
   * pup配置
   * *******
   */
  const pCig = { ...PupOptions, ...getPupPath() }
  // 设置旧的值
  setBotConfigByKey('puppeteer', pCig)
  if (Options?.puppeteer) {
    // 存在 替换新的值
    setBotConfigByKey('puppeteer', Options?.puppeteer)
  }
  const pData = getBotConfigByKey('puppeteer')
  await setLanchConfig(pData)
  /**
   * *********
   * mysql配置
   * *********
   */
  if (Options?.mysql) {
    setBotConfigByKey('mysql', Options.mysql)
  }
  /**
   * *********
   * redis配置
   * *********
   */
  if (Options?.redis) {
    setBotConfigByKey('redis', Options.redis)
  }
  /**
   * *********
   * serer配置
   * *********
   */
  if (Options?.server) {
    setBotConfigByKey('server', Options.server)
  }
  /**
   * **********
   * 启动转换器
   * **********
   */
  const arr: string[] = []
  /**
   * *********
   * 登录机器人
   * *********
   */
  if (Options?.login) {
    if (Options.login?.discord) {
      // 自定义覆盖
      setBotConfigByKey('discord', Options.login.discord)
    }
    if (Options.login?.qq) {
      // 开启私域
      if (Options.login?.qq?.isPrivate) {
        setBotConfigByKey('qq', {
          intents: [
            // 基础事件
            AvailableIntentsEventsEnum.GUILDS, //频道进出
            AvailableIntentsEventsEnum.GUILD_MEMBERS, //成员资料
            AvailableIntentsEventsEnum.DIRECT_MESSAGE, //私信
            // 需申请的
            AvailableIntentsEventsEnum.AUDIO_ACTION, //音频
            AvailableIntentsEventsEnum.MESSAGE_AUDIT, //消息审核
            AvailableIntentsEventsEnum.INTERACTION, //互动事件
            AvailableIntentsEventsEnum.GUILD_MESSAGE_REACTIONS, //表情表态
            // 私域特有
            AvailableIntentsEventsEnum.GUILD_MESSAGES, //私域事件
            AvailableIntentsEventsEnum.FORUMS_EVENT //私域论坛
          ]
        })
      } else {
        setBotConfigByKey('qq', {
          intents: [
            // 基础事件
            AvailableIntentsEventsEnum.GUILDS, //频道进出
            AvailableIntentsEventsEnum.GUILD_MEMBERS, //成员资料
            AvailableIntentsEventsEnum.DIRECT_MESSAGE, //私信
            // 公域特有
            AvailableIntentsEventsEnum.PUBLIC_GUILD_MESSAGES //公域事件
          ]
        })
      }
      // 自定义覆盖
      setBotConfigByKey('qq', Options.login.qq)
    }
    if (Options.login?.ntqq) {
      // 自定义覆盖
      setBotConfigByKey('ntqq', Options.login.ntqq)
    }
    if (Options.login?.kook) {
      // 自定义覆盖
      setBotConfigByKey('kook', Options.login.kook)
    }
    if (Options.login?.villa) {
      // 自定义覆盖
      setBotConfigByKey('villa', Options.login.villa)
    }
    for (const item in Options.login) {
      if (arr.indexOf(item) != -1) continue
      if (!rebotMap[item]) continue
      arr.push(item)
      await rebotMap[item]()
    }
  }
  /**
   * ********
   * 登录提示
   * ********
   */
  if (!Options?.login || Object.keys(Options?.login ?? {}).length == 0) {
    console.info('[LOGIN] 无登录配置')
  }
  /**
   * ************
   * 迟缓插件加载
   * ************
   */
  let mount = false
  if (Options?.app?.component || Options?.app?.module) {
    mount = true
  }
  const address = Options?.plugin?.directory ?? 'application'
  appDir = address
  /**
   * ************
   * 设置扫描规则
   * ***********
   */
  if (Options?.plugin?.RegexOpen || Options?.plugin?.RegexClose) {
    setAppRegex({
      RegexOpen: Options?.plugin?.RegexOpen,
      RegexClose: Options?.plugin?.RegexClose
    })
  }
  /**
   * ************
   * 扫描插件
   * ************
   */
  if (Options?.plugin?.init) {
    await loadInit({
      mount: mount,
      address: address == undefined ? '/application' : `/${address}`
    })
  }
  /**
   * ************
   * 编译独立插件
   * ************
   */
  if (mount) {
    const app = createApp(Options?.app?.name ?? 'bot')
    if (Options?.app?.regJSon?.address) {
      app.setHelp(Options?.app?.regJSon?.address ?? '/public/defset')
    }
    if (Options?.app?.module) {
      const word = await compilationTools({
        aInput: Options?.app?.module?.input ?? 'src/apps/**/*.ts',
        aOutput: Options?.app?.module?.input ?? '.apps/index.js'
      })
      app.component(word)
    }
    if (Options?.app?.component) {
      for await (const item of Options.app.component) {
        app.component(item)
      }
    }
    app.mount('#app')
  }

  setTimeout(async () => {
    /**
     * **********
     * 附加执行
     * **********
     */
    if (Options?.command) {
      for await (const item of Options.command) {
        if (item?.cmd) {
          // 默认同步
          await command(item?.cess ?? 'execSync', item?.cmd)
        }
      }
    }
    /**
     * ***************
     * 附加脚本
     * ***************
     */
    if (Options?.scripts) {
      for await (const item of Options.scripts) {
        const name = item?.name ?? 'node'
        nodeScripts(name, item?.file, item?.ars ?? [])
      }
    }
  }, Options?.waitingTime ?? 3000)

  return
}
