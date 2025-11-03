export const EUR = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 })
export const TWO = new Intl.NumberFormat('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })


export const formatMoney = (n: number) => EUR.format(n)
export const format2 = (n: number) => TWO.format(n)


export function computeItemTotal(quantity: number, unitPrice: number) {
return +(quantity * unitPrice).toFixed(2)
}


export function computeTotals(items: { total: number }[]) {
const subtotal = +items.reduce((s, i) => s + (i.total || 0), 0).toFixed(2)
const vat = +((subtotal * 0.2)).toFixed(2)
const total = +(subtotal + vat).toFixed(2)
return { subtotal, vat, total }
}