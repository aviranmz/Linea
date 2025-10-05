import React, { useState, useEffect } from 'react'
import { getJson, postJson, putJson, deleteJson } from '../lib/api'
import { useLanguage } from '../hooks/useLanguage'

interface Product {
  id: string
  name: string
  slug: string
  description?: string
  color?: string
  icon?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function AdminProducts() {
  const [authLoading, setAuthLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const { t } = useLanguage()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [message, setMessage] = useState('')
  const [newProduct, setNewProduct] = useState({
    name: '',
    slug: '',
    description: '',
    color: '#3b82f6',
    icon: '🏷️',
    isActive: true
  })

  useEffect(() => {
    let mounted = true
    getJson<{ authenticated: boolean; user?: { role?: string } }>('/auth/me')
      .then((res) => { if (!mounted) return; setIsAdmin(!!res.user && res.user.role === 'ADMIN') })
      .catch(() => { if (!mounted) return; setIsAdmin(false) })
      .finally(() => { if (mounted) setAuthLoading(false) })
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    if (isAdmin) {
      loadProducts()
    }
  }, [isAdmin])

  const loadProducts = async () => {
    try {
      const data = await getJson<{ products: Product[] }>('/api/admin/products')
      setProducts(data.products || [])
    } catch (error) {
      console.error('Failed to load products:', error)
      setMessage('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await postJson('/api/admin/products', newProduct)
      setMessage('Product created successfully!')
      setNewProduct({ name: '', slug: '', description: '', color: '#3b82f6', icon: '🏷️', isActive: true })
      setShowCreateForm(false)
      loadProducts()
    } catch (error) {
      console.error('Failed to create product:', error)
      setMessage('Failed to create product')
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct) return

    try {
      await putJson(`/api/admin/products/${editingProduct.id}`, editingProduct)
      setMessage('Product updated successfully!')
      setEditingProduct(null)
      loadProducts()
    } catch (error) {
      console.error('Failed to update product:', error)
      setMessage('Failed to update product')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm(t('confirm.deleteProduct'))) return

    try {
      await deleteJson(`/api/admin/products/${id}`)
      setMessage('Product deleted successfully!')
      loadProducts()
    } catch (error) {
      console.error('Failed to delete product:', error)
      setMessage('Failed to delete product')
    }
  }

  const toggleActive = async (product: Product) => {
    try {
      await putJson(`/api/admin/products/${product.id}`, {
        ...product,
        isActive: !product.isActive
      })
      setMessage(`Product ${!product.isActive ? 'activated' : 'deactivated'} successfully!`)
      loadProducts()
    } catch (error) {
      console.error('Failed to toggle product status:', error)
      setMessage('Failed to update product status')
    }
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  if (authLoading) return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">Loading...</div>
  if (!isAdmin) return <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">Forbidden: Admins only.</div>

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Admin • Products</h1>
          <p className="text-sm text-gray-600">Manage product tags and specialties</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn btn-primary"
        >
          Create Product
        </button>
      </div>

      {message && (
        <div className="bg-indigo-100 border border-indigo-200 text-indigo-800 px-4 py-3 rounded-lg mb-6" role="alert">
          {message}
        </div>
      )}

      {loading ? (
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      ) : (
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slug
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Businesses
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{product.icon}</span>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          {product.description && (
                            <div className="text-sm text-gray-500">{product.description}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.slug}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        product.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {/* TODO: Add business count */}
                      0
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingProduct(product)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => toggleActive(product)}
                          className={product.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}
                        >
                          {product.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:text-red-900"
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

      {/* Create Product Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Product</h3>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    className="input w-full"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct(prev => ({ 
                      ...prev, 
                      name: e.target.value,
                      slug: generateSlug(e.target.value)
                    }))}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug *
                  </label>
                  <input
                    type="text"
                    className="input w-full"
                    value={newProduct.slug}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, slug: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    className="input w-full"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color
                    </label>
                    <input
                      type="color"
                      className="input w-full h-10"
                      value={newProduct.color}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, color: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Icon
                    </label>
                    <input
                      type="text"
                      className="input w-full"
                      value={newProduct.icon}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, icon: e.target.value }))}
                      placeholder="🏷️"
                    />
                  </div>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    className="mr-2"
                    checked={newProduct.isActive}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, isActive: e.target.checked }))}
                  />
                  <label htmlFor="isActive" className="text-sm text-gray-700">
                    Active
                  </label>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Product</h3>
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    className="input w-full"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct(prev => prev ? ({ 
                      ...prev, 
                      name: e.target.value,
                      slug: generateSlug(e.target.value)
                    }) : null)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug *
                  </label>
                  <input
                    type="text"
                    className="input w-full"
                    value={editingProduct.slug}
                    onChange={(e) => setEditingProduct(prev => prev ? ({ ...prev, slug: e.target.value }) : null)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    className="input w-full"
                    value={editingProduct.description || ''}
                    onChange={(e) => setEditingProduct(prev => prev ? ({ ...prev, description: e.target.value }) : null)}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color
                    </label>
                    <input
                      type="color"
                      className="input w-full h-10"
                      value={editingProduct.color || '#3b82f6'}
                      onChange={(e) => setEditingProduct(prev => prev ? ({ ...prev, color: e.target.value }) : null)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Icon
                    </label>
                    <input
                      type="text"
                      className="input w-full"
                      value={editingProduct.icon || '🏷️'}
                      onChange={(e) => setEditingProduct(prev => prev ? ({ ...prev, icon: e.target.value }) : null)}
                      placeholder="🏷️"
                    />
                  </div>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="editIsActive"
                    className="mr-2"
                    checked={editingProduct.isActive}
                    onChange={(e) => setEditingProduct(prev => prev ? ({ ...prev, isActive: e.target.checked }) : null)}
                  />
                  <label htmlFor="editIsActive" className="text-sm text-gray-700">
                    Active
                  </label>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
