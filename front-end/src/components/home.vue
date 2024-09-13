<template>
  <div :class="['home', darkMode ? 'dark' : 'light']">
    <nav class="buttons">
      <Button
        label="Login"
        @click="goToLogin"
        :class="darkMode ? 'dark-button' : 'light-button'"
      />
      <Button
        label="Registrar"
        @click="goToRegister"
        :class="darkMode ? 'dark-button' : 'light-button'"
      />
      <Button
        :icon="darkMode ? 'pi pi-moon' : 'pi pi-sun'"
        @click="toggleDarkMode"
        :class="darkMode ? 'dark-button' : 'light-button'"
      />
    </nav>
    <article>
      <h1>Bem-vindo ao Junky!</h1>
      <p>Bem-vindo à Junky, sua solução definitiva para gestão de carrinhos de compras! Nossa plataforma foi desenvolvida para simplificar e otimizar sua experiência de compras online, garantindo que você nunca perca um produto desejado. Na Junky, oferecemos ferramentas intuitivas e eficientes para organizar seus itens, comparar preços e finalizar suas compras com facilidade. Descubra como podemos transformar sua experiência de compra em algo prático e prazeroso. Navegue com confiança, compre com inteligência!</p>
    </article>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import Button from 'primevue/button';

export default defineComponent({
  name: 'Home',
  components: {
    Button
  },
  setup() {
    const darkMode = ref(false);

    onMounted(() => {
      const storedDarkMode = localStorage.getItem('darkMode');
      if (storedDarkMode) {
        darkMode.value = storedDarkMode === 'true';
        document.body.classList.toggle('dark', darkMode.value);
      }
    });

    const toggleDarkMode = () => {
      darkMode.value = !darkMode.value;
      document.body.classList.toggle('dark', darkMode.value);
      localStorage.setItem('darkMode', darkMode.value.toString());
    };

    return {
      darkMode,
      toggleDarkMode
    };
  },
  methods: {
    goToLogin() {
      this.$router.push({ name: 'login' });
    },
    goToRegister() {
      this.$router.push({ name: 'register' });
    }
  }
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100..900;1,100..900&display=swap');
.home {
  display: flex;
  text-align: center;
  background-color: inherit;
  color: inherit;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.buttons {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100vw;
  margin-top: 15px;
}

.buttons Button {
  margin: 0px 10px;
  font-family: 'Jost', sans-serif;
}

article {
  display: flex;
  width: 500px;
  height: 80vh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

article p {
  text-align: justify;
  font-family: 'Jost', sans-serif;
  font-size: 1rem;
  font-weight: 450;
}

h1 {
  margin-bottom: 20px;
  font-family: 'Jost', sans-serif;
  font-weight: 400;
  font-size: 1.8rem;
}

/* Estilos para modo claro */
.light {
  background-color: #F1DAC4;
  color: #3E3E3E;
}

.light-button {
  background-color: #00BFFF;
  color: white;
  border: 0px transparent;
}

/* Estilos para modo escuro */
.dark {
  background-color: #3E3E3E;
  color: #F1DAC4;
}

.dark-button {
  background-color: #a626a6;
  color: white;
  border: 0px transparent;
}
</style>

<style>
/* Estilos globais para o modo escuro */
body.dark {
  background-color: #3E3E3E;
  color: #F1DAC4;
}

/* Estilos globais para o modo claro */
body:not(.dark) {
  background-color: #F1DAC4;
  color: #3E3E3E;
}
</style>
