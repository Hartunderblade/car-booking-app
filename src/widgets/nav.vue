<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
    <nav class="navigation">
        <div class="navigation-logo">
          <h1 class="navigation-logo__img">ЭХ, ПРОКАЧУ!</h1>
        </div>
        <div class="navigation-links">
          <router-link class="navigation-links__link" to="/"
            >Главная</router-link
          >
          <router-link class="navigation-links__link" to="/profile"
            >Профиль</router-link
          >
        </div>
        <div class="navigation-icons">
          <img
            class="navigation-icons__img"
            src="@/app/images/whatsapp.svg"
            alt=""
          />
          <img
            class="navigation-icons__img"
            src="@/app/images/telegram.svg"
            alt=""
          />
        </div>
      </nav>
</template>

<style scoped lang="scss">
.navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1rem 0;

  &-links {
    display: flex;
    align-items: center;
    column-gap: 1.8rem;

    &__link {
      font-weight: 500;
      font-size: 1.2rem;
      color: #000;
    }
  }

  &-icons {
    display: flex;
    align-items: center;
    column-gap: 1.8rem;
  }
}



a.router-link-active {
  border: 1px solid #000;
  border-radius: 100px;
  padding: 16px;
}
</style>