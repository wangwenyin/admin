// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import * as api from './api'
import * as $const from './constants'
import globalBus from './globaBus'
import './filter'
import './elementUIComponents'

Vue.prototype.$api = api
Vue.prototype.$const = $const
Vue.prototype.$globalBus = globalBus

Vue.config.productionTip = false

// 你可以使用 router.beforeEach 注册一个全局前置守卫：
router.beforeEach((to, from, next) => {
  if (to.meta.noAuth) {
    next()
  } else {
    if (globalBus.USER.id) {
      next()
    } else {
      globalBus.$api.getUser(data => {
        globalBus.USER = data.resource
        next()
      }, e => {
        next({
          path: '/login',
          query: {redirect: to.fullPath}
        })
      })
    }
  }
})

/* eslint-disable no-new */
const vm = new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

// 统一处理ajax数据返回
api.allHandle.handleSuccess = function (data, success, failure) {
  if (data.responseCode === '200') {
    success(data.resultParm)
  } else if (data.responseCode === '401') {
    globalBus.USER = {}
    vm.$router.push('/login')
  } else {
    if (failure) {
      failure(data)
    } else {
      alert(data.message + 'code:' + data.responseCode)
    }
  }
}

// 处理ajax最后的异常
api.allHandle.handleCatch = function (err) {
  console.error(err)
  if (err.toString().indexOf('404')) {
    vm.$notify({
      title: '404',
      message: '没有找到相应接口'
    })
  } else {
    alert('网络请求失败')
  }
}

/*
// 字符串
router.push('home')

// 对象
router.push({ path: 'home' })

// 命名的路由,/user/123
router.push({ name: 'user', params: { userId: 123 }})

// 带查询参数，变成 /register?plan=private
router.push({ path: 'register', query: { plan: 'private' }})
*/
  
  /*点击命名路由：
  <router-link :to="{ name: 'user', params: { userId: 123 }}">User</router-link>
  
  这跟代码调用 router.push() 是一回事：
router.push({ name: 'user', params: { userId: 123 }})
*/

/*
HTML5 History 模式

vue-router 默认 hash 模式 —— 使用 URL 的 hash 来模拟一个完整的 URL，于是当 URL 改变时，页面不会重新加载。

如果不想要很丑的 hash，我们可以用路由的 history 模式，这种模式充分利用 history.pushState API 来完成 URL 跳转而无须重新加载页面。

const router = new VueRouter({
  mode: 'history',
  routes: [...]
})
当你使用 history 模式时，URL 就像正常的 url，例如 http://yoursite.com/user/id，也好看！
  
  不过这种模式要玩好，还需要后台配置支持。因为我们的应用是个单页客户端应用，如果后台没有正确的配置，当用户在浏览器直接访问 http://oursite.com/user/id 就会返回 404，这就不好看了。
  
  所以呢，你要在服务端增加一个覆盖所有情况的候选资源：如果 URL 匹配不到任何静态资源，则应该返回同一个 index.html 页面，这个页面就是你 app 依赖的页面。
*/

/* vue中数据获取的两个时机：
导航完成之后获取：先完成导航，然后在接下来的组件生命周期钩子中获取数据。在数据获取期间显示『加载中』之类的指示。

导航完成之前获取：导航完成前，在路由进入的守卫中获取数据，在数据获取成功后执行导航。*/

/*
* router 路由实例：
* 方法
 
 router.beforeEach(guard)
 router.beforeResolve(guard) (2.5.0+): 此时异步组件已经加载完成
 router.afterEach(hook)
 
 增加全局的导航守卫。参考导航守卫。
 
 在 2.5.0+ 这三个方法都返回一个移除已注册的守卫/钩子的函数。
 
 router.push(location, onComplete?, onAbort?)
 
 router.replace(location, onComplete?, onAbort?)
 
 router.go(n)
 router.back()
 router.forward()
 
 动态的导航到一个新 URL。参考编程式导航。
 
 router.getMatchedComponents(location?)
 
 返回目标位置或是当前路由匹配的组件数组（是数组的定义/构造类，不是实例）。通常在服务端渲染的数据预加载时时候。
 
 router.resolve(location, current?, append?)
* */

/*
* route:路由信息对象(只读)
 
 一个 route object（路由信息对象） 表示当前激活的路由的状态信息，包含了当前 URL 解析得到的信息，还有 URL 匹配到的 route records（路由记录）。
 
 route object 是 immutable（不可变） 的，每次成功的导航后都会产生一个新的对象。
 
 route object 出现在多个地方:
 
 在组件内，即 this.$route
 
 在 $route 观察者回调内
 
 router.match(location) 的返回值
 
 导航守卫的参数：
 
 router.beforeEach((to, from, next) => {
 // to 和 from 都是 路由信息对象
 })
 scrollBehavior 方法的参数:
 const router = new VueRouter({
 scrollBehavior (to, from, savedPosition) {
 // to 和 from 都是 路由信息对象
 }
 })
 路由信息对象的属性
 
 $route.path
 
 类型: string
 
 字符串，对应当前路由的路径，总是解析为绝对路径，如 "/foo/bar"。
 
 $route.params
 
 类型: Object
 一个 key/value 对象，包含了 动态片段 和 全匹配片段，如果没有路由参数，就是一个空对象。
 
 $route.query
 
 类型: Object
 
 一个 key/value 对象，表示 URL 查询参数。例如，对于路径 /foo?user=1，则有 $route.query.user == 1，如果没有查询参数，则是个空对象。
 
 $route.hash
 
 类型: string
 
 当前路由的 hash 值 (带 #) ，如果没有 hash 值，则为空字符串。
 
 $route.fullPath
 
 类型: string
 
 完成解析后的 URL，包含查询参数和 hash 的完整路径。
 
 $route.matched
 
 类型: Array<RouteRecord>
 一个数组，包含当前路由的所有嵌套路径片段的 路由记录 。路由记录就是 routes 配置数组中的对象副本（还有在 children 数组）。
 
 const router = new VueRouter({
 routes: [
 // 下面的对象就是 route record
 { path: '/foo', component: Foo,
 children: [
 // 这也是个 route record
 { path: 'bar', component: Bar }
 ]
 }
 ]
 })
 当 URL 为 /foo/bar，$route.matched 将会是一个包含从上到下的所有对象（副本）。
 
 $route.name
 
 当前路由的名称，如果有的话。（查看 命名路由）
 */

/*
* keep-alive 是 Vue 内置的一个组件，可以使被包含的组件保留状态，或避免重新渲染。
* 可以设置include，exclude(组件标签内)或meta（路由配置内）属性来决定谁被缓存和不被缓存
* */

/*
Vue.js 允许你自定义过滤器，可被用于一些常见的文本格式化(即对一些值做些处理)。过滤器可以用在两个地方：双花括号插值和 v-bind 表达式。
可在组件内定义过滤器，也可在main.js全局定义
*/

/*
* 前端权限解决方案：https://github.com/OneWayTech/vue-auth-solution*/
