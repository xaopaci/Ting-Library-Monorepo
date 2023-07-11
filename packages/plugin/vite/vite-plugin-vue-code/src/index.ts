import type { PluginOption } from 'vite'
import { createFilter } from './createFilter'
import transform from './transform'

const VitePluginVueCode = (): PluginOption => {
  /** filter out files which aren't  files */
  const filter = createFilter(/\.demo.vue$/)

  return {
    name: 'vite-plugin-md-page',
    // 该插件在 plugin-vue 插件之前执行，这样就可以直接解析到原模板文件
    enforce: 'pre',
    // Vite 读取并解析完用户自定义的配置文件（通常是 vite.config.js）后
    async configResolved() {
      // 传入参数并且
    },
    // 服务相关配置
    async configureServer() {},
    // 在构建前执行一些自定义操作
    async buildStart() {},
    // 代码转译，这个函数的功能类似于 `webpack` 的 `loader`
    async transform(code, id) {
      if (!filter(id)) return
      return transform(code)
    },
    // 热更新时触发
    async handleHotUpdate(ctx) {
      if (!filter(ctx.file)) return
      console.log('----------------------------------------------')
      const defaultRead = ctx.read
      ctx.read = async function () {
        console.log(await defaultRead())
        return await transform(await defaultRead())
      }
    }
  }
}
export default VitePluginVueCode
export { VitePluginVueCode }
