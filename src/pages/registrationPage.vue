<script setup>
import { RouterLink } from 'vue-router';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import axios from 'axios';

// Поля формы
const fullName = ref('');
const phone = ref('');
const email = ref('');
const password = ref('');
const driverLicense = ref('');

// Сообщения об ошибках и успехе
const errors = ref([]);
const success = ref('');

// Маршрутизация
const router = useRouter();

// Регулярные выражения для валидации
const phoneRegex = /^8\(\d{3}\)-\d{3}-\d{2}-\d{2}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*\d).{3,}$/; // Пароль должен содержать хотя бы одну цифру и быть длиной от 3 символов
const driverLicenseRegex = /^[A-Za-zА-Яа-я0-9\s]{1,}$/; // Простая проверка на заполненность

const validateInputs = () => {
  errors.value = [];

  if (!fullName.value.trim()) {
    errors.value.push('Введите ФИО.');
  }
  if (!phoneRegex.test(phone.value)) {
    errors.value.push('Введите телефон в формате 8(XXX)-XXX-XX-XX.');
  }
  if (!emailRegex.test(email.value)) {
    errors.value.push('Введите корректный адрес электронной почты.');
  }
  if (!passwordRegex.test(password.value)) {
    errors.value.push('Пароль должен содержать хотя бы одну цифру и быть длиной не менее 3 символов.');
  }
  if (!driverLicenseRegex.test(driverLicense.value)) {
    errors.value.push('Введите серию и номер водительского удостоверения.');
  }

  return errors.value.length === 0;
};

const registerUser = async () => {
  if (!validateInputs()) {
    return; // Если есть ошибки, не продолжаем
  }

  try {
    await axios.post('http://localhost:3000/register', {
      fullName: fullName.value,
      phone: phone.value,
      email: email.value,
      password: password.value,
      driverLicense: driverLicense.value,
    });

    success.value = 'Регистрация успешна! Перенаправляем на страницу входа...';
    setTimeout(() => {
      router.push('/'); // Перенаправление на страницу входа
    }, 2000);
  } catch (err) {
    errors.value.push(err.response?.data?.error || 'Ошибка при регистрации');
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
        <form class="form" @submit.prevent="registerUser">
          <p class="form__title">РЕГИСТРАЦИЯ</p>
          <input class="form__input" type="text" placeholder="Ваше имя" v-model="fullName" required />
          <input class="form__input" type="text" placeholder="Номер телефона" v-model="phone" required />
          <input class="form__input" type="email" placeholder="Почта" v-model="email" required />
          <input class="form__input" type="password" placeholder="Пароль" v-model="password" required />
          <input class="form__input" type="text" placeholder="Серия и номер ВУ" v-model="driverLicense" required />
          <button class="form__signup" type="submit">Зарегистрироваться</button>
          <ul v-if="errors.length" style="color: #ff5151">
            <li v-for="error in errors" :key="error">{{ error }}</li>
          </ul>
          <p v-if="success" style="color: green">{{ success }}</p>
        </form>
        <button @click="router.push({ path: '/' })" class="auth__signin">или Войти</button>
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

</style>
