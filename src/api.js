import Vue from 'vue'
// import globalBus from './globaBus'
import axios from 'axios'
import querystring from 'querystring'
import { hexMd5 } from '../static/js/md5' // MD5加密
import { Promise } from 'es6-promise'
window.Promise = Promise
Vue.prototype.$ajax = axios // 挂载到全局
axios.defaults.baseURL = 'http://192.168.30.87:8080'
window.basePath = 'http://192.168.30.87:8080'
axios.defaults.withCredentials = true // 跨域带sension
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
axios.defaults.transformRequest = function (data) {
  return querystring.stringify(data)
}
axios.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    return Promise.reject(error)   // 返回接口返回的错误信息
  })

// 文件操作
export const file = {
  see: function (fid) {
    if (fid) {
      return axios.defaults.baseURL + '/file/see?fid=' + fid
    } else {
      return ''
    }
  },
  download: function (fid) {
    if (fid) {
      return axios.defaults.baseURL + '/file/download?fid=' + fid
    } else {
      return ''
    }
  },
  excel: function () {
    return axios.defaults.baseURL + '/admin/item/heat/excel'
  }
}

// 图片上传
export const uploadImage = (data, success, failure) => {
  let conf = {
    url: '/file/uploadImg',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    transformRequest: function (data) {
      return data
    }
  }
  ajax(conf, success, failure)
}

/* **************************************************************
 * 登录
 * **************************************************************/
/**
 * 登录
 * @param data
 * @param success
 * @param failure
 */
export const login = (data, success, failure) => {
  let conf = {
    url: '/admin/login',
    method: 'post',
    data: {
      identifier: data.identifier,
      password: data.password ? hexMd5(data.password) : '',
      validate: data.validate
    }
  }
  ajax(conf, success, failure)
}

/**
 * 退出
 * @param success
 * @param failure
 */
export const loginOut = (success, failure) => {
  let conf = {
    url: '/loginout',
    method: 'get'
  }
  ajax(conf, success, failure)
}

/**
 * 获取登录信息
 */
export const getUser = (success, failure) => {
  let conf = {
    url: '/authority/admin',
    method: 'get'
  }
  ajax(conf, success, failure)
}

/**
 * 检测账号是否已经被注册
 */
export const detection = (data, success, failure) => {
  let conf = {
    url: '/detection',
    method: 'get',
    params: {
      identifier: data.identifier,
      loginType: data.loginType
    }
  }
  ajax(conf, success, failure)
}

/**
 * 轮播图列表
 */
export const findCarousel = (data, success, failure) => {
  let conf = {
    url: '/admin/carousel',
    method: 'get',
    params: {
      pageNo: data.pageNo,
      pageSize: data.pageSize
    }
  }
  ajax(conf, success, failure)
}

/**
 * 添加轮播图
 */
export const addCarousel = (data, success, failure) => {
  let conf = {
    url: '/admin/carousel',
    method: 'post',
    data: {
      carouselFigureBean: data ? JSON.stringify(data) : null
    }
  }
  ajax(conf, success, failure)
}
/**
 * 分页查看投诉列表
 */
export const findComplain = (data, success, failure) => {
  let conf = {
    url: '/admin/complain/notice',
    method: 'get',
    params: {
      pageNo: data.pageNo,
      pageSize: data.pageSize
    }
  }
  ajax(conf, success, failure)
}
/**
 * 处理投诉反馈
 */
export const updateComplain = (data, success, failure) => {
  let conf = {
    url: '/admin/complain/sendBack',
    method: 'post',
    data: {
      notice: data ? JSON.stringify(data) : ''
    }
  }
  ajax(conf, success, failure)
}
/**
 * 修改轮播图
 */
export const updateCarousel = (data, success, failure) => {
  let conf = {
    url: '/admin/carousel',
    method: 'post',
    params: {
      _method: 'put'
    },
    data: {
      carouselFigureBean: data ? JSON.stringify(data) : null
    }
  }
  ajax(conf, success, failure)
}

/**
 * 启用/禁用轮播图
 */
export const updateCarouselEnable = (carouselId, success, failure) => {
  let conf = {
    url: '/admin/carousel/start',
    method: 'post',
    params: {
      _method: 'put'
    },
    data: {
      carouselId: carouselId
    }
  }
  ajax(conf, success, failure)
}

/**
 * 删除轮播图
 */
export const deleteCarousel = (carouselId, success, failure) => {
  let conf = {
    url: '/admin/carousel',
    method: 'post',
    params: {
      _method: 'delete'
    },
    data: {
      id: carouselId
    }
  }
  ajax(conf, success, failure)
}

/**
 * 查询商品
 */
export const findCommoditys = (data, success, failure) => {
  let conf = {
    url: '/admin/items',
    method: 'get',
    params: {
      name: data.name,
      item_type: data.item_type,
      disable: data.disable,
      plus_code: data.plus_code,
      runningProgram: data.running_program,
      pageNo: data.pageNo,
      pageSize: data.pageSize
    }
  }
  ajax(conf, success, failure)
}

/**
 * 查询单个商品
 */
export const getCommodity = (itemId, success, failure) => {
  let conf = {
    url: '/admin/item',
    method: 'get',
    params: {
      itemId: itemId
    }
  }
  ajax(conf, success, failure)
}

/**
 * 添加商品
 */
export const addCommodity = (item, success, failure) => {
  let conf = {
    url: '/admin/item',
    method: 'post',
    params: {
      itemBean: item ? JSON.stringify(item) : null
    }
  }
  ajax(conf, success, failure)
}
/**
 * 强制删除商品
 */
