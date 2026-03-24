export type SiteSettings = {
  _id: string;
  _type: 'siteSettings';
  siteTitle?: string;
  siteDescription?: string;
  heroTagline?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroVideo?: {
    asset?: {
      _id: string;
      url: string;
      mimeType?: string;
    };
  };
  heroVideoUrl?: string;
  heroHeight?: '100vh' | '75vh' | '66vh' | '50vh';
  heroEdgeStyle?: 'gradient' | 'blur' | 'solid';
  aboutHeading?: string;
  aboutBody?: any[];
  aboutImage?: SanityImage;
  aboutImagePosition?: 'top' | 'upper' | 'center' | 'lower' | 'bottom';
  aboutImageAspectRatio?: 'portrait' | 'square' | 'original';
  aboutImageAlignment?: 'section' | 'text';
  stats?: Array<{
    _key: string;
    number: string;
    label: string;
  }>;
  contactHeading?: string;
  contactSubheading?: string;
  contactEmail?: string;
  ogImage?: {
    asset?: {
      _id: string;
      url: string;
      metadata?: {
        dimensions?: { width: number; height: number };
      };
    };
  };
};

export type PortfolioItem = {
  _id: string;
  _type: 'portfolioItem';
  title: string;
  slug: { current: string };
  category?: string;
  vimeoUrl?: string;
  videoUrl?: string;
  videoFile?: {
    asset?: {
      _id: string;
      url: string;
      mimeType?: string;
    };
  };
  thumbnail?: SanityImage;
  description?: string;
  year?: string;
  aspectRatio?: 'auto' | '16:9' | '4:3' | '1:1' | '9:16' | '21:9';
  displayMode?: 'contain' | 'cover';
  featured?: boolean;
  order?: number;
};

export type Service = {
  _id: string;
  _type: 'service';
  title: string;
  description: string;
  icon?: string;
  order?: number;
};

export type Category = {
  _id?: string;
  _type?: 'category';
  title: string;
  slug?: { current: string } | null;
};

export type Post = {
  _id: string;
  _type: 'post';
  title: string;
  slug: { current: string };
  publishedAt: string;
  excerpt?: string;
  mainImage?: SanityImage;
  category?: Category | null;
  categories?: Category[];
  body?: any[];
  meta_title?: string;
  meta_description?: string;
  noindex?: boolean;
  ogImage?: {
    asset?: {
      _id: string;
      url: string;
      metadata?: {
        dimensions?: { width: number; height: number };
      };
    };
  };
};

export type Page = {
  _id: string;
  _type: 'page';
  title: string;
  slug: { current: string };
  body?: any[];
  meta_title?: string;
  meta_description?: string;
  noindex?: boolean;
  ogImage?: {
    asset?: {
      _id: string;
      url: string;
      metadata?: {
        dimensions?: { width: number; height: number };
      };
    };
  };
};

export type SocialLink = {
  _id: string;
  _type: 'socialLink';
  platform: string;
  url: string;
  order?: number;
};

export type ContactDetail = {
  _id: string;
  _type: 'contactDetail';
  detailType:
    | 'social'
    | 'phone'
    | 'email'
    | 'location'
    | 'address'
    | 'website'
    | 'other';
  label: string;
  value: string;
  linkUrl?: string;
  order?: number;
};

export type SanityImage = {
  _type?: 'image';
  asset?: {
    _id: string;
    _createdAt?: string;
    url: string;
    mimeType?: string;
    metadata?: {
      lqip?: string;
      dimensions?: {
        width: number;
        height: number;
      };
    };
  };
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  alt?: string;
};
