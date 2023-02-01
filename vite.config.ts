import { ConfigEnv, UserConfigExport, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

//获取环境变量
const getEnv = (mode,env)=> {
  return loadEnv(mode, process.cwd())[env];
}

const pathResolve = (dir: string): any => {
  return resolve(__dirname, ".", dir)
}

const alias: Record<string, string> = {
  '@': pathResolve("src")
}

// https://vitejs.dev/config/
export default ({ command,mode }: ConfigEnv): UserConfigExport => {
  return {
    resolve: {
      alias
    },
    server: {
      port: Number(getEnv(mode, "VITE_PORT")) || 8080,
      host: '0.0.0.0', //127.0.0.1
      open: true,
      proxy: { // 代理配置
        '/dev': 'https://www.fastmock.site/mock/48cab8545e64d93ff9ba66a87ad04f6b/'
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'echarts': ['echarts']
          }
        },
      },
    },
    base:getEnv(mode, "VITE_PAGE_URL") || '/',
    // base:'/admin/',
    plugins: [
      vue(),
    ]
  };
}
