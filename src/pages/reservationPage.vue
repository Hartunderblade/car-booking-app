<script setup>
import { ref, onMounted } from "vue";
import axios from 'axios';
import { useRouter } from 'vue-router';
import Booking from '@/widgets/booking.vue';

const userName = ref(''); // Имя пользователя
const currentUser = ref(null);
const cars = ref([]);

const bookings = ref([]);
const loading = ref(true);

const user = ref(null);
const router = useRouter();

const fetchUserCars = async () => {
  const userId = 1; // Заменить на ID текущего пользователя
  const response = await axios.get(`http://localhost:3000/user-cars/${userId}`);
  cars.value = response.data;
};

const formatDate = (date) => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return new Date(date).toLocaleDateString('ru-RU', options);
};

const fetchCurrentUser = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user) {
    currentUser.value = user;
  }
};

// Определение класса в зависимости от статуса
const getStatusClass = (status) => {
  switch (status) {
    case "Новое":
        return "status-new";
    case "Подтверждено":
        return "status-confirmed";
    case "Отклонено":
        return "status-rejected";
    default:
        return "status-default";
  }
};


const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  currentUser.value = null;
  router.push('/')
};


 // ID пользователя (может быть получен через токен или другой источник)
 const userId = 1;

const fetchBookings = async () => {
  try {
    const response = await axios.get("http://localhost:3000/bookings", {
      params: { user_id: userId },
    });
    bookings.value = response.data;
  } catch (error) {
    console.error("Ошибка при загрузке данных о бронированиях:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchBookings();
});

onMounted(fetchUserCars);
onMounted(fetchCurrentUser);

</script>

<template>
  <div class="inner">
    <div class="section">
      <div v-if="currentUser" class="section-user">
        <p class="section-user__name">{{ currentUser.fullName }}</p>
        <button @click="logout" class="section-user__exit">Выйти <img src="@/app/images/icon-header.svg"
            alt="" /></button>
      </div>
      <h1 class="section__title">Мои бронирования</h1>
      <div v-if="loading">Загрузка...</div>
      <div v-else class="section-cars">
        <div v-for="booking in bookings"
        :key="booking.booking_id" class="car">
          <div class="car-content">
            <p class="car-content__name">{{ booking.car.name }}</p>
            <p class="car-content__price">500$</p>
          </div>
          <div class="car-status">
            <p :class="getStatusClass(booking.status)" class="car-status__active">{{ booking.status }}</p>
            <p class="car-status__date">{{ formatDate(booking.booking_date) }}</p>
          </div>
          <img class="car__image" src="@/app/images/card-car.png" alt="">
        </div>
      </div>
      <div class="section-booking">
        <Booking />
      </div>

    </div>

  </div>
</template>

<style scoped lang="scss">
.section {
  &__title {
    font-weight: 600;
    font-size: 3rem;
    text-transform: uppercase;
    color: #1e1e1e;
    margin-top: 4rem;
  }

  &-user {
    display: flex;
    align-items: center;
    column-gap: 1rem;

    &__name {
      font-weight: 400;
      font-size: 1.2rem;
    }

    &__exit {
      display: flex;
      align-items: center;
      column-gap: 1rem;

      background: #1e1e1e;
      border-radius: 10rem;
      padding: 1rem;

      font-weight: 400;
      font-size: 20px;
      color: #fff;
    }
  }

  &-cars {
    width: 1088px;
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    margin-top: 4rem;
  }
}

.car {
  display: flex;
  flex-direction: column;
  row-gap: 2rem;
  padding: 2.1rem 2rem;
  border: 1px solid #000;
  border-radius: 16px;
  width: 352px;

  position: relative;

  &-content {
    display: flex;
    flex-direction: column;
    row-gap: 3rem;

    &__name {
      font-weight: 500;
      font-size: 28px;
      text-transform: capitalize;
    }

    &__price {
      font-weight: 400;
      font-size: 20px;
    }
  }

  &-status {
    display: flex;
    align-items: center;
    column-gap: 0.6rem;

    &__active {
      font-weight: 400;
      font-size: 1.1rem;
      background: #ffe6bd;
      border-radius: 1rem;
      padding: 0.4rem 1rem;
    }
  }

  &__image {
    position: absolute;
    right: 0;
  }
}

button {
  margin-left: 10px;
}


/* Статусы с цветами */
.status-new {
  background-color: #dffedf; /* Светло-зеленый */
  color: #1d1d1d;
}

.status-confirmed {
  background-color: #fff3cd; /* Светло-желтый */
  color: #1d1d1d;
}

.status-rejected {
  background-color: #f8d7da; /* Светло-красный */
  color: #1d1d1d;
}

.status-default {
  background-color: #f8d7da; /* Серый */
  color: #1d1d1d;
}
</style>
