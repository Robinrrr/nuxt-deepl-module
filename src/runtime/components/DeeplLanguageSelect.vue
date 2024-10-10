<template>
  <div
    v-if="selectedLanguages && selectedLanguages.length"
    ref="dropdownElement"
    v-deepl:watch="false"
    class="dl-dropdown"
  >
    <!-- Focus Trap START --->
    <div
      v-if="isOpen"
      tabindex="0"
      aria-hidden="true"
      @focus="focusLastElement"
    />

    <!-- ====== Trigger Button ====== -->

    <button
      id="dl-options-menu"
      class="dl-dropdown__button"
      type="button"
      aria-haspopup="true"
      :aria-expanded="isOpen"
      :class="{ 'is-active': isOpen }"
      @click="isOpen ? closeDropdown() : openDropdown()"
      @focus="isOpen ? focusLastElement : null"
    >
      <slot
        name="button"
        :is-open="isOpen"
      >
        <span class="dl-dropdown__button-icon-wrapper">

          <transition name="dl-transition-icon">
            <svg
              v-if="isTranslating"
              width="16"
              height="16"
              stroke="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              class="dl-dropdown__button-icon dl-dropdown__button-icon--prefix"
            ><g class="dl-icon-spinner"><circle
              cx="10"
              cy="10"
              r="7.5"
              fill="none"
              stroke-width="2"
            /></g></svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              class="dl-dropdown__button-icon dl-dropdown__button-icon--prefix"
            >
              <path d="M7.75 2.75a.75.75 0 0 0-1.5 0v1.258a32.987 32.987 0 0 0-3.599.278.75.75 0 1 0 .198 1.487A31.545 31.545 0 0 1 8.7 5.545 19.381 19.381 0 0 1 7 9.56a19.418 19.418 0 0 1-1.002-2.05.75.75 0 0 0-1.384.577 20.935 20.935 0 0 0 1.492 2.91 19.613 19.613 0 0 1-3.828 4.154.75.75 0 1 0 .945 1.164A21.116 21.116 0 0 0 7 12.331c.095.132.192.262.29.391a.75.75 0 0 0 1.194-.91c-.204-.266-.4-.538-.59-.815a20.888 20.888 0 0 0 2.333-5.332c.31.031.618.068.924.108a.75.75 0 0 0 .198-1.487 32.832 32.832 0 0 0-3.599-.278V2.75Z" />
              <path
                fill-rule="evenodd"
                d="M13 8a.75.75 0 0 1 .671.415l4.25 8.5a.75.75 0 1 1-1.342.67L15.787 16h-5.573l-.793 1.585a.75.75 0 1 1-1.342-.67l4.25-8.5A.75.75 0 0 1 13 8Zm2.037 6.5L13 10.427 10.964 14.5h4.073Z"
                clip-rule="evenodd"
              />
            </svg>
          </transition>
        </span>

        <span class="dl-dropdown__button-language">
          {{ currentLanguage.name }}
        </span>

        <span class="dl-dropdown__button-icon-wrapper">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
            class="dl-dropdown__button-icon dl-dropdown__button-icon--suffix"
          >
            <path
              fill-rule="evenodd"
              d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
              clip-rule="evenodd"
            />
          </svg>
        </span>
      </slot>
    </button>

    <!-- ====== Dropdown Menu ====== -->

    <div
      v-show="isOpen"
      ref="dropdownMenuElement"
      :class="['dl-dropdown__menu', 'is-' + dropdownPositionY, 'is-' + dropdownPositionX]"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="dl-options-menu"
    >
      <slot
        name="menu"
        :selected-languages="selectedLanguages"
        :set-language="setLanguage"
      >
        <ul class="dl-dropdown__menu-list">
          <li
            v-for="(lang, index) in sortedLanguages"
            :key="index"
            class="dl-dropdown__menu-list-item"
            :class="{ 'is-active': currentLanguage.code === lang.code }"
          >
            <button
              class="dl-dropdown__menu-list-button"
              @click="[closeDropdown(true), setLanguage(lang.code)]"
            >
              {{ lang.name }}
            </button>
          </li>
        </ul>
      </slot>

      <!-- Focus Trap END --->
      <div
        tabindex="0"
        aria-hidden="true"
        @focus="focusFirstElement(false)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'
