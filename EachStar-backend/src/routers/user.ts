import Router = require('koa-router')
import UserController from '../controller/user'

export const getUserApiMiddleware = () => {
  const router = new Router({
    prefix: '/user',
  })
  const userController = new UserController()
  router.get('/@me', userController.getSelf.bind(userController))
  router.get('/:id', userController.getUser.bind(userController))
  router.post('/email/check', userController.checkEmailCode.bind(userController))
  router.put('/@me/profile', userController.setProfile.bind(userController))
  router.put(
    '/@me/preference',
    userController.setPreference.bind(userController),
  )
  router.get('/:id/profile', userController.getProfiles.bind(userController))
  router.get(
    '/:id/preference',
    userController.getPreferences.bind(userController),
  )
  router.get(
    '/@me/external',
    userController.getExternalProfiles.bind(userController),
  )
  return router.routes()
}
