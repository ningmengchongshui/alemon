import { dirname, basename } from 'path'
import { fileURLToPath } from 'url'
import { setMessage, setAppArg } from './message.js'
import { setApp } from './app.js'

/**
 * 得到执行路径
 * @param url  import.meta.url
 * @returns AppName目录名
 */
export function getAppPath(url: string | URL) {
  return dirname(fileURLToPath(url)).replace(/\\/g, '/')
}

/**
 * 得到执行目录
 * @param {} url import.meta.url
 * @returns AppName目录名
 */
export function getAppName(url: string | URL) {
  return basename(getAppPath(url))
}

/**
 * 创建应用对象
 * @param url import.meta.url
 * @returns AppName目录名
 */
export function createApps(url: string) {
  return createApp(getAppName(url))
}

/**
 * 创建应用对象
 * @param AppName 目录名 getAppName(import.meta.url)
 * @returns 应用app对象
 */
export function createApp(AppName: string) {
  /**
   * 应用集
   */
  const apps: object = {}
  /**
   * 重名控制器
   */
  let acount = 0
  return {
    /**
     * 设置扩展参
     */
    setArg: (fnc: (...args: any[]) => any[] | Promise<any[]>) => {
      try {
        setAppArg(AppName, fnc)
        return true
      } catch (err) {
        console.error('APP setArg', err)
        return false
      }
    },
    /**
     * 重定义消息
     * @param fnc 回调函数
     * @returns 是否成功定义
     */
    setMessage: (fnc: (...args: any[]) => any) => {
      try {
        setMessage(AppName, fnc)
        return true
      } catch (err) {
        console.error('APP setMessage', err)
        return false
      }
    },
    /**
     * 创建应用
     * @param app 应用对象
     */
    component: (urlObject: object = {}) => {
      try {
        for (const item in urlObject) {
          /**
           * 如果该导出是class
           */
          if (urlObject[item].prototype) {
            if (!Object.prototype.hasOwnProperty.call(apps, item)) {
              /**
               * 不重名
               */
              apps[item] = urlObject[item]
              continue
            }
            const T = true
            while (T) {
              const keyName = `${item}$${acount}`
              if (!Object.prototype.hasOwnProperty.call(apps, keyName)) {
                /**
                 * 不重名
                 */
                apps[keyName] = urlObject[item]
                /**
                 * 重置为0
                 */
                acount = 0
                break
              } else {
                /**
                 * 加1
                 */
                acount++
              }
            }
          }
        }
        return true
      } catch (err) {
        console.error('APP component', err)
        return false
      }
    },
    /**
     * 挂起应用
     */
    mount: () => {
      try {
        setApp(AppName, apps)
      } catch (err) {
        console.error('APP mount', err)
      }
    }
  }
}
