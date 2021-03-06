<template lang='pug'>
  q-page.admin-theme
    .row.q-pa-md.items-center
      .col-auto
        img.admin-icon.animated.fadeInLeft(src='~assets/icons/fluent-paint-roller.svg')
      .col.q-pl-md
        .text-h5.text-primary.animated.fadeInLeft {{ $t('admin.theme.title') }}
        .text-subtitle1.text-grey.animated.fadeInLeft.wait-p2s {{ $t('admin.theme.subtitle') }}
      .col-auto
        q-spinner-tail.q-mr-md(
          v-show='loading'
          color='accent'
          size='sm'
        )
        q-btn.q-mr-sm.acrylic-btn(
          icon='las la-question-circle'
          flat
          color='grey'
          href='https://docs.js.wiki/theming'
          target='_blank'
          )
        q-btn(
          unelevated
          icon='mdi-check'
          :label='$t(`common.actions.apply`)'
          color='secondary'
          @click='save'
          :loading='loading'
        )
    q-separator(inset)
    .row.q-pa-md.q-col-gutter-md
      .col-6
        //- -----------------------
        //- Theme Options
        //- -----------------------
        q-card.shadow-1.q-pb-sm
          q-card-section.flex.items-center
            .text-subtitle1 {{$t('admin.theme.options')}}
            q-space
            q-btn.acrylic-btn(
              icon='las la-redo-alt'
              :label='$t(`admin.theme.resetDefaults`)'
              flat
              size='sm'
              color='pink'
              @click='resetColors'
            )
          q-item(tag='label', v-ripple)
            blueprint-icon(icon='light-on')
            q-item-section
              q-item-label {{$t(`admin.theme.darkMode`)}}
              q-item-label(caption) {{$t(`admin.theme.darkModeHint`)}}
            q-item-section(avatar)
              q-toggle(
                v-model='config.dark'
                color='primary'
                checked-icon='las la-check'
                unchecked-icon='las la-times'
                :aria-label='$t(`admin.theme.darkMode`)'
                )
          template(v-for='(cl, idx) of colorKeys')
            q-separator.q-my-sm(inset)
            q-item(:key='cl')
              blueprint-icon(icon='fill-color')
              q-item-section
                q-item-label {{$t(`admin.theme.` + cl + `Color`)}}
                q-item-label(caption) {{$t(`admin.theme.` + cl + `ColorHint`)}}
              q-item-section(side)
                .text-caption.text-grey-6 {{config[`color` + startCase(cl)]}}
              q-item-section(side)
                q-btn.q-mr-sm(
                  :key='`btnpick-` + cl'
                  glossy
                  padding='xs md'
                  no-caps
                  size='sm'
                  :color='cl'
                  )
                  q-icon(name='las la-fill', size='xs', left)
                  span Pick...
                  q-menu
                    q-color(
                      v-model='config[`color` + startCase(cl)]'
                    )

        //- -----------------------
        //- Theme Layout
        //- -----------------------
        q-card.shadow-1.q-pb-sm.q-mt-md
          q-card-section
            .text-subtitle1 {{$t('admin.theme.layout')}}
          q-item
            blueprint-icon(icon='right-navigation-toolbar')
            q-item-section
              q-item-label {{$t(`admin.theme.sidebarPosition`)}}
              q-item-label(caption) {{$t(`admin.theme.sidebarPositionHint`)}}
            q-item-section.col-auto
              q-btn-toggle(
                v-model='config.sidebarPosition'
                push
                glossy
                no-caps
                toggle-color='primary'
                :options=`[
                  { label: 'Left', value: 'left' },
                  { label: 'Right', value: 'right' }
                ]`
              )
          q-separator.q-my-sm(inset)
          q-item
            blueprint-icon(icon='index')
            q-item-section
              q-item-label {{$t(`admin.theme.tocPosition`)}}
              q-item-label(caption) {{$t(`admin.theme.tocPositionHint`)}}
            q-item-section.col-auto
              q-btn-toggle(
                v-model='config.tocPosition'
                push
                glossy
                no-caps
                toggle-color='primary'
                :options=`[
                  { label: 'Left', value: 'left' },
                  { label: 'Right', value: 'right' }
                ]`
              )
          q-separator.q-my-sm(inset)
          q-item(tag='label', v-ripple)
            blueprint-icon(icon='share')
            q-item-section
              q-item-label {{$t(`admin.theme.showSharingMenu`)}}
              q-item-label(caption) {{$t(`admin.theme.showSharingMenuHint`)}}
            q-item-section(avatar)
              q-toggle(
                v-model='config.showSharingMenu'
                color='primary'
                checked-icon='las la-check'
                unchecked-icon='las la-times'
                :aria-label='$t(`admin.theme.showSharingMenu`)'
                )
          q-separator.q-my-sm(inset)
          q-item(tag='label', v-ripple)
            blueprint-icon(icon='print')
            q-item-section
              q-item-label {{$t(`admin.theme.showPrintBtn`)}}
              q-item-label(caption) {{$t(`admin.theme.showPrintBtnHint`)}}
            q-item-section(avatar)
              q-toggle(
                v-model='config.showPrintBtn'
                color='primary'
                checked-icon='las la-check'
                unchecked-icon='las la-times'
                :aria-label='$t(`admin.theme.showPrintBtn`)'
                )

      .col-6
        //- -----------------------
        //- Code Injection
        //- -----------------------
        q-card.shadow-1.q-pb-sm
          q-card-section
            .text-subtitle1 {{$t('admin.theme.codeInjection')}}
          q-item
            blueprint-icon(icon='css')
            q-item-section
              q-item-label {{$t(`admin.theme.cssOverride`)}}
              q-item-label(caption) {{$t(`admin.theme.cssOverrideHint`)}}
          q-item
            q-item-section
              q-no-ssr(:placeholder='$t(`common.loading`)')
                codemirror.admin-theme-cm(
                  ref='cmCSS'
                  v-model='config.injectCSS'
                  :options='{ mode: `text/css` }'
                  @ready='onCmReady'
                )
          q-separator.q-my-sm(inset)
          q-item
            blueprint-icon(icon='html')
            q-item-section
              q-item-label {{$t(`admin.theme.headHtmlInjection`)}}
              q-item-label(caption) {{$t(`admin.theme.headHtmlInjectionHint`)}}
          q-item
            q-item-section
              q-no-ssr(:placeholder='$t(`common.loading`)')
                codemirror.admin-theme-cm(
                  ref='cmHead'
                  v-model='config.injectHead'
                  :options='{ mode: `text/html` }'
                  @ready='onCmReady'
                )
          q-separator.q-my-sm(inset)
          q-item
            blueprint-icon(icon='html')
            q-item-section
              q-item-label {{$t(`admin.theme.bodyHtmlInjection`)}}
              q-item-label(caption) {{$t(`admin.theme.bodyHtmlInjectionHint`)}}
          q-item
            q-item-section
              q-no-ssr(:placeholder='$t(`common.loading`)')
                codemirror.admin-theme-cm(
                  ref='cmBody'
                  v-model='config.injectBody'
                  :options='{ mode: `text/html` }'
                  @ready='onCmReady'
                )
