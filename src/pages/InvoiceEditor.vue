<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { formatMoney, computeItemTotal, computeTotals } from '../utils/format'
import { useInvoices } from '../composables/useInvoices'
import type { Invoice, InvoiceStatus } from '../types'

const { getOne, save } = useInvoices()
const route = useRoute()
const router = useRouter()

const saving = ref(false)
const formErrors = ref<string[]>([])

const model = reactive<Invoice>({
  id: '',
  number: '',
  date: new Date().toISOString().slice(0, 10),
  dueDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
  customerName: '',
  customerEmail: '',
  items: [{ description: '', quantity: 1, unitPrice: 0, total: 0 }],
  subtotal: 0,
  vat: 0,
  total: 0,
  status: 'draft'
})

onMounted(async () => {
  if (route.params.id) {
    const data = await getOne(route.params.id as string)
    Object.assign(model, data)
  }
  recalc()
})

function recalc() {
  for (const it of model.items)
    it.total = computeItemTotal(Number(it.quantity || 0), Number(it.unitPrice || 0))
  const totals = computeTotals(model.items)
  model.subtotal = totals.subtotal
  model.vat = totals.vat
  model.total = totals.total
}

function addItem() {
  model.items.push({ description: '', quantity: 1, unitPrice: 0, total: 0 })
  recalc()
}

function removeItem(i: number) {
  model.items.splice(i, 1)
  recalc()
}

function validate() {
  formErrors.value = []
  if (!model.customerName.trim()) formErrors.value.push('Customer name is required')
  if (!model.number.trim()) formErrors.value.push('Invoice number is required')
  if (!model.date) formErrors.value.push('Date is required')
  if (!model.dueDate) formErrors.value.push('Due date is required')
  const valid: InvoiceStatus[] = ['draft', 'unpaid', 'paid']
  if (!valid.includes(model.status)) formErrors.value.push('Status is invalid')
  if (model.items.length === 0) formErrors.value.push('At least one item required')
  model.items.forEach((it, i) => {
    if (!it.description.trim()) formErrors.value.push(`Item #${i + 1}: description is required`)
    if (Number(it.quantity) <= 0) formErrors.value.push(`Item #${i + 1}: quantity must be > 0`)
    if (Number(it.unitPrice) < 0) formErrors.value.push(`Item #${i + 1}: unit price must be ≥ 0`)
  })
  return formErrors.value.length === 0
}

async function onSave() {
  recalc()
  if (!validate()) return
  saving.value = true
  try {
    await save({ ...model })
    router.push('/invoices')
  } finally {
    saving.value = false
  }
}

function onCancel() {
  router.push('/invoices')
}

// watch за live recalculation
watch(() => model.items, recalc, { deep: true })
</script>

<template>
  <div class="col" style="gap:16px;">
    <div class="space-between">
      <h1>{{ model.id ? 'Edit Invoice' : 'New Invoice' }}</h1>
      <div class="row" style="gap:8px;">
        <button class="btn" @click="onSave" :disabled="saving">Save</button>
        <button class="btn secondary" @click="onCancel" :disabled="saving">Cancel</button>
      </div>
    </div>

    <div v-if="formErrors.length" class="banner" style="margin-bottom:12px;">
      <div v-for="e in formErrors" :key="e">• {{ e }}</div>
    </div>

    <div class="row" style="gap:20px;">
      <!-- LEFT: FORM -->
      <div class="col" style="flex:1; gap:12px;">
        <div class="card col" style="gap:12px;">
          <div class="row">
            <div class="col" style="flex:1;">
              <label>Customer Name</label>
              <input v-model="model.customerName" class="input" />
            </div>
            <div class="col" style="flex:1;">
              <label>Customer Email</label>
              <input v-model="model.customerEmail" class="input" />
            </div>
          </div>

          <div class="row">
            <div class="col" style="flex:1;">
              <label>Invoice Number</label>
              <input v-model="model.number" class="input" />
            </div>
            <div class="col" style="flex:1;">
              <label>Date</label>
              <input type="date" v-model="model.date" class="input" />
            </div>
            <div class="col" style="flex:1;">
              <label>Due Date</label>
              <input type="date" v-model="model.dueDate" class="input" />
            </div>
          </div>

          <div class="col">
            <label>Status</label>
            <select v-model="model.status" class="input">
              <option value="draft">Draft</option>
              <option value="unpaid">Unpaid</option>
              <option value="paid">Paid</option>
            </select>
          </div>

          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(it, i) in model.items" :key="i">
                <td><input v-model="it.description" class="input" /></td>
                <td><input v-model.number="it.quantity" type="number" min="1" class="input" /></td>
                <td><input v-model.number="it.unitPrice" type="number" min="0" step="0.01" class="input" /></td>
                <td>{{ formatMoney(it.total) }}</td>
                <td><button class="btn secondary" @click="removeItem(i)">x</button></td>
              </tr>
            </tbody>
          </table>

          <button class="btn" @click="addItem">Add Item</button>
        </div>
      </div>

      <!-- RIGHT: LIVE PREVIEW -->
      <div class="col" style="flex:1; gap:12px;">
        <h3>Live Preview</h3>
        <div class="preview">
          <div class="space-between">
            <div>
              <div style="font-weight:700; font-size:20px;">VOIDWEB</div>
              <div>Voidweb Ltd.</div>
              <div>hello@voidweb.eu</div>
              <div>EU VAT: BG000000</div>
            </div>
            <div style="text-align:right">
              <div style="font-weight:700;">Invoice</div>
              <div># {{ model.number || '—' }}</div>
              <div>Date: {{ model.date }}</div>
              <div>Due: {{ model.dueDate }}</div>
              <div><span class="status" :class="model.status">{{ model.status }}</span></div>
            </div>
          </div>
          <hr />
          <div class="row">
            <div class="col" style="flex:1">
              <strong>Bill To</strong>
              <div>{{ model.customerName || '—' }}</div>
              <div>{{ model.customerEmail }}</div>
            </div>
          </div>
          <table style="margin-top:12px;">
            <thead>
              <tr>
                <th>Description</th>
                <th>Qty</th>
                <th>Unit</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(it, i) in model.items" :key="i">
                <td>{{ it.description || '—' }}</td>
                <td>{{ it.quantity }}</td>
                <td>{{ formatMoney(it.unitPrice || 0) }}</td>
                <td>{{ formatMoney(it.total || 0) }}</td>
              </tr>
            </tbody>
          </table>
          <div class="col" style="align-items:flex-end; gap:6px; margin-top:12px;">
            <div>Subtotal: <strong>{{ formatMoney(model.subtotal) }}</strong></div>
            <div>VAT (20%): <strong>{{ formatMoney(model.vat) }}</strong></div>
            <div style="font-size:18px;">Total: <strong>{{ formatMoney(model.total) }}</strong></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
