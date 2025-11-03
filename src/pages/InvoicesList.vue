<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useInvoices } from '../composables/useInvoices'
import { useDebounce } from '../composables/useDebounce'
import { formatMoney } from '../utils/format'
import LoadingSkeleton from '../components/LoadingSkeleton.vue'
import { useToast } from '../components/Toasts.vue'
import type { Invoice } from '../types'
import { useRouter } from 'vue-router'

const router = useRouter()
const { loading, error, data, fetchAll, remove } = useInvoices()
const { push } = useToast()

const q = ref('')
const qd = useDebounce(q, 350)

const filtered = computed(() => {
  const list = data.value || []
  const term = qd.value.trim().toLowerCase()
  if (!term) return list
  return list.filter(x => x.customerName.toLowerCase().includes(term))
})

async function onDelete(inv: Invoice) {
  if (!inv.id) return
  if (!confirm(`Delete invoice ${inv.number}?`)) return
  try {
    await remove(inv.id)
    push('Invoice deleted', 'success')
  } catch (e: any) {
    push(e.message || 'Delete failed', 'error')
  }
}

onMounted(fetchAll)
</script>

<template>
  <div class="col" style="gap:16px;">
    <div class="space-between">
      <h1>Invoices</h1>
      <div class="row">
        <input class="input" placeholder="Search by customer name" v-model="q" />
        <button class="btn" @click="router.push('/invoices/new')">New Invoice</button>
      </div>
    </div>

    <div v-if="loading" class="card"><LoadingSkeleton/></div>
    <div v-else>
      <div v-if="error" class="banner" role="alert">{{ error }}</div>

      <div class="card" v-if="filtered.length">
        <table>
          <thead>
            <tr>
              <th>Number</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Due</th>
              <th>Subtotal</th>
              <th>VAT</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="inv in filtered" :key="inv.id">
              <td>{{ inv.number }}</td>
              <td>{{ inv.customerName }}</td>
              <td>{{ inv.date }}</td>
              <td>{{ inv.dueDate }}</td>
              <td>{{ formatMoney(inv.subtotal || 0) }}</td>
              <td>{{ formatMoney(inv.vat || 0) }}</td>
              <td><strong>{{ formatMoney(inv.total || 0) }}</strong></td>
              <td><span class="status" :class="inv.status">{{ inv.status }}</span></td>
              <td class="row">
                <button class="btn secondary" @click="router.push(`/invoices/${inv.id}`)">Edit</button>
                <button class="btn" @click="onDelete(inv)" :disabled="loading">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="card" v-else>No invoices</div>
    </div>
  </div>
</template>
