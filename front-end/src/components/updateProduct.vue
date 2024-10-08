<template>
    <div :class="['update-container', darkMode ? 'dark' : 'light']">
        <nav class="buttons">
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
        <h2>Atualize as informações da compra!</h2>
        <div class="form">
            <div class="p-field">
                <label for="name">Nome</label>
                <InputText id="name" type="text" v-model="name"/>
            </div>
            <div class="p-field">
                <label for="link">Link</label>
                <InputText id="link" type="text" v-model="link"/>
            </div>
            <div class="p-field">
                <label for="price">Preço</label>
                <InputNumber 
                v-model="price"
                id="price"
                mode="currency" 
                currency="BRL"
                :min="0"
                :invalid="price === null"/>
            </div>
            <div class="p-field">
                <label for="origin">Origem</label>
                <InputText id="origin" type="text" v-model="origin"/>
            </div>
            <div id="submit-cancel">
                <Button 
                label="Atualizar"
                @click="updateProduct"
                :class="darkMode ? 'dark-button' : 'light-button'"
                />
                <Button 
                label="Cancelar"
                @click="goToList"
                :class="darkMode ? 'dark-button' : 'light-button'"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, onMounted } from 'vue';
    import Button from 'primevue/button';
    import InputText from 'primevue/inputtext';
    import FloatLabel from 'primevue/floatlabel';
    import apiClient from '../axiosConfig';
    import InputNumber from 'primevue/inputnumber';
    import axios, { AxiosError } from 'axios';

    export default defineComponent({
        name: 'Update',
        components: {
        Button,
        InputText,
        InputNumber,
        FloatLabel
        },
        setup() {
            const darkMode = ref(false);
            const name = ref('');
            const link = ref('');
            const price = ref<number | null>(null);
            const origin = ref('');

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
                goToHome: () => {
                    window.location.href = '/';
                },
                darkMode,
                toggleDarkMode,
                goToList: () => {
                    window.location.href = '/list';
                },
                goToLogin: () => {
                    window.location.href = '/login';
                },
                goToProfile: () => {
                    window.location.href = '/profile';
                },
                price,
                name,
                origin,
                link
            };
        },
        methods: {
            async updateProduct() {
                const token = localStorage.getItem('authToken');
                const productId = localStorage.getItem('selectedProductId');

                if (!token) {
                    console.error('Token de autenticação não encontrado. Redirecionando para a página de login.');
                    this.$router.push({ name: 'login' });
                    return;
                }

                if (!productId) {
                    console.error('ID do produto não encontrado. Não é possível atualizar.');
                    alert("Erro: ID do produto não encontrado.");
                    return;
                }

                try {
                    const response = await apiClient.put(`/product/update/${productId}`, 
                    {
                        name: this.name,
                        link: this.link,
                        price: this.price,
                        origin: this.origin
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    console.log('Produto atualizado com sucesso:', response.data);
                    alert("Produto atualizado com sucesso!");
                    this.goToList();
                } catch (error) {
                    if (axios.isAxiosError(error)) {
                    const axiosError = error as AxiosError;
                    if (axiosError.response?.status == 401) {
                        alert("Sua sessão expirou!");
                        this.goToLogin();
                    } else if (axiosError.response?.status == 404) {
                        alert("Produto não encontrado!");
                    }
                }
                    console.error('Erro ao atualizar o produto: ', error);
                    alert("Erro ao atualizar o produto!");
                }
            }
        }
    });
</script>

<style scoped>

    .update-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 90vh;
        padding-top: 0;
        background-color: inherit;
        color: inherit;
    }

    .buttons {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        position: fixed;
        top: 25px;
        width: 100%;
    }

    .buttons Button {
        margin: 0 10px;
        font-family: 'Jost', sans-serif;
    }

    h2 {
        margin-top: 30px;
        font-family: 'Jost', sans-serif;
        font-weight: 500;
    }

    .form {
        display: flex;
        height: fit-content;
        width: fit-content;
        text-align: center;
        background-color: inherit;
        color: inherit;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
    }

    .p-field {
        margin-bottom: 1rem;
        display: flex;
        flex-direction: column;
        align-items: start;
        justify-content: center;
        width: fit-content;
    }

    .p-field label {
        font-family: 'Jost', sans-serif;
    }

    #submit-cancel {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        font-family: 'Jost', sans-serif;
    }

    #submit-cancel Button {
        margin: 0px 10px;
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