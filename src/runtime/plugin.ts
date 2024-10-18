import { nextTick } from 'vue'
import type { VNode } from 'vue'
import { useLogger } from '../helper'
import { useDeepl } from './composables/useDeepl'
import { defineNuxtPlugin } from '#app'
import { useRuntimeConfig } from '#imports'

export default defineNuxtPlugin((nuxtApp) => {
  const logger = useLogger()
  nuxtApp.hook('app:beforeMount', async () => {
    const { currentLanguage, setLanguage, previousLanguage, defaultLanguage, isTranslating, cookieLanguage }
      = useDeepl()
    const config = useRuntimeConfig()
    const nuxtElement = document.getElementById('__nuxt')

    if (!nuxtElement) {
      logger.error('No Nuxt element found')
      return
    }
    // Set the language to the cookie value if it is set and different from the current language
    if (config.public.deepl.useCookie && cookieLanguage.value && currentLanguage.value !== cookieLanguage.value) {
      setLanguage(cookieLanguage.value)
      logger.info('Set language to cookie value')
    }

    await nextTick()

    const observer = new MutationObserver(async (list, observer) => {
      if (isTranslating.value || (previousLanguage.value === currentLanguage.value || currentLanguage.value === defaultLanguage)) return
      const elements = Array.from(list)
        .filter((element: MutationRecord) => {
          const targetElement = element.target as Element
          return typeof targetElement.hasAttribute !== 'function' || (!targetElement.hasAttribute('data-deepl-disable') && (!targetElement.hasAttribute('data-deepl-watch') && targetElement.getAttribute('data-deepl-watch') !== 'false'))
        })
        .map(mutation => mutation.target)

      if (elements.length === 0) return
      observer.disconnect()
      await nextTick()
      await setLanguage(currentLanguage.value, true)
      observer.observe(nuxtElement, {
        characterData: true,
        attributes: false,
        childList: true,
        subtree: true,
      })
    })

    observer.observe(nuxtElement, {
      characterData: true,
      attributes: false,
      childList: true,
      subtree: true,
    })
  })

  nuxtApp.vueApp.directive('deepl', {
    async mounted(el, binding, vnode: VNode) {
      const setAttributeToChildren = function (vnode: VNode, attributeName: string, attributeValue: string): void {
        if (Array.isArray(vnode.children) && vnode.children.length > 0) {
          (vnode.children as VNode[]).forEach((child: VNode) => {
            if (child && child.el && typeof child.el.setAttribute === 'function') {
              child.el.setAttribute(attributeName, attributeValue)
            }
            setAttributeToChildren(child, attributeName, attributeValue)
          })
        }
      }
      /**
       * The directive is used to disable the translation of elements and child elements.
       */
      if (binding.arg === 'disable') {
        el.setAttribute('data-deepl-disable', 'true')
        setAttributeToChildren(vnode, 'data-deepl-disable', 'true')
      }

      /**
       * The directive is used to ignore elements from mutations but listen to setLanguage function.
       */
      if (binding.arg === 'watch' && binding.value === false) {
        el.setAttribute('data-deepl-watch', 'false')
        setAttributeToChildren(vnode, 'data-deepl-watch', 'false')
      }
    },
  })

  return {
    provide: {
      deepl: useDeepl(),
    },
  }
})
