import { ref } from 'vue'
import  api  from '../services/api'
import type { Invoice } from '../types'


export function useInvoices() {
const loading = ref(false)
const error = ref<string | null>(null)
const data = ref<Invoice[] | null>(null)


async function fetchAll() {
loading.value = true
error.value = null
try {
const res = await api.get('/invoices')
data.value = res.data
} catch (e: any) {
error.value = e?.response?.data?.message || e?.message || 'Failed to fetch invoices'
} finally {
loading.value = false
}
}


async function remove(id: string) {
try {
await api.delete(`/invoices/${id}`)
data.value = (data.value || []).filter(x => x.id !== id)
} catch (e: any) {
throw new Error(e?.response?.data?.message || e?.message || 'Delete failed')
}
}


async function getOne(id: string) {
const res = await api.get(`/invoices/${id}`)
return res.data as Invoice
}


async function save(payload: Invoice) {
const body = { ...payload }
if (body.id) {
const { id, ...rest } = body
const res = await api.put(`/invoices/${id}`, rest)
return res.data as Invoice
} else {
const { id, ...rest } = body
const res = await api.post('/invoices', rest)
return res.data as Invoice
}
}


return { loading, error, data, fetchAll, remove, getOne, save }
}