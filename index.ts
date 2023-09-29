import { createBot } from './src/index.js'
import { createApp } from 'alemon'
import config from './config.js'

// 创建机器人
const AlemonBot = await createBot()

// 创建插件
const { compilationTools } = await AlemonBot({
  mount: true
})

// 加载模块
const example = await compilationTools(config)

// 创建应用
const app = createApp('example')
// 设置模块
app.component(example)
// 挂载
app.mount('#app')
