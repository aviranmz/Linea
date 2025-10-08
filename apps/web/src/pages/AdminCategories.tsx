import React, { useState, useEffect } from 'react';
import { getJson, postJson, putJson, deleteJson } from '../lib/api';
import { useLanguage } from '../hooks/useLanguage';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminCategories() {
  const [authLoading, setAuthLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { t } = useLanguage();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [message, setMessage] = useState('');
  const [newCategory, setNewCategory] = useState({
    name: '',
    slug: '',
    description: '',
    color: '#3b82f6',
    icon: '🏷️',
    isActive: true,
  });

  useEffect(() => {
    let mounted = true;
    getJson<{ authenticated: boolean; user?: { role?: string } }>('/auth/me')
      .then(res => {
        if (!mounted) return;
        setIsAdmin(!!res.user && res.user.role === 'ADMIN');
      })
      .catch(() => {
        if (!mounted) return;
        setIsAdmin(false);
      })
      .finally(() => {
        if (mounted) setAuthLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (isAdmin) {
      loadCategories();
    }
  }, [isAdmin]);

  const loadCategories = async () => {
    try {
      const data = await getJson<{ categories: Category[] }>(
        '/api/admin/categories'
      );
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Failed to load categories:', error);
      setMessage('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await postJson('/api/admin/categories', newCategory);
      setMessage('Category created successfully!');
      setNewCategory({
        name: '',
        slug: '',
        description: '',
        color: '#3b82f6',
        icon: '🏷️',
        isActive: true,
      });
      setShowCreateForm(false);
      loadCategories();
    } catch (error) {
      console.error('Failed to create category:', error);
      setMessage('Failed to create category');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    try {
      await putJson(
        `/api/admin/categories/${editingCategory.id}`,
        editingCategory
      );
      setMessage('Category updated successfully!');
      setEditingCategory(null);
      loadCategories();
    } catch (error) {
      console.error('Failed to update category:', error);
      setMessage('Failed to update category');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('confirm.deleteCategory'))) return;

    try {
      await deleteJson(`/api/admin/categories/${id}`);
      setMessage('Category deleted successfully!');
      loadCategories();
    } catch (error) {
      console.error('Failed to delete category:', error);
      setMessage('Failed to delete category');
    }
  };

  const toggleActive = async (category: Category) => {
    try {
      await putJson(`/api/admin/categories/${category.id}`, {
        ...category,
        isActive: !category.isActive,
      });
      setMessage(
        `Category ${!category.isActive ? 'activated' : 'deactivated'} successfully!`
      );
      loadCategories();
    } catch (error) {
      console.error('Failed to toggle category status:', error);
      setMessage('Failed to update category status');
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  if (authLoading)
    return (
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
        Loading...
      </div>
    );
  if (!isAdmin)
    return (
      <div className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
        Forbidden: Admins only.
      </div>
    );

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h1 className='text-2xl font-bold'>Admin • Categories</h1>
          <p className='text-sm text-gray-600'>
            Manage event categories and tags
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className='btn btn-primary'
        >
          Create Category
        </button>
      </div>

      {message && (
        <div
          className='bg-indigo-100 border border-indigo-200 text-indigo-800 px-4 py-3 rounded-lg mb-6'
          role='alert'
        >
          {message}
        </div>
      )}

      {loading ? (
        <div className='animate-pulse space-y-4'>
          {[...Array(5)].map((_, i) => (
            <div key={i} className='h-16 bg-gray-200 rounded'></div>
          ))}
        </div>
      ) : (
        <div className='bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Category
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Slug
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Status
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Events
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {categories.map(category => (
                  <tr key={category.id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center'>
                        <span className='text-2xl mr-3'>{category.icon}</span>
                        <div>
                          <div className='text-sm font-medium text-gray-900'>
                            {category.name}
                          </div>
                          {category.description && (
                            <div className='text-sm text-gray-500'>
                              {category.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                      {category.slug}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          category.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {category.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {/* TODO: Add event count */}0
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                      <div className='flex space-x-2'>
                        <button
                          onClick={() => setEditingCategory(category)}
                          className='btn btn-ghost btn-sm'
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => toggleActive(category)}
                          className={`btn btn-sm ${
                            category.isActive
                              ? 'btn-outline text-red-600 border-red-300 hover:bg-red-50'
                              : 'btn-outline text-green-600 border-green-300 hover:bg-green-50'
                          }`}
                        >
                          {category.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className='btn btn-outline btn-sm text-red-600 border-red-300 hover:bg-red-50'
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Category Modal */}
      {showCreateForm && (
        <div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50'>
          <div className='relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white'>
            <div className='mt-3'>
              <h3 className='text-lg font-medium text-gray-900 mb-4'>
                Create New Category
              </h3>
              <form onSubmit={handleCreate} className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Name *
                  </label>
                  <input
                    type='text'
                    className='input w-full'
                    value={newCategory.name}
                    onChange={e =>
                      setNewCategory(prev => ({
                        ...prev,
                        name: e.target.value,
                        slug: generateSlug(e.target.value),
                      }))
                    }
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Slug *
                  </label>
                  <input
                    type='text'
                    className='input w-full'
                    value={newCategory.slug}
                    onChange={e =>
                      setNewCategory(prev => ({
                        ...prev,
                        slug: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Description
                  </label>
                  <textarea
                    className='input w-full'
                    value={newCategory.description}
                    onChange={e =>
                      setNewCategory(prev => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    rows={3}
                  />
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Color
                    </label>
                    <input
                      type='color'
                      className='input w-full h-10'
                      value={newCategory.color}
                      onChange={e =>
                        setNewCategory(prev => ({
                          ...prev,
                          color: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Icon
                    </label>
                    <input
                      type='text'
                      className='input w-full'
                      value={newCategory.icon}
                      onChange={e =>
                        setNewCategory(prev => ({
                          ...prev,
                          icon: e.target.value,
                        }))
                      }
                      placeholder='🏷️'
                    />
                  </div>
                </div>
                <div className='flex items-center'>
                  <input
                    type='checkbox'
                    id='isActive'
                    className='mr-2'
                    checked={newCategory.isActive}
                    onChange={e =>
                      setNewCategory(prev => ({
                        ...prev,
                        isActive: e.target.checked,
                      }))
                    }
                  />
                  <label htmlFor='isActive' className='text-sm text-gray-700'>
                    Active
                  </label>
                </div>
                <div className='flex justify-end space-x-3'>
                  <button
                    type='button'
                    onClick={() => setShowCreateForm(false)}
                    className='btn btn-outline'
                  >
                    Cancel
                  </button>
                  <button type='submit' className='btn btn-primary'>
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {editingCategory && (
        <div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50'>
          <div className='relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white'>
            <div className='mt-3'>
              <h3 className='text-lg font-medium text-gray-900 mb-4'>
                Edit Category
              </h3>
              <form onSubmit={handleUpdate} className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Name *
                  </label>
                  <input
                    type='text'
                    className='input w-full'
                    value={editingCategory.name}
                    onChange={e =>
                      setEditingCategory(prev =>
                        prev
                          ? {
                              ...prev,
                              name: e.target.value,
                              slug: generateSlug(e.target.value),
                            }
                          : null
                      )
                    }
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Slug *
                  </label>
                  <input
                    type='text'
                    className='input w-full'
                    value={editingCategory.slug}
                    onChange={e =>
                      setEditingCategory(prev =>
                        prev ? { ...prev, slug: e.target.value } : null
                      )
                    }
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Description
                  </label>
                  <textarea
                    className='input w-full'
                    value={editingCategory.description || ''}
                    onChange={e =>
                      setEditingCategory(prev =>
                        prev ? { ...prev, description: e.target.value } : null
                      )
                    }
                    rows={3}
                  />
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Color
                    </label>
                    <input
                      type='color'
                      className='input w-full h-10'
                      value={editingCategory.color || '#3b82f6'}
                      onChange={e =>
                        setEditingCategory(prev =>
                          prev ? { ...prev, color: e.target.value } : null
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Icon
                    </label>
                    <input
                      type='text'
                      className='input w-full'
                      value={editingCategory.icon || '🏷️'}
                      onChange={e =>
                        setEditingCategory(prev =>
                          prev ? { ...prev, icon: e.target.value } : null
                        )
                      }
                      placeholder='🏷️'
                    />
                  </div>
                </div>
                <div className='flex items-center'>
                  <input
                    type='checkbox'
                    id='editIsActive'
                    className='mr-2'
                    checked={editingCategory.isActive}
                    onChange={e =>
                      setEditingCategory(prev =>
                        prev ? { ...prev, isActive: e.target.checked } : null
                      )
                    }
                  />
                  <label
                    htmlFor='editIsActive'
                    className='text-sm text-gray-700'
                  >
                    Active
                  </label>
                </div>
                <div className='flex justify-end space-x-3'>
                  <button
                    type='button'
                    onClick={() => setEditingCategory(null)}
                    className='btn btn-outline'
                  >
                    Cancel
                  </button>
                  <button type='submit' className='btn btn-primary'>
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
