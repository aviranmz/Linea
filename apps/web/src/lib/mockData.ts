export type Owner = {
  id: string;
  name: string;
  company: string;
  email: string;
  avatarUrl: string;
  city: string;
  country: string;
  specialty: string;
};

export type OwnerEvent = {
  id: string;
  ownerId: string;
  title: string;
  slug: string;
  description: string;
  startDate: string;
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED';
  capacity?: number;
  imageUrl?: string;
};

export const owners: Owner[] = [
  {
    id: 'own_milano_studio_nova',
    name: 'Luca Bianchi',
    company: 'Studio Nova Cucine',
    email: 'luca@studionovacucine.it',
    avatarUrl: 'https://i.pravatar.cc/150?img=12',
    city: 'Milano',
    country: 'Italy',
    specialty: 'Minimalist Italian kitchens',
  },
  {
    id: 'own_florence_terra',
    name: 'Giulia Rinaldi',
    company: 'Terra & Marmo',
    email: 'giulia@terramarmo.it',
    avatarUrl: 'https://i.pravatar.cc/150?img=15',
    city: 'Firenze',
    country: 'Italy',
    specialty: 'Natural stone countertops',
  },
  {
    id: 'own_copenhagen_nord',
    name: 'Mikkel Sørensen',
    company: 'Nord Køkken',
    email: 'mikkel@nordkokken.dk',
    avatarUrl: 'https://i.pravatar.cc/150?img=7',
    city: 'Copenhagen',
    country: 'Denmark',
    specialty: 'Scandinavian oak cabinetry',
  },
  {
    id: 'own_london_brass_house',
    name: 'Amelia Wright',
    company: 'Brass House Kitchens',
    email: 'amelia@brasshouse.co.uk',
    avatarUrl: 'https://i.pravatar.cc/150?img=47',
    city: 'London',
    country: 'UK',
    specialty: 'Brass accents & bespoke joinery',
  },
  {
    id: 'own_barcelona_ceramica',
    name: 'Carlos Ortega',
    company: 'Cerámica & Luz',
    email: 'carlos@ceramicaluz.es',
    avatarUrl: 'https://i.pravatar.cc/150?img=19',
    city: 'Barcelona',
    country: 'Spain',
    specialty: 'Textured ceramic backsplashes',
  },
  {
    id: 'own_paris_atelier',
    name: 'Camille Dubois',
    company: 'Atelier Plan de Travail',
    email: 'camille@atelierplan.fr',
    avatarUrl: 'https://i.pravatar.cc/150?img=5',
    city: 'Paris',
    country: 'France',
    specialty: 'Marble islands & lighting',
  },
  {
    id: 'own_berlin_bau',
    name: 'Jonas Keller',
    company: 'Bau Küchenwerk',
    email: 'jonas@baukuechenwerk.de',
    avatarUrl: 'https://i.pravatar.cc/150?img=29',
    city: 'Berlin',
    country: 'Germany',
    specialty: 'Industrial-modern steel & wood',
  },
  {
    id: 'own_stockholm_laga',
    name: 'Elin Andersson',
    company: 'Laga & Ljus',
    email: 'elin@lagaljus.se',
    avatarUrl: 'https://i.pravatar.cc/150?img=32',
    city: 'Stockholm',
    country: 'Sweden',
    specialty: 'Light-forward compact kitchens',
  },
  {
    id: 'own_newyork_blueprint',
    name: 'Marcus Lee',
    company: 'Blueprint Kitchens',
    email: 'marcus@blueprint.nyc',
    avatarUrl: 'https://i.pravatar.cc/150?img=68',
    city: 'New York',
    country: 'USA',
    specialty: 'Urban luxury & smart appliances',
  },
  {
    id: 'own_tokyo_hikari',
    name: 'Aiko Tanaka',
    company: 'Hikari Kitchens',
    email: 'aiko@hikari.jp',
    avatarUrl: 'https://i.pravatar.cc/150?img=23',
    city: 'Tokyo',
    country: 'Japan',
    specialty: 'Zen minimalism & storage systems',
  },
];

