<script setup>
import { ref, onMounted } from "vue";
import axios from 'axios';

const cars = ref([]);
const bookingDate = ref({});

const today = new Date().toISOString().split('T')[0];

const fetchCars = async () => {
  const response = await axios.get('http://localhost:3000/cars');
  cars.value = response.data.map(car => ({ ...car, bookingDate: today }));
};

const bookCar = async (carId, bookingDate) => {
  try {
    const userId = 1; // Временно жестко заданный ID пользователя
    await axios.post('http://localhost:3000/bookings', {
      userId,
      carId,
      bookingDate,
    });
    alert('Автомобиль успешно забронирован!');
  } catch (error) {
    alert('Ошибка при бронировании: ' + error.response?.data?.error || error.message);
  }
};

onMounted(fetchCars);

</script>

<template>
  <div class="booking">
    <h1 class="booking__title">БРОНИРОВАНИЕ АВТОМОБИЛЯ</h1>
    <div class="cars">
      <div v-if="cars.length">
        <div v-for="car in cars" :key="car.id" class="car">
          <div class="car-info">
            <p class="car-info__number">{{ car.id < 10 ? `0${car.id}` : car.id }}</p>
                <p class="car-info__name">{{ car.name }}</p>
          </div>
          <div class="car-info">
            <input class="car-info__date" type="date" v-model="car.bookingDate" :min="today" />
            <button @click="bookCar(car.id, car.bookingDate)" type="submit" class="car-info__button">
              Забронировать<img src="@/app/images/icon-header.svg" alt="" />
            </button>
          </div>
        </div>
      </div>
      <p v-else>Загрузка автомобилей...</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.booking {
  margin-top: 6rem;

  &__title {
    font-weight: 600;
    font-size: 3rem;
    text-transform: uppercase;
    color: #1e1e1e;
  }
}

.cars {
  margin-top: 80px;
}

.car {
  display: flex;
  align-items: center;
  column-gap: 35rem;
  border-bottom: 1px solid #ababab;
  padding-bottom: 16px;
  margin-top: 3rem;

  &-info {
    display: flex;
    column-gap: 21rem;
    // width: 584px;

    &__number {
      font-weight: 400;
      font-size: 1.2rem;
      color: #ababab;
    }

    &__name {
      font-weight: 500;
      font-size: 2rem;
      text-transform: capitalize;
      color: #000;
      width: 200px;
    }

    &__date {
      border: 1px solid #ababab;
      padding: 0.6rem;
    }

    &__button {
      display: flex;
      align-items: center;
      column-gap: 0.5rem;
      font-weight: 400;
      font-size: 1.1rem;
      color: #fff;
      background: #1e1e1e;
      border-radius: 6.2rem;
      padding: 0.6rem 1rem;
    }
  }
}
</style>