export const superDeleteCommodity = (itemId, success, failure) => {
  let conf = {
    url: '/admin/forced/item',
    method: 'post',
    params: {
      _method: 'delete'
    },
    data: {
      itemId: itemId
    }
  }
  ajax(conf, success, failure)
}
/**
 * 删除商品
 */
export const deleteCommodity = (itemId, success, failure) => {
  let conf = {
    url: '/admin/item',
    method: 'post',
    params: {
      _method: 'delete'
    },
    data: {
      itemId: itemId
    }
  }
  ajax(conf, success, failure)
}

/**
 * 更新商品
 */
export const updateCommodity = (item, success, failure) => {
  let conf = {
    url: '/admin/item',
    method: 'post',
    params: {
      _method: 'put'
    },
    data: {
      itemBean: item ? JSON.stringify(item) : null
    }
  }
  ajax(conf, success, failure)
}

/**
 * 禁用/启用商品
 */
export const updateCommodityEnable = (itemId, success, failure) => {
  let conf = {
    url: '/admin/item/state',
    method: 'post',
    params: {
      _method: 'put'
    },
    data: {
      itemId: itemId
    }
  }
  ajax(conf, success, failure)
}
/**
 * 是否新手商品
 */
export const updateNoviceEnable = (itemId, success, failure) => {
  let conf = {
    url: '/admin/item/novice',
    method: 'post',
    params: {
      _method: 'put'
    },
    data: {
      itemId: itemId
    }
  }
  ajax(conf, success, failure)
}
/**
 * 是否前端展示商品
 */
export const updateCommodityShowEnable = (itemId, success, failure) => {
  let conf = {
    url: '/admin/item/show',
    method: 'post',
    params: {
      _method: 'put'
    },
    data: {
      itemId: itemId
    }
  }
  ajax(conf, success, failure)
}

/**
 * 获取机器人分类
 */
export const getRuningProgram = (success, failure) => {
  let conf = {
    url: '/admin/running/program/type',
    method: 'get'
  }
  ajax(conf, success, failure)
}

/**
 * 获取标签列表
 */
export const findLabels = (data, success, failure) => {
  let conf = {
    url: '/admin/labels',
    method: 'get',
    params: {
      pageNo: data.pageNo,
      pageSize: data.pageSize
    }
  }
  ajax(conf, success, failure)
}

/**
 * 获取单个标签
 */
export const getLabel = (id, success, failure) => {
  let conf = {
    url: '/admin/label',
    method: 'get',
    params: {
      labelId: id
    }
  }
  ajax(conf, success, failure)
}

/**
 * 添加标签
 */
export const addLabel = (data, success, failure) => {
  let conf = {
    url: '/admin/label',
    method: 'post',
    data: {
      labelBean: data ? JSON.stringify(data) : null
    }
  }
  ajax(conf, success, failure)
}

/**
 * 修改标签
 */
export const updateLabel = (data, success, failure) => {
  let conf = {
    url: '/admin/label',
    method: 'post',
    params: {
      _method: 'put'
    },
    data: {
      labelBean: data ? JSON.stringify(data) : null
    }
  }
  ajax(conf, success, failure)
}

/**
 * 删除标签
 */
export const deleteLabel = (id, success, failure) => {
  let conf = {
    url: '/admin/label',
    method: 'post',
    params: {
      _method: 'delete'
    },
    data: {
      labelId: id
    }
  }
  ajax(conf, success, failure)
}
/**
 * 更新标签禁用状态
 */
export const updateLabelEnable = (id, success, failure) => {
  let conf = {
    url: '/admin/label/state',
    method: 'post',
    params: {
      _method: 'put'
    },
    data: {
      labelId: id
    }
  }
  ajax(conf, success, failure)
}

/**
 * 获取分类列表
 */
export const findSorts = (data, success, failure) => {
  let conf = {
    url: '/admin/sorts',
    method: 'get',
    params: {
      pageNo: data.pageNo,
      pageSize: data.pageSize
    }
  }
  ajax(conf, success, failure)
}

/**
 * 获取单个分类
 */
export const getSort = (id, success, failure) => {
  let conf = {
    url: '/admin/sort',
    method: 'get',
    params: {
      sortId: id
    }
  }
  ajax(conf, success, failure)
}

/**
 * 添加分类
 */
export const addSort = (data, success, failure) => {
  let conf = {
    url: '/admin/sort',
    method: 'post',
    data: {
      sortBean: data ? JSON.stringify(data) : null
    }
  }
  ajax(conf, success, failure)
}

/**
 * 修改分类
 */
export const updateSort = (data, success, failure) => {
  let conf = {
    url: '/admin/sort',
    method: 'post',
    params: {
      _method: 'put'
    },
    data: {
      sortBean: data ? JSON.stringify(data) : null
    }
  }
  ajax(conf, success, failure)
}

/**
 * 删除分类
 */
export const deleteSort = (id, success, failure) => {
  let conf = {
    url: '/admin/sort',
    method: 'post',
    params: {
      _method: 'delete'
    },
    data: {
      sortId: id
    }
  }
  ajax(conf, success, failure)
}
/**
 * 更新商品分类禁用状态
 */
export const updateSortEnable = (id, success, failure) => {
  let conf = {
    url: '/admin/sort/state',
    method: 'post',
    params: {
      _method: 'put'
    },
    data: {
      sortId: id
    }
  }
  ajax(conf, success, failure)
}

/**
 * 获取会员列表
 */
export const findUsers = (data, success, failure) => {
  let conf = {
    url: '/admin/users',
    method: 'get',
    params: {
      name: data.name,
      phone: data.phone,
      disable: data.disable,
      pageNo: data.pageNo,
      pageSize: data.pageSize
    }
  }
  ajax(conf, success, failure)
}

