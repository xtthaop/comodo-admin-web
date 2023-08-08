export default {
  methods: {
    resolveKey(route) {
      const path = route.path || ''
      const id = route.meta?.id || ''
      return `${path}-${id}`
    },
  },
}
