<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})

const store = useUserStore()

const loading = ref(false)

const onFilterSelect = async (item: { id: number; label: string; [key: string]: any }) => {
  store.searchQuery = item.label.split(',')[0] ?? ''
  store.currentPage = 1
  loading.value = true
  await store.getUsers(1, store.currentLimit)
  loading.value = false
}

const clearFilter = async () => {
  store.searchQuery = ''
  store.currentPage = 1
  loading.value = true
  await store.getUsers(1, store.currentLimit)
  loading.value = false
}

const totalPages = computed(() =>
  Math.max(1, Math.ceil(store.totalPage / store.currentLimit))
)

const pageNumbers = computed(() => {
  const total = totalPages.value
  const current = store.currentPage
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | string)[] = [1]
  if (current > 3) pages.push('…')
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) pages.push(p)
  if (current < total - 2) pages.push('…')
  pages.push(total)
  return pages
})

const modal = reactive({
  open: false,
  mode: 'create' as 'create' | 'edit',
  editId: 0,
  form: { name: '', age: 0 }
})

const isFormValid = computed(() => modal.form.name.trim().length > 0 && modal.form.age > 0)

const openCreateModal = () => {
  modal.form = { name: '', age: 0 }
  modal.mode = 'create'
  modal.open = true
}

const openEditModal = (user: { id: number; name: string; age: number }) => {
  modal.form = { name: user.name, age: user.age }
  modal.editId = user.id
  modal.mode = 'edit'
  modal.open = true
}

const closeModal = () => { modal.open = false }

const submitModal = async () => {
  if (!isFormValid.value) return
  loading.value = true
  if (modal.mode === 'create') {
    await store.createUser(modal.form)
  } else {
    await store.updateUser(modal.editId, modal.form)
  }
  loading.value = false
  closeModal()
}

const handleDelete = async (id: number) => {
  if (!confirm('Delete this user?')) return
  loading.value = true
  await store.deleteUser(id)
  loading.value = false
}

const changeLimit = async (e: Event) => {
  store.currentLimit = +(e.target as HTMLSelectElement).value
  store.currentPage = 1
  loading.value = true
  await store.getUsers(1, store.currentLimit)
  loading.value = false
}

onMounted(async () => {
  loading.value = true
  await store.getUsers(store.currentPage, store.currentLimit)
  loading.value = false
})
</script>

