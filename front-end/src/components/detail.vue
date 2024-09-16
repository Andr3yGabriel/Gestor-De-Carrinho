<template>
    <div :class="['detail', darkMode ? 'dark' : 'light']">
        <nav class="buttons">
            <Button
                label="Voltar"
                @click="goToList"
                :class="darkMode ? 'dark-button' : 'light-button'"
            />
            <Button
                icon="pi pi-user"
                @click="goToProfile"
                :class="darkMode ? 'dark-button' : 'light-button'"
            />
            <Button 
                icon="pi pi-trash"
                @click="removeProduct"
                :class="darkMode ? 'dark-button' : 'light-button'"
            />
            <Button 
                icon="pi pi-pencil"
                @click="goToUpdate"
                :class="darkMode ? 'dark-button' : 'light-button'"
            />
            <Button
                :icon="darkMode ? 'pi pi-moon' : 'pi pi-sun'"
                @click="toggleDarkMode"
                :class="darkMode ? 'dark-button' : 'light-button'"
            />
        </nav>
        <Card>
            <template #title>Informações do produto</template>
            <template #content>
                <div v-if="productDetails">
                    <h3>{{ productDetails.name }}</h3>
                    <p>Preço: {{ productDetails.price }}</p>
                    <a :href="productDetails.link" target="_blank" rel="noopener noreferrer">Clique aqui para ir até o produto</a>
                    <p>Origem: {{ productDetails.origin }}</p>
                </div>
                <div v-else>
                    <p>Carregando detalhes do produto...</p>
                </div>
            </template>
        </Card>
    </div>
</template>

<script lang="ts">
import Button from 'primevue/button';
import Card from 'primevue/card';
import { defineComponent, onMounted, ref } from 'vue';
import apiClient from '../axiosConfig';
import axios, { AxiosError } from 'axios';
    export default defineComponent({
        name: 'Detail',
        components: {
            Button,
            Card
        },
        setup() {
            const darkMode = ref(false);
            const productDetails = ref<any>(null);
            const token = ref<string | null>(localStorage.getItem('authToken'));

            onMounted(async () => {
                const storedDarkMode = localStorage.getItem('darkMode');
                if (storedDarkMode) {
                    darkMode.value = storedDarkMode === 'true';
                    document.body.classList.toggle('dark', darkMode.value);
                }

                const productId = localStorage.getItem('selectedProductId');
                if (productId) {
                    await fetchProductDetails(productId);
                }
            });

            const fetchProductDetails = async (productId: string) => {
                if (!token.value) {
                    console.error('Token de autenticação não encontrado');
                    return;
                }

                try {
                    const response = await apiClient.get(`/product/detail/${productId}`, {
                        headers: {
                            Authorization: `Bearer ${token.value}`
                        }
                    });
                    productDetails.value = response.data;
                } catch (error) {
                    console.error('Error fetching product details:', error);
                }
            };

            const removeProduct = async () => {
                if (!token.value) {
                    console.error('Token de autenticação não encontrado');
                    return;
                }

                const productId = localStorage.getItem('selectedProductId');

                try {
                    const response = await apiClient.delete(`/product/delete/${productId}`, {
                        headers: {
                            Authorization: `Bearer ${token.value}`
                        }
                    });
                    console.log(response.status);
                    alert("Produto removido da lista com sucesso!");
                    window.location.href = 'list';
                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        const axiosError = error as AxiosError;
                        if (axiosError.response?.status == 401) {
                            alert("Sua sessão expirou!");
                            window.location.href = '/login';
                        }
                    } else {
                        console.error("Erro ao excluir produto: ", error);
                        alert('Erro ao excluir produto!');
                    }
                }
            }

            const toggleDarkMode = () => {
                darkMode.value = !darkMode.value;
                document.body.classList.toggle('dark', darkMode.value);
                localStorage.setItem('darkMode', darkMode.value.toString());
            };

            return {
                darkMode,
                toggleDarkMode,
                productDetails,
                goToList: () => {
                    window.location.href = 'list';
                },
                removeProduct,
                goToUpdate: () => {
                    window.location.href = 'update';
                },
                goToProfile: () => {
                    window.location.href = '/profile';
                }                
            };
        }
    })
</script>

<style scoped>
    .detail {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .buttons {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        width: 100%;
    }

    .buttons Button {
        margin: 10px 10px;
        font-family: 'Jost', sans-serif;
    }

    .p-card {
        width: 100%;
        text-align: center;
        font-family: 'Jost', sans-serif;
    }

    .p-card a {
        text-decoration: none;
        color: rgba(0, 0, 0, 0.71);
    }

    .p-card a:hover {
        color: red;
    }

    .p-card p {
        color: rgba(0, 0, 0, 0.71);
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