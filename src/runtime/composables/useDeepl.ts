import type { Ref } from 'vue'
import { nextTick, readonly } from 'vue'
import { type TargetLanguageCode } from 'deepl-node'
import { type ExtendedNode } from '../../types'
import { useCookie, useRuntimeConfig, useState } from '#imports'

/**
 * Retrieves the current language setting from the runtime configuration.
 *
 * This function uses the `useRuntimeConfig` composable to access the runtime configuration
 * and initializes a state variable `currentLanguage` with the default language specified
 * in the configuration.
 *
 * @returns {Ref<TargetLanguageCode>} A reference to the current language state.
 */
function getLanguage(): Ref<TargetLanguageCode> {
  const config = useRuntimeConfig()

  const currentLanguage = useState(
    'dl:currentLanguage',
    () => config.public.deepl.defaultLanguage as TargetLanguageCode,
  )

  return currentLanguage
}

/**
 * Retrieves the language preference stored in a cookie.
 *
 * @returns {Ref<TargetLanguageCode>} A reference to the target language code stored in the 'dl:language' cookie.
 */
function getLanguageCookie(): Ref<TargetLanguageCode> {
  const cookieLanguage = useCookie('dl:language', {
    sameSite: 'strict',
  })

  return cookieLanguage as Ref<TargetLanguageCode>
}

/**
 * Retrieves the default language setting from the runtime configuration.
 *
 * @returns {TargetLanguageCode | undefined} The default language specified in the public DeepL configuration, or undefined if not set.
 */
function getDefaultLanguage(): TargetLanguageCode | undefined {
  const config = useRuntimeConfig()

  return config.public.deepl?.defaultLanguage as TargetLanguageCode | undefined
}

/**
 * Retrieves the previously selected language from the state.
 *
 * @returns {Ref<TargetLanguageCode | undefined>} A reference to the previous language stored in the state.
 */
function getPreviousLanguage(): Ref<TargetLanguageCode | undefined> {
  const previousLanguage = useState('dl:previousLanguage', () => undefined)

  return previousLanguage
}

/**
 * Retrieves the current translating state.
 *
 * This function returns a reactive reference to a boolean value indicating
 * whether a translation process is currently ongoing. The initial state is set to `false`.
 *
 * @returns {Ref<boolean>} A reference to the translating state.
 */
function getTranslatingState(): Ref<boolean> {
  const isTranslating = useState('dl:isTranslating', () => false)

  return isTranslating
}

/**
 * Sets the target language for the application and updates the text content of the DOM elements accordingly.
 *
 * @param {TargetLanguageCode} targetLanguage - The language code to set as the target language.
 * @param {boolean} [silent] - If true, the language change will be applied silently without triggering translation animations.
 * @returns {Promise<Ref<string>>} - A promise that resolves to the current language state.
 *
 * This function performs the following steps:
 * 1. Updates the language cookie and state variables.
 * 2. Traverses the DOM to find text nodes that need to be translated.
 * 3. Applies the necessary style changes for the translation transition.
 * 4. Fetches translations from the server if needed.
 * 5. Updates the text content of the DOM elements with the translated text.
 * 6. Resets the style changes after the translation is applied.
 *
 * The function ensures that text nodes are not translated if they belong to certain elements (e.g., script, style, body) or if they have a `data-deepl-disable` attribute set to `true`.
 *
 * The function also handles the case where the target language is the default language, reverting the text content to its original state if necessary.
 */