</template>

<script>
import gql from 'graphql-tag'
import { get } from 'vuex-pathify'
import _get from 'lodash/get'
import cloneDeep from 'lodash/cloneDeep'
import startCase from 'lodash/startCase'
import { colors } from 'quasar'

export default {
  meta () {
    return {
      title: this.$t('admin.theme.title')
    }
  },
  data () {
    return {
      loading: false,
      colorKeys: [
        'primary',
        'secondary',
        'accent',
        'header',
        'sidebar'
      ],
      config: {
        dark: false,
        injectCSS: '',
        injectHead: '',
        injectBody: '',
        colorPrimary: '#1976D2',
        colorSecondary: '#02C39A',
        colorAccent: '#f03a47',
        colorHeader: '#000',
        colorSidebar: '#1976D2',
        sidebarPosition: 'left',
        tocPosition: 'right',
        showSharingMenu: true,
        showPrintBtn: true
      },
      darkModeInitial: false
    }
  },
  computed: {
    currentSiteId: get('admin/currentSiteId')
  },
  watch: {
    'config.dark' (newValue) {
      this.$q.dark.set(newValue)
      this.$refs.cmCSS.codemirror.setOption('theme', newValue ? 'material-ocean' : 'elegant')
      this.$refs.cmHead.codemirror.setOption('theme', newValue ? 'material-ocean' : 'elegant')
      this.$refs.cmBody.codemirror.setOption('theme', newValue ? 'material-ocean' : 'elegant')
    },
    'config.colorPrimary' (newValue) {
      colors.setBrand('primary', newValue)
    },
    'config.colorSecondary' (newValue) {
      colors.setBrand('secondary', newValue)
    },
    'config.colorAccent' (newValue) {
      colors.setBrand('accent', newValue)
    },
    'config.colorHeader' (newValue) {
      colors.setBrand('header', newValue)
    },
    'config.colorSidebar' (newValue) {
      colors.setBrand('sidebar', newValue)
    },
    currentSiteId () {
      this.fetchConfig()
    }
  },
  mounted () {
    this.fetchConfig()
  },
  beforeDestroy () {
    this.$q.dark.set(this.darkModeInitial)
  },
  methods: {
    startCase,
    onCmReady (cm) {
      cm.setOption('theme', this.$q.dark.isActive ? 'material-ocean' : 'elegant')
      cm.setSize(null, 200)
    },
    resetColors () {
      this.config.dark = false
      this.config.colorPrimary = '#1976D2'
      this.config.colorSecondary = '#02C39A'
      this.config.colorAccent = '#f03a47'
      this.config.colorHeader = '#000'
      this.config.colorSidebar = '#1976D2'
    },
    async fetchConfig () {
      if (!this.currentSiteId) { return }

      this.loading = true
      try {
        const resp = await this.$apollo.query({
          query: gql`
            query (
              $id: UUID!
            ) {
              siteById(
                id: $id
              ) {
                theme {
                  dark
                  colorPrimary
                  colorSecondary
                  colorAccent
                  colorHeader
                  colorSidebar
                  injectCSS
                  injectHead
                  injectBody
                  sidebarPosition
                  tocPosition
                  showSharingMenu
                  showPrintBtn
                }
              }
            }
          `,
          variables: {
            id: this.currentSiteId
          },
          fetchPolicy: 'network-only'
        })
        if (!resp?.data?.siteById?.theme) {
          throw new Error('Failed to fetch theme config.')
        }
        this.config = cloneDeep(resp.data.siteById.theme)
        this.darkModeInitial = this.config.dark
      } catch (err) {
        this.$q.notify({
          type: 'negative',
          message: 'Failed to fetch site theme config'
        })
      }
      this.loading = false
    },
    async save () {
      this.loading = true
      this.$store.commit('loadingStart', 'admin-theme-save')
      try {
        const respRaw = await this.$apollo.mutate({
          mutation: gql`
            mutation(
              $id: UUID!
              $patch: SiteUpdateInput!
              ) {
              updateSite (
                id: $id,
                patch: $patch
                ) {
                status {
                  succeeded
                  slug
                  message
                }
              }
            }
          `,
          variables: {
            id: this.currentSiteId,
            patch: {
              theme: {
                dark: this.config.dark,
                colorPrimary: this.config.colorPrimary,
                colorSecondary: this.config.colorSecondary,
                colorAccent: this.config.colorAccent,
                colorHeader: this.config.colorHeader,
                colorSidebar: this.config.colorSidebar,
                injectCSS: this.config.injectCSS,
                injectHead: this.config.injectHead,
                injectBody: this.config.injectBody,
                sidebarPosition: this.config.sidebarPosition,
                tocPosition: this.config.tocPosition,
                showSharingMenu: this.config.showSharingMenu,
                showPrintBtn: this.config.showPrintBtn
              }
            }
          }
        })
        const resp = _get(respRaw, 'data.updateSite.status', {})
        if (resp.succeeded) {
          this.darkModeInitial = this.darkMode
          this.$q.notify({
            type: 'positive',
            message: this.$t('admin.theme.saveSuccess')
          })
        } else {
          throw new Error(resp.message)
        }
      } catch (err) {
        this.$q.notify({
          type: 'negative',
          message: 'Failed to save site theme config',
          caption: err.message
        })
      }
      this.$store.commit('loadingStop', 'admin-theme-save')
      this.loading = false
    }
  }
}
</script>

<style lang='scss'>
.admin-theme-cm {
  border: 1px solid #CCC;
  border-radius: 5px;
  overflow: hidden;

  > .CodeMirror {
    height: 150px;
  }
}
</style>