/**
 * 获取会员收货地址列表
 */
export const findUsersAddress = (id, success, failure) => {
  let conf = {
    url: '/admin/user/address',
    method: 'get',
    params: {
      userId: id
    }
  }
  ajax(conf, success, failure)
}

/**
 * 修改自身密码
 */
export const updatePwd = (data, success, failure) => {
  let conf = {
    url: '/admin/password',
    method: 'post',
    params: {
      _method: 'put'
    },
    data: {
      newPassword: data.newPassword ? hexMd5(data.newPassword) : '',
      oldPassword: data.oldPassword ? hexMd5(data.oldPassword) : ''
    }
  }
  ajax(conf, success, failure)
}

/**
 * 修改会员密码
 */
export const updateUsersPwd = (data, success, failure) => {
  let conf = {
    url: '/admin/user/password',
    method: 'post',
    params: {
      _method: 'put'
    },
    data: {
      userId: data.userId,
      newPassword: data.newPassword ? hexMd5(data.newPassword) : ''
    }
  }
  ajax(conf, success, failure)
}
/**
 * 修改会员密码
 */
export const updateUserEnable = (data, success, failure) => {
  let conf = {
    url: '/admin/user/start',
    method: 'post',
    params: {
      _method: 'put'
    },
    data: {
      userId: data
    }
  }
  ajax(conf, success, failure)
}
/**
 * 删除已经注册的用户信息,get方法传递参数使用params传递参数，post和put用data传递参数
 */
export const deleteUserInfo = (data, success, failure) => {
  let conf = {
    url: '/admin/user/delUser',
    method: 'get',
    params: {
      userId: data
    }
  }
  ajax(conf, success, failure)
}
/**
 * 赠送赠币
 */
export const giftCoin = (data, success, failure) => {
  let conf = {
    url: '/admin/user/gift',
    method: 'post',
    data: {
      userId: data.userId,
      number: data.number,
      reason: data.reason
    }
  }
  ajax(conf, success, failure)
}
/**
 * 赠送拍币
 */
export const giftRealCoin = (data, success, failure) => {
  let conf = {
    url: '/admin/user/coin',
    method: 'post',
    data: {
      userId: data.userId,
      number: data.number,
      reason: data.reason
    }
  }
  ajax(conf, success, failure)
}
/**
 * 增加用户积分
 */
export const giftIntegral = (data, success, failure) => {
  let conf = {
    url: '/admin/user/integral',
    method: 'post',
    data: {
      userId: data.userId,
      number: data.number,
      reason: data.reason
    }
  }
  ajax(conf, success, failure)
}

/**
 * 获取个人通知
 */
export const findUserNotices = (data, success, failure) => {
  let conf = {
    url: '/admin/notice/personal/list',
    method: 'get',
    params: {
      userId: data.userId,
      pageNo: data.pageNo,
      pageSize: data.pageSize
    }
  }
  ajax(conf, success, failure)
}

/**
 * 删除个人通知
 */
export const deleteNotice = (id, success, failure) => {
  let conf = {
    url: '/admin/notice',
    method: 'post',
    params: {
      _method: 'delete'
    },
    data: {
      noticeId: id
    }
  }
  ajax(conf, success, failure)
}
/**
 * 添加个人通知
 */
export const addPersonalNotice = (data, success, failure) => {
  let conf = {
    url: '/admin/notice',
    method: 'post',
    data: {
      title: data.title,
      context: data.context,
      userId: data.userId
    }
  }
  ajax(conf, success, failure)
}
/**
 * 发送通知
 */
export const sendNotice = (id, success, failure) => {
  let conf = {
    url: '/admin/notice/send',
    method: 'post',
    data: {
      noticeId: id
    }
  }
  ajax(conf, success, failure)
}
/**
 * 编辑通知
 */
export const updateNotice = (data, success, failure) => {
  let conf = {
    url: '/admin/notice',
    method: 'post',
    params: {
      _method: 'put'
    },
    data: {
      notice: data ? JSON.stringify(data) : ''
    }
  }
  ajax(conf, success, failure)
}

/**
 * 获取中奖人列表
 */
export const findWinners = (data, success, failure) => {
  let conf = {
    url: '/admin/orders',
    method: 'get',
    params: {
      itemName: data.itemName,
      orderState: data.orderState,
      robot: data.robot,
      itemType: data.itemType,
      pageNo: data.pageNo,
      pageSize: data.pageSize,
      name: data.name
    }
  }
  ajax(conf, success, failure)
}

/**
 * 获取中奖订单详情
 */
export const getOrderInfo = (id, success, failure) => {
  let conf = {
    url: '/admin/order',
    method: 'get',
    params: {
      orderId: id
    }
  }
  ajax(conf, success, failure)
}

/**
 * 查看收货地址
 */
export const getOrderAddress = (id, success, failure) => {
  let conf = {
    url: '/admin/order/address',
    method: 'get',
    params: {
      orderId: id
    }
  }
  ajax(conf, success, failure)
}

/**
 * 添加订单发货详情
 */
export const addOrderDeliveryInfo = (data, success, failure) => {
  let conf = {
    url: '/admin/order',
    method: 'post',
    params: {
      _method: 'put'
    },
    data: {
      orderId: data.orderId,
      remarks: data.remarks
    }
  }
  ajax(conf, success, failure)
}

/**
 * 发送订单系统通知
 */
export const sendOrderNotice = (data, success, failure) => {
  let conf = {
    url: '/admin/order/notice',
    method: 'post',
    params: {
      userId: data.userId,
      title: data.title,
      context: data.context
    }
  }
  ajax(conf, success, failure)
}

