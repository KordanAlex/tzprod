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

    const searchQuery = ref('')

    const getUsers = async (page: number, limit?: number) => {
        try {
            const data = await $fetch<{ users: User[]; total: number }>('/api/users', {
                query: { page, limit, search: searchQuery.value || undefined }
            })
            users.value = data.users
            totalPage.value = data.total
        } catch (err) {
            console.error('Ошибка при получении пользователей:', err)
        }
    }

    const getUser = async (id: number) => {
        try {
            const data = await $fetch<User>('/api/users', {
                query: { id }
            })
            Object.assign(user, structuredClone(data))
        } catch (err) {
            console.error('Ошибка при получении пользователя:', err)
        }
    }

    const createUser = async (newUser: Omit<User, 'id'>) => {
        try {
            const data = await $fetch<User>('/api/users', {
                method: 'POST',
                body: newUser
            })
            users.value.push(data)
            totalPage.value += 1
        } catch (err) {
            console.error('Ошибка при создании пользователя:', err)
        }
    }

    const updateUser = async (id: number, updatedData: Omit<User, 'id'>) => {
        try {
            const data = await $fetch<User>('/api/users', {
                method: 'PUT',
                query: { id },
                body: updatedData
            })
            const index = users.value.findIndex(u => u.id === id)
            if (index !== -1) {
                users.value[index] = { id: users.value[index]!.id, ...updatedData }
            }
            if (user.id === id) {
                Object.assign(user, structuredClone(data))
            }
        } catch (err) {
            console.error('Ошибка при обновлении пользователя:', err)
        }
    }

    const deleteUser = async (id: number) => {
        try {
            await $fetch('/api/users', {
                method: 'DELETE',
                query: { id }
            })
            const index = users.value.findIndex(u => u.id === id)
            if (index !== -1) {
                users.value.splice(index, 1)
                totalPage.value -= 1
            }
        } catch (err) {
            console.error('Ошибка при удалении пользователя:', err)
        }
    }

    const nextPage = () => {
        if (currentPage.value < Math.ceil(totalPage.value / currentLimit.value)) {
            currentPage.value += 1
            getUsers(currentPage.value, currentLimit.value)
        }
    }

    const prevPage = () => {
        if (currentPage.value > 1) {
            currentPage.value -= 1
            getUsers(currentPage.value, currentLimit.value)
        }
    }

    const setPage = (page: number) => {
        if (page >= 1 && page <= Math.ceil(totalPage.value / currentLimit.value)) {
            currentPage.value = page
            getUsers(currentPage.value, currentLimit.value)
        }
    }

    const searchUsers = async (search: string) => {
        try {
            const data = await $fetch<{ users: (User & { position: number })[]; total: number }>('/api/users', {
                query: { page: 1, limit: 50, search }
            })
            return data.users.map(u => ({ id: u.id, label: `${u.name}, ${u.age} age`, position: u.position }))
        } catch (err) {
            console.error('Ошибка при поиске:', err)
            return []
        }
    }

    const refreshUsers = () => {
        getUsers(currentPage.value, currentLimit.value)
    }

    return {
        user, users, searchQuery, currentPage, currentLimit, getUsers, getUser,
        searchUsers, createUser, updateUser, deleteUser, nextPage, prevPage,
        setPage, refreshUsers, totalPage
    }
})
