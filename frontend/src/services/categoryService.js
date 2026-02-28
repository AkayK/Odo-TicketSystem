import api from './api';

export const categoryService = {
  async getAll() {
    const { data } = await api.get('/categories');
    return data.data;
  },

  async getById(id) {
    const { data } = await api.get(`/categories/${id}`);
    return data.data;
  },

  async create(categoryData) {
    const { data } = await api.post('/categories', categoryData);
    return data.data;
  },

  async update(id, categoryData) {
    const { data } = await api.put(`/categories/${id}`, categoryData);
    return data.data;
  },

  async toggleActive(id) {
    const { data } = await api.delete(`/categories/${id}`);
    return data.data;
  },

  async getDepartments() {
    const { data } = await api.get('/categories/departments');
    return data.data;
  },
};
