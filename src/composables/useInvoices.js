import { ref } from 'vue';
import api from '../services/api';
export function useInvoices() {
    const loading = ref(false);
    const error = ref(null);
    const data = ref(null);
    async function fetchAll() {
        loading.value = true;
        error.value = null;
        try {
            const res = await api.get('/invoices');
            data.value = res.data;
        }
        catch (e) {
            error.value = e?.response?.data?.message || e?.message || 'Failed to fetch invoices';
        }
        finally {
            loading.value = false;
        }
    }
    async function remove(id) {
        try {
            await api.delete(`/invoices/${id}`);
            data.value = (data.value || []).filter(x => x.id !== id);
        }
        catch (e) {
            throw new Error(e?.response?.data?.message || e?.message || 'Delete failed');
        }
    }
    async function getOne(id) {
        const res = await api.get(`/invoices/${id}`);
        return res.data;
    }
    async function save(payload) {
        const body = { ...payload };
        if (body.id) {
            const { id, ...rest } = body;
            const res = await api.put(`/invoices/${id}`, rest);
            return res.data;
        }
        else {
            const { id, ...rest } = body;
            const res = await api.post('/invoices', rest);
            return res.data;
        }
    }
    return { loading, error, data, fetchAll, remove, getOne, save };
}
