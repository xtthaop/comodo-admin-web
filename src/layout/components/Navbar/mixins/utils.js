import { setTheme } from '@/utils'

export default {
  methods: {
    handleChangeTheme(val) {
      setTheme(val)
      this.$store.dispatch('settings/changeSetting', {
        key: 'theme',
        value: val,
      })
    },
  },
}
