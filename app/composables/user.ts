export const useUserStore = defineStore('userStore', () => {
    interface User {
        id: number,
        name: string,
        age: number,
    }

    const users = ref<User[]>([])
    const user = reactive<User>({
        id: 0,
        name: "",
        age: 0
    })

    const currentPage = ref(1)
    const currentLimit = ref(5)
    const totalPage = ref(0)

    const getUsers = async (page: number, limit?: number) => {
        try {
            const { data, error } = await useFetch<{ users: User[]; total: number }>('/api/users', {
                query: { page, limit }
            });
            if (error) {
                console.error('Ошибка при получении пользователей:', error);
                return;
            }
            if (data.value) {
                users.value = data.value.users;
                totalPage.value = data.value.total;
            }
        } catch (err) {
            console.error('Ошибка сети:', err);
        }
    };

    const getUser = async (id: number) => {
        try {
            const { data, error } = await useFetch<User>('/api/users', {
                query: { id }
            });
            if (error) {
                console.error('Ошибка при получении пользователя:', error);
                return;
            }
            if (data.value) {
                Object.assign(user, structuredClone(data.value));
            }
        } catch (err) {
            console.error('Ошибка сети:', err);
        }
    };

    const createUser = async (newUser: Omit<User, 'id'>) => {
        try {
            const { data, error } = await useFetch<User>('/api/users', {
                method: 'POST',
                body: newUser
            });
            if (error) {
                console.error('Ошибка при создании пользователя:', error);
                return;
            }
            if (data.value) {
                users.value.push(data.value);
                totalPage.value += 1;
            }
        } catch (err) {
            console.error('Ошибка сети:', err);
        }
    };


    const updateUser = async (id: number, updatedData: Omit<User, 'id'>) => {
        try {
            const { data, error } = await useFetch<User>('/api/users', {
                method: 'PUT',
                query: { id },
                body: updatedData
            });
            if (error) {
                console.error('Ошибка при обновлении пользователя:', error);
                return;
            }
            if (data.value) {
                const index = users.value.findIndex(u => u.id === id);
                if (index !== -1) {
                    users.value[index] = { id: users.value[index]!.id, ...updatedData };
                }
                if (user.id === id) {
                    Object.assign(user, structuredClone(data.value));
                }
            }
        } catch (err) {
            console.error('Ошибка сети:', err);
        }
    };

    const deleteUser = async (id: number) => {
        try {
            const { error } = await useFetch('/api/users', {
                method: 'DELETE',
                query: { id }
            });
            if (error) {
                console.error('Ошибка при удалении пользователя:', error);
                return;
            }
            const index = users.value.findIndex(u => u.id === id);
            if (index !== -1) {
                users.value.splice(index, 1);
                totalPage.value -= 1;
            }
        } catch (err) {
            console.error('Ошибка сети:', err);
        }
    };

    const nextPage = () => {
        if (currentPage.value < Math.ceil(totalPage.value / currentLimit.value)) {
            currentPage.value += 1;
            getUsers(currentPage.value, currentLimit.value);
        }
    };

    const prevPage = () => {
        if (currentPage.value > 1) {
            currentPage.value -= 1;
            getUsers(currentPage.value, currentLimit.value);
        }
    };

    const setPage = (page: number) => {
        if (page >= 1 && page <= Math.ceil(totalPage.value / currentLimit.value)) {
            currentPage.value = page;
            getUsers(currentPage.value, currentLimit.value);
        }
    };

    const refreshUsers = () => {
        getUsers(currentPage.value, currentLimit.value);
    };

    return {
        user, users, currentPage, currentLimit, getUsers, getUser, createUser, updateUser, deleteUser, nextPage, prevPage, setPage, refreshUsers, totalPage
    }
}
)
