import { type TargetLanguageCode, type SourceLanguageCode } from 'deepl-node'

export type GlossaryPair = { uuid: string, source: SourceLanguageCode, target: TargetLanguageCode }

export type LanguageArray = Array<{ code: TargetLanguageCode, name: string }>

export interface ModuleOptions {
  apiKey: string | undefined
  apiUrl: {
    free: string
    pro: string
  }
  apiType: 'free' | 'pro'
  glossaryPairs?: GlossaryPair[]
  useCache?: boolean
  useCookie?: boolean
  defaultLanguage: SourceLanguageCode
  debug?: boolean
}

export interface ExtendedNode extends Node {
  defaultTexts?: { [key: string]: string }
  currentLanguage?: string
  currentTextContent?: string
  defaultText?: string
  defaultStyleColor?: string
  hasTransition?: boolean
  style?: CSSStyleDeclaration
}
