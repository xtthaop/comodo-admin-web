import permission from './permission'
import actionpermission from './actionpermission'

export default {
  install(app) {
    app.directive('permission', permission)
    app.directive('actionpermission', actionpermission)
  },
}
