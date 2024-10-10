import * as deepl from 'deepl-node'
import { readBody, createError } from 'h3'
import { consola } from 'consola'
import { arrayToUniqueHash, sanitizeLanguageCode } from '../../../../helper'
import { type GlossaryPair } from '../../../../types'
import { defineEventHandler, useRuntimeConfig, useStorage } from '#imports'

interface ParsedBody {
  targetLanguage: string
  currentLanguage?: string | null
  textNodes: string[]
}

export default defineEventHandler(async (event): Promise<{ texts: string[] } | void> => {
  const deeplStorage = await useStorage('deepl')
  const config = useRuntimeConfig()
  const body = await readBody(event)

  try {
    const parsedBody: ParsedBody = JSON.parse(body)
    const targetLanguage = parsedBody.targetLanguage as deepl.TargetLanguageCode
    const currentLanguage = parsedBody.currentLanguage as deepl.LanguageCode || null
    const sourceLanguage = sanitizeLanguageCode(currentLanguage)
    const translator = new deepl.Translator(config.deepl.apiKey)
    const { textNodes } = parsedBody
    const textNodeHash = arrayToUniqueHash(textNodes)
    const cachedTextNodes: string[] | null = await deeplStorage.getItem(textNodeHash + targetLanguage + sourceLanguage)

    // Check if the text nodes are already cached and cache is enabled
    if (config.deepl.useCache && cachedTextNodes) {
      return {
        texts: cachedTextNodes,
      }
    }

    if (!Array.isArray(parsedBody.textNodes) || !targetLanguage) {
      consola.error('No text or target language specified')

      throw createError({
        statusCode: 400,
        message: 'No text or target language specified',
      })
    }

    // Get the glossary ID if it exists
    const glossaryId = config.deepl.glossaryPairs?.find((pair: GlossaryPair) => pair.source === sourceLanguage && pair.target === targetLanguage)?.uuid

    const results: deepl.TextResult[] | deepl.TextResult = await translator.translateText(parsedBody.textNodes, sourceLanguage, targetLanguage, {
      glossary: glossaryId,
    })

    if (!Array.isArray(results)) {
      throw createError({
        statusCode: 500,
        message: 'Something went wrong',
      })
    }

    const TextResults: string[] = results.map((result: deepl.TextResult) => {
      return result.text
    })

    // Cache the text nodes if caching is enabled
    if (config.deepl.useCache) {
      await deeplStorage.setItem(textNodeHash + targetLanguage + sourceLanguage, TextResults)
    }

    return {
      texts: TextResults,
    }
  }
  catch (e) {
    consola.error(e)

    throw createError({
      statusCode: 500,
      message: 'No text results',
    })
  }
})