async function setLanguage(targetLanguage: TargetLanguageCode, silent: boolean = false): Promise<Ref<TargetLanguageCode>> {
  const cookieLanguage = getLanguageCookie()
  const currentLanguage = getLanguage()
  const previousLanguage = getPreviousLanguage()
  const defaultLanguage = getDefaultLanguage()
  const isTranslating = getTranslatingState()
  const isUpdating = useState('dl:isUpdating', () => false)
  const config = useRuntimeConfig()
  const transitionDuration = 200
  const textNodes: { element: ExtendedNode, text: string }[] = []

  cookieLanguage.value = targetLanguage
  isTranslating.value = !silent
  isUpdating.value = silent

  if (currentLanguage.value !== targetLanguage) {
    previousLanguage.value = currentLanguage.value
  }

  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: (node) => {
        const parentNode = node.parentNode as HTMLElement
        if (
          ['script', 'style', 'body'].includes(parentNode.nodeName.toLowerCase())
          || parentNode.dataset?.deeplDisable === 'true'
        ) {
          return NodeFilter.FILTER_REJECT
        }
        return NodeFilter.FILTER_ACCEPT
      },
    },
    false,
  )

  let currentNode: ExtendedNode
  while ((currentNode = walker.nextNode() as ExtendedNode)) {
    const trimmedText = currentNode.textContent?.trim() || ''

    if (!currentNode.defaultTexts) {
      currentNode.defaultTexts = {}
    }

    if (
      trimmedText === ''
      || (currentNode.currentLanguage === targetLanguage
        && currentNode.textContent === currentNode.defaultTexts[currentLanguage.value])
    ) {
      continue
    }

    const styleElement = currentNode.style || currentNode.parentElement?.style
    if (styleElement) {
      currentNode.defaultStyleColor = styleElement.color
      styleElement.color = 'transparent'

      if (!styleElement.transition) {
        currentNode.hasTransition = true
        styleElement.transition = 'color ' + transitionDuration + 'ms'
      }
    }

    if (currentNode.defaultTexts[targetLanguage]) {
      currentNode.currentLanguage = targetLanguage
      currentNode.textContent = currentNode.defaultTexts[targetLanguage]
      currentNode.currentTextContent = currentNode.textContent
      const styleNode = currentNode.style ? currentNode : currentNode.parentElement
      if (styleNode?.style)
        styleNode.style.color = currentNode.defaultStyleColor || ''
      continue
    }

    if (targetLanguage === defaultLanguage && currentNode.textContent !== currentNode.defaultText) {
      currentNode.textContent = currentNode.defaultText || currentNode.textContent
      const styleNode = currentNode.style ? currentNode : currentNode.parentElement
      if (styleNode?.style)
        styleNode.style.color = currentNode.defaultStyleColor || ''
      continue
    }

    currentNode.defaultTexts[currentLanguage.value] = trimmedText
    currentNode.currentLanguage = targetLanguage

    textNodes.push({
      element: currentNode,
      text: trimmedText,
    })
  }

  await nextTick()

  if (config.public.deepl.defaultLanguage !== targetLanguage && textNodes.length) {
    const translationRequest = await fetch('/api/deepl', {
      method: 'POST',
      body: JSON.stringify({
        targetLanguage: targetLanguage,
        currentLanguage: silent ? defaultLanguage : previousLanguage.value,
        textNodes: textNodes.map(textNode => textNode.text),
      }),
    })
    const translation = await translationRequest.json()
    textNodes.forEach((node, i) => {
      const translatedText = translation.texts[i]
      if (!node.element.defaultText) {
        node.element.defaultText = node.element.textContent!
      }
      node.element.textContent = translatedText
      node.element.currentTextContent = translatedText

      const styleElement = node.element.style || node.element.parentElement?.style
      if (styleElement) {
        styleElement.color = node.element.defaultStyleColor || ''
        if (node.element.hasTransition) {
          setTimeout(() => {
            styleElement.transition = ''
          }, transitionDuration)
        }
      }
    })
  }
  else {
    textNodes.forEach((node) => {
      const styleElement = node.element.style || node.element.parentElement?.style
      if (styleElement)
        styleElement.color = node.element.defaultStyleColor || ''
    })
  }

  isTranslating.value = false
  isUpdating.value = false
  currentLanguage.value = targetLanguage

  return currentLanguage
}

export function useDeepl() {
  return {
    currentLanguage: readonly(getLanguage()),
    previousLanguage: readonly(getPreviousLanguage()),
    defaultLanguage: getDefaultLanguage(),
    cookieLanguage: readonly(getLanguageCookie()),
    isTranslating: readonly(getTranslatingState()),
    setLanguage,
  }
}
