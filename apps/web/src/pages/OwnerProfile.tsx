import React, { useState, useEffect } from 'react';
import { getJson, putJson } from '../lib/api';
import { Link } from 'react-router-dom';
import { PhotoGallery } from '../components/PhotoGallery';
import { useLanguage } from '../hooks/useLanguage';

interface Area {
  id: string;
  name: string;
  slug: string;
  color: string;
  icon: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  color: string;
  icon: string;
}

interface OwnerProfileData {
  name: string;
  email: string;
  phone: string;
  businessName: string;
  website: string;
  address: string;
  city: string;
  country: string;
  businessIntro: string;
  logoUrl: string;
  profilePictureUrl: string;
  latitude: number | null;
  longitude: number | null;
  areaId: string;
  area: Area;
  productId: string;
  product: Product;
  facebookUrl?: string;
  instagramUrl?: string;
}

export default function OwnerProfile() {
  const [auth, setAuth] = useState<{
    authenticated: boolean;
    user?: { email: string };
  } | null>(null);
  const { t } = useLanguage();
  const [profile, setProfile] = useState<OwnerProfileData>({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    website: '',
    address: '',
    city: '',
    country: '',
    businessIntro: '',
    logoUrl: '',
    profilePictureUrl: '',
    latitude: null,
    longitude: null,
    areaId: '',
    area: { id: '', name: '', slug: '', color: '', icon: '' },
    productId: '',
    product: { id: '', name: '', slug: '', color: '', icon: '' },
    facebookUrl: '',
    instagramUrl: '',
  });
  const [areas, setAreas] = useState<Area[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [geocoding, setGeocoding] = useState(false);

  useEffect(() => {
    getJson<{ authenticated: boolean; user?: { email: string } }>('/auth/me')
      .then(setAuth)
      .catch(() => setAuth({ authenticated: false }));
  }, []);

  useEffect(() => {
    if (auth?.authenticated) {
      loadProfile();
      loadAreas();
      loadProducts();
    }
  }, [auth]);

  const loadProfile = async () => {
    try {
      const data = await getJson<OwnerProfileData>('/api/owner/profile');
      setProfile(data);
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadAreas = async () => {
    try {
      const data = await getJson<{ areas: Area[] }>('/api/areas');
      setAreas(data.areas || []);
    } catch (err) {
      console.error('Failed to load areas:', err);
    }
  };

  const loadProducts = async () => {
    try {
      const data = await getJson<{ products: Product[] }>('/api/products');
      setProducts(data.products || []);
    } catch (err) {
      console.error('Failed to load products:', err);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setMessage('File too large. Maximum size is 5MB.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setMessage('Invalid file type. Please upload JPEG, PNG, or WebP images.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/owner/upload/logo', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const result = await response.json();
      setProfile(prev => ({ ...prev, logoUrl: result.logoUrl }));
      setMessage('Logo uploaded successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to upload logo. Please try again.');
      console.error('Failed to upload logo:', err);
    }
  };

  const handleProfilePictureUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setMessage('File too large. Maximum size is 5MB.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setMessage('Invalid file type. Please upload JPEG, PNG, or WebP images.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/owner/upload/profile-picture', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const result = await response.json();
      setProfile(prev => ({
        ...prev,
        profilePictureUrl: result.profilePictureUrl,
      }));
      setMessage('Profile picture uploaded successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to upload profile picture. Please try again.');
      console.error('Failed to upload profile picture:', err);
    }
  };

  const handleGeocodeAddress = async () => {
    if (!profile.address || !profile.city || !profile.country) {
      setMessage('Please fill in address, city, and country first.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setGeocoding(true);
    try {
      const fullAddress = `${profile.address}, ${profile.city}, ${profile.country}`;
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}&limit=1`
      );

      if (!response.ok) {
        throw new Error('Geocoding failed');
      }

      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setProfile(prev => ({
          ...prev,
          latitude: parseFloat(lat),
          longitude: parseFloat(lon),
        }));
        setMessage('Address geocoded successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Address not found. Please check your address details.');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      setMessage('Failed to geocode address. Please try again.');
      console.error('Geocoding failed:', err);
    } finally {
      setGeocoding(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      await putJson('/api/owner/profile', profile);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to update profile. Please try again.');
      console.error('Failed to save profile:', err);
    } finally {
      setSaving(false);
    }
  };

  if (!auth?.authenticated) {
    return (
      <div className='max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <h1 className='heading-2 mb-4'>Owner Login</h1>
        <p className='text-body mb-6'>Please log in to access your profile.</p>
        <Link to='/owner' className='btn btn-primary'>
          Go to Login
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-sage-50 via-white to-terracotta-50'>
        <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
          <div className='animate-pulse'>
            <div className='bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8'>
              <div className='h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-1/4 mb-4'></div>
              <div className='h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2'></div>
            </div>
            <div className='bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8'>
              <div className='space-y-6'>
                <div className='h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-1/3'></div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div className='h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl'></div>
                  <div className='h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl'></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-sage-50 via-white to-terracotta-50'>
      <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Professional Header */}
        <div className='mb-6'>
          <div className='bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <h1 className='text-3xl font-display font-bold text-gray-900 mb-2'>
                  Business Profile
                </h1>
                <p className='text-base text-gray-600'>
                  Manage your business information and contact details for your
                  design events.
                </p>
              </div>
              <div className='hidden md:flex items-center'>
                <div className='w-12 h-12 bg-gradient-to-br from-accent-500 to-terracotta-500 rounded-lg flex items-center justify-center'>
                  <span className='text-xl'>🏢</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {message && (
          <div
            className={`mb-4 p-4 rounded-lg shadow-md border ${
              message.includes('successfully')
                ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border-green-200'
                : 'bg-gradient-to-r from-red-50 to-rose-50 text-red-800 border-red-200'
            }`}
          >
            <div className='flex items-center'>
              <div
                className={`w-4 h-4 rounded-full mr-2 ${
                  message.includes('successfully')
                    ? 'bg-green-500'
                    : 'bg-red-500'
                }`}
              ></div>
              <span className='font-medium text-sm'>{message}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSave} className='space-y-6'>
          <div className='bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6'>
            <div className='flex items-center mb-4'>
              <div className='w-10 h-10 bg-gradient-to-br from-accent-500 to-terracotta-500 rounded-lg flex items-center justify-center mr-3'>
                <span className='text-lg'>💼</span>
              </div>
              <h2 className='text-xl font-display font-bold text-gray-900'>
                Business Information
              </h2>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-semibold text-gray-800 mb-2'>
                  Business Name *
                </label>
                <input
                  type='text'
                  className='w-full px-3 py-2 bg-white/80 border-2 border-gray-200 rounded-lg focus:border-accent-500 focus:ring-2 focus:ring-accent-100 transition-all duration-200 shadow-sm hover:shadow-md'
                  value={profile.businessName || ''}
                  onChange={e =>
                    setProfile(prev => ({
                      ...prev,
                      businessName: e.target.value,
                    }))
                  }
                  placeholder={t('owner.businessNamePlaceholder')}
                  required
                />
                <p className='text-xs text-gray-600 mt-1'>
                  This will be displayed on your event pages and business card
                </p>
              </div>

              <div>
                <label className='block text-sm font-semibold text-gray-800 mb-2'>
                  Business Logo
                </label>
                <div className='space-y-3'>
                  {profile.logoUrl && (
                    <div className='flex items-center space-x-3 p-3 bg-gradient-to-r from-sage-50 to-accent-50 rounded-lg border border-sage-200'>
                      <img
                        src={profile.logoUrl}
                        alt={t('owner.currentLogo')}
                        className='w-12 h-12 object-cover rounded-lg border-2 border-white shadow-sm'
                      />
                      <div>
                        <p className='text-xs font-medium text-gray-700'>
                          Current logo
                        </p>
                        <button
                          type='button'
                          onClick={() =>
                            setProfile(prev => ({ ...prev, logoUrl: '' }))
                          }
                          className='text-xs text-red-600 hover:text-red-800 font-medium'
                        >
                          Remove logo
                        </button>
                      </div>
                    </div>
                  )}
                  <div className='relative'>
                    <input
                      type='file'
                      accept='image/jpeg,image/png,image/webp'
                      onChange={handleLogoUpload}
                      className='w-full px-3 py-2 bg-white/80 border-2 border-gray-200 rounded-lg focus:border-accent-500 focus:ring-2 focus:ring-accent-100 transition-all duration-200 shadow-sm hover:shadow-md file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-accent-50 file:text-accent-700 hover:file:bg-accent-100'
                    />
                  </div>
                  <p className='text-xs text-gray-600'>
                    Upload a logo for your business (JPEG, PNG, WebP, max 5MB)
                  </p>
                </div>
              </div>

              <div>
                <label className='block text-sm font-semibold text-gray-800 mb-2'>
                  Designer/Business Picture
                </label>
                <div className='space-y-3'>
                  {profile.profilePictureUrl && (
                    <div className='flex items-center space-x-3 p-3 bg-gradient-to-r from-terracotta-50 to-gold-50 rounded-lg border border-terracotta-200'>
                      <img
                        src={profile.profilePictureUrl}
                        alt={t('owner.currentProfilePicture')}
                        className='w-12 h-12 object-cover rounded-lg border-2 border-white shadow-sm'
                      />
                      <div>
                        <p className='text-xs font-medium text-gray-700'>
                          Current profile picture
                        </p>
                        <button
                          type='button'
                          onClick={() =>
                            setProfile(prev => ({
                              ...prev,
                              profilePictureUrl: '',
                            }))
                          }
                          className='text-xs text-red-600 hover:text-red-800 font-medium'
                        >
                          Remove picture
                        </button>
                      </div>
                    </div>
                  )}
                  <div className='relative'>
                    <input
                      type='file'
                      accept='image/jpeg,image/png,image/webp'
                      onChange={handleProfilePictureUpload}
                      className='w-full px-3 py-2 bg-white/80 border-2 border-gray-200 rounded-lg focus:border-accent-500 focus:ring-2 focus:ring-accent-100 transition-all duration-200 shadow-sm hover:shadow-md file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-terracotta-50 file:text-terracotta-700 hover:file:bg-terracotta-100'
                    />
                  </div>
                  <p className='text-xs text-gray-600'>
                    Upload a profile picture for the designer or business (JPEG,
                    PNG, WebP, max 5MB)
                  </p>
                </div>
              </div>

              <div className='md:col-span-2'>
                <label className='block text-sm font-semibold text-gray-800 mb-2'>
                  Business Introduction
                </label>
                <textarea
                  className='w-full px-3 py-2 bg-white/80 border-2 border-gray-200 rounded-lg focus:border-accent-500 focus:ring-2 focus:ring-accent-100 transition-all duration-200 shadow-sm hover:shadow-md resize-none'
                  value={profile.businessIntro || ''}
                  onChange={e =>
                    setProfile(prev => ({
                      ...prev,
                      businessIntro: e.target.value,
                    }))
                  }
                  placeholder={t('owner.businessIntroPlaceholder')}
                  rows={3}
                />
                <p className='text-xs text-gray-600 mt-1'>
                  A brief description of your business that will appear on your
                  business card
                </p>
              </div>

              <div>
                <label className='block text-sm font-semibold text-gray-800 mb-2'>
                  Designer Name
                </label>
                <input
                  type='text'
                  className='w-full px-3 py-2 bg-white/80 border-2 border-gray-200 rounded-lg focus:border-accent-500 focus:ring-2 focus:ring-accent-100 transition-all duration-200 shadow-sm hover:shadow-md'
                  value={profile.name || ''}
                  onChange={e =>
                    setProfile(prev => ({ ...prev, name: e.target.value }))
                  }
                  placeholder={t('owner.contactNamePlaceholder')}
                />
              </div>

              <div>
                <label className='block text-sm font-semibold text-gray-800 mb-2'>
                  Email
                </label>
                <input
                  type='email'
                  className='w-full px-3 py-2 bg-white/80 border-2 border-gray-200 rounded-lg focus:border-accent-500 focus:ring-2 focus:ring-accent-100 transition-all duration-200 shadow-sm hover:shadow-md'
                  value={profile.email || ''}
                  onChange={e =>
                    setProfile(prev => ({ ...prev, email: e.target.value }))
                  }
                  placeholder={t('owner.contactEmailPlaceholder')}
                  required
                />
              </div>

              <div>
                <label className='block text-sm font-semibold text-gray-800 mb-2'>
                  Phone
                </label>
                <input
                  type='tel'
                  className='w-full px-3 py-2 bg-white/80 border-2 border-gray-200 rounded-lg focus:border-accent-500 focus:ring-2 focus:ring-accent-100 transition-all duration-200 shadow-sm hover:shadow-md'
                  value={profile.phone || ''}
                  onChange={e =>
                    setProfile(prev => ({ ...prev, phone: e.target.value }))
                  }
                  placeholder={t('owner.contactPhonePlaceholder')}
                />
              </div>

              <div>
                <label className='block text-sm font-semibold text-gray-800 mb-2'>
                  Website
                </label>
                <input
                  type='url'
                  className='w-full px-3 py-2 bg-white/80 border-2 border-gray-200 rounded-lg focus:border-accent-500 focus:ring-2 focus:ring-accent-100 transition-all duration-200 shadow-sm hover:shadow-md'
                  value={profile.website || ''}
                  onChange={e =>
                    setProfile(prev => ({ ...prev, website: e.target.value }))
                  }
                  placeholder={t('owner.websitePlaceholder')}
                />
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-semibold text-gray-800 mb-2'>
                    <span className='flex items-center'>
                      <svg
                        className='w-4 h-4 mr-2 text-blue-600'
                        fill='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' />
                      </svg>
                      Facebook
                    </span>
                  </label>
                  <input
                    type='url'
                    className='w-full px-3 py-2 bg-white/80 border-2 border-gray-200 rounded-lg focus:border-accent-500 focus:ring-2 focus:ring-accent-100 transition-all duration-200 shadow-sm hover:shadow-md'
                    value={profile.facebookUrl || ''}
                    onChange={e =>
                      setProfile(prev => ({
                        ...prev,
                        facebookUrl: e.target.value,
                      }))
                    }
                    placeholder={t('owner.facebookPlaceholder')}
                  />
                  <p className='text-xs text-gray-600 mt-1'>
                    Your Facebook business page URL
                  </p>
                </div>

                <div>
                  <label className='block text-sm font-semibold text-gray-800 mb-2'>
                    <span className='flex items-center'>
                      <svg
                        className='w-4 h-4 mr-2 text-pink-600'
                        fill='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' />
                      </svg>
                      Instagram
                    </span>
                  </label>
                  <input
                    type='url'
                    className='w-full px-3 py-2 bg-white/80 border-2 border-gray-200 rounded-lg focus:border-accent-500 focus:ring-2 focus:ring-accent-100 transition-all duration-200 shadow-sm hover:shadow-md'
                    value={profile.instagramUrl || ''}
                    onChange={e =>
                      setProfile(prev => ({
                        ...prev,
                        instagramUrl: e.target.value,
                      }))
                    }
                    placeholder={t('owner.instagramPlaceholder')}
                  />
                  <p className='text-xs text-gray-600 mt-1'>
                    Your Instagram profile URL
                  </p>
                </div>
              </div>

              <div>
                <label className='block text-sm font-semibold text-gray-800 mb-2'>
                  City
                </label>
                <input
                  type='text'
                  className='w-full px-3 py-2 bg-white/80 border-2 border-gray-200 rounded-lg focus:border-accent-500 focus:ring-2 focus:ring-accent-100 transition-all duration-200 shadow-sm hover:shadow-md'
                  value={profile.city || ''}
                  onChange={e =>
                    setProfile(prev => ({ ...prev, city: e.target.value }))
                  }
                  placeholder={t('owner.cityPlaceholder')}
                />
              </div>
            </div>

            <div className='mt-4'>
              <label className='block text-sm font-semibold text-gray-800 mb-2'>
                Address
              </label>
              <input
                type='text'
                className='w-full px-3 py-2 bg-white/80 border-2 border-gray-200 rounded-lg focus:border-accent-500 focus:ring-2 focus:ring-accent-100 transition-all duration-200 shadow-sm hover:shadow-md'
                value={profile.address || ''}
                onChange={e =>
                  setProfile(prev => ({ ...prev, address: e.target.value }))
                }
                placeholder={t('owner.addressPlaceholder')}
              />
            </div>

            <div className='mt-4'>
              <label className='block text-sm font-semibold text-gray-800 mb-2'>
                Country
              </label>
              <select
                className='w-full px-3 py-2 bg-white/80 border-2 border-gray-200 rounded-lg focus:border-accent-500 focus:ring-2 focus:ring-accent-100 transition-all duration-200 shadow-sm hover:shadow-md'
                value={profile.country || ''}
                onChange={e =>
                  setProfile(prev => ({ ...prev, country: e.target.value }))
                }
              >
                <option value=''>Select Country</option>
                <option value='Italy'>{t('country.italy')}</option>
                <option value='France'>{t('country.france')}</option>
                <option value='Germany'>{t('country.germany')}</option>
                <option value='Spain'>{t('country.spain')}</option>
                <option value='Denmark'>{t('country.denmark')}</option>
                <option value='Sweden'>{t('country.sweden')}</option>
                <option value='Netherlands'>{t('country.netherlands')}</option>
                <option value='Belgium'>{t('country.belgium')}</option>
                <option value='Switzerland'>{t('country.switzerland')}</option>
                <option value='Austria'>{t('country.austria')}</option>
                <option value='United Kingdom'>
                  {t('country.unitedKingdom')}
                </option>
                <option value='Other'>{t('country.other')}</option>
              </select>
            </div>

            <div className='mt-4'>
              <label className='block text-sm font-semibold text-gray-800 mb-2'>
                Design District / Area
              </label>
              <select
                className='w-full px-3 py-2 bg-white/80 border-2 border-gray-200 rounded-lg focus:border-accent-500 focus:ring-2 focus:ring-accent-100 transition-all duration-200 shadow-sm hover:shadow-md'
                value={profile.areaId || ''}
                onChange={e =>
                  setProfile(prev => ({
                    ...prev,
                    areaId: e.target.value,
                    area: areas.find(a => a.id === e.target.value) || {
                      id: '',
                      name: '',
                      slug: '',
                      color: '',
                      icon: '',
                    },
                  }))
                }
              >
                <option value=''>Select Design District</option>
                {areas.map(area => (
                  <option key={area.id} value={area.id}>
                    {area.icon} {area.name}
                  </option>
                ))}
              </select>
              <p className='text-xs text-gray-600 mt-1'>
                Choose the design district where your business is located
              </p>
            </div>

            <div className='mt-4'>
              <label className='block text-sm font-semibold text-gray-800 mb-2'>
                Product Specialties
              </label>
              <select
                className='w-full px-3 py-2 bg-white/80 border-2 border-gray-200 rounded-lg focus:border-accent-500 focus:ring-2 focus:ring-accent-100 transition-all duration-200 shadow-sm hover:shadow-md'
                value={profile.productId || ''}
                onChange={e =>
                  setProfile(prev => ({
                    ...prev,
                    productId: e.target.value,
                    product: products.find(p => p.id === e.target.value) || {
                      id: '',
                      name: '',
                      slug: '',
                      color: '',
                      icon: '',
                    },
                  }))
                }
              >
                <option value=''>Select Product Specialty</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.icon} {product.name}
                  </option>
                ))}
              </select>
              <p className='text-xs text-gray-600 mt-1'>
                Choose your main product specialty (e.g., Recessed lights,
                Spotlights)
              </p>
            </div>
          </div>

          <div className='bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6'>
            <div className='flex items-center justify-between mb-4'>
              <div className='flex items-center'>
                <div className='w-10 h-10 bg-gradient-to-br from-sage-500 to-accent-500 rounded-lg flex items-center justify-center mr-3'>
                  <span className='text-lg'>📍</span>
                </div>
                <h2 className='text-xl font-display font-bold text-gray-900'>
                  Location & Map
                </h2>
              </div>
              <button
                type='button'
                onClick={handleGeocodeAddress}
                disabled={
                  geocoding ||
                  !profile.address ||
                  !profile.city ||
                  !profile.country
                }
                className='px-4 py-2 bg-gradient-to-r from-accent-500 to-terracotta-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm'
              >
                {geocoding ? 'Geocoding...' : t('owner.getCoordinates')}
              </button>
            </div>

            {profile.latitude !== null &&
              profile.longitude !== null &&
              profile.latitude !== 0 &&
              profile.longitude !== 0 && (
                <div className='mb-4'>
                  <div className='bg-gradient-to-r from-sage-50 to-accent-50 rounded-lg p-4 border border-sage-200'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                      <div className='flex items-center'>
                        <div className='w-6 h-6 bg-sage-500 rounded-md flex items-center justify-center mr-2'>
                          <span className='text-white text-xs'>🌍</span>
                        </div>
                        <div>
                          <span className='font-semibold text-gray-800 text-sm'>
                            Latitude:
                          </span>
                          <span className='ml-2 text-gray-700 text-sm'>
                            {profile.latitude?.toFixed(6) || 'N/A'}
                          </span>
                        </div>
                      </div>
                      <div className='flex items-center'>
                        <div className='w-6 h-6 bg-accent-500 rounded-md flex items-center justify-center mr-2'>
                          <span className='text-white text-xs'>🌐</span>
                        </div>
                        <div>
                          <span className='font-semibold text-gray-800 text-sm'>
                            Longitude:
                          </span>
                          <span className='ml-2 text-gray-700 text-sm'>
                            {profile.longitude?.toFixed(6) || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            <div className='bg-gradient-to-br from-gray-50 to-sage-50 rounded-lg p-4 border border-gray-200'>
              <p className='text-xs font-medium text-gray-700 mb-3'>
                Map Preview (coordinates will be used to show your location on
                event pages)
              </p>
              {profile.latitude !== null &&
              profile.longitude !== null &&
              profile.latitude !== 0 &&
              profile.longitude !== 0 ? (
                <div className='w-full h-32 bg-gradient-to-br from-sage-100 to-accent-100 rounded-lg flex items-center justify-center border-2 border-sage-200'>
                  <div className='text-center'>
                    <div className='text-2xl mb-2'>📍</div>
                    <p className='text-xs font-medium text-gray-700'>
                      Map will be displayed here
                      <br />
                      <span className='text-accent-600'>
                        Coordinates: {profile.latitude?.toFixed(4) || 'N/A'},{' '}
                        {profile.longitude?.toFixed(4) || 'N/A'}
                      </span>
                    </p>
                  </div>
                </div>
              ) : (
                <div className='w-full h-32 bg-gradient-to-br from-gray-100 to-sage-100 rounded-lg flex items-center justify-center border-2 border-gray-200'>
                  <div className='text-center'>
                    <div className='text-2xl mb-2'>🗺️</div>
                    <p className='text-xs font-medium text-gray-600'>
                      {t('owner.getCoordinatesDescription')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className='flex flex-col sm:flex-row justify-between items-center gap-3 mt-6'>
            <Link
              to='/owner'
              className='w-full sm:w-auto px-6 py-3 bg-white/80 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:border-accent-300 hover:text-accent-700 text-center'
            >
              Back to Dashboard
            </Link>
            <button
              type='submit'
              className='w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-accent-500 to-terracotta-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>

        {/* Photo Gallery Section */}
        <div className='mt-8'>
          <div className='bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6'>
            <div className='flex items-center mb-4'>
              <div className='w-10 h-10 bg-gradient-to-br from-gold-500 to-terracotta-500 rounded-lg flex items-center justify-center mr-3'>
                <span className='text-lg'>📸</span>
              </div>
              <h2 className='text-xl font-display font-bold text-gray-900'>
                Photo Gallery
              </h2>
            </div>
            <PhotoGallery isEditable={true} maxPhotos={12} />
          </div>
        </div>
      </div>
    </div>
  );
}
