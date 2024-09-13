<template>
    <div :class="['register-container', darkMode ? 'dark' : 'light']">
      <nav class="buttons">
        <Button 
          label="Voltar para Home" 
          @click="goToHome"
          :class="darkMode ? 'dark-button' : 'light-button'"
        />
        <Button
        :icon="darkMode ? 'pi pi-moon' : 'pi pi-sun'"
        @click="toggleDarkMode"
        :class="darkMode ? 'dark-button' : 'light-button'"
        />
      </nav>
      <div class="register">
        <h2>Registrar</h2>
        <div class="p-field">
          <label for="name">Nome</label>
          <InputText id="name" v-model="name" type="text" />
        </div>
        <div class="p-field">
          <label for="email">Email</label>
          <InputText id="email" v-model="email" type="email" />
        </div>
        <div class="p-field">
          <label for="password">Senha</label>
          <Password id="password" v-model="password" toggleMask />
        </div>
        <div class="registrar">
          <Button label="Registrar" @click="register" id="registrar" :class="darkMode ? 'dark-button' : 'light-button'"/>
        </div>
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  import InputText from 'primevue/inputtext';
  import Password from 'primevue/password';
  import Button from 'primevue/button';
  import apiClient from '../axiosConfig';
  import axios, { AxiosError } from 'axios';
  
  export default defineComponent({
    name: 'Register',
    components: {
      InputText,
      Password,
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
    data() {
      return {
        name: '',
        email: '',
        password: '',
        errorMessage: ''
      };
    },
    methods: {
      async register() {
        try {
          const response = await apiClient.post('/user/register', {
            name: this.name,
            email: this.email,
            password: this.password
          });
          console.log('Registrado com sucesso:', response.data);
          this.$router.push({ name: 'login' });
        } catch (error) {
          console.error('Erro ao registrar:', error);
          if (axios.isAxiosError(error)){
            const axiosError = error as AxiosError;
            if (axiosError.response?.status == 409) {
              this.errorMessage = 'Usuário com este email já cadastrado!'
            } else {
              this.errorMessage = "Erro ao registrar. Por favor, tente novamente."
            }
          } else {
            this.errorMessage = "Erro ao registrar. Por favor, tente novamente."
          }
        }
      },
      goToHome() {
        this.$router.push({ name: 'home' });
      }
    }
  });
  </script>
  
  <style scoped>
  .register-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    padding-top: 0;
    background-color: inherit;
    color: inherit;
  }

  .register {
    display: flex;
    max-width: 400px;
    height: 80vh;
    text-align: center;
    background-color: inherit;
    color: inherit;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
  }

  .register h2 {
  font-family: 'Jost', sans-serif;
  font-weight: 500;
  }

  .p-field {
    margin-bottom: 1rem;
  }

  .p-field label {
    margin-right: 20px;
    font-family: 'Jost', sans-serif;
  }

  .buttons {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
    margin-top: 15px;
  }

  .buttons Button {
    margin: 0 10px;
    font-family: 'Jost', sans-serif;
  }

  #registrar {
    font-family: 'Jost', sans-serif;
  }

  .error-message {
    margin-top: 10px;
    font-family: 'Jost', sans-serif;
  }

  /* Estilos para modo claro */
  .light {
    background-color: #F1DAC4;
    color: #2C2C2C;
  }

  .light-button {
    background-color: #00BFFF;
    color: white;
    border: 0px transparent;
  }

  /* Estilos para modo escuro */
  .dark {
    background-color: #3E3E3E;
    color: #FFFFFF;
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