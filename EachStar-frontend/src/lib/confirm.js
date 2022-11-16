import { ElMessageBox } from 'element-plus'
import { getUserType } from '@/api/login.js'

/**
 * 确认退出登录
 */
export async function logoutConfirm() {
  var confirm = false
  await ElMessageBox.confirm('您确定要退出登录吗?', '正在退出登录', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    center: true,
  })
    .then(() => {
      confirm = true
    })
    .catch(() => {
      confirm = false
    })
  return confirm
}

/**
 * 确认删除卡片
 */
export async function deleteConfirm(price, type = getUserType()) {
  var priceName = type == 'GitHub' ? '星币' : '云币'
  var confirm = false
  await ElMessageBox.confirm(
    '您正在删除卡片, 将会返还' + price + priceName + ', 您确定吗?',
    '删除卡片',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      center: true,
    }
  )
    .then(() => {
      confirm = true
    })
    .catch(() => {
      confirm = false
    })
  return confirm
}

/**
 * 确认发布卡片
 */
export async function publicConfirm(type = getUserType()) {
  var confirm = false
  await ElMessageBox.confirm(
    '请确认您的' + type.toLowerCase() + '链接有效, 且为公开(public)状态～',
    '正在发布卡片',
    {
      confirmButtonText: '确定,立即发布',
      cancelButtonText: '取消',
      center: true,
    }
  )
    .then(() => {
      confirm = true
    })
    .catch(() => {
      confirm = false
    })
  return confirm
}

/**
 * 确认修改卡片
 */
export async function editConfirm() {
  var confirm = false
  await ElMessageBox.confirm('您确定要修改这张卡片吗?', '正在修改卡片', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    center: true,
  })
    .then(() => {
      confirm = true
    })
    .catch(() => {
      confirm = false
    })
  return confirm
}
