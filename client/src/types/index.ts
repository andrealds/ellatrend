export interface PostWithDetails {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  featuredImage?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  status: string;
  type: string;
  viewCount: number;
  likeCount: number;
  isFeatured: boolean;
  publishedAt?: Date | null;
  authorId: string;
  categoryId?: string | null;
  subcategoryId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductWithDetails {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  model?: string | null;
  sku?: string | null;
  images?: string[] | null;
  specifications?: any;
  currentPrice?: string | null;
  originalPrice?: string | null;
  affiliateLinks: any;
  isActive: boolean;
  featured: boolean;
  rating?: string | null;
  reviewCount: number;
  availabilityStatus: string;
  brandId?: string | null;
  categoryId?: string | null;
  subcategoryId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface DealWithDetails {
  id: string;
  title: string;
  description?: string | null;
  productId?: string | null;
  originalPrice: string;
  dealPrice: string;
  discountPercent: number;
  couponCode?: string | null;
  affiliateLink: string;
  store: string;
  isActive: boolean;
  isFeatured: boolean;
  startDate?: Date | null;
  endDate?: Date | null;
  clickCount: number;
  conversionCount: number;
  createdAt: Date;
  updatedAt: Date;
  product?: ProductWithDetails;
}

export interface CategoryWithDetails {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  color?: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}
