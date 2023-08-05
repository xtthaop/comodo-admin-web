const getters = {
  sidebar: (state) => state.app.sidebar,
  username: (state) => state.user.username,
  roles: (state) => state.user.roles,
  actionpermission: (state) => state.user.actionpermission,
  permissionroutes: (state) => state.permission.routes,
}

export default getters
