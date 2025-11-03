import { createRouter, createWebHistory } from 'vue-router';
const InvoicesList = () => import('./pages/InvoicesList.vue');
const InvoiceEditor = () => import('./pages/InvoiceEditor.vue');
export const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', redirect: '/invoices' },
        { path: '/invoices', name: 'invoices', component: InvoicesList },
        { path: '/invoices/new', name: 'invoice-new', component: InvoiceEditor },
        { path: '/invoices/:id', name: 'invoice-edit', component: InvoiceEditor, props: true },
    ],
});
