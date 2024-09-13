<template>
  <div :class="['list', darkMode ? 'dark' : 'light']">
    <header>
      <h2>Bem vindo, {{ userName }}!</h2>
      <nav class="buttons">
      <Button 
        label="Adicionar compra"
        @click="goToAdd"
        :class="darkMode ? 'dark-button' : 'light-button'"
      />
      <Button
        label="Voltar para Home"
        @click="goToHome"
        :class="darkMode ? 'dark-button' : 'light-button'"
      />
      <Button
        icon="pi pi-user"
        @click="goToProfile"
        :class="darkMode ? 'dark-button' : 'light-button'"
      />
      <Button
        :icon="darkMode ? 'pi pi-moon' : 'pi pi-sun'"
        @click="toggleDarkMode"
        :class="darkMode ? 'dark-button' : 'light-button'"
      />
    </nav>
    </header>
    <main>
      <ul class="product-list">
        <li v-for="product in products" :key="product.id" class="product-card" @click="handleCardClick(product.id.toString())">
          <h3>{{ product.name }}</h3>
          <p>Preço: {{ product.price }}</p>
        </li>
      </ul>
    </main>
  </div>
</template>


<script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  import Button from 'primevue/button';
  import apiClient from '../axiosConfig';
  import { Product } from '../types/Product';
  import axios, {AxiosError} from 'axios';

  export default defineComponent({
    name: 'List',
    components: {
      Button
    },
    setup() {
      const userName = ref<string>(localStorage.getItem('userName') || '');
      const products = ref<Product[]>([]);
      const token = ref<string | null>(localStorage.getItem('authToken'));
      const darkMode = ref(false);

      const fetchProducts = async () => {
        if (!token.value) {
          console.error('Token de autenticação não encontrado');
          return;
        }

        try {
          const response = await apiClient.get('/product/list', {
            headers: {
              Authorization: `Bearer ${token.value}`
            }
          });
          products.value = response.data.map((product: Product) => ({
            id: product.id,
            name: product.name,
            price: product.price,
          }));
          console.log(products);
        } catch (error) {
          if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            if (axiosError.response?.status == 401) {
              alert("Sua sessão expirou!");
              window.location.href = '/login';
            }
          } else {
            console.error("Erro ao listar os produtos: ", error);
            alert('erro ao listar os produtos!');
          }
        }
      };

      onMounted(() => {
        const storedDarkMode = localStorage.getItem('darkMode');
        if (storedDarkMode) {
          darkMode.value = storedDarkMode === 'true';
          document.body.classList.toggle('dark', darkMode.value);
        }
        fetchProducts();
      });

      const toggleDarkMode = () => {
        darkMode.value = !darkMode.value;
        document.body.classList.toggle('dark', darkMode.value);
        localStorage.setItem('darkMode', darkMode.value.toString());
      };

      const handleCardClick = (productId: string) => {
        localStorage.setItem('selectedProductId', productId);
        window.location.href = '/detail'
      };

      return {
        userName,
        products,
        goToHome: () => {
          window.location.href = '/';
        },
        handleCardClick,
        darkMode,
        toggleDarkMode,
        goToAdd: () => {
          window.location.href = '/add';
        },
        goToProfile: () => {
          window.location.href = '/profile';
        }
      };
    }
  });
</script>

  
<style scoped>
.list {
  text-align: center;
}

header {
  display: flex;
  text-align: left;
  margin: 10px 15px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

header h2 {
  width: 35vw;
  font-family: 'Jost', sans-serif;
  font-weight: 400;
}

.buttons {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
}

.buttons Button {
  margin: 0 10px;
  font-family: 'Jost', sans-serif;
}

.product-list {
  list-style-type: none;
  padding: 0;
}

.product-card {
  background-color: #f9f9f9;
  margin: 10px;
  padding: 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  color: #3E3E3E;
}

.product-card h3 {
  font-family: 'Jost', sans-serif;
}

.product-card p {
  font-family: 'Jost', sans-serif;
}

.product-card:hover {
  background-color: #e0e0e0;
}

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