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

    const getUsers = async(page: number, limit? : number) => {
        console.log(page, limit)
        const { data } = await useFetch('/api/users', {
            query: {page: page, limit:limit}
        })
        if(data.value && typeof data.value === 'object' && 'users' in data.value) {
            users.value = data.value.users as User[]
        }
        if(data.value && typeof data.value === 'number' && 'total' in data.value) {
        totalPage.value = (data.value as any).total}
    }

    const getUser = async(id: number) => {
        const {data} = useFetch('/api/users', {
            query: {id: id}
        })

        
    }

    return {user, users, currentPage, currentLimit,}
}
)
