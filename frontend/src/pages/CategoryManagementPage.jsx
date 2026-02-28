import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { categoryService } from '../services/categoryService';

const initialForm = {
  name: '',
  description: '',
  departmentId: '',
};

function CategoryFormModal({ isOpen, onClose, onSubmit, category, departments, isSubmitting }) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const isEditMode = Boolean(category);

  useEffect(() => {
    if (category) {
      setForm({
        name: category.name,
        description: category.description || '',
        departmentId: String(category.departmentId),
      });
    } else {
      setForm(initialForm);
    }
    setError('');
  }, [category, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!form.name || form.name.trim().length < 3) {
      return 'Category name must be at least 3 characters';
    }
    if (!form.departmentId) {
      return 'Department is required';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      departmentId: Number(form.departmentId),
    };

    try {
      await onSubmit(payload);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={(e) => e.stopPropagation()}>
        <h2 id="modal-title">{isEditMode ? 'Edit Category' : 'Create Category'}</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="cat-name">Name</label>
            <input id="cat-name" type="text" name="name" value={form.name} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label htmlFor="cat-description">Description</label>
            <textarea id="cat-description" name="description" value={form.description} onChange={handleChange} rows="3" />
          </div>

          <div className="form-group">
            <label htmlFor="cat-departmentId">Department</label>
            <select id="cat-departmentId" name="departmentId" value={form.departmentId} onChange={handleChange}>
              <option value="">Select department...</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn-primary-inline" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : isEditMode ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CategoryManagementPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setError('');
      const [categoriesData, deptsData] = await Promise.all([
        categoryService.getAll(),
        categoryService.getDepartments(),
      ]);
      setCategories(categoriesData);
      setDepartments(deptsData);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openCreateModal = () => {
    setEditingCategory(null);
    setModalOpen(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingCategory(null);
  };

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      if (editingCategory) {
        await categoryService.update(editingCategory.id, formData);
      } else {
        await categoryService.create(formData);
      }
      closeModal();
      await loadData();
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (category) => {
    const action = category.isActive ? 'deactivate' : 'activate';
    if (!window.confirm(`Are you sure you want to ${action} "${category.name}"?`)) {
      return;
    }
    try {
      await categoryService.toggleActive(category.id);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.error || `Failed to ${action} category`);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="loading">Loading...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <div className="page-header-left">
          <button className="btn-back" onClick={() => navigate('/dashboard')}>
            &larr; Back
          </button>
          <h2>Category Management</h2>
        </div>
        <button className="btn-primary-inline" onClick={openCreateModal}>
          + Create Category
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Department</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c.id} className={!c.isActive ? 'row-inactive' : ''}>
              <td>{c.name}</td>
              <td>{c.description || '-'}</td>
              <td>{c.department}</td>
              <td>
                <span className={`status-badge ${c.isActive ? 'status-active' : 'status-inactive'}`}>
                  {c.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="actions-cell">
                <button className="btn-sm btn-edit" onClick={() => openEditModal(c)}>
                  Edit
                </button>
                <button
                  className={`btn-sm ${c.isActive ? 'btn-toggle-off' : 'btn-toggle-on'}`}
                  onClick={() => handleToggleActive(c)}
                >
                  {c.isActive ? 'Deactivate' : 'Activate'}
                </button>
              </td>
            </tr>
          ))}
          {categories.length === 0 && (
            <tr>
              <td colSpan="5" className="empty-state">No categories found</td>
            </tr>
          )}
        </tbody>
      </table>

      <CategoryFormModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        category={editingCategory}
        departments={departments}
        isSubmitting={submitting}
      />
    </DashboardLayout>
  );
}
