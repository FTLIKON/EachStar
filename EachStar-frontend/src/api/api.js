import axios from 'axios'
import api_server from '@/config.js'
import { setCookie } from '@/lib/cookie.js'
import { setUserType, isLogin, getUserType } from '@/api/login.js'
import { getParsedTime } from '@/utils/time.js'
/**
 * Star 一键star
 */
export async function starCard(type, id) {
  let data = new URLSearchParams()
  data.append('type', type)
  data.append('cardId', id)

  var config = {
    method: 'post',
    url: api_server + '/api/card/quickstar',
    data: data,
  }

  var success = false
  await axios(config)
    .then(function (res) {
      success = true
    })
    .catch(function (error) {
      console.log(error)
    })
  return success
}

/**
 * Delete 删除卡片
 */
export async function deleteCard(type, id) {
  var config = {
    method: 'delete',
    url: api_server + '/api/card?type=' + type + '&cardId=' + id,
  }

  var success = false
  await axios(config)
    .then(function (res) {
      success = true
    })
    .catch(function (error) {
      console.log(error)
    })
  return success
}

/**
 * Public 发布卡片
 */
export async function publicCard(type, title, context, price, num) {
  let data = new URLSearchParams()
  data.append('type', type)
  data.append('title', title)
  data.append('context', context)
  data.append('starPrice', price)
  data.append('starNum', num)
  data.append('expireTime', getParsedTime())
  var config = {
    method: 'post',
    url: api_server + '/api/card',
    data: data,
  }

  var success = false
  await axios(config)
    .then(function (res) {
      success = true
    })
    .catch(function (error) {
      success = false
    })
  return success
}

/**
 * Edit 修改卡片
 */
export async function editCard(type, cardId, title, context, price, num) {
  let data = new URLSearchParams()
  data.append('cardId', cardId)
  data.append('type', type)
  data.append('title', title)
  data.append('context', context)
  data.append('starPrice', price)
  data.append('starNum', num)
  data.append('expireTime', '2022-09-26 10:00:00')
  var config = {
    method: 'post',
    url: api_server + '/api/card',
    data: data,
  }

  var success = false
  await axios(config)
    .then(function (res) {
      success = true
    })
    .catch(function (error) {
      success = false
    })
  return success
}

/**
 * Card 获取卡片列表
 */
export async function getCard(type, start, myrepo) {
  var config = {
    method: 'get',
    url: api_server + '/api/card?type=' + type + '&start=' + start,
  }
  if (myrepo) {
    config.url = api_server + '/api/card/@me?type=' + type + '&start=' + start
  }

  var cardData = {
    count: 0,
    data: [],
  }
  await axios(config)
    .then(function (res) {
      cardData = res.data
    })
    .catch(function (error) {
      console.log(error)
    })
  return cardData
}

/**
 * Global 更改页面的 user 信息至 type 版本
 */
export async function fetchUserInfo(type) {
  setUserType(type)
  if (isLogin(type)) {
    var config = {
      method: 'get',
      url: api_server + '/api/user/@me?type=' + type,
    }
    var res = await axios(config)
    var user = res.data
    setCookie(user.type.toLowerCase() + 'Price', user.price)
  }
}

/**
 * Global 退出登陆 ( type类型 )
 */
export async function userLogout(type) {
  if (isLogin(type)) {
    var config = {
      method: 'get',
      url: api_server + '/oauth/' + type.toLowerCase() + '/logout',
    }
    var res = await axios(config)
    setCookie(getUserType().toLowerCase() + 'Price', '')
    location.reload()
  }
}
