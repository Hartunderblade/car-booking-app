import { createRouter, createWebHistory } from "vue-router";
import mainPage from "@/pages/mainPage.vue";
import registrationPage from "@/pages/registrationPage.vue";
import loginPage from "@/pages/loginPage.vue";
import reservationPage from "@/pages/reservationPage.vue";
import formPage from "@/pages/formPage.vue";
import adminPage from "@/pages/adminPage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/main",
      name: "main",
      component: mainPage,
      beforeEnter: (to, from, next) => {
        // Проверка авторизации
        const token = localStorage.getItem('token');
        if (!token) {
          next('/'); // Если токен отсутствует, перенаправляем на страницу входа
        } else {
          next();
        }
      },
      children: [
        {
          path: "form",
          name: "form",
          component: formPage,
        },
        {
          path: "profile",
          name: "profile",
          component: reservationPage,
        },
      ],
    },
    {
      path: "/admin",
      name: "adminPage",
      component: adminPage,
      beforeEnter: (to, from, next) => {
        const token = localStorage.getItem('token');
        if (!token) {
          next('/'); // Если токен отсутствует
          return;
        }
  
        // Расшифровываем токен и проверяем роль
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.role === 'admin') {
          next(); // Разрешаем доступ, если роль admin
        } else {
          next('/'); // Перенаправляем на вход, если роль не admin
        }
      },
    },
    {
      path: "/registration",
      name: "registration",
      component: registrationPage,
    },
    {
      path: "/",
      name: "login",
      component: loginPage,
    }
  ],
});

// router.beforeEach((to, from, next) => {
//   const userToken = localStorage.getItem('token');
//   const adminToken = localStorage.getItem('adminToken');

//   // Защита маршрута профиля
//   if (to.path === '/profile') {
//     if (!userToken) {
//       return next({ path: '/' }); // Незарегистрированные пользователи перенаправляются на страницу входа
//     }
//     if (adminToken) {
//       return next({ path: '/admin/panel' }); // Администратор не может заходить в профиль
//     }
//   }

//   // Защита маршрута административной панели
//   if (to.path === '/admin/panel') {
//     if (!adminToken) {
//       return next({ path: '/' }); // Незарегистрированные пользователи перенаправляются на страницу входа
//     }
//     if (userToken) {
//       return next({ path: '/profile' }); // Пользователь не может заходить в админ панель
//     }
//   }

//   next(); // Разрешить переход
// });




export default router;