/**
 * 获取所有封存记录
 */
export const findLatestDeals = (data, success, failure) => {
  let conf = {
    url: '/admin/seals',
    method: 'get',
    params: {
      itemName: data.itemName,
      name: data.name,
      join: data.join,
      robot: data.robot,
      pageNo: data.pageNo,
      pageSize: data.pageSize
    }
  }
  ajax(conf, success, failure)
}

/**
 * 获取所有封存记录
 */
export const getLatestDeal = (id, success, failure) => {
  let conf = {
    url: '/admin/seal',
    method: 'get',
    params: {
      sealId: id
    }
  }
  ajax(conf, success, failure)
}

/**
 * 获取出价记录
 */
export const findBidders = (data, success, failure) => {
  let conf = {
    url: '/admin/bidders',
    method: 'get',
    params: {
      sealId: data.sealId,
      pageNo: data.pageNo,
      pageSize: data.pageSize
    }
  }
  ajax(conf, success, failure)
}

/**
 * 查询所有常见帮助
 */
export const findQuestions = (data, success, failure) => {
  let conf = {
    url: '/admin/questions',
    method: 'get',
    params: {
      title: data.title,
      questionCategory: data.questionCategory,
      pageNo: data.pageNo,
      pageSize: data.pageSize
    }
  }
  ajax(conf, success, failure)
}

/**
 * 查询单个常见帮助
 */
export const getQuestion = (id, success, failure) => {
  let conf = {
    url: '/admin/question',
    method: 'get',
    params: {
      questionId: id
    }
  }
  ajax(conf, success, failure)
}

/**
 * 修改常见帮助状态
 */
export const updateQuestionState = (id, success, failure) => {
  let conf = {
    url: '/admin/question/state',
    method: 'post',
    params: {
      _method: 'put'
    },
    data: {
      questionId: id
    }
  }
  ajax(conf, success, failure)
}

/**
 * 修改常见帮助
 */
export const updateQuestion = (data, success, failure) => {
  let conf = {
    url: '/admin/question',
    method: 'post',
    params: {
      _method: 'put'
    },
    data: {
      commonQuestion: data ? JSON.stringify(data) : null
    }
  }
  ajax(conf, success, failure)
}

/**
 * 添加一个常见帮助
 */
export const addQuestion = (data, success, failure) => {
  let conf = {
    url: '/admin/question',
    method: 'post',
    data: {
      commonQuestion: data ? JSON.stringify(data) : null
    }
  }
  ajax(conf, success, failure)
}

/**
 * 删除一个常见帮助
 */
export const deleteQuestion = (id, success, failure) => {
  let conf = {
    url: '/admin/question',
    method: 'post',
    params: {
      _method: 'delete'
    },
    data: {
      questionId: id
    }
  }
  ajax(conf, success, failure)
}

/**
 * 机器人后台服务是否启动中
 */
export const isBackgroundServiceRunning = (data, success, failure) => {
  let conf = {
    url: '/admin/robot/isBackgroundServiceRunning',
    method: 'get'
  }
  ajax(conf, success, failure)
}

/**
 * 机器人后台服务是否启动中
 */
export const startOrStopBackgroundService = (data, success, failure) => {
  let conf = {
    url: '/admin/robot/startOrStopBackgroundService',
    method: 'post'
  }
  ajax(conf, success, failure)
}

/**
 * 获取机器人用户列表
 */
export const findRobotUsers = (data, success, failure) => {
  let conf = {
    url: '/admin/robot/users',
    method: 'get',
    params: {
      name: data.name,
      disable: data.disable,
      pageNo: data.pageNo,
      pageSize: data.pageSize
    }
  }
  ajax(conf, success, failure)
}

/**
 * 获取机器人用户
 */
export const getRobotUser = (id, success, failure) => {
  let conf = {
    url: '/admin/robot/user',
    method: 'get',
    params: {
      userId: id
    }
  }
  ajax(conf, success, failure)
}

/**
 * 获取机器人用户头像列表
 */
export const findDefaultRobotUserHeadImg = (data, success, failure) => {
  let conf = {
    url: '/admin/robot/user/defaultHeadImgs',
    method: 'get'
  }
  ajax(conf, success, failure)
}

/**
 * 添加机器人用户
 */
export const addRobotUser = (data, success, failure) => {
  let conf = {
    url: '/admin/robot/user',
    method: 'post',
    data: {
      userView: data ? JSON.stringify(data) : null
    }
  }
  ajax(conf, success, failure)
}

/**
 * 修改机器人用户
 */
export const updateRobotUser = (data, success, failure) => {
  let conf = {
    url: '/admin/robot/user',
    method: 'post',
    params: {
      _method: 'put'
    },
    data: {
      userView: data ? JSON.stringify(data) : null
    }
  }
  ajax(conf, success, failure)
}

/**
 * 批量上传模板文件下载
 */
export const tempFile = () => {
  return axios.defaults.baseURL + '/admin/robot/user/upload/tempFile'
}

/**
 * 批量上传机器人
 */
export const uploadRobotUsers = (data, success, failure) => {
  let conf = {
    url: '/admin/robot/user/upload',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    transformRequest: function (data) {
      return data
    }
  }
  ajax(conf, success, failure)
}

/**
 * 获取机器人商品列表
 */
export const findRobotItems = (data, success, failure) => {
  let conf = {
    url: '/admin/root/items',
    method: 'get',
    params: {
      name: data.name,
      pageNo: data.pageNo,
      pageSize: data.pageSize
    }
  }
  ajax(conf, success, failure)
}

/**
 * 修改机器人商品
 */
