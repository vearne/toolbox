import Vue from 'vue'
import Router from 'vue-router'
import MidUrl from '@/components/ToolMidUrl'
import TimeStamp from '@/components/ToolTimeStamp'
import IP from '@/components/ToolIP'
import Pinyin from '@/components/ToolPinyin'
import Domain from '@/components/ToolDomain'

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
      path: '/domain',
      name: 'domain',
      components: {
        main:Domain
      }
    }
  ]
})