<template>
  <div class="page">
    <header class="page-header">
      <div class="header-left">
        <span class="header-label">USERS</span>
        <h1 class="header-title">Directory</h1>
      </div>
      <div class="header-right">
        <span class="total-badge">{{ store.totalPage }} total</span>
        <button class="btn-create" @click="openCreateModal">
          <span class="btn-icon">+</span> New User
        </button>
      </div>
    </header>

    <div class="table-wrapper">
      <div v-if="loading" class="loading-overlay">
        <div class="spinner" />
      </div>

      <table class="user-table">
        <thead>
          <tr>
            <th class="th-id">#</th>
            <th>Name</th>
            <th>Age</th>
            <th class="th-actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, i) in store.users" :key="user.id" class="table-row" :style="{ '--i': i }">
            <td class="td-id">{{ user.id }}</td>
            <td class="td-name">
              <span class="avatar">{{ user.name[0]?.toUpperCase() }}</span>
              {{ user.name }}
            </td>
            <td class="td-age">
              <span class="age-chip">{{ user.age }} yr</span>
            </td>
            <td class="td-actions">
              <button class="action-btn edit" @click="openEditModal(user)" title="Edit">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
              <button class="action-btn delete" @click="handleDelete(user.id)" title="Delete">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  <path d="M10 11v6" />
                  <path d="M14 11v6" />
                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                </svg>
              </button>
            </td>
          </tr>
          <tr v-if="!store.users.length && !loading">
            <td colspan="4" class="empty-row">No users found</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination">
      <div class="page-info">
        Page <strong>{{ store.currentPage }}</strong> of <strong>{{ totalPages }}</strong>
      </div>
      <div class="page-controls">
        <button class="page-btn" :disabled="store.currentPage === 1" @click="store.prevPage()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button v-for="p in pageNumbers" :key="p" class="page-btn number"
          :class="{ active: p === store.currentPage, ellipsis: p === '…' }" :disabled="p === '…'"
          @click="p !== '…' && store.setPage(+p)">{{ p }}</button>
        <button class="page-btn" :disabled="store.currentPage === totalPages" @click="store.nextPage()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
      <div class="limit-select">
        <label>Show</label>
        <select :value="store.currentLimit" @change="changeLimit">
          <option v-for="n in [5, 10, 20]" :key="n" :value="n">{{ n }}</option>
        </select>
      </div>
    </div>

    <div class="filter-bar">
      <DropdownFilter
        :search-fn="store.searchUsers"
        placeholder="Filter by name..."
        @select="onFilterSelect"
      />
      <button v-if="store.searchQuery" class="btn-clear-filter" @click="clearFilter">
        Clear
      </button>
    </div>

    <Transition name="modal">
      <div v-if="modal.open" class="modal-backdrop" @click.self="closeModal">
        <div class="modal">
          <div class="modal-header">
            <h2>{{ modal.mode === 'create' ? 'New User' : 'Edit User' }}</h2>
            <button class="modal-close" @click="closeModal">✕</button>
          </div>
          <div class="modal-body">
            <div class="field">
              <label>Name</label>
              <input v-model="modal.form.name" placeholder="Full name" />
            </div>
            <div class="field">
              <label>Age</label>
              <input v-model.number="modal.form.age" type="number" placeholder="Age" min="1" />
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-cancel" @click="closeModal">Cancel</button>
            <button class="btn-save" :disabled="!isFormValid" @click="submitModal">
              {{ modal.mode === 'create' ? 'Create' : 'Save' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: #0d0d0f;
  color: #e8e6e1;
  font-family: 'Syne', sans-serif;
  padding: 48px 40px 260px;
  max-width: 960px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 36px;
  border-bottom: 1px solid #222;
  padding-bottom: 24px;
}

.header-label {
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.18em;
  color: #f5c842;
  display: block;
  margin-bottom: 4px;
}

.header-title {
  font-size: 40px;
  font-weight: 800;
  line-height: 1;
  margin: 0;
  color: #fff;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.total-badge {
  font-family: 'DM Mono', monospace;
  font-size: 12px;
  color: #666;
}

.btn-create {
  background: #f5c842;
  color: #0d0d0f;
  border: none;
  border-radius: 6px;
  padding: 10px 20px;
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: opacity 0.15s;
}

.btn-create:hover { opacity: 0.85; }
.btn-icon { font-size: 18px; line-height: 1; }

.table-wrapper {
  position: relative;
  border: 1px solid #222;
  border-radius: 10px;
  overflow: hidden;
}

.loading-overlay {
  position: absolute;
  inset: 0;
  background: rgba(13, 13, 15, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #333;
  border-top-color: #f5c842;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.user-table { width: 100%; border-collapse: collapse; }

.user-table th {
  background: #141416;
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.12em;
  color: #555;
  text-transform: uppercase;
  padding: 14px 20px;
  text-align: left;
  border-bottom: 1px solid #222;
}

.th-id { width: 64px; }
.th-actions { width: 100px; text-align: right; }

.table-row {
  border-bottom: 1px solid #1a1a1c;
  animation: rowIn 0.3s ease both;
  animation-delay: calc(var(--i) * 50ms);
}

@keyframes rowIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.table-row:last-child { border-bottom: none; }
.table-row:hover { background: #141416; }

.user-table td { padding: 14px 20px; font-size: 15px; vertical-align: middle; }

.td-id { font-family: 'DM Mono', monospace; font-size: 12px; color: #444; }

.td-name {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
  color: #e8e6e1;
}

.avatar {
  width: 30px;
  height: 30px;
  background: #1e1e22;
  border: 1px solid #2e2e32;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'DM Mono', monospace;
  font-size: 13px;
  color: #f5c842;
  flex-shrink: 0;
}

.td-age { color: #888; }

.age-chip {
  font-family: 'DM Mono', monospace;
  font-size: 12px;
  background: #1a1a1c;
  border: 1px solid #2a2a2e;
  border-radius: 4px;
  padding: 3px 8px;
  color: #aaa;
}

.td-actions {
  text-align: right;
  white-space: nowrap;
}

.action-btn {
  background: none;
  border: 1px solid transparent;
  border-radius: 6px;
  padding: 6px 8px;
  cursor: pointer;
  transition: all 0.15s;
  color: #555;
  display: inline-flex;
  align-items: center;
}

.action-btn.edit:hover { border-color: #2e5af5; color: #5b82ff; background: #0e1428; }
.action-btn.delete:hover { border-color: #6b1a1a; color: #f55; background: #1a0e0e; }

.empty-row {
  text-align: center;
  padding: 48px;
  color: #444;
  font-size: 14px;
  font-family: 'DM Mono', monospace;
}

.filter-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 24px;
}

.btn-clear-filter {
  background: none;
  border: 1px solid #2a2a2e;
  border-radius: 6px;
  color: #666;
  font-family: 'Syne', sans-serif;
  font-size: 13px;
  padding: 10px 16px;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-clear-filter:hover { border-color: #f55; color: #f55; }

.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 24px;
  flex-wrap: wrap;
  gap: 12px;
}

.page-info { font-family: 'DM Mono', monospace; font-size: 12px; color: #555; }
.page-info strong { color: #aaa; }
.page-controls { display: flex; gap: 4px; }

.page-btn {
  min-width: 34px;
  height: 34px;
  padding: 0 8px;
  border: 1px solid #222;
  border-radius: 6px;
  background: #141416;
  color: #888;
  cursor: pointer;
  font-family: 'DM Mono', monospace;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}

.page-btn:hover:not(:disabled):not(.ellipsis) { border-color: #f5c842; color: #f5c842; }
.page-btn.active { background: #f5c842; border-color: #f5c842; color: #0d0d0f; font-weight: 700; }
.page-btn:disabled { opacity: 0.3; cursor: default; }
.page-btn.ellipsis { pointer-events: none; color: #444; }

.limit-select {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'DM Mono', monospace;
  font-size: 12px;
  color: #555;
}

.limit-select select {
  background: #141416;
  border: 1px solid #222;
  color: #aaa;
  border-radius: 6px;
  padding: 6px 10px;
  font-family: 'DM Mono', monospace;
  font-size: 12px;
  cursor: pointer;
  outline: none;
}

.limit-select select:focus { border-color: #f5c842; }

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  backdrop-filter: blur(4px);
}

.modal {
  background: #141416;
  border: 1px solid #2a2a2e;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #1e1e22;
}

.modal-header h2 { margin: 0; font-size: 18px; font-weight: 700; }

.modal-close {
  background: none;
  border: none;
  color: #555;
  cursor: pointer;
  font-size: 16px;
  padding: 4px;
}

.modal-close:hover { color: #fff; }

.modal-body { padding: 24px; display: flex; flex-direction: column; gap: 16px; }
.field { display: flex; flex-direction: column; gap: 6px; }

.field label {
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.12em;
  color: #555;
  text-transform: uppercase;
}

.field input {
  background: #0d0d0f;
  border: 1px solid #2a2a2e;
  border-radius: 6px;
  color: #e8e6e1;
  font-family: 'Syne', sans-serif;
  font-size: 15px;
  padding: 10px 14px;
  outline: none;
  transition: border-color 0.15s;
}

.field input:focus { border-color: #f5c842; }
.field input::placeholder { color: #333; }

.modal-footer { display: flex; gap: 10px; padding: 16px 24px 24px; justify-content: flex-end; }

.btn-cancel {
  background: none;
  border: 1px solid #2a2a2e;
  border-radius: 6px;
  color: #666;
  font-family: 'Syne', sans-serif;
  font-size: 14px;
  font-weight: 600;
  padding: 10px 18px;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-cancel:hover { border-color: #444; color: #aaa; }

.btn-save {
  background: #f5c842;
  border: none;
  border-radius: 6px;
  color: #0d0d0f;
  font-family: 'Syne', sans-serif;
  font-size: 14px;
  font-weight: 700;
  padding: 10px 22px;
  cursor: pointer;
  transition: opacity 0.15s;
}

.btn-save:hover:not(:disabled) { opacity: 0.85; }
.btn-save:disabled { opacity: 0.3; cursor: default; }

.modal-enter-active, .modal-leave-active { transition: opacity 0.2s; }
.modal-enter-active .modal, .modal-leave-active .modal { transition: transform 0.2s; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .modal { transform: scale(0.95) translateY(10px); }
.modal-leave-to .modal { transform: scale(0.95) translateY(10px); }
</style>