export const updateRobotItem = (data, success, failure) => {
  let conf = {
    url: '/admin/root/item',
    method: 'post',
    params: {
      _method: 'put'
    },
    data: {
      robotItem: data ? JSON.stringify(data) : null
    }
  }
  ajax(conf, success, failure)
}

/**
 * 分页查看机器人未晒单中奖记录
 */
export const findSealedBeforeShow = (data, success, failure) => {
  let conf = {
    url: '/admin/robot/sealedBeforeShow',
    method: 'get',
    params: {
      username: data.username,
      itemName: data.itemName,
      startTime: data.startTime,
      endTime: data.endTime,
      pageNo: data.pageNo,
      pageSize: data.pageSize
    }
  }
  ajax(conf, success, failure)
}

/**
 * 添加晒单
 */
export const addSealedBeforeShow = (data, success, failure) => {
  let conf = {
    url: '/admin/robot/showItem',
    method: 'post',
    data: {
      view: data ? JSON.stringify(data) : null
    }
  }
  ajax(conf, success, failure)
}
/**
 * 分页查看系统通知
 */
export const findSystemNotice = (data, success, failure) => {
  let conf = {
    url: '/admin/system/notice',
    method: 'get',
    params: {
      state: data.state,
      pageNo: data.pageNo,
      pageSize: data.pageSize
    }
  }
  ajax(conf, success, failure)
}
/**
 * 阅读通知
 */
export const systemNoticeRead = (data, success, failure) => {
  let conf = {
    url: '/admin/system/notice/read',
    method: 'post',
    data: {
      noticeId: data
    }
  }
  ajax(conf, success, failure)
}
/**
 * 分页查看公告通知列表
 */
export const findNotice = (data, success, failure) => {
  let conf = {
    url: '/admin/notice/announcement/list',
    method: 'get',
    params: {
      pageNo: data.pageNo,
      pageSize: data.pageSize
    }
  }
  ajax(conf, success, failure)
}
/**
 * 添加公告通知
 */
export const addNotice = (data, success, failure) => {
  let conf = {
    url: '/admin/notice/announcement',
    method: 'post',
    data: {
      title: data.title,
      context: data.context
    }
  }
  ajax(conf, success, failure)
}
/**
 * 查询充值展示标志位
 */
export const getShowPay = (data, success, failure) => {
  let conf = {
    url: '/admin/setting/recharge',
    method: 'get'
  }
  ajax(conf, success, failure)
}
/**
 * 查询充值展示标志位
 */
export const setShowPay = (data, success, failure) => {
  let conf = {
    url: '/admin/setting/recharge',
    method: 'post',
    params: {
      _method: 'put'
    }
  }
  ajax(conf, success, failure)
}

/**
 * 获取系统维护状态
 */
export const getSystemState = (data, success, failure) => {
  let conf = {
    url: '/admin/setting/maintenance',
    method: 'get'
  }
  ajax(conf, success, failure)
}

/**
 * 设置系统维护状态
 */
export const setSystemState = (data, success, failure) => {
  let conf = {
    url: '/admin/setting/maintenance',
    method: 'post',
    params: {
      _method: 'put'
    }
  }
  ajax(conf, success, failure)
}

/**
 * 版本更新接口
 */
export const appinfo = (data, success, failure) => {
  let conf = {
    url: '/app/list',
    method: 'get',
    params: {
      pageNo: data.pageNo,
      pageSize: data.pageSize
    }
  }
  ajax(conf, success, failure)
}

/**
 * 编辑通知
 */
export const saveAppInfo = (data, success, failure) => {
  let conf = {
    url: '/app/updateAppInfo',
    method: 'post',
    params: {
      _method: 'put'
    },
    data: {
      appInfo: data ? JSON.stringify(data) : ''
    }
  }
  ajax(conf, success, failure)
}

/**
 * 查看是否是超级管理员
 * @param query
 * @param page
 * @param success
 * @param failure
 */
export const isSuperman = (data, success, failure) => {
  let conf = {
    url: '/authority/superAdmin',
    method: 'get'
  }
  ajax(conf, success, failure)
}

/**
 * 获取用户参与历史记录
 * @param success
 * @param failure
 */
export const findUserSealedHistory = (data, success, failure) => {
  let conf = {
    url: '/admin/user/sealed',
    method: 'get',
    params: {
      userId: data.userId,
      pageNo: data.pageNo,
      pageSize: data.pageSize
    }
  }
  ajax(conf, success, failure)
}

/**
 * 查看用户金币流动情况
 * @param success
 * @param failure
 */
export const findUserCoinFlow = (data, success, failure) => {
  let conf = {
    url: '/admin/user/coin_flow',
    method: 'get',
    params: {
      userId: data.userId,
      pageNo: data.pageNo,
      pageSize: data.pageSize,
      coinType: data.coinType
    }
  }
  ajax(conf, success, failure)
}

/**
 * 查看用户金币情况统计
 * @param success
 * @param failure
 */
export const findUserCoinStatistics = (data, success, failure) => {
  let conf = {
    url: '/admin/user/coin_statistics',
    method: 'get',
    params: {
      userId: data.userId,
      coinType: data.coinType
    }
  }
  ajax(conf, success, failure)
}

/**
 * 查看最新充值用户统计
 * @param success
 * @param failure
 */
export const findNewUserRecharge = (data, success, failure) => {
  let conf = {
    url: '/admin/successful/recharge',
    method: 'get',
    params: {
      sort: data.sort,
      pageNo: data.pageNo,
      pageSize: data.pageSize
    }
  }
  ajax(conf, success, failure)
}

/**
 * 查看最新充值用户详细统计
 * @param success
 * @param failure
 */
