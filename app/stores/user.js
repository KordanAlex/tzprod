export const useUserStore = defineStore("userStore", () => {
    const users = ref([]);
    const user = reactive({
        id: "",
        name: "",
        age: "",
    });

    const getUsers = async () => {
        try {
            const { data } = await useFetch(
                "/api/users",
            );
            users.value = data.value;
        } catch (e) {
            console.error("Ошибка получения списка пользователей", e);
        }
    };

    const getUser = async (id) => {
        try {
            const { data } = await useFetch(`/api/users${id}`)
            Object.assign(user, data.value)
        } catch(e) {
            console.error("Ошибка получения пользователя", e)
        }
    };

    return { user, users, getUsers };
});
