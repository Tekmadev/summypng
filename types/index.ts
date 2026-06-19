/**
 * Shared domain types for SummyPNG - Summy Singh Photography.
 * Field names mirror the snake_case Postgres columns 1:1.
 * Strict TypeScript. Named exports only. No default export.
 * @module types
 */

export type GalleryType = 'portfolio' | 'client';
export type QueryStatus = 'new' | 'read' | 'replied';
export type PhotoCategory = 'people' | 'businesses' | 'hospitality' | 'real-estate';
export type CategoryLabel = 'People' | 'Businesses' | 'Hospitality' | 'Real Estate';

export interface Category {
  readonly id: string;
  readonly slug: PhotoCategory;
  readonly label: CategoryLabel;
  readonly description: string | null;
  readonly display_order: number;
  readonly created_at: string;
}

export interface Photo {
  readonly id: string;
  readonly category_id: string | null;
  readonly full_res_url: string;
  readonly compressed_url: string;
  readonly alt_text: string | null;
  readonly camera: string | null;
  readonly lens: string | null;
  readonly aperture: string | null;
  readonly shutter: string | null;
  readonly iso: number | null;
  readonly taken_at: string | null;
  readonly is_visible: boolean;
  readonly display_order: number;
  readonly gallery_type: GalleryType;
  readonly client_id: string | null;
  readonly project_id: string | null;
  readonly created_at: string;
  readonly updated_at: string;
}

export interface ContactQuery {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly phone: string | null;
  readonly category_id: string | null;
  readonly category_label: CategoryLabel | null;
  readonly description: string | null;
  readonly preferred_date: string | null;
  readonly utm_source: string | null;
  readonly utm_medium: string | null;
  readonly utm_campaign: string | null;
  readonly referrer: string | null;
  readonly landing_page: string | null;
  readonly user_agent: string | null;
  readonly status: QueryStatus;
  readonly created_at: string;
}

export interface AboutContent {
  readonly id: string;
  readonly bio: string | null;
  readonly photo_url: string | null;
  readonly tagline: string | null;
  readonly social_links: SocialLinks;
  readonly is_active: boolean;
  readonly updated_at: string;
}

export interface SocialLinks {
  readonly instagram?: string;
  readonly [platform: string]: string | undefined;
}

export interface TrafficSource {
  readonly id: string;
  readonly utm_source: string | null;
  readonly utm_medium: string | null;
  readonly utm_campaign: string | null;
  readonly utm_content: string | null;
  readonly utm_term: string | null;
  readonly page: string;
  readonly referrer: string | null;
  readonly created_at: string;
}

export interface Client {
  readonly id: string;
  readonly auth_user_id: string | null;
  readonly name: string;
  readonly email: string;
  readonly created_at: string;
}

export interface Project {
  readonly id: string;
  readonly client_id: string;
  readonly name: string;
  readonly is_delivered: boolean;
  readonly delivered_at: string | null;
  readonly created_at: string;
}

/* Insert helpers - required NOT NULL columns stay required; nullable
   columns become optional so the public form need not pass null for
   every analytics field. DB defaults id/status/created_at. */
export type ContactQueryInsert =
  Pick<ContactQuery, 'name' | 'email'> &
  Partial<Pick<
    ContactQuery,
    | 'phone' | 'category_id' | 'category_label' | 'description'
    | 'preferred_date' | 'utm_source' | 'utm_medium' | 'utm_campaign'
    | 'referrer' | 'landing_page' | 'user_agent'
  >>;

export type TrafficSourceInsert =
  Pick<TrafficSource, 'page'> &
  Partial<Pick<
    TrafficSource,
    'utm_source' | 'utm_medium' | 'utm_campaign' | 'utm_content' | 'utm_term' | 'referrer'
  >>;
