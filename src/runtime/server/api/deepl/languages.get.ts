import * as deepl from 'deepl-node'
import { createError } from 'h3'
import { consola } from 'consola'
import { defineEventHandler, useRuntimeConfig, useStorage } from '#imports'

export default defineEventHandler(async () => {
  const deeplStorage = await useStorage('deepl')
  const config = useRuntimeConfig()

  try {
    const cachedTranslations = await deeplStorage.getItem('languages')

    if (cachedTranslations) {
      return {
        translations: cachedTranslations,
      }
    }

    const translator = new deepl.Translator(config.deepl.apiKey)
    const sourceLanguages = await translator.getSourceLanguages()

    deeplStorage.setItem('languages', sourceLanguages)

    consola.info('Languages fetched successfully')

    return {
      languages: sourceLanguages,
    }
  }
  catch (e) {
    consola.error(e)

    throw createError({
      statusCode: 404,
      message: 'No languages found',
    })
  }
})
