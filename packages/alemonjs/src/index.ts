import './global.js'
import { join } from 'path'
import { existsSync } from 'fs'
import { getConfig } from './config'
import { loadModule, moduleChildrenFiles } from './app/load.js'
import { DefineBotValue } from './global.js'
import { ErrorModule } from './app/local.utils.js'

/**
 * @param input
 */
export const start = async (input: string = 'lib/index.js') => {
  const cfg = getConfig()
  const login = cfg.argv?.login
  if (typeof login == 'boolean') return
  // 默认值
  let platform = '@alemonjs/gui'
  if (typeof login != 'undefined') {
    platform = `@alemonjs/${login}`
  } else {
    cfg.argv.login == 'gui'
  }
  if (typeof cfg.argv?.platform == 'string') {
    platform = cfg.argv?.platform
    cfg.argv.login = platform.replace(/^(@alemonjs\/|alemonjs-)/, '')
  }
  // module
  if (cfg.value && cfg.value?.apps && Array.isArray(cfg.value.apps)) {
    for (const app of cfg.value?.apps) {
      moduleChildrenFiles(app)
    }
  }
  //  input
  const run = async () => {
    // 不存在input
    if (!input) return
    // 路径
    const mainPath = join(process.cwd(), input)
    if (!existsSync(mainPath)) return
    // src/apps/**/*
    await loadModule(mainPath)
  }
  await run()
  try {
    const bot: {
      default: DefineBotValue
    } = await import(platform)
    if (!bot.default?._name || bot.default?._name != 'platform') {
      throw new Error('The platform name is not correct')
    }
    // 挂在全局
    global.alemonjs = bot?.default.callback()
  } catch (e) {
    ErrorModule(e)
  }
}

export * from './post.js'