import { languages, languageCodes } from '../../assets/languages'
import type { LanguageArray } from '../../types/index'
import { useDeepl } from '#imports'
import type { Ref } from '#imports'

const { currentLanguage: language, setLanguage, isTranslating } = useDeepl()

const props = defineProps({
  selectedLanguages: {
    type: Array as () => LanguageArray,
    validator: (value: LanguageArray) => {
      return value.every(lang => languageCodes.includes(lang.code))
    },
    default: () => languages,
    required: false,
  },
  useStyles: {
    type: Boolean,
    default: true,
    required: false,
  },
})

const isOpen = ref(false)
const dropdownElement: Ref<HTMLElement | null> = ref(null)
const dropdownMenuElement: Ref<HTMLElement | null> = ref(null)
const dropdownPositionY = ref('bottom')
const dropdownPositionX = ref('right')

const currentLanguage = computed(() => {
  return languages.find(lang => lang.code === language.value) as typeof languages[0]
})

const sortedLanguages = computed(() => {
  return [...props.selectedLanguages].sort((a, b) => {
    if (a.code === currentLanguage.value.code) return -1
    if (b.code === currentLanguage.value.code) return 1
    return 0
  })
})

const openDropdown = async () => {
  isOpen.value = true
  adjustDropdownPosition()
  await nextTick()
  focusFirstElement(true)
}

const closeDropdown = (focus: boolean = false) => {
  isOpen.value = false
  dropdownPositionY.value = 'bottom'
  dropdownPositionX.value = 'left'
  if (focus) focusFirstElement(false)
}

const adjustDropdownPosition = () => {
  if (!dropdownMenuElement.value || !dropdownElement.value) return
  const dropdownMenuElementStyle = dropdownMenuElement.value.style
  const originalDisplay = dropdownMenuElementStyle.display

  // Temporarily show the element to measure its dimensions
  dropdownMenuElementStyle.display = 'block'
  const dropdownMenuRect = dropdownMenuElement.value.getBoundingClientRect()
  const dropdownRect = dropdownElement.value.getBoundingClientRect()

  // Revert the display property back to its original value
  dropdownMenuElementStyle.display = originalDisplay
  const viewportHeight = window.innerHeight
  const viewportWidth = window.innerWidth

  const spaceAbove = dropdownMenuRect.top
  const spaceBelow = viewportHeight - dropdownMenuRect.bottom
  const spaceLeft = dropdownMenuRect.left
  const spaceRight = viewportWidth - dropdownMenuRect.right

  if (spaceBelow >= (dropdownMenuRect.height + dropdownRect.height)) {
    dropdownPositionY.value = 'bottom'
  }
  else if (spaceAbove >= (dropdownMenuRect.height + dropdownRect.height)) {
    dropdownPositionY.value = 'top'
  }
  else {
    dropdownPositionY.value = 'bottom' // Default Y fallback
  }
  if (spaceLeft >= dropdownMenuRect.width) {
    dropdownPositionX.value = 'left'
  }
  else if (spaceRight >= dropdownMenuRect.width) {
    dropdownPositionX.value = 'right'
  }
  else {
    dropdownPositionX.value = 'right' // Default X fallback
  }
}

const focusFirstElement = (innerElement: boolean) => {
  const element = innerElement ? dropdownMenuElement.value : dropdownElement.value
  if (!element) return
  const focusableElements = element.querySelectorAll('button, [href], input, select, textarea')
  if (focusableElements.length) {
    (focusableElements[0] as HTMLElement).focus()
  }
}

const focusLastElement = () => {
  const element = dropdownMenuElement.value
  if (!element) return
  const focusableElements = element.querySelectorAll('button, [href], input, select, textarea')
  if (focusableElements.length) {
    (focusableElements[focusableElements.length - 1] as HTMLElement).focus()
  }
}

/* Close dropdown when clicking outside */
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownElement.value && event.target && !dropdownElement.value.contains(event.target as Node)) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style>
@import '../../assets/style.css';
</style>