export const findNewUserAllRecharge = (data, success, failure) => {
  let conf = {
    url: '/admin/recharge/record',
    method: 'get',
    params: {
      userId: data.userId,
      pageNo: data.pageNo,
      pageSize: data.pageSize
    }
  }
  ajax(conf, success, failure)
}

/**
 * 查看用户晒单
 * @param success
 * @param failure
 */
export const findShowItems = (data, success, failure) => {
  let conf = {
    url: '/admin/show',
    method: 'get',
    params: {
      userId: data.userId,
      itemName: data.itemName,
      key: data.key,
      disable: data.disable,
      pageNo: data.pageNo,
      pageSize: data.pageSize
    }
  }
  ajax(conf, success, failure)
}

/**
 * 修改晒单状态
 * @param success
 * @param failure
 */
export const updateShowItemState = (data, success, failure) => {
  let conf = {
    url: '/admin/show',
    method: 'post',
    params: {
      _method: 'put'
    },
    data: {
      showId: data
    }
  }
  ajax(conf, success, failure)
}

/**
 * 删除晒单
 * @param success
 * @param failure
 */
export const deleteShowItem = (data, success, failure) => {
  let conf = {
    url: '/admin/show',
    method: 'post',
    params: {
      _method: 'delete'
    },
    data: {
      showId: data
    }
  }
  ajax(conf, success, failure)
}

/**
 * 获取在线人数
 * @param success
 * @param failure
 */
export const getOnlineNum = (data, success, failure) => {
  let conf = {
    url: '/admin/home/total',
    method: 'get',
    data: {
      rate: data
    }
  }
  ajax(conf, success, failure)
}

/**
 * 获取所有转盘活动商品
 */
export const findTurntableItems = (data, success, failure) => {
  let conf = {
    url: '/activity/admin/turntable',
    method: 'get'
  }
  ajax(conf, success, failure)
}

/**
 * 更新转盘活动商品
 */
export const updateTurntableItems = (data, success, failure) => {
  let conf = {
    url: '/activity/admin/turntable',
    method: 'post',
    params: {
      _method: 'put'
    },
    data: {
      itemType: data ? JSON.stringify(data) : null
    }
  }
  ajax(conf, success, failure)
}

/**
 * 删除转盘活动商品
 */
export const deleteTurntableItem = (data, success, failure) => {
  let conf = {
    url: '/activity/admin/turntable',
    method: 'post',
    params: {
      _method: 'delete'
    },
    data: {
      itemTypeId: data
    }
  }
  ajax(conf, success, failure)
}

/**
 * 添加转盘活动商品
 */
export const addTurntableItems = (data, success, failure) => {
  let conf = {
    url: '/activity/admin/turntable',
    method: 'post',
    data: {
      itemType: data ? JSON.stringify(data) : null
    }
  }
  ajax(conf, success, failure)
}

/**
 * 获取大转盘活动时间
 */
export const getTurntableTime = (data, success, failure) => {
  let conf = {
    url: '/activity/admin/turntable/time',
    method: 'get'
  }
  ajax(conf, success, failure)
}

/**
 * 设置大转盘活动时间
 */
export const setTurntableTime = (data, success, failure) => {
  let conf = {
    url: '/activity/admin/turntable/time',
    method: 'post',
    params: {
      _method: 'put'
    },
    data: {
      time: data
    }
  }
  ajax(conf, success, failure)
}

/**
 * 查询转盘中奖信息
 */
export const findTurntableWinInfo = (data, success, failure) => {
  let conf = {
    url: '/activity/admin/turntable/winning/list',
    method: 'get',
    params: {
      userId: data.userId,
      itemName: data.itemName,
      winningType: data.type,
      state: data.state,
      pageNo: data.pageNo,
      pageSize: data.pageSize
    }
  }
  ajax(conf, success, failure)
}

/**
 * 转盘中奖发货
 */
export const shipTurntableWin = (data, success, failure) => {
  let conf = {
    url: '/activity/admin/turntable/winning/ship',
    method: 'get',
    params: {
      winningId: data.winningId,
      shipMessage: data.shipMessage
    }
  }
  ajax(conf, success, failure)
}

/**
 * 转盘中奖完成
 */
export const finishTurntableWin = (data, success, failure) => {
  let conf = {
    url: '/activity/admin/turntable/winning/finish',
    method: 'get',
    params: {
      winningId: data
    }
  }
  ajax(conf, success, failure)
}

/**
 * 转盘中奖取消中奖
 */
export const cancelTurntableWin = (data, success, failure) => {
  let conf = {
    url: '/activity/admin/turntable/winning/cancel',
    method: 'get',
    params: {
      winningId: data.winningId,
      reason: data.reason
    }
  }
  ajax(conf, success, failure)
}

/**
 * 获取充值优惠卡天数
 */
export const getRechargeCardDay = (data, success, failure) => {
  let conf = {
    url: '/activity/admin/benefitCard/validDays',
    method: 'get'
  }
  ajax(conf, success, failure)
}
/**
 * 设置充值优惠卡天数
 */
export const setRechargeCardDay = (data, success, failure) => {
  let conf = {
    url: '/activity/admin/benefitCard/validDays',
    method: 'post',
    params: {
      _method: 'put'
    },
    data: {
      validDays: data
    }
  }
  ajax(conf, success, failure)
}

/**
 * 获取充值优惠卡额度
 */
export const getRechargeCardLimit = (data, success, failure) => {
  let conf = {
    url: '/activity/admin/benefitCard/limits',
    method: 'get'
  }
  ajax(conf, success, failure)
}
/**
 * 设置充值优惠卡额度
 */
