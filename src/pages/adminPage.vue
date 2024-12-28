<script setup>
import { RouterLink, RouterView } from "vue-router";
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Footer from '@/widgets/footer.vue';
import axios from 'axios';

const bookings = ref([]);

const error = ref('');

const admin = ref(null);


const users = ref([]);

const router = useRouter();

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

// Получение списка бронирований
const fetchBookings = async () => {
  try {
    const response = await fetch('http://localhost:3000/bookings');
    if (!response.ok) throw new Error('Ошибка при загрузке данных');
    bookings.value = await response.json();
  } catch (err) {
    console.error(err);
  }
};

// Обновление статуса бронирования
const updateStatus = async (id, status) => {
  try {
    const response = await fetch(`http://localhost:3000/bookings/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error('Ошибка при обновлении статуса');
    const updatedBooking = await response.json();

    // Обновляем статус в списке
    const index = bookings.value.findIndex((b) => b.id === id);
    if (index !== -1) {
      bookings.value[index].status = updatedBooking.status;
    }
  } catch (err) {
    console.error(err);
    alert('Не удалось обновить статус');
  }
};


const formatDate = (date) => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return new Date(date).toLocaleDateString('ru-RU', options);
};

const logout = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('admin');
  router.push('/');
};



const fetchUsers = async () => {
  try {
    const response = await fetch('http://localhost:3000/users');
    users.value = await response.json();
  } catch (err) {
    console.error('Error fetching users:', err);
  }
};

onMounted(fetchUsers);
onMounted(fetchBookings);

</script>

<template>
  <div class="container">
    <nav class="navigation">
      <p class="navigation__logo">ЭХ, ПРОКАЧУ!</p>
      <div class="navigation-admin">
        <p class="navigation-admin__name">Админ</p>
        <button @click="logout" class="navigation-admin__exit">Выйти <img src="@/app/images/icon-header.svg"
            alt="" /></button>
      </div>
    </nav>
    <div class="users">
      <h1 class="users__title">Список бронирований</h1>
      <div v-for="booking in bookings" :key="booking.id" class="user">
        <div class="info">
          <div class="info-about">
            <h2 class="info-about__name">{{ booking.user.full_name }}</h2>
            <p class="info-about__phone">{{ booking.user.phone }}</p>
            <p class="info-about__email">{{ booking.user.email }}</p>
          </div>
          <div class="info-car">
            <p class="info-car__name">{{ booking.car.name }}</p>
            <p class="info-car__date">{{ formatDate(booking.booking_date) }}</p>
          </div>
        </div>
        <div class="info-status">
          <select :class="getStatusClass(booking.status)" v-model="booking.status"
            @change="updateStatus(booking.id, booking.status)">
            <option value="Новое">Новое</option>
            <option value="Подтверждено">Подтверждено</option>
            <option value="Отменено">Отменено</option>
          </select>
        </div>
      </div>
    </div>
    <footer>
      <Footer />
    </footer>
  </div>

</template>

<style scoped lang="scss">
.navigation {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 2rem 0;

  &__logo {
    font-weight: 500;
    font-size: 32px;
    text-transform: uppercase;
    color: #000;
  }

  &-admin {
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
      font-weight: 400;
      font-size: 1.2rem;
      color: #fff;
      background: #1e1e1e;
      border-radius: 10rem;
      padding: 1rem;
    }
  }
}

.users {
  margin-top: 4rem;
  display: flex;
  flex-direction: column;
  row-gap: 2rem;

  &__title {
    font-weight: 600;
    font-size: 3rem;
    text-transform: uppercase;
    color: #1e1e1e;
  }
}

.user {
  display: flex;
  align-items: start;
  column-gap: 596px;
  border-bottom: 1px solid #8d8d8d;
  padding-bottom: 1rem;
  margin-top: 3rem;
}

.info {
  display: flex;
  align-items: start;
  column-gap: 164px;

  &-about {
    display: flex;
    flex-direction: column;
    row-gap: 0.6rem;

    &__name {
      font-weight: 500;
      font-size: 2rem;
    }

    &__phone,
    &__email {
      font-weight: 300;
      font-size: 1rem;
    }
  }

  &-car {
    display: flex;
    flex-direction: column;
    row-gap: 0.6rem;

    &__name {
      font-weight: 500;
      font-size: 1.8rem;
    }

    &__date {
      font-weight: 300;
      font-size: 1rem;
    }
  }
}


select {
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 1rem;
  background-color: #fff;
  cursor: pointer;
}

.selected-status {
  font-size: 1.8rem;
  font-weight: 400;
}


/* Статусы с цветами */
.status-new {
  background-color: #eaffea;
  /* Светло-зеленый */
  color: #1d1d1d;
}

.status-confirmed {
  background-color: #fff3cd;
  /* Светло-желтый */
  color: #1d1d1d;
}

.status-rejected {
  background-color: #f8d7da;
  /* Светло-красный */
  color: #1d1d1d;
}

.status-default {
  background-color: #f8d7da;
  /* Серый */
  color: #1d1d1d;
}
</style>
