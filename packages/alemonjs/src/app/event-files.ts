import { dirname, join } from 'node:path'
import fs from 'node:fs'

const _dir = './src/apps'

type DbKey = {
  [key: string]: any
  dir: string
  path: string
}

/**
 *
 */
const values: DbKey[] = []

/**
 *
 * @returns
 */
export const getFilesValues = () => values

/**
 * 递归获取所有文件名以 res 开头的文件
 * @param dir 目录路径
 * @returns 文件路径数组
 */
const getFiles = (dir: string): string[] => {
  let results: string[] = []
  const list = fs.readdirSync(dir, { withFileTypes: true })
  list.forEach(item => {
    const fullPath = join(dir, item.name)
    if (item.isDirectory()) {
      results = results.concat(getFiles(fullPath))
    } else if (item.isFile() && item.name.startsWith('res')) {
      if (
        item.name.endsWith('.ts') ||
        item.name.endsWith('.js') ||
        item.name.endsWith('.jsx') ||
        item.name.endsWith('.tsx')
      ) {
        results.push(fullPath)
      }
    }
  })
  return results
}

/**
 * 加载文件
 */
export const loadFiles = async () => {
  const dir = join(process.cwd(), _dir)
  const files = getFiles(dir)
  // 读取config ，根据config对目录进行分类
  for (const item of files) {
    const dir = dirname(item)
    let v: any = {}
    try {
      const obj = await import(`file://${dir}/config.js`)
      v = obj?.default
    } catch (e) {
      // console.error(e)
    }
    // 保存目录地址和文件地址
    values.push({
      ...v,
      dir: dirname(item),
      path: item
    })
  }
}
