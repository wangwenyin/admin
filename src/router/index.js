import Vue from 'vue'
import Router from 'vue-router'
const login = resolve => require(['@/views/login'], resolve)
const main = resolve => require(['@/views/main'], resolve)
const carousel = resolve => require(['@/views/main/carousel'], resolve)
const commodity = resolve => require(['@/views/main/commodity'], resolve)
const commodityList = resolve => require(['@/views/main/commodity/list'], resolve)
const commodityEdit = resolve => require(['@/views/main/commodity/edit'], resolve)
const label = resolve => require(['@/views/main/label'], resolve)
const sort = resolve => require(['@/views/main/sort'], resolve)
const sortList = resolve => require(['@/views/main/sort/list'], resolve)
const sortEdit = resolve => require(['@/views/main/sort/edit'], resolve)
const member = resolve => require(['@/views/main/member'], resolve)
const effectiveUser = resolve => require(['@/views/main/member/effectiveUser'], resolve)
const attentionUser = resolve => require(['@/views/main/member/attentionUser'], resolve)
const approvalShowOrder = resolve => require(['@/views/main/member/approvalShowOrder'], resolve)
const notice = resolve => require(['@/views/main/notice'], resolve)
const noticeList = resolve => require(['@/views/main/notice/list'], resolve)
const systemNotice = resolve => require(['@/views/main/notice/systemNotice'], resolve)
const complainList = resolve => require(['@/views/main/notice/complainList'], resolve)
const winner = resolve => require(['@/views/main/winner'], resolve)
const operation = resolve => require(['@/views/main/operation'], resolve)
const latestDeal = resolve => require(['@/views/main/operation/latestDeal'], resolve)
const helpCenter = resolve => require(['@/views/main/operation/helpCenter'], resolve)
const robot = resolve => require(['@/views/main/robot'], resolve)
const robotUser = resolve => require(['@/views/main/robot/robotUser'], resolve)
const robotUserList = resolve => require(['@/views/main/robot/robotUser/list'], resolve)
const robotUserEdit = resolve => require(['@/views/main/robot/robotUser/edit'], resolve)
const robotItem = resolve => require(['@/views/main/robot/robotItem'], resolve)
const robotShowPrize = resolve => require(['@/views/main/robot/robotShowPrize'], resolve)
const system = resolve => require(['@/views/main/system'], resolve)
const app = resolve => require(['@/views/main/system/list'], resolve)
const activities = resolve => require(['@/views/main/activities'], resolve)
const turntable = resolve => require(['@/views/main/activities/turntable'], resolve)
const rechargeCard = resolve => require(['@/views/main/activities/rechargeCard'], resolve)
const compensation = resolve => require(['@/views/main/activities/compensation'], resolve)
const share = resolve => require(['@/views/main/activities/share'], resolve)
const home = resolve => require(['@/views/main/home'], resolve)
const homeUser = resolve => require(['@/views/main/home/homeUser'], resolve)
const homeItem = resolve => require(['@/views/main/home/homeItem'], resolve)
const homeOrder = resolve => require(['@/views/main/home/homeOrder'], resolve)
const statistics = resolve => require(['@/views/main/statistics'], resolve)
const showItems = resolve => require(['@/views/main/showItems'], resolve)
const activityStatistics = resolve => require(['@/views/main/activityStatistics'], resolve)
const benefitCardRegisterStatistics = resolve => require(['@/views/main/activityStatistics/benefitCardRegister'], resolve)
const benefitCardStatistics = resolve => require(['@/views/main/activityStatistics/benefitCard'], resolve)
const indemnityStatistics = resolve => require(['@/views/main/activityStatistics/indemnity'], resolve)
const turntableStatistics = resolve => require(['@/views/main/activityStatistics/turntable'], resolve)

Vue.use(Router)

