import { debug } from 'node:console'
import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  useLogger,
  addComponentsDir,
  addServerScanDir,
  addImportsDir,
} from '@nuxt/kit'

import { defu } from 'defu'
import { type ModuleOptions } from './types'

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-deepl-module',
    configKey: 'deepl',
  },
  // Default configuration options of the Nuxt module
  defaults: {
    apiKey: null,
    apiUrl: {
      pro: 'https://api.deepl.com/v2',
      free: 'https://api-free.deepl.com/v2',
    },
    glossaryPairs: [],
    apiType: 'free',
    defaultLanguage: 'de',
    useCache: true,
    useCookie: true,
    debug: false,
  },
  setup(options, nuxt) {
    const logger = useLogger('deepl-module')
    const resolver = createResolver(import.meta.url)
    nuxt.options.runtimeConfig.deepl = defu(nuxt.options.runtimeConfig.deepl, {
      apiKey: options.apiKey,
      apiUrl: options.apiUrl,
      glossaryPairs: options.glossaryPairs,
      useCache: options.useCache,
    })

    nuxt.options.runtimeConfig.public.deepl = defu(
      nuxt.options.runtimeConfig.public.deepl,
      {
        defaultLanguage: options.defaultLanguage,
        useCookie: options.useCookie,
        debug: options.debug,
      },
    )

    if (!nuxt.options.runtimeConfig.deepl || !nuxt.options.runtimeConfig.deepl.apiKey) {
      logger.warn('No API key provided. Please provide an API key to use the DeepL module.')
    }

    /* Add runtime imports */
    addImportsDir(resolver.resolve('./runtime/composables'))

    /* Add runtime components */
    addComponentsDir({
      path: resolver.resolve('./runtime/components'),
    })

    addServerScanDir(resolver.resolve('./runtime/server'))

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin(resolver.resolve('./runtime/plugin'))
  },
})