export const events: OwnerEvent[] = [
  {
    id: 'evt_nova_showcase',
    ownerId: 'own_milano_studio_nova',
    title: 'Nova Quartz & Walnut Showcase',
    slug: 'nova-quartz-walnut-showcase',
    description:
      'Live demo of integrated quartz worktops with warm walnut cabinetry featuring hidden channels and ambient lighting.',
    startDate: '2025-10-05T18:00:00.000Z',
    status: 'PUBLISHED',
    capacity: 80,
    imageUrl:
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=1600',
  },
  {
    id: 'evt_terra_marmo_masterclass',
    ownerId: 'own_florence_terra',
    title: 'Marmo Surfaces Masterclass',
    slug: 'marmo-surfaces-masterclass',
    description:
      'Selecting, sealing and caring for natural stone countertops with live edge finishing.',
    startDate: '2025-10-07T16:30:00.000Z',
    status: 'PUBLISHED',
    capacity: 50,
    imageUrl:
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1600',
  },
  {
    id: 'evt_nord_oak_lines',
    ownerId: 'own_copenhagen_nord',
    title: 'Oak Lines: Scandinavian Kitchens',
    slug: 'oak-lines-scandi-kitchens',
    description:
      'Exploring vertical grain oak, soap-treated finishes, and matte black fixtures.',
    startDate: '2025-10-09T17:00:00.000Z',
    status: 'PUBLISHED',
    capacity: 60,
    imageUrl:
      'https://images.unsplash.com/photo-1616596491714-2cf5f2b24f88?q=80&w=1600',
  },
  {
    id: 'evt_brass_house_series',
    ownerId: 'own_london_brass_house',
    title: 'The Brass House Series',
    slug: 'brass-house-series',
    description:
      'Brass detailing deep-dive: patina control, edge profiles, and lighting temperature.',
    startDate: '2025-10-11T18:30:00.000Z',
    status: 'PUBLISHED',
    capacity: 70,
    imageUrl:
      'https://images.unsplash.com/photo-1598300183876-1c39e6b86f66?q=80&w=1600',
  },
  {
    id: 'evt_ceramica_textures',
    ownerId: 'own_barcelona_ceramica',
    title: 'Cerámica: Texture & Light',
    slug: 'ceramica-texture-light',
    description:
      'Tactile backsplash tiles and diffused light strategies for warm kitchens.',
    startDate: '2025-10-13T17:30:00.000Z',
    status: 'PUBLISHED',
    capacity: 90,
    imageUrl:
      'https://images.unsplash.com/photo-1582582621959-48d5d00f50be?q=80&w=1600',
  },
  {
    id: 'evt_atelier_lumieres',
    ownerId: 'own_paris_atelier',
    title: 'Îlot & Lumières',
    slug: 'ilot-et-lumieres',
    description:
      'Center islands, pendant geometry, and reflective marble surfaces.',
    startDate: '2025-10-14T19:00:00.000Z',
    status: 'PUBLISHED',
    capacity: 65,
    imageUrl:
      'https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=1600',
  },
  {
    id: 'evt_bau_werkflow',
    ownerId: 'own_berlin_bau',
    title: 'Werkflow: Steel x Timber',
    slug: 'werkflow-steel-timber',
    description:
      'Industrial kitchens with powder-coated steel frames and reclaimed timber.',
    startDate: '2025-10-16T18:15:00.000Z',
    status: 'PUBLISHED',
    capacity: 75,
    imageUrl:
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1600',
  },
  {
    id: 'evt_laga_compact',
    ownerId: 'own_stockholm_laga',
    title: 'Compact & Bright',
    slug: 'compact-and-bright',
    description:
      'High-function compact kitchens with light strategies for Nordic winters.',
    startDate: '2025-10-18T16:00:00.000Z',
    status: 'PUBLISHED',
    capacity: 55,
    imageUrl:
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1600',
  },
  {
    id: 'evt_blueprint_smart',
    ownerId: 'own_newyork_blueprint',
    title: 'Smart Urban Kitchens',
    slug: 'smart-urban-kitchens',
    description:
      'Appliance integration, voice control, and NYC–scale storage solutions.',
    startDate: '2025-10-20T17:45:00.000Z',
    status: 'PUBLISHED',
    capacity: 120,
    imageUrl:
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1600',
  },
  {
    id: 'evt_hikari_zen',
    ownerId: 'own_tokyo_hikari',
    title: 'Hikari: Zen Storage',
    slug: 'hikari-zen-storage',
    description:
      'Hidden hardware, shoji-inspired panels, and precision storage.',
    startDate: '2025-10-22T18:00:00.000Z',
    status: 'PUBLISHED',
    capacity: 85,
    imageUrl:
      'https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=1600',
  },
];

export const byOwner = owners.reduce<Record<string, Owner>>((acc, o) => {
  acc[o.id] = o;
  return acc;
}, {});

export const eventsWithOwner = events.map(e => ({
  ...e,
  owner: byOwner[e.ownerId],
}));
