import Vue from 'vue'
import Router from 'vue-router'
import MidUrl from '@/components/ToolMidUrl'
import TimeStamp from '@/components/ToolTimeStamp'
import IP from '@/components/ToolIP'
import Pinyin from '@/components/ToolPinyin'
import Domain from '@/components/ToolDomain'
import Tinyurl from '@/components/ToolTinyURL'
import Base64 from '@/components/ToolBase64'
import WeChatMarkdown from '@/components/ToolWeChatMarkdown'
import UpperLower from '@/components/ToolUpperLower'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'RootPath',
      components: {
        main:MidUrl
      }
    },
    {
      path: '/mid-url',
      name: 'mid-url',
      components: {
        main:MidUrl
      }
    },
    {
      path: '/timestamp',
      name: 'timestamp',
      components: {
        main:TimeStamp
      }
    },
    {
      path: '/ip',
      name: 'ip',
      components: {
        main:IP
      }
    },
    {
      path: '/pinyin',
      name: 'pinyin',
      components: {
        main:Pinyin
      }
    },
    {
      path: '/tinyurl',
      name: 'tinyurl',
      components: {
        main:Tinyurl
      }
    },
    {
      path: '/domain',
      name: 'domain',
      components: {
        main:Domain
      }
    },
    {
      path: '/base64',
      name: 'base64',
      components: {
        main:Base64
      }
    },
    {
      path: '/wechat-markdown',
      name: 'wechat-markdown',
      components: {
        main:WeChatMarkdown
      }
    },
    {
      path: '/upper-lower',
      name: 'upperLower',
      components: {
        main:UpperLower
      }
    }
  ]
})
