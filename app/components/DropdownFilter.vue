<script setup lang="ts">
interface SearchResult {
    id: number
    label: string
    [key: string]: any
}

interface Props {
    searchFn: (query: string) => Promise<SearchResult[]>
    placeholder?: string;
}
const props = defineProps<Props>()

const emit = defineEmits<{ select: [value: SearchResult] }>()

const search = ref('')
const results = ref<SearchResult[]>([])
const activeIndex = ref(-1)
const isOpen = ref(false)
let timeout: ReturnType<typeof setTimeout>

watch(search, (newVal) => {
    clearTimeout(timeout)
    timeout = setTimeout(async () => {
        if (newVal.trim()) {
            results.value = await props.searchFn(newVal)
        } else {
            results.value = []
        }
    }, 300)
    activeIndex.value = -1
})

const onKeydown = (e: KeyboardEvent) => {
    const lastIndex = results.value.length - 1

    switch (e.key) {
        case 'ArrowDown':
            e.preventDefault() 
            if (activeIndex.value < lastIndex) {
                activeIndex.value++
            }
            break

        case 'ArrowUp':
            e.preventDefault()
            if (activeIndex.value > 0) {
                activeIndex.value--
            }
            break

        case 'Enter':
            if (activeIndex.value >= 0) {
                const selected = results.value[activeIndex.value]
                if (selected) {
                    emit('select', selected)
                    isOpen.value = false
                }
            }
            break
    }
}

</script>

<template>
    <div class="dropdown">
        <input
            class="dropdown-input"
            @keydown="onKeydown"
            @focus="isOpen = true"
            @blur="isOpen = false"
            v-model="search"
            :placeholder="placeholder"
        />

        <ul v-if="isOpen && results.length" class="dropdown-list">
            <li
                v-for="(opt, i) in results"
                :key="opt.id"
                :class="['dropdown-item', { active: i === activeIndex }]"
                @mousedown.prevent
                @click="emit('select', opt); isOpen = false"
            >
                {{ opt.label }}
            </li>
        </ul>
        <div v-else-if="isOpen && search" class="dropdown-empty">Nothing found</div>
    </div>
</template>

<style scoped>
.dropdown {
    position: relative;
    width: 280px;
    font-family: 'Syne', sans-serif;
}

.dropdown-input {
    width: 100%;
    height: 42px;
    padding: 0 14px;
    background: #141416;
    border: 1px solid #2a2a2e;
    border-radius: 8px;
    color: #e8e6e1;
    font-family: 'DM Mono', monospace;
    font-size: 14px;
    line-height: 42px;
    outline: none;
    transition: border-color 0.15s;
    box-sizing: border-box;
    overflow: visible;
}

.dropdown-input:focus {
    border-color: #f5c842;
}

.dropdown-input::placeholder {
    color: #444;
}

.dropdown-list {
    position: absolute;
    top: calc(100% + 6px);
    left: 0;
    right: 0;
    margin: 0;
    padding: 6px 6px 10px;
    list-style: none;
    background: #141416;
    border: 1px solid #2a2a2e;
    border-radius: 8px;
    max-height: 200px;
    overflow: visible;
    z-index: 50;
}

.dropdown-item {
    display: block;
    padding: 12px 12px 14px;
    border-radius: 6px;
    font-size: 14px;
    line-height: 1.5;
    color: #aaa;
    cursor: pointer;
    transition: all 0.1s;
}

.dropdown-item:hover {
    background: #1e1e22;
    color: #e8e6e1;
}

.dropdown-item.active {
    background: #f5c842;
    color: #0d0d0f;
    font-weight: 600;
}

.dropdown-empty {
    margin-top: 6px;
    padding: 12px;
    text-align: center;
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    color: #444;
    background: #141416;
    border: 1px solid #2a2a2e;
    border-radius: 8px;
}
</style>