import { defineAlemonConfig } from './src/index.js'
/**
 * **********
 * 配置式启动
 * **********
 */
export default defineAlemonConfig({
  login: {
    qq: {
      appID: '',
      token: ''
    }
  },
  app: {
    module: {}
  }
})
