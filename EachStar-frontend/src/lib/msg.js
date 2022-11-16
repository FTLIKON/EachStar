import { ElMessage } from 'element-plus'
import { getUserType } from '@/api/login.js'

/**
 * 通用报错
 */
export function errorMessage() {
  ElMessage({
    showClose: true,
    message: '出错了, 请稍后再试～',
    type: 'error',
  })
}

/**
 * 未登陆警告
 */
export function nologinMessage() {
  ElMessage({
    showClose: true,
    message: '您尚未登陆, 请先登入/注册～',
    type: 'error',
  })
}

/**
 * 发布链接有误
 */
export function urlErrorMessage() {
  ElMessage({
    showClose: true,
    message: '项目链接错误, 请检查格式是否正确~',
    type: 'error',
  })
}

/**
 * 一键star成功
 */
export function starMessage(price, type = getUserType()) {
  var priceName = type == 'GitHub' ? '星币' : '云币'
  ElMessage({
    showClose: true,
    message: '一键star成功, 获得' + priceName + ': ' + price,
    type: 'success',
  })
}

/**
 * 没积分警告
 */
export function nopriceMessage(type = getUserType()) {
  if (type == 'GitHub') {
    ElMessage({
      showClose: true,
      message: '您的星币不足, 快去star别人的卡片吧~',
      type: 'error',
    })
  } else {
    ElMessage({
      showClose: true,
      message: '您的云币不足, 快去star别人的卡片吧~',
      type: 'error',
    })
  }
}

/**
 * 删除卡片成功
 */
export function deleteMessage(price, type = getUserType()) {
  var priceName = type == 'GitHub' ? '星币' : '云币'
  ElMessage({
    showClose: true,
    message: '卡片删除成功, 成功返还' + priceName + ': ' + price + '',
    type: 'success',
  })
}

/**
 * 修改卡片成功
 */
export function editMessage(addPrice, type = getUserType()) {
  var priceName = type == 'GitHub' ? '星币' : '云币'
  var operaName = addPrice > 0 ? '返还' : '消耗'
  ElMessage({
    showClose: true,
    message:
      '修改卡片成功, 成功' +
      operaName +
      Math.abs(parseInt(addPrice)) +
      priceName +
      '',
    type: 'success',
  })
}

/**
 * 发布卡片成功
 */
export function publicMessage(price, type = getUserType()) {
  var priceName = type == 'GitHub' ? '星币' : '云币'
  ElMessage({
    showClose: true,
    message: '卡片发布成功, 消耗' + price + priceName + '～',
    type: 'success',
  })
}