export const setRechargeCardLimit = (data, success, failure) => {
  let conf = {
    url: '/activity/admin/benefitCard/limits',
    method: 'post',
    params: {
      _method: 'put'
    },
    data: {
      limits: data
    }
  }
  ajax(conf, success, failure)
}
/**
 * 获取充值优惠卡注册额度
 */
export const getRechargeCardRegisteLimit = (data, success, failure) => {
  let conf = {
    url: '/activity/admin/benefitCard/limitRegisterGive',
    method: 'get'
  }
  ajax(conf, success, failure)
}
/**
 * 设置充值优惠卡注册额度
 */
export const setRechargeCardRegisteLimit = (data, success, failure) => {
  let conf = {
    url: '/activity/admin/benefitCard/limitRegisterGive',
    method: 'post',
    params: {
      _method: 'put'
    },
    data: {
      limit: data ? JSON.stringify(data) : ''
    }
  }
  ajax(conf, success, failure)
}

/**
 * 获取充值优惠卡使用记录
 */
export const findRechargeCardUsed = (data, success, failure) => {
  let conf = {
    url: '/activity/admin/benefitCard/list',
    method: 'get',
    params: {
      username: data.username,
      money: data.money,
      cardType: data.cardType,
      isUse: data.isUse,
      pageNo: data.pageNo,
      pageSize: data.pageSize
    }
  }
  ajax(conf, success, failure)
}

/**
 * 获取不中包赔的商品
 */
export const getCompensationItem = (data, success, failure) => {
  let conf = {
    url: '/activity/admin/indemnity/item',
    method: 'get'
  }
  ajax(conf, success, failure)
}

/**
 * 设置不中包赔的商品
 */
export const setCompensationItem = (data, success, failure) => {
  let conf = {
    url: '/activity/admin/indemnity/item',
    method: 'post',
    params: {
      _method: 'put'
    },
    data: {
      itemId: data
    }
  }
  ajax(conf, success, failure)
}

/**
 * 获取不中包赔的额度
 */
export const getCompensationLimits = (data, success, failure) => {
  let conf = {
    url: '/activity/admin/indemnity/limits',
    method: 'get'
  }
  ajax(conf, success, failure)
}

/**
 * 设置不中包赔额度
 */
export const setCompensationLimits = (data, success, failure) => {
  let conf = {
    url: '/activity/admin/indemnity/limits',
    method: 'post',
    params: {
      _method: 'put'
    },
    data: {
      limits: data
    }
  }
  ajax(conf, success, failure)
}

/**
 * 获取不中包赔使用记录
 */
export const findCompensation = (data, success, failure) => {
  let conf = {
    url: '/activity/admin/indemnity/list',
    method: 'get',
    params: {
      username: data.username,
      state: data.state,
      pageNo: data.pageNo,
      pageSize: data.pageSize
    }
  }
  ajax(conf, success, failure)
}

/**
 * 获取分享赠币数
 */
export const getShareNum = (data, success, failure) => {
  let conf = {
    url: '/admin/setting/gift_coin',
    method: 'get'
  }
  ajax(conf, success, failure)
}
/**
 * 设置分享赠币数
 */
export const setShareNum = (data, success, failure) => {
  let conf = {
    url: '/admin/setting/gift_coin',
    method: 'post',
    params: {
      _method: 'put'
    },
    data: {
      number: data
    }
  }
  ajax(conf, success, failure)
}

/**
 * 获取安卓应用下载链接
 */
export const getAndroidUrl = (data, success, failure) => {
  let conf = {
    url: '/admin/setting/app/android/download',
    method: 'get'
  }
  ajax(conf, success, failure)
}

/**
 * 设置安卓应用下载链接
 */
export const setAndroidUrl = (data, success, failure) => {
  let conf = {
    url: '/admin/setting/app/android/download',
    method: 'post',
    params: {
      _method: 'put'
    },
    data: {
      link: data
    }
  }
  ajax(conf, success, failure)
}

/**
 * 获取苹果应用下载链接
 */
export const getIosUrl = (data, success, failure) => {
  let conf = {
    url: '/admin/setting/app/ios/download',
    method: 'get'
  }
  ajax(conf, success, failure)
}

/**
 * 设置苹果应用下载链接
 */
export const setIosUrl = (data, success, failure) => {
  let conf = {
    url: '/admin/setting/app/ios/download',
    method: 'post',
    params: {
      _method: 'put'
    },
    data: {
      link: data
    }
  }
  ajax(conf, success, failure)
}

/**
 * 获取微信分享信息
 */
export const getWXShareData = (data, success, failure) => {
  let conf = {
    url: '/admin/setting/share',
    method: 'get'
  }
  ajax(conf, success, failure)
}

/**
 * 设置微信分享信息
 */
export const setWXShareData = (data, success, failure) => {
  let conf = {
    url: '/admin/setting/share',
    method: 'post',
    params: {
      _method: 'put'
    },
    data: {
      title: data.title,
      imgId: data.imgId,
      context: data.context,
      shareUrl: data.shareUrl
    }
  }
  ajax(conf, success, failure)
}

/**
 * 有效会员
 */
export const findEffectiveUser = (data, success, failure) => {
  let conf = {
    url: '/admin/v02/users',
    method: 'get',
    params: {
      userId: data.userId,
      name: data.name,
      phone: data.phone,
      disable: data.disable,
      date: data.date,
      sort: data.sort,
      pageNo: data.pageNo,
      pageSize: data.pageSize,
      source: data.source
    }
  }
  ajax(conf, success, failure)
}
/**
 * 有效会员导出
 */
