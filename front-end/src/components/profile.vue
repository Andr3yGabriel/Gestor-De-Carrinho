<template>
    <div :class="['profile-container', darkMode ? 'dark' : 'light']">
        <header>
            <h2>Bem vindo, {{ userName }}!</h2>
            <nav class="buttons">
                <Button
                label="Voltar"
                @click="goToList"
                :class="darkMode ? 'dark-button' : 'light-button'"
                />
                <Button 
                icon="pi pi-trash"
                @click="showDeleteDialog"
                :class="darkMode ? 'dark-button' : 'light-button'"
                />
                <Button
                    :icon="darkMode ? 'pi pi-moon' : 'pi pi-sun'"
                    @click="toggleDarkMode"
                    :class="darkMode ? 'dark-button' : 'light-button'"
                />
            </nav>
        </header>
        <div class="form-nome-email">
            <h2>Atualizar informações do usuário</h2>
            <div class="p-field">
                <label for="name">Nome</label>
                <InputText id="name" type="text" v-model="name"/>
            </div>
            <div class="p-field">
                <label for="email">Email</label>
                <InputText id="email" type="text" v-model="email"/>
            </div>
            <Button 
                label="Atualizar"
                @click="updateUser"
                :class="darkMode ? 'dark-button' : 'light-button'"
            />
        </div>
        <div class="atualizar-senha">
            <h2>Atualizar senha</h2>
            <div class="p-field">
                <label for="currentPassword">Senha atual</label>
                <Password v-model="currentPassword" :feedback="false" toggleMask/>             
            </div>
            <div class="p-field">
                <label for="newPassword">Nova senha</label>
                <Password v-model="newPassword" toggleMask/>             
            </div>
            <Button 
                label="Atualizar"
                @click="updateUser"
                :class="darkMode ? 'dark-button' : 'light-button'"
            />
        </div>
        <Dialog 
            header="Confirmar Exclusão" 
            v-model:visible="deleteDialogVisible" 
            :modal="true" 
            :closable="false"
        >
            <div class="p-field">
                <label for="deletePassword">Senha atual</label>
                <Password v-model="deletePassword" :feedback="false" toggleMask />
            </div>
            <div class="dialog-buttons">
                <Button label="Cancelar" @click="cancelDelete" :class="darkMode ? 'dark-button' : 'light-button'" />
                <Button label="Confirmar" @click="confirmDelete" :class="darkMode ? 'dark-button' : 'light-button'" />
            </div>
        </Dialog>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, onMounted } from 'vue';
    import Button from 'primevue/button';
    import InputText from 'primevue/inputtext';
    import apiClient from '../axiosConfig';
    import axios, { AxiosError } from 'axios';
    import Password from 'primevue/password';
