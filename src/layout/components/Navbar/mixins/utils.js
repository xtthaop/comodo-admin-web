import { addClass, removeClass } from '@/utils'

export default {
  methods: {
    handleChangePageStyle(val) {
      if (val === 'dark') {
        addClass(document.documentElement, 'dark')
      } else {
        removeClass(document.documentElement, 'dark')
      }

      this.$store.dispatch('settings/changeSetting', {
        key: 'pageStyle',
        value: val,
      })
    },
  },
}
