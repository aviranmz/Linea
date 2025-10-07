import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getJson } from '../lib/api';
import { PhotoGallery } from '../components/PhotoGallery';

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

interface OwnerPublicProfile {
  id: string;
  name: string;
  businessName: string;
  businessIntro?: string;
  logoUrl?: string;
  profilePictureUrl?: string;
  website?: string;
  address?: string;
  city?: string;
  country?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  area?: Area | null;
  product?: Product | null;
}

export default function DesignerProfile() {
  const { id } = useParams();
  const [owner, setOwner] = useState<OwnerPublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        if (!id) return;
        const data = await getJson<{ owner: OwnerPublicProfile }>(
          `/api/owners/${id}/profile`
        );
        setOwner(data.owner);
      } catch (err) {
        console.error('Failed to load designer profile:', err);
        setError('Designer not found');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='animate-pulse h-8 bg-gray-200 rounded w-1/3 mb-4'></div>
        <div className='animate-pulse h-4 bg-gray-200 rounded w-1/2'></div>
      </div>
    );
  }

  if (error || !owner) {
    return (
      <div className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center'>
        <p className='text-red-600 mb-6'>{error || 'Designer not found'}</p>
        <Link to='/designers' className='btn btn-outline'>
          Back to Designers
        </Link>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-sage-50 via-white to-terracotta-50'>
      <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='bg-white/90 rounded-2xl shadow-lg border border-white/20 p-6 mb-6'>
          <div className='flex items-start gap-4'>
            <img
              src={
                owner.profilePictureUrl ||
                owner.logoUrl ||
                '/images/placeholder.jpg'
              }
              alt={owner.name || owner.businessName}
              className='w-20 h-20 rounded-xl object-cover border'
            />
            <div className='flex-1'>
              <h1 className='heading-2'>{owner.businessName || owner.name}</h1>
              {(owner.city || owner.country) && (
                <p className='text-sm text-gray-600'>
                  {[owner.city, owner.country].filter(Boolean).join(', ')}
                </p>
              )}
              {owner.website && (
                <a
                  className='text-accent-700 hover:underline text-sm'
                  href={owner.website}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Visit website
                </a>
              )}
            </div>
          </div>
          {owner.businessIntro && (
            <p className='mt-4 text-gray-700 whitespace-pre-line'>
              {owner.businessIntro}
            </p>
          )}
          {(owner.area || owner.product) && (
            <div className='mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm'>
              {owner.area && (
                <div className='bg-sage-50 border border-sage-200 rounded-lg p-3'>
                  <div className='font-semibold'>Area</div>
                  <div className='text-gray-700'>
                    {owner.area.icon} {owner.area.name}
                  </div>
                </div>
              )}
              {owner.product && (
                <div className='bg-accent-50 border border-accent-200 rounded-lg p-3'>
                  <div className='font-semibold'>Product</div>
                  <div className='text-gray-700'>
                    {owner.product.icon} {owner.product.name}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <PhotoGallery ownerId={owner.id} isEditable={false} />
      </div>
    </div>
  );
}