import Dialog from 'primevue/dialog';

    export default defineComponent({
        name: 'Profile',
        components: {
        Button,
        InputText,
        Password,
        Dialog
        },
        setup() {
            const userName = ref<string>(localStorage.getItem('userName') || '');
            const darkMode = ref(false);
            const name = ref('');
            const email = ref('');
            const currentPassword = ref('');
            const newPassword = ref('');
            const deleteDialogVisible = ref(false);
            const deletePassword = ref('');

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
                userName,
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
                email,
                name,
                currentPassword,
                newPassword,
                deleteDialogVisible,
                deletePassword
            };
        },
        methods: {
            showDeleteDialog() {
                this.deleteDialogVisible = true;
            },
            async updateUser() {
                const token = localStorage.getItem('authToken');
                const userId = localStorage.getItem('selectedUserId');

                if (!token) {
                    console.error('Token de autenticação não encontrado. Redirecionando para a página de login.');
                    this.$router.push({ name: 'login' });
                    return;
                }

                if (!userId) {
                    console.error('ID do usuário não encontrado. Não é possível atualizar.');
                    alert("Erro: ID do usuário não encontrado.");
                    return;
                }

                try {
                    const response = await apiClient.put(`/user/update/${userId}`, 
                        {
                            name: this.name,
                            email: this.email
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }
                    );
                    console.log('Usuário atualizado com sucesso!');
                    alert("Usuário atualizado com sucesso!");
                    localStorage.setItem('userName', response.data.name);
                    this.goToList();
                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        const axiosError = error as AxiosError;
                        if (axiosError.response?.status == 401) {
                            alert("Sua sessão expirou!");
                            this.goToLogin();
                        } else if (axiosError.response?.status == 404) {
                            alert("Usuário não encontrado!");
                        }
                    }
                    console.error('Erro ao atualizar o usuário: ', error);
                    alert("Erro ao atualizar o usuário!");
                }
            },
            async changePassword() {
                const token = localStorage.getItem('authToken');
                const userId = localStorage.getItem('selectedUserId');

                if (!token) {
                    console.error('Token de autenticação não encontrado. Redirecionando para a página de login.');
                    this.$router.push({ name: 'login' });
                    return;
                }

                if (!userId) {
                    console.error('ID do usuário não encontrado. Não é possível atualizar.');
                    alert("Erro: ID do usuário não encontrado.");
                    return;
                }

                try {
                    const response = await apiClient.put(`/user/changepassword/${userId}`, 
                        {
                            currentPassword: this.currentPassword,
                            newPassword: this.newPassword
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }
                    );
                    console.log('Senha alterada com sucesso:', response.data);
                    alert("Senha alterada com sucesso!");
                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        const axiosError = error as AxiosError;
                        if (axiosError.response?.status == 401) {
                            alert("Sua sessão expirou!");
                            this.goToLogin();
                        } else if (axiosError.response?.status == 404) {
                            alert("Usuário não encontrado!");
                        } else if (axiosError.response?.status == 400) {
                            alert("Senha atual incorreta!");
                        }
                    }
                    console.error('Erro ao alterar a senha: ', error);
                    alert("Erro ao alterar a senha!");
                }
            },
            async deleteUser() {
                const token = localStorage.getItem('authToken');
                const userId = localStorage.getItem('selectedUserId');

                if (!token) {
                    console.error('Token de autenticação não encontrado. Redirecionando para a página de login.');
                    this.$router.push({ name: 'login' });
                    return;
                }

                if (!userId) {
                    console.error('ID do usuário não encontrado. Não é possível excluir.');
                    alert("Erro: ID do usuário não encontrado.");
                    return;
                }

                try {
                    const response = await apiClient.delete(`/user/delete/${userId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        },
                        data: {
                            currentPassword: this.deletePassword
                        }
                    });
                
                    console.log('Usuário excluído com sucesso:', response.data);
                    alert("Usuário excluído com sucesso!");
                    this.goToList();
                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        const axiosError = error;
                        if (axiosError.response?.status == 401) {
                            alert("Sua sessão expirou!");
                            this.goToLogin();
                        } else if (axiosError.response?.status == 400) {
                            alert("Senha atual incorreta!");
                        } else if (axiosError.response?.status == 404) {
                            alert("Usuário não encontrado!");
                        }
                    }
                    console.error('Erro ao excluir o usuário: ', error);
                    alert("Erro ao excluir o usuário!");
                }
            },
            cancelDelete() {
                this.deleteDialogVisible = false;
                this.deletePassword = '';
            },
            confirmDelete() {
                this.deleteUser();
                this.deleteDialogVisible = false;
                this.$router.push({ name: 'login' });
            },
        }
    });
</script>

<style scoped>

    .add-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 90vh;
        padding-top: 0;
        background-color: inherit;
        color: inherit;
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

    h2 {
        margin-top: 30px;
        font-family: 'Jost', sans-serif;
        font-weight: 500;
    }

    .form-nome-email {
        display: flex;
        height: fit-content;
        width: fit-content;
        background-color: inherit;
        color: inherit;
        flex-direction: column;
        justify-content: left;
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

    .p-button {
        margin: 0px 10px;
        font-family: 'Jost', sans-serif;
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