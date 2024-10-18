<!--
Get your module up and running quickly.

Find and replace all on all files (CMD+SHIFT+F):
- Name: My Module
- Package name: my-module
- Description: My new Nuxt module
-->

# Nuxt Deepl Module

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

My new Nuxt module for doing amazing things.

- [✨ &nbsp;Release Notes](/CHANGELOG.md)

<!-- - [🏀 Online playground](https://stackblitz.com/github/your-org/my-module?file=playground%2Fapp.vue) -->

<!-- - [📖  Documentation](https://example.com) -->

## Features

- ⛰ &nbsp;Automatically translate texts
- 🚠 &nbsp;Translate reactive values
- 🚠 &nbsp;Data protection compliant thanks to its own endpoint
- 🌲 &nbsp;Built-In Caching
- 🌲 &nbsp;Preconfigured language selection component

## Requirements

## Installation

Install the module to your Nuxt application with one command:

```bash
npx nuxi module add my-module
```

That's it! You can now use My Module in your Nuxt app ✨

## Basic Usage

### Use Selection Component

### Manual Translation

### useDeepl Composable

## Buy me a coffee

## Future Roadmap

## Contribution

<details>
  <summary>Local development</summary>

```bash
# Install dependencies
npm install

# Generate type stubs
npm run dev:prepare

# Develop with the playground
npm run dev

# Build the playground
npm run dev:build

# Run ESLint
npm run lint

# Run Vitest
npm run test
npm run test:watch

# Release new version
npm run release
```

</details>

<!-- Badges -->

**Overview**

The Nuxt Deepl Module offers a solution for transforming single-language Nuxt.js websites into multi-language sites without the complexities of manual translation. By leveraging the DeepL API, this module automates the translation process, ensuring a seamless user experience across various languages.

**Requirements**

* Nuxt.js 3.x or later
* A DeepL API account

**Key Features**

* 🤖 **Automated Translation:** Effortlessly translate website content into multiple languages using the DeepL API.
* ⚡️ **Caching:** Enhance performance by caching DeepL API responses, reducing load times and improving user satisfaction.
* 🗣️ **Language Selection:** Provide users with a user-friendly language selector component for easy language switching.
* 🍪 **Cookie-Based Preferences:** Remember user language preferences using cookies, delivering a personalized experience.
* 🔒 **Secure DeepL Requests:** Maintain data privacy and security with a built-in proxy for secure DeepL API interactions.

**Installation and Setup**

1. Install the module using npm or yarn:
   **Bash**

   ```
   npm install @nuxtjs/deepl
   ```

   **Verwende den Code **[mit Vorsicht](/faq#coding)**.**
2. Add the module to your `nuxt.config.js` file:
   **JavaScript**

   ```
   export default {
     modules: [
       '@nuxtjs/deepl'
     ],
     deepl: {
       apiKey: 'YOUR_DEEPL_API_KEY'
     }
   }
   ```

   **Verwende den Code **[mit Vorsicht](/faq#coding)**.**

**Usage**

* **DeeplLanguageSelect Component:** Utilize the pre-built`DeeplLanguageSelect` component for a straightforward language selection interface.
* **useDeepl Composable:** Employ the`useDeepl` composable to programmatically access the DeepL translation functionality within your Vue components.

**Future Development**

* **Additional Language Providers:** Explore integration with other translation APIs to expand language options.
* **Customization:** Offer greater flexibility for customizing the language selector component and overall module behavior.
* **Performance Optimization:** Continuously refine the module's performance and efficiency.

[npm-version-src]: https://img.shields.io/npm/v/nuxt-deepl-module/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/nuxt-deepl-module
[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-deepl-module.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npmjs.com/package/nuxt-deepl-module
[license-src]: https://img.shields.io/npm/l/nuxt-deepl-module.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/nuxt-deepl-module
[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt.js
[nuxt-href]: https://nuxt.com
