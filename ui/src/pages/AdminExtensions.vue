<template lang='pug'>
  q-page.admin-extensions
    .row.q-pa-md.items-center
      .col-auto
        img.admin-icon.animated.fadeInLeft(src='~assets/icons/fluent-module.svg')
      .col.q-pl-md
        .text-h5.text-primary.animated.fadeInLeft {{ $t('admin.extensions.title') }}
        .text-subtitle1.text-grey.animated.fadeInLeft.wait-p2s {{ $t('admin.extensions.subtitle') }}
      .col-auto
        q-btn.acrylic-btn.q-mr-sm(
          icon='las la-question-circle'
          flat
          color='grey'
          href='https://docs.js.wiki/admin/extensions'
          target='_blank'
          type='a'
          )
        q-btn.acrylic-btn(
          icon='las la-redo-alt'
          flat
          color='secondary'
          @click='$apollo.queries.extensions.refetch()'
          )
    q-separator(inset)
    .row.q-pa-md.q-col-gutter-md
      .col-12
        q-card.shadow-1
          q-list(separator)
            q-item(
              v-for='(ext, idx) of extensions'
              :key='`ext-` + ext.key'
              )
              blueprint-icon(icon='module')
              q-item-section
                q-item-label {{ext.title}}
                q-item-label(caption) {{ext.description}}
              q-item-section(side)
                .row
                  q-btn-group(unelevated)
                    q-btn(
                      icon='las la-check'
                      size='sm'
                      color='positive'
                      padding='xs sm'
                      v-if='ext.isInstalled'
                      :ripple='false'
                      )
                      q-tooltip(
                        anchor='center left'
                        self='center right'
                        ) {{$t('admin.extensions.installed')}}
                    q-btn(
                      :label='$t(`admin.extensions.install`)'
                      color='blue-7'
                      v-if='ext.isCompatible && !ext.isInstalled && ext.isInstallable'
                      @click='install(ext)'
                      no-caps
                    )
                    q-btn(
                      v-else-if='ext.isCompatible && ext.isInstalled && ext.isInstallable'
                      :label='$t(`admin.extensions.reinstall`)'
                      color='blue-7'
                      @click='install(ext)'
                      no-caps
                    )
                    q-btn(
                      v-else-if='ext.isCompatible && ext.isInstalled && !ext.isInstallable'
                      :label='$t(`admin.extensions.installed`)'
                      color='positive'
                      no-caps
                      :ripple='false'
                    )
                    q-btn(
                      v-else-if='ext.isCompatible'
                      :label='$t(`admin.extensions.instructions`)'
                      icon='las la-info-circle'
                      color='indigo'
                      outline
                      type='a'
                      :href='`https://docs.js.wiki/admin/extensions/` + ext.key'
                      target='_blank'
                      no-caps
                      )
                      q-tooltip(
                        anchor='center left'
                        self='center right'
                        ) {{$t('admin.extensions.instructionsHint')}}
                    q-btn(
                      v-else
                      color='negative'
                      outline
                      :label='$t(`admin.extensions.incompatible`)'
                      no-caps
                      :ripple='false'
                    )

</template>

<script>
import gql from 'graphql-tag'
import cloneDeep from 'lodash/cloneDeep'

export default {
  meta () {
    return {
      title: this.$t('admin.extensions.title')
    }
  },
  data () {
    return {
      loading: false,
      extensions: []
    }
  },
  methods: {
    async install (ext) {
      this.$q.loading.show({
        message: this.$t('admin.extensions.installing') + '<br>' + this.$t('admin.extensions.installingHint')
      })
      try {
        const respRaw = await this.$apollo.mutate({
          mutation: gql`
            mutation (
              $key: String!
            ) {
              installExtension(
                key: $key
              ) {
                status {
                  succeeded
                  message
                }
              }
            }
          `,
          variables: {
            key: ext.key
          }
        })
        if (respRaw.data?.installExtension?.status?.succeeded) {
          this.$q.notify({
            type: 'positive',
            message: this.$t('admin.extensions.installSuccess')
          })
          ext.isInstalled = true
          this.$forceUpdate()
        } else {
          throw new Error(respRaw.data?.installExtension?.status?.message || 'An unexpected error occured')
        }
      } catch (err) {
        this.$q.notify({
          type: 'negative',
          message: this.$t('admin.extensions.installFailed'),
          caption: err.message
        })
      }
      this.$q.loading.hide()
    }
  },
  apollo: {
    extensions: {
      query: gql`
        {
          systemExtensions {
            key
            title
            description
            isInstalled
            isInstallable
            isCompatible
          }
        }
      `,
      prefetch: false,
      fetchPolicy: 'network-only',
      update: (data) => cloneDeep(data.systemExtensions),
      watchLoading (isLoading) {
        this.$store.commit(`loading${isLoading ? 'Start' : 'Stop'}`, 'admin-extensions-refresh')
      }
    }
  }
}
</script>

<style lang='scss'>
.admin-extensions {
  .q-expansion-item__content .q-card {
    @at-root .body--light & {
      background-color: $grey-1;
    }
    @at-root .body--dark & {
      background-color: $dark-3;
    }
  }
}
</style>
