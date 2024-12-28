<script setup>
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import axios from 'axios';

const email = ref('');
const password = ref('');

const error = ref('');

const router = useRouter();

const loginUser = async () => {
  try {
    const response = await axios.post('http://localhost:3000/login', {
      email: email.value,
      password: password.value,
    });

    const { token, role, user } = response.data;

    // Сохраняем токен и данные пользователя
    localStorage.setItem('token', token);
    if (role === 'admin') {
      // Если администратор, перенаправляем на страницу администратора
      router.push('/admin');
    } else {
      // Если пользователь, сохраняем данные и перенаправляем на профиль
      localStorage.setItem('user', JSON.stringify(user));
      router.push('/main/profile');
    }
  } catch (err) {
    error.value = err.response?.data?.error || 'Ошибка входа';
  }
};

</script>

<template>
  <div class="container">
    <div class="wrapper">
      <div class="nav">
        <h1 class="nav__logo">ЭХ, ПРОКАЧУ!</h1>
      </div>
      <div class="auth">
        <form class="form" @submit.prevent="loginUser">
          <p class="form__title">ВХОД</p>
          <input class="form__input" type="email" placeholder="Почта" name="email" v-model="email" required />
          <input class="form__input" type="password" placeholder="Пароль" name="password" v-model="password" required />
          <p class="error" v-if="error">{{ error }}</p>
          <button class="form__signup" type="submit">Войти</button>
        </form>
        <button @click="router.push({ path: '/registration' })" class="auth__signin">или Зарегистрируйся</button>
        <div class="auth-image">
          <img src="@/app/images/bc-auth.jpg" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  max-width: 1540px;
  margin: 0 auto;
  width: 100%;
  //   position: absolute;
}

.nav {
  margin-top: 1rem;
}

.auth {
  // display: flex;
  // justify-content: space-between;


  &-image {
    position: absolute;
    top: 0;
    right: 0;
  }

  &__signin {
    margin-top: 1rem;
    border-bottom: 1px solid #252525;
  }
}

.form {
  display: flex;
  flex-direction: column;
  align-items: left;
  // text-align: center;
  row-gap: 1.8rem;
  margin-top: 10rem;

  &__title {
    font-size: 1.8rem;
    margin-bottom: 1rem;
  }

  &__input {
    font-weight: 100;
    font-size: 1.1rem;
    color: #464646;
    border-bottom: 1px solid #1e1e1e;
    padding-bottom: 0.6rem;
    max-width: 630px;
  }

  &__signup {
    text-align: center;
    border: 1px solid #1e1e1e;
    border-radius: 1rem;
    padding: 1.6rem 0;
    font-weight: 500;
    font-size: 1.4rem;
    color: #1e1e1e;
    width: 630px;
    margin-top: 1.6rem;
  }
}

.error {
  color: #ff5151;
}
</style>