export const exportEffectiveUser = (data, success, failure) => {
  let conf = {
    url: '/admin/v02/exportUsers',
    method: 'get',
    params: {
      userId: data.userId,
      name: data.name,
      phone: data.phone,
      disable: data.disable,
      date: data.date,
      sort: data.sort,
      pageNo: data.pageNo,
      pageSize: data.pageSize,
      source: data.source,
      first: true
    }
  }
  ajax(conf, success, failure)
}

/**
 * 首页渠道数据
 */
export const getHomeUsers = (data, success, failure) => {
  let conf = {
    url: '/admin/home/users',
    method: 'get',
    params: {
      userId: data.userId,
      name: data.name,
      phone: data.phone,
      disable: data.disable,
      startTime: data.startTime,
      endTime: data.endTime,
      pageNo: data.pageNo,
      pageSize: data.pageSize,
      source: data.source
    }
  }
  ajax(conf, success, failure)
}

/**
 * 首页渠道总计数据
 */
export const getHomeTotal = (data, success, failure) => {
  let conf = {
    url: '/admin/home/userTotal',
    method: 'get',
    params: {
      userId: data.userId,
      name: data.name,
      phone: data.phone,
      disable: data.disable,
      startTime: data.startTime,
      endTime: data.endTime,
      source: data.source
    }
  }
  ajax(conf, success, failure)
}

/**
 * 首页商品数据
 */
export const getHomeItems = (data, success, failure) => {
  let conf = {
    url: '/admin/home/item',
    method: 'get',
    params: {
      itemName: data.itemName,
      periods: data.periods,
      startTime: data.startTime,
      endTime: data.endTime,
      pageNo: data.pageNo,
      pageSize: data.pageSize
    }
  }
  ajax(conf, success, failure)
}

/**
 * 首页订单充值详情
 */
export const getHomeRecharge = (data, success, failure) => {
  let conf = {
    url: '/pay/home/recharge',
    method: 'get',
    params: {
      userId: data.userId,
      name: data.name,
      phone: data.phone,
      payType: data.payType,
      startTime: data.startTime,
      endTime: data.endTime,
      pageNo: data.pageNo,
      pageSize: data.pageSize
    }
  }
  ajax(conf, success, failure)
}

/**
 * 首页订单付款详情
 */
export const getHomePay = (data, success, failure) => {
  let conf = {
    url: '/pay/home/pay',
    method: 'get',
    params: {
      userId: data.userId,
      name: data.name,
      phone: data.phone,
      payType: data.payType,
      startTime: data.startTime,
      endTime: data.endTime,
      pageNo: data.pageNo,
      pageSize: data.pageSize
    }
  }
  ajax(conf, success, failure)
}

/**
 * 首页订单总计
 */
export const getHomeOrderTotal = (data, success, failure) => {
  let conf = {
    url: '/pay/home/orderTotal',
    method: 'get',
    params: {
      userId: data.userId,
      name: data.name,
      phone: data.phone,
      payType: data.payType,
      startTime: data.startTime,
      endTime: data.endTime
    }
  }
  ajax(conf, success, failure)
}

/**
 * 会员关注
 */
export const findUserAttention = (data, success, failure) => {
  let conf = {
    url: '/admin/users/attention',
    method: 'get',
    params: {
      userId: data.userId,
      sort: data.sort,
      pageNo: data.pageNo,
      pageSize: data.pageSize
    }
  }
  ajax(conf, success, failure)
}
/** ******************************
 * 活动统计
 *********************************/

 /**
  * 管理员根据日期进行统计近15日内 活动充值优惠卡注册赠送的参与人数及金额
  */
export const benefitCardStatisticsLastRegisterGive = (data, success, failure) => {
  let conf = {
    url: '/activity/admin/benefitCard/statistics/lastRegisterGive',
    method: 'get'
  }
  ajax(conf, success, failure)
}

/**
* 管理员根据日期进行统计近15日内 活动充值优惠卡的参与人数及金额
*/
export const benefitCardStatisticsLast = (data, success, failure) => {
  let conf = {
    url: '/activity/admin/benefitCard/statistics/last',
    method: 'get',
    params: {
      money: data.money
    }
  }
  ajax(conf, success, failure)
}

/**
* 管理员根据日期进行统计近15日内 活动猜大小的参与人数及金额
*/
export const guessSizeStatisticsLast = (data, success, failure) => {
  let conf = {
    url: '/activity/admin/guess_size/statistics/last',
    method: 'get'
  }
  ajax(conf, success, failure)
}

/**
* 管理员根据日期进行统计近15日内 活动不中包赔的参与人数及金额
*/
export const indemnityStatisticsLast = (data, success, failure) => {
  let conf = {
    url: '/activity/admin/indemnity/statistics/last',
    method: 'get'
  }
  ajax(conf, success, failure)
}
/**
* 管理员根据日期进行统计近15日内 活动幸运转盘的参与人数及金额
*/
export const turntableStatisticsLast = (data, success, failure) => {
  let conf = {
    url: '/activity/admin/turntable/statistics/last',
    method: 'get'
  }
  ajax(conf, success, failure)
}

// 统一处理返回数据
export const allHandle = {
  handleSuccess () {},
  handleCatch () {}
}

/**
 * 过滤空值的属性
 * @param obj
 * @constructor
 */
function FilterData (obj) {
  for (var key in obj) {
    if (obj[key] == null || obj[key] === '') {
      delete obj[key]
    }
  }
}
function ajax (conf, success, failure) {
  FilterData(conf.params) // 过滤空属性
  FilterData(conf.data)  // 过滤空属性
  axios(conf)
    .then((res) => {// 成功的回调
      allHandle.handleSuccess(res, success, failure)
    })
    .catch((err) => {
      allHandle.handleCatch(err)
    })
}
