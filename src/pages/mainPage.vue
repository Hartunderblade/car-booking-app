<script setup>
import { RouterLink, RouterView } from "vue-router";
import Navigation from '@/pages/registrationPage.vue';
import Footer from '@/widgets/footer.vue';
</script>

<template>
  <div class="container">
    <header class="header">
      <nav class="navigation">
        <div class="navigation-logo">
          <h1 class="navigation-logo__img">ЭХ, ПРОКАЧУ!</h1>
        </div>
        <div class="navigation-links">
          <router-link class="navigation-links__link" to="/main/form"
            >Главная</router-link
          >
          <router-link class="navigation-links__link" to="/main/profile"
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
      
    </header>
    <main>
      <RouterView />
    </main>
    <footer>
      <Footer/>
    </footer>
  </div>
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
    column-gap: 1rem;

    &__link {
      font-weight: 500;
      font-size: 1.2rem;
      color: #000;
    }
  }

  &-icons {
    display: flex;
    align-items: center;
    column-gap: 1rem;
  }
}



a.router-link-active {
  border: 1px solid #000;
  border-radius: 100px;
  padding: 1rem;
}


</style>
