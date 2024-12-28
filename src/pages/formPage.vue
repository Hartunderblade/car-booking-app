<script setup>
import { ref } from "vue";
import Booking from '@/widgets/booking.vue';
</script>

<template>
  <div>
    <div class="wrapper">
      <div class="wrapper-image">
        <img src="@/app/images/main-header.jpg" alt="" />
      </div>
      <div class="about">
        <div class="about-info">
          <h2 class="about-info__title">Рено логан</h2>
          <div class="info">
            <div class="info-text">
              <p class="info-text__title">Пробег</p>
              <p class="info-text__description">412км</p>
            </div>
            <div class="info-text">
              <p class="info-text__title">0-100КМ/ч</p>
              <p class="info-text__description">2.8с</p>
            </div>
            <div class="info-text">
              <p class="info-text__title">HP</p>
              <p class="info-text__description">560</p>
            </div>
          </div>
        </div>
        <div class="button">
          <img class="button__img" src="@/app/images/button-header.jpg" alt="" />
          <div class="button-link">
            <p>Забронируйте новый классный автомобиль!</p>
            <button>
              Забронировать <img src="@/app/images/icon-header.svg" alt="" />
            </button>
          </div>
        </div>
      </div>
    </div>
    <section>
      <Booking />
    </section>
  </div>

</template>

<style scoped lang="scss">
.wrapper {
  &-image {
    text-align: center;

    img {
      width: 1460px;
    }
  }
}

.header {
  margin-bottom: 2rem;
}

.about {
  display: flex;
  justify-content: space-between;
  align-items: end;

  &-info {
    display: flex;
    column-gap: 7rem;
    align-items: end;

    &__title {
      font-weight: 500;
      font-size: 3rem;
      color: #1e1e1e;
    }
  }

}

.button {
  display: flex;
  column-gap: 1rem;
  border-radius: 20px;
  padding: 20px;
  backdrop-filter: blur(40px);
  background: rgba(70, 70, 70, 0.1);

  &__img {
    border-radius: 1.4rem;
  }

  &-link {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 212px;

    p {
      font-weight: 500;
      font-size: 22px;
      width: 250px;
    }

    button {
      font-weight: 400;
      font-size: 18px;
      text-transform: capitalize;
      color: #fff;
      background: #1e1e1e;
      border-radius: 100px;
      padding: 10px 16px;
      display: flex;
      align-items: center;
      column-gap: 0.8rem;
    }
  }
}



.info {
  display: flex;
  align-items: center;
  column-gap: 3rem;

  &-text {
    display: flex;
    flex-direction: column;
    row-gap: 1rem;

    &__title {
      font-weight: 400;
      font-size: 16px;
      text-transform: uppercase;
      color: #464646;
    }

    &__description {
      font-weight: 500;
      font-size: 24px;
      text-transform: capitalize;
      color: #1e1e1e;
    }
  }
}
</style>
