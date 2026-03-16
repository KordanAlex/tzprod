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

    return { user, users, currentPage, currentLimit, getUsers, getUser, updateUser, totalPage }
}
)
