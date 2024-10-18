<template>
  <div class="dl-container">
    <DeeplLanguageSelect />

    <div class="dl-text-container">
      <!-- German Example Text -->
      Das ist ein Beispieltext, der in deutscher Sprache angezeigt wird.
      Er wird in der Sprache angezeigt, die in der DeeplLanguageSelect Komponente ausgewählt wurde.
    </div>
  </div>
</template>

<style>
body {
  height: 3000px;
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Arial', sans-serif;
}
.dl-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.dl-text-container {
  margin-top: 20px;
  font-size: 16px;
  line-height: 1.5;
  max-width: 500px;
  background-color: #f7fafc;
  padding: 1rem;
  border-radius: 0.5rem;
  text-align: center;
}
</style>
