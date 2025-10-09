import { useState, useEffect, useMemo } from 'react';
import { getJson, putJson, postJson } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';

interface UserRow {
  id: string;
  email: string;
  name: string | null;
  role: 'VISITOR' | 'OWNER' | 'ADMIN';
  isActive: boolean;
  createdAt: string;
  lastLoginAt: string | null;
  eventRegistrations: number;
  waitlistEntries: number;
  ownedEvents: number;
}

interface UsersResponse {
  users: UserRow[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function AdminUsers() {
  const [authLoading, setAuthLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState<'' | 'VISITOR' | 'OWNER' | 'ADMIN'>('');
  const [status, setStatus] = useState<'' | 'ACTIVE' | 'INACTIVE'>('');
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [sortKey] = useState<
    'name' | 'email' | 'role' | 'eventRegistrations' | 'createdAt'
  >('createdAt');
  const [sortDir] = useState<'asc' | 'desc'>('desc');

  // Edit visitor modal state
  const [editingVisitor, setEditingVisitor] = useState<UserRow | null>(null);
  const [visitorRegistrations, setVisitorRegistrations] = useState<any[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    email: '',
  });
  const [saving, setSaving] = useState(false);

  const query = useMemo(() => {
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('limit', String(limit));
    if (search) params.set('search', search);
    if (role) params.set('role', role);
    if (status) params.set('status', status);
    params.set('sortBy', sortKey);
    params.set('sortOrder', sortDir);
    return params.toString();
  }, [page, limit, search, role, status, sortKey, sortDir]);

  useEffect(() => {
    let mounted = true;
    getJson<{ authenticated: boolean; user?: { role?: string } }>('/auth/me')
      .then(res => {
        if (!mounted) return;

        // Redirect owners to owner portal
        if (res.authenticated && res.user?.role === 'OWNER') {
          navigate('/owner');
          return;
        }

        // Redirect non-admin users to home
        if (res.authenticated && res.user?.role !== 'ADMIN') {
          navigate('/');
          return;
        }

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
  }, [navigate]);

  useEffect(() => {
    let active = true;
    const loadUsers = async () => {
      setLoading(true);
      try {
        const data = await getJson<UsersResponse>(`/api/admin/users?${query}`);
        if (active) {
          setUsers(data.users);
          setTotalPages(data.pagination.totalPages);
          setTotal(data.pagination.total);
        }
      } catch (error) {
        console.error('Failed to load users:', error);
        if (active) {
          setUsers([]);
          setTotalPages(1);
          setTotal(0);
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    loadUsers();
    return () => {
      active = false;
    };
  }, [query]);

  const toggleUserStatus = async (user: UserRow) => {
    try {
      const newStatus = user.isActive ? 'INACTIVE' : 'ACTIVE';
      await putJson(`/api/admin/users/${user.id}/status`, {
        status: newStatus,
      });

      // Update local state
      setUsers(prev =>
        prev.map(u => (u.id === user.id ? { ...u, isActive: !u.isActive } : u))
      );
    } catch (error) {
      console.error('Failed to update user status:', error);
      alert('Failed to update user status. Please try again.');
    }
  };

  const sendMagicLink = async (user: UserRow) => {
    try {
      const res = await postJson<{
        ok?: boolean;
        message?: string;
        magicLink?: string;
      }>('/auth/request-magic-link', { email: user.email });
      const magic = (
        res && typeof res === 'object'
          ? (res as { magicLink?: string })
          : undefined
      )?.magicLink;
      if (magic) {
        try {
          await navigator.clipboard.writeText(magic);
        } catch (e) {
          /* ignore */
        }
        alert(`Magic link generated and copied to clipboard.\n\n${magic}`);
      } else {
        alert(res.message || 'Magic link sent to the user via email.');
      }
    } catch (error) {
      try {
        const dev = await postJson<{ magicLink: string }>(
          '/auth/dev/generate-link',
          { email: user.email, role: user.role, name: user.name ?? undefined }
        );
        try {
          await navigator.clipboard.writeText(dev.magicLink);
        } catch (e) {
          /* ignore */
        }
        alert(`Magic link (dev) generated and copied:\n\n${dev.magicLink}`);
      } catch (e) {
        console.error('Failed to generate/send magic link', e);
        alert('Failed to generate or send magic link. Please try again.');
      }
    }
  };

  const openEditVisitor = async (user: UserRow) => {
    try {
      // Load visitor registrations
      const registrations = await getJson<any[]>(`/api/admin/users/${user.id}/registrations`);
      setVisitorRegistrations(registrations || []);
      
      setEditingVisitor(user);
      setEditData({
        name: user.name || '',
        email: user.email,
      });
      setShowEditModal(true);
    } catch (error) {
      console.error('Failed to load visitor data:', error);
      alert('Failed to load visitor data. Please try again.');
    }
  };

  const saveVisitorChanges = async () => {
    if (!editingVisitor) return;
    
    setSaving(true);
    try {
      await putJson(`/api/admin/users/${editingVisitor.id}`, {
        name: editData.name,
        email: editData.email,
      });

      // Update local state
      setUsers(prev =>
        prev.map(u => 
          u.id === editingVisitor.id 
            ? { ...u, name: editData.name, email: editData.email }
            : u
        )
      );

      setShowEditModal(false);
      setEditingVisitor(null);
      alert('Visitor information updated successfully.');
    } catch (error) {
      console.error('Failed to update visitor:', error);
      alert('Failed to update visitor information. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const exportCsv = () => {
    const csvContent = [
      [
        'Email',
        'Name',
        'Role',
        'Status',
        'Event Registrations',
        'Waitlist Entries',
        'Owned Events',
        'Created At',
        'Last Login',
      ],
      ...users.map(user => [
        user.email,
        user.name || '',
        user.role,
        user.isActive ? 'Active' : 'Inactive',
        user.eventRegistrations.toString(),
        user.waitlistEntries.toString(),
        user.ownedEvents.toString(),
        new Date(user.createdAt).toLocaleDateString(),
        user.lastLoginAt
          ? new Date(user.lastLoginAt).toLocaleDateString()
          : 'Never',
      ]),
    ]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800';
      case 'OWNER':
        return 'bg-blue-100 text-blue-800';
      case 'VISITOR':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-accent-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  // Redirect non-admin users (this should not happen due to useEffect redirect, but just in case)
  if (!isAdmin) {
    return (
      <div className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-red-600 mb-4'>
            {t('admin.users.accessDenied')}
          </h1>
          <p className='text-gray-600 mb-6'>
            {t('admin.users.accessDeniedDescription')}
          </p>
          <button onClick={() => navigate('/')} className='btn btn-primary'>
            {t('admin.users.goToHome')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
      <div className='flex items-end justify-between mb-6 gap-4 flex-wrap'>
        <div>
          <h1 className='text-2xl font-bold'>{t('admin.users.title')}</h1>
          <p className='text-sm text-gray-600'>{t('admin.users.subtitle')}</p>
        </div>
        <div className='flex gap-2'>
          <input
            className='input'
            placeholder={t('admin.users.searchPlaceholder')}
            value={search}
            onChange={e => {
              setPage(1);
              setSearch(e.target.value);
            }}
          />
          <select
            className='input'
            value={role}
            onChange={e => {
              setPage(1);
              setRole(e.target.value as '' | 'VISITOR' | 'OWNER' | 'ADMIN');
            }}
          >
            <option value=''>{t('admin.users.allRoles')}</option>
            <option value='VISITOR'>{t('admin.users.visitors')}</option>
            <option value='OWNER'>{t('admin.users.owners')}</option>
            <option value='ADMIN'>{t('admin.users.admins')}</option>
          </select>
          <select
            className='input'
            value={status}
            onChange={e => {
              setPage(1);
              setStatus(e.target.value as '' | 'ACTIVE' | 'INACTIVE');
            }}
          >
            <option value=''>{t('admin.users.allStatus')}</option>
            <option value='ACTIVE'>{t('admin.users.active')}</option>
            <option value='INACTIVE'>{t('admin.users.inactive')}</option>
          </select>
          <button className='btn btn-outline' onClick={exportCsv}>
            {t('admin.users.exportCsv')}
          </button>
        </div>
      </div>

      <div className='bg-white shadow rounded-lg overflow-hidden'>
        {loading ? (
          <div className='flex items-center justify-center py-12'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
            <span className='ml-3 text-gray-600'>
              {t('admin.users.loadingUsers')}
            </span>
          </div>
        ) : users.length === 0 ? (
          <div className='text-center py-12'>
            <div className='text-gray-400 text-6xl mb-4'>👥</div>
            <h3 className='text-lg font-medium text-gray-900 mb-2'>
              {t('admin.users.noUsersFound')}
            </h3>
            <p className='text-gray-600'>
              {t('admin.users.noUsersDescription')}
            </p>
          </div>
        ) : (
          <>
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      {t('admin.users.user')}
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      {t('admin.users.role')}
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      {t('admin.users.status')}
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      {t('admin.users.eventActivity')}
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      {t('admin.users.lastLogin')}
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      {t('admin.users.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {users.map(user => (
                    <tr key={user.id} className='hover:bg-gray-50'>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div>
                          <div className='text-sm font-medium text-gray-900'>
                            {user.email}
                          </div>
                          {user.name && (
                            <div className='text-sm text-gray-500'>
                              {user.name}
                            </div>
                          )}
                          <div className='text-xs text-gray-400'>
                            {t('admin.users.joined')}{' '}
                            {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.isActive)}`}
                        >
                          {user.isActive
                            ? t('admin.users.active')
                            : t('admin.users.inactive')}
                        </span>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        <div className='space-y-1'>
                          <div className='flex items-center'>
                            <span className='text-gray-500'>
                              {t('admin.users.events')}:
                            </span>
                            <span className='ml-2 font-medium'>
                              {user.eventRegistrations}
                            </span>
                          </div>
                          <div className='flex items-center'>
                            <span className='text-gray-500'>
                              {t('admin.users.waitlist')}:
                            </span>
                            <span className='ml-2 font-medium'>
                              {user.waitlistEntries}
                            </span>
                          </div>
                          {user.role === 'OWNER' && (
                            <div className='flex items-center'>
                              <span className='text-gray-500'>
                                {t('admin.users.owned')}:
                              </span>
                              <span className='ml-2 font-medium'>
                                {user.ownedEvents}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {user.lastLoginAt ? (
                          new Date(user.lastLoginAt).toLocaleDateString()
                        ) : (
                          <span className='text-gray-400'>
                            {t('admin.users.never')}
                          </span>
                        )}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                        <div className='flex space-x-2'>
                          <button
                            onClick={() => toggleUserStatus(user)}
                            className={`btn btn-sm ${
                              user.isActive
                                ? 'btn-outline text-red-600 border-red-300 hover:bg-red-50'
                                : 'btn-outline text-green-600 border-green-300 hover:bg-green-50'
                            }`}
                          >
                            {user.isActive
                              ? t('admin.users.deactivate')
                              : t('admin.users.activate')}
                          </button>
                          {user.role === 'VISITOR' && (
                            <button
                              onClick={() => openEditVisitor(user)}
                              className='btn btn-ghost btn-sm text-blue-600 hover:text-blue-700'
                            >
                              Edit
                            </button>
                          )}
                          {user.role === 'OWNER' && (
                            <button
                              onClick={() => sendMagicLink(user)}
                              className='btn btn-ghost btn-sm text-blue-600 hover:text-blue-700'
                            >
                              Send Magic Link
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className='bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6'>
                <div className='flex-1 flex justify-between sm:hidden'>
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className='relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    {t('admin.users.previous')}
                  </button>
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className='ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    {t('admin.users.next')}
                  </button>
                </div>
                <div className='hidden sm:flex-1 sm:flex sm:items-center sm:justify-between'>
                  <div>
                    <p className='text-sm text-gray-700'>
                      {t('admin.users.showing')}{' '}
                      <span className='font-medium'>
                        {(page - 1) * limit + 1}
                      </span>{' '}
                      {t('admin.users.to')}{' '}
                      <span className='font-medium'>
                        {Math.min(page * limit, total)}
                      </span>{' '}
                      {t('admin.users.of')}{' '}
                      <span className='font-medium'>{total}</span>{' '}
                      {t('admin.users.results')}
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
                        {t('admin.users.previous')}
                      </button>
                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
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
                        }
                      )}
                      <button
                        onClick={() => setPage(Math.min(totalPages, page + 1))}
                        disabled={page === totalPages}
                        className='relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                      >
                        {t('admin.users.next')}
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Edit Visitor Modal */}
        {showEditModal && editingVisitor && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className='bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto'>
              <h2 className='text-2xl font-bold text-gray-900 mb-6'>
                Edit Visitor: {editingVisitor.email}
              </h2>

              <div className='space-y-4 mb-6'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Name
                  </label>
                  <input
                    type='text'
                    value={editData.name}
                    onChange={e => setEditData({ ...editData, name: e.target.value })}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Email
                  </label>
                  <input
                    type='email'
                    value={editData.email}
                    onChange={e => setEditData({ ...editData, email: e.target.value })}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  />
                </div>
              </div>

              {/* Event Registrations */}
              <div className='mb-6'>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                  Event Registrations ({visitorRegistrations.length})
                </h3>
                {visitorRegistrations.length > 0 ? (
                  <div className='space-y-3 max-h-60 overflow-y-auto'>
                    {visitorRegistrations.map((registration, index) => (
                      <div key={index} className='border border-gray-200 rounded-lg p-3'>
                        <div className='flex justify-between items-start'>
                          <div>
                            <h4 className='font-medium text-gray-900'>
                              {registration.event?.title || 'Unknown Event'}
                            </h4>
                            <p className='text-sm text-gray-500'>
                              {registration.event?.startDate 
                                ? new Date(registration.event.startDate).toLocaleDateString()
                                : 'Date TBA'
                              }
                            </p>
                            <p className='text-sm text-gray-500'>
                              Status: {registration.status || 'Unknown'}
                            </p>
                          </div>
                          <span className='text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full'>
                            {registration.event?.venue?.city || 'Location TBA'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className='text-gray-500 text-sm'>No event registrations found.</p>
                )}
              </div>

              <div className='flex justify-end space-x-3'>
                <button
                  onClick={() => setShowEditModal(false)}
                  className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                >
                  Cancel
                </button>
                <button
                  onClick={saveVisitorChanges}
                  disabled={saving}
                  className='px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50'
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
