<template lang="pug">
  q-menu(
    auto-close
    anchor='bottom right'
    self='top right'
    )
    q-list(padding)
      q-item(clickable, @click='create(`wysiwyg`)')
        blueprint-icon(icon='google-presentation')
        q-item-section.q-pr-sm New Page
      q-item(clickable, @click='create(`markdown`)')
        blueprint-icon(icon='markdown')
        q-item-section.q-pr-sm New Markdown Page
      q-item(clickable, @click='create(`blog`)')
        blueprint-icon(icon='typewriter-with-paper')
        q-item-section.q-pr-sm New Blog Page
      q-item(clickable, @click='create(`api`)')
        blueprint-icon(icon='api')
        q-item-section.q-pr-sm New API Documentation
      q-item(clickable, @click='create(`redirect`)')
        blueprint-icon(icon='advance')
        q-item-section.q-pr-sm New Redirection
      q-separator.q-my-sm(inset)
      q-item(clickable, to='/f')
        blueprint-icon(icon='add-image')
        q-item-section.q-pr-sm Upload Media Asset
</template>

<script>
export default {
  data () {
    return { }
  },
  methods: {
    create (editor) {
      this.$store.dispatch('page/pageCreate', { editor })
    }
  }
}
</script>
