<template lang='pug'>
  q-item-section(avatar)
    q-avatar(
      :color='avatarBgColor'
      rounded
      )
      q-icon(
        v-if='imgPath'
        :name='`img:` + imgPath'
        size='sm'
      )
</template>

<script>
const iconsContext = require.context('../assets/icons/', false, /\/ultraviolet-[a-zA-Z0-9-]+\.svg$/, 'lazy-once')

export default {
  name: 'BlueprintIcon',
  props: {
    icon: {
      type: String,
      default: ''
    },
    dark: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      imgPath: null
    }
  },
  computed: {
    avatarBgColor () { return this.$q.dark.isActive || this.dark ? 'dark-4' : 'blue-1' }
  },
  watch: {
    icon () {
      this.generatePath()
    }
  },
  mounted () {
    this.generatePath()
  },
  methods: {
    async generatePath () {
      this.imgPath = await iconsContext('./ultraviolet-' + this.icon + '.svg')
    }
  }
}
</script>
