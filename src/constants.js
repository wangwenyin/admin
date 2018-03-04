export const REQUEST_METHOD = [
  'GET',
  'POST',
  'PUT',
  'DELETE'
]

export const ORDER_STATE = {
  WAITING_PAYMENT: '待付款',
  WAITING_CHOICE_ADDRESS: '待选择收货地址',
  WAITING_SHIP: '待发货',
  WAITING_RECEIPT: '待收货',
  WAITING_SUN_ALONE: '待晒单',
  CONSUMMATION: '完成'
}

export const ITEM_TYPE = {
  VIRTUAL: '虚拟',
  IN_KIND: '实物'
}

export const NOTICE_STATE = {
  UNSENT: '未发送',
  READ: '已读',
  UNREAD: '未读'
}

export const QUESTION_CATEGORY = {
  LOGIN_QUESTION: '注册登录',
  AUCTION_QUESTION: '拍卖问题',
  SUM_ALONE_REWARD: '晒单奖励',
  COMMON_QUESTION: '常见问题'
}

export const TURNTABLE_ITEM_TYPE = {
  GIFT_COIN: '赠币',
  ITEM: '商品',
  NO: '谢谢惠顾',
  BENEFIT_CARD: '充值优惠卡'
}

export const TURNTABLE_WIN_TYPE = {
  EVERYDAY: '每天一次',
  RECHARGE: '单笔充值100元以上'
}

export const TURNTABLE_WIN_STATE = {
  WAITING_CHOICE_ADDRESS: '待选择收货地址',
  WAITING_SHIP: '待发货',
  WAITING_RECEIPT: '待收货',
  CONSUMMATION: '完成',
  CANCAL: '取消'
}
export const RECHARGE_CARD_TYPE = {
  NORMAL: '普通充值优惠卡',
  REGISTER_GIVE: '注册赠送,永久有效'
}
export const GUESS_ORDER_STATE = {
  WAITING_CHOICE_ADDRESS: '待选择收货地址',
  WAITING_SHIP: '待发货',
  WAITING_RECEIPT: '待收货',
  CONSUMMATION: '完成'
}
export const INDEMNITY_STATE = {
  WAIT_PAY: '等待支付',
  DOING: '参与中',
  SUCCESS: '竞拍成功',
  FAILURE: '竞拍失败, 返还拍币',
  NO: '没有参与'
}
export const GUESS_WIN_TYPE = {
  BIG: '大',
  MIDDLE: '發',
  SMALL: '小'
}