export default new Router({
  base: '/1005admin/',
  routes: [
    {
      path: '/',
      redirect: '/main' // 路径不完整才会重定向
    },
    {
      path: '/login',
      name: 'login',
      component: login,
      meta: { // 路由元信息
        noAuth: true
      }
    },
    {
      path: '/main',
      component: main,
      meta: {
        cname: '首页'
      },
      children: [
        {
          path: '/',
          redirect: '/home'
        },
        {
          path: '/home',
          name: 'home',
          component: home,
          meta: {
            cname: ''
          }
        },
        {
          path: '/homeUser',
          name: 'homeUser',
          component: homeUser,
          meta: {
            cname: '渠道统计'
          }
        },
        {
          path: '/homeItem',
          name: 'homeItem',
          component: homeItem,
          meta: {
            cname: '商品统计'
          }
        },
        {
          path: '/homeOrder',
          name: 'homeOrder',
          component: homeOrder,
          meta: {
            cname: '订单统计'
          }
        },
        {
          path: '/carousel',
          name: 'carousel',
          component: carousel,
          meta: {
            cname: '轮播图设置'
          }
        },
        {
          path: '/commodity',
          component: commodity,
          meta: {
            cname: '商品管理'
          },
          children: [
            {
              path: '',
              redirect: '/commodityList'
            },
            {
              path: '/commodityList',
              name: 'commodityList',
              component: commodityList,
              meta: {
                cname: '商品列表'
              }
            },
            {
              path: '/commodityEdit',
              name: 'commodityEdit',
              component: commodityEdit,
              meta: {
                cname: '编辑商品'
              }
            }
          ]
        },
        {
          path: '/label',
          name: 'label',
          component: label,
          meta: {
            cname: '标签列表'
          }
        },
        {
          path: '/sort',
          component: sort,
          meta: {
            cname: '分类管理'
          },
          children: [
            {
              path: '',
              redirect: '/sortList'
            },
            {
              path: '/sortList',
              name: 'sortList',
              component: sortList,
              meta: {
                cname: '分类列表'
              }
            },
            {
              path: '/sortEdit',
              name: 'sortEdit',
              component: sortEdit,
              meta: {
                cname: '编辑分类'
              }
            }
          ]
        },
        {
          path: '/member',
          name: 'member',
          component: member,
          redirect: '/effectiveUser',
          meta: {
            cname: '会员管理'
          },
          children: [
            {
              path: '/effectiveUser',
              name: 'effectiveUser',
              component: effectiveUser,
              meta: {
                cname: '有效会员'
              }
            },
            {
              path: '/attentionUser',
              name: 'attentionUser',
              component: attentionUser,
              meta: {
                cname: '会员关注'
              }
            },
            {
              path: '/approvalShowOrder',
              name: 'approvalShowOrder',
              component: approvalShowOrder,
              meta: {
                cname: '晒单审核'
              }
            }
          ]
        },
        {
          path: '/activityStatistics',
          name: 'activityStatistics',
          component: activityStatistics,
          redirect: '/activityStatistics/benefitCardRegisterStatistics',
          meta: {
            cname: '活动统计'
          },
          children: [
            {
              path: 'benefitCardRegisterStatistics',
              name: 'benefitCardRegisterStatistics',
              component: benefitCardRegisterStatistics,
              meta: {
                cname: '新人充值优惠卡'
              }
            },
            {
              path: 'benefitCardStatistics',
              name: 'benefitCardStatistics',
              component: benefitCardStatistics,
              meta: {
                cname: '充值优惠卡'
              }
            },
            {
              path: 'indemnityStatistics',
              name: 'indemnityStatistics',
              component: indemnityStatistics,
              meta: {
                cname: '不中包赔'
              }
            },
            {
              path: 'turntableStatistics',
              name: 'turntableStatistics',
              component: turntableStatistics,
              meta: {
                cname: '大转盘'
              }
            },
            {
              path: 'share',
              name: 'share',
              component: share,
              meta: {
                cname: '分享'
              }
            }
          ]
        },
        {
          path: '/notice',
          component: notice,
          meta: {
            cname: '通知管理'
          },
          children: [
            {
              path: '',
              redirect: '/noticeList'
            },
            {
              path: '/noticeList',
              name: 'noticeList',
              component: noticeList,
              meta: {
                cname: '公告通知'
              }
            },
            {
              path: '/systemNotice',
              name: 'systemNotice',
              component: systemNotice,
              meta: {
                cname: '系统通知'
              }
            },
            {
              path: '/complainList',
              name: 'complainList',
              component: complainList,
              meta: {
                cname: '投诉建议'
              }
            }
          ]
        },{
          path: '/system',
          name: 'system',
          component: system,
          meta: {
            cname: '系统设置'
          }
        },{
          path: '/app',
          name: 'app',
          component: app,
          meta: {
            cname: '版本更新'
          }
        },
        {
          path: '/winner',
          name: 'winner',
          component: winner,
          meta: {
            cname: '中奖管理'
          }
        },
        {
          path: '/showItems',
          name: 'showItems',
          component: showItems,
          meta: {
            cname: '晒单管理'
          }
        },
        {
          path: '/statistics',
          name: 'statistics',
          component: statistics,
          meta: {
            cname: '充值统计'
          }
        },
        {
          path: '/operation',
          component: operation,
          meta: {
            cname: '运营管理'
          },
          children: [
            {
              path: '',
              redirect: '/latestDeal'
            },
            {
              path: '/latestDeal',
              name: 'latestDeal',
              component: latestDeal,
              meta: {
                cname: '最新成交'
              }
            },
            {
              path: '/helpCenter',
              name: 'helpCenter',
              component: helpCenter,
              meta: {
                cname: '帮助中心'
              }
            }
          ]
        },
        {
          path: '/activities',
          name: 'activities',
          component: activities,
          redirect: '/activities/turntable',
          meta: {
            cname: '活动管理'
          },
          children: [
            {
              path: 'turntable',
              name: 'turntable',
              component: turntable,
              meta: {
                cname: '大转盘'
              }
            },
            {
              path: 'rechargeCard',
              name: 'rechargeCard',
              component: rechargeCard,
              meta: {
                cname: '充值卡设置'
              }
            },
            {
              path: 'compensation',
              name: 'compensation',
              component: compensation,
              meta: {
                cname: '不中包赔'
              }
            }
          ]
        },
        {
          path: '/robot',
          name: 'robot',
          component: robot,
          meta: {
            cname: '机器人系统'
          },
          children: [
            {
              path: '/robotUser',
              component: robotUser,
              meta: {
                cname: '机器人用户管理'
              },
              children: [
                {
                  path: '/',
                  redirect: '/robotUserList'
                },
                {
                  path: '/robotUserList',
                  name: 'robotUserList',
                  component: robotUserList,
                  meta: {
                    cname: '机器人用户列表'
                  }
                },
                {
                  path: '/robotUserEdit',
                  name: 'robotUserEdit',
                  component: robotUserEdit,
                  meta: {
                    cname: '编辑机器人'
                  }
                }
              ]
            }
          ]
        },
        {
          path: '/robotItem',
          name: 'robotItem',
          component: robotItem,
          meta: {
            cname: '机器人商品设置列表'
          }
        },
        {
          path: '/robotShowPrize',
          name: 'robotShowPrize',
          component: robotShowPrize,
          meta: {
            cname: '机器人晒单'
          }
        }
      ]
    }
  ]
})
