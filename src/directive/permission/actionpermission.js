import store from '@/store'

export default {
  mounted(el, binding) {
    const { value } = binding
    const all_permission = '*:*:*'
    const permissions = store.getters && store.getters.actionpermission

    if (value && value instanceof Array && value.length > 0) {
      const permissionFlag = value

      const hasPermissions = permissions.some((permission) => {
        return all_permission === permission || permissionFlag.includes(permission)
      })

      if (!hasPermissions) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(
        `need permissions! Like v-actionpermission="['sys:admin:add','sys:admin:remove']"`
      )
    }
  },
}
