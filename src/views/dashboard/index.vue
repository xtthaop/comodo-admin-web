<template>
  <div class="app-container">{{ username }}您好！欢迎登录本系统！</div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'DashboardPage',
  computed: {
    ...mapGetters(['username']),
  },
}
</script>
