import { useEffect, useMemo, useState } from 'react';
import { getJson, putJson } from '../lib/api';

type OwnerRow = {
  id: string;
  email: string;
  name: string | null;
  organizationName: string | null;
  phone: string | null;
  businessName: string | null;
  website: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  status: 'ACTIVE' | 'SUSPENDED';
  createdAt: string;
  eventCount: number;
};

type OwnersResponse = {
  owners: OwnerRow[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

type EditOwnerData = {
  name: string;
  email: string;
  phone: string;
  businessName: string;
  website: string;
  address: string;
  city: string;
  country: string;
};

export default function AdminOwners() {
  const [authLoading, setAuthLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [owners, setOwners] = useState<OwnerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'' | 'ACTIVE' | 'SUSPENDED'>('');
  const [totalPages, setTotalPages] = useState(1);
  const [sortKey, setSortKey] = useState<
    'name' | 'email' | 'eventCount' | 'status' | 'createdAt'
  >('createdAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  // Edit modal state
  const [editingOwner, setEditingOwner] = useState<OwnerRow | null>(null);
  const [editData, setEditData] = useState<EditOwnerData>({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    website: '',
    address: '',
    city: '',
    country: '',
  });
  const [saving, setSaving] = useState(false);

  const query = useMemo(() => {
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('limit', String(limit));
    if (search) params.set('search', search);
    if (status) params.set('status', status);
    return params.toString();
  }, [page, limit, search, status]);

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
    let active = true;
    const load = async () => {
      setLoading(true);
      try {
        const data = await getJson<OwnersResponse>(
          `/api/admin/owners?${query}`
        );
        if (!active) return;
        const rows = [...data.owners];
        setOwners(rows);
        setTotalPages(data.pagination.totalPages);
      } catch {
        if (!active) return;
        setOwners([]);
        setTotalPages(1);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [query]);

  const sortedOwners = useMemo(() => {
    const rows = [...owners];
    rows.sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      switch (sortKey) {
        case 'name':
          return (a.name || '').localeCompare(b.name || '') * dir;
        case 'email':
          return a.email.localeCompare(b.email) * dir;
        case 'eventCount':
          return (a.eventCount - b.eventCount) * dir;
        case 'status':
          return a.status.localeCompare(b.status) * dir;
        case 'createdAt':
        default:
          return (
            (new Date(a.createdAt).getTime() -
              new Date(b.createdAt).getTime()) *
            dir
          );
      }
    });
    return rows;
  }, [owners, sortKey, sortDir]);

  const setSort = (key: typeof sortKey) => {
    if (key === sortKey) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const exportCsv = () => {
    const header = [
      'id',
      'email',
      'name',
      'phone',
      'businessName',
      'website',
      'address',
      'city',
      'country',
      'status',
      'createdAt',
      'eventCount',
    ];
    const rows = sortedOwners.map(o => [
      o.id,
      o.email,
      o.name || '',
      o.phone || '',
      o.businessName || '',
      o.website || '',
      o.address || '',
      o.city || '',
      o.country || '',
      o.status,
      o.createdAt,
      String(o.eventCount),
    ]);
    const csv = [header, ...rows]
      .map(r =>
        r
          .map(v => (v.includes(',') ? `"${v.replace(/"/g, '""')}"` : v))
          .join(',')
      )
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `owners-page${page}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const openEditModal = (owner: OwnerRow) => {
    setEditingOwner(owner);
    setEditData({
      name: owner.name || '',
      email: owner.email,
      phone: owner.phone || '',
      businessName: owner.businessName || '',
      website: owner.website || '',
      address: owner.address || '',
      city: owner.city || '',
      country: owner.country || '',
    });
  };

  const closeEditModal = () => {
    setEditingOwner(null);
    setEditData({
      name: '',
      email: '',
      phone: '',
      businessName: '',
      website: '',
      address: '',
      city: '',
      country: '',
    });
  };

  const saveOwner = async () => {
    if (!editingOwner) return;

    setSaving(true);
    try {
      await putJson(`/api/admin/owners/${editingOwner.id}`, editData);

      // Update local state
      setOwners(prev =>
        prev.map(owner =>
          owner.id === editingOwner.id ? { ...owner, ...editData } : owner
        )
      );

      closeEditModal();
    } catch (error) {
      console.error('Failed to save owner:', error);
      alert('Failed to save owner details. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const toggleOwnerStatus = async (owner: OwnerRow) => {
    try {
      const newStatus = owner.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
      await putJson(`/api/admin/owners/${owner.id}/status`, {
        status: newStatus,
      });

      // Update local state
      setOwners(prev =>
        prev.map(o => (o.id === owner.id ? { ...o, status: newStatus } : o))
      );
    } catch (error) {
      console.error('Failed to update owner status:', error);
      alert('Failed to update owner status. Please try again.');
    }
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
      <div className='flex items-end justify-between mb-6 gap-4 flex-wrap'>
        <div>
          <h1 className='text-2xl font-bold'>Admin • Owners</h1>
          <p className='text-sm text-gray-600'>
            Manage owner accounts and details
          </p>
        </div>
        <div className='flex gap-2'>
          <input
            className='input'
            placeholder='Search email or name'
            value={search}
            onChange={e => {
              setPage(1);
              setSearch(e.target.value);
            }}
          />
          <select
            className='input'
            value={status}
            onChange={e => {
              setPage(1);
              setStatus(e.target.value as '' | 'ACTIVE' | 'SUSPENDED');
            }}
          >
            <option value=''>All</option>
            <option value='ACTIVE'>Active</option>
            <option value='SUSPENDED'>Suspended</option>
          </select>
          <button className='btn btn-outline' onClick={exportCsv}>
            Export CSV
          </button>
        </div>
      </div>

      <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th
                onClick={() => setSort('name')}
                className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
              >
                Owner
              </th>
              <th
                onClick={() => setSort('eventCount')}
                className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
              >
                Events
              </th>
              <th
                onClick={() => setSort('status')}
                className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
              >
                Status
              </th>
              <th
                onClick={() => setSort('createdAt')}
                className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
              >
                Created
              </th>
              <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {loading ? (
              <tr>
                <td className='px-4 py-6' colSpan={5}>
                  Loading...
                </td>
              </tr>
            ) : sortedOwners.length === 0 ? (
              <tr>
                <td className='px-4 py-6' colSpan={5}>
                  No owners found.
                </td>
              </tr>
            ) : (
              sortedOwners.map(o => (
                <tr key={o.id} className='hover:bg-gray-50'>
                  <td className='px-4 py-2'>
                    <div className='text-sm font-medium text-gray-900'>
                      {o.name || '—'}
                    </div>
                    <div className='text-xs text-gray-500'>{o.email}</div>
                    {o.businessName && (
                      <div className='text-xs text-gray-400'>
                        {o.businessName}
                      </div>
                    )}
                  </td>
                  <td className='px-4 py-2 text-sm'>{o.eventCount}</td>
                  <td className='px-4 py-2'>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${o.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td className='px-4 py-2 text-sm text-gray-500'>
                    {new Date(o.createdAt).toLocaleDateString()}
                  </td>
                  <td className='px-4 py-2'>
                    <div className='flex gap-2'>
                      <button
                        className='px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors'
                        onClick={() => openEditModal(o)}
                      >
                        Edit
                      </button>
                      <button
                        className={`px-3 py-1 text-xs rounded transition-colors ${
                          o.status === 'ACTIVE'
                            ? 'bg-red-100 text-red-800 hover:bg-red-200'
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                        onClick={() => toggleOwnerStatus(o)}
                      >
                        {o.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Enhanced Pagination */}
      {totalPages > 1 && (
        <div className='flex items-center justify-between mt-6'>
          <div className='flex items-center'>
            <button
              className='btn btn-outline'
              disabled={page <= 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
            >
              Previous
            </button>
            <button
              className='btn btn-outline ml-3'
              disabled={page >= totalPages}
              onClick={() => setPage(p => p + 1)}
            >
              Next
            </button>
          </div>
          <div className='hidden sm:flex-1 sm:flex sm:items-center sm:justify-between'>
            <div>
              <p className='text-sm text-gray-700'>
                Showing{' '}
                <span className='font-medium'>{(page - 1) * limit + 1}</span> to{' '}
                <span className='font-medium'>
                  {Math.min(page * limit, owners.length)}
                </span>{' '}
                of <span className='font-medium'>{owners.length}</span> results
              </p>
            </div>
            <div>
              <nav
                className='relative z-0 inline-flex rounded-md shadow-sm -space-x-px'
                aria-label='Pagination'
              >
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className='relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum =
                    Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
                  if (pageNum > totalPages) return null;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        pageNum === page
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className='relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingOwner && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-xl font-bold'>Edit Owner Details</h2>
              <button
                className='text-gray-400 hover:text-gray-600'
                onClick={closeEditModal}
              >
                ✕
              </button>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Name
                </label>
                <input
                  type='text'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  value={editData.name}
                  onChange={e =>
                    setEditData(prev => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Email
                </label>
                <input
                  type='email'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  value={editData.email}
                  onChange={e =>
                    setEditData(prev => ({ ...prev, email: e.target.value }))
                  }
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Phone
                </label>
                <input
                  type='tel'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  value={editData.phone}
                  onChange={e =>
                    setEditData(prev => ({ ...prev, phone: e.target.value }))
                  }
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Business Name
                </label>
                <input
                  type='text'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  value={editData.businessName}
                  onChange={e =>
                    setEditData(prev => ({
                      ...prev,
                      businessName: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Website
                </label>
                <input
                  type='url'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  value={editData.website}
                  onChange={e =>
                    setEditData(prev => ({ ...prev, website: e.target.value }))
                  }
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Address
                </label>
                <input
                  type='text'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  value={editData.address}
                  onChange={e =>
                    setEditData(prev => ({ ...prev, address: e.target.value }))
                  }
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  City
                </label>
                <input
                  type='text'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  value={editData.city}
                  onChange={e =>
                    setEditData(prev => ({ ...prev, city: e.target.value }))
                  }
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Country
                </label>
                <input
                  type='text'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  value={editData.country}
                  onChange={e =>
                    setEditData(prev => ({ ...prev, country: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className='flex justify-end gap-3 mt-6'>
              <button
                className='px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50'
                onClick={closeEditModal}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                className='px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50'
                onClick={saveOwner}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
