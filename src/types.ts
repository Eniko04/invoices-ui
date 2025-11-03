export type InvoiceStatus = 'unpaid' | 'paid' | 'draft'


export interface Item {
description: string
quantity: number
unitPrice: number
total: number // computed
}


export interface Invoice {
id?: string
date: string // YYYY-MM-DD
number: string
dueDate: string
customerName: string
customerEmail?: string
subtotal: number // computed
vat: number // computed (20%)
total: number // computed
items: Item[]
status: InvoiceStatus
}