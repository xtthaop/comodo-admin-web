import permission from './permission'
import actionpermission from './actionpermission'

const install = function(Vue){
  Vue.directive('permission', permission)
  Vue.directive('actionpermission', actionpermission)
}

if(window.Vue){
  window['permission'] = permission
  window['actionpermission'] = actionpermission
  // eslint-disable-next-line no-undef
  Vue.use(install)
}

permission.install = install
export default permission
