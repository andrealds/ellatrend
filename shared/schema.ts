import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  integer,
  boolean,
  decimal,
  primaryKey,
  unique,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role", { enum: ["ADMIN", "EDITOR", "AUTHOR"] }).default("EDITOR"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Categories
export const categories = pgTable("categories", {
  id: varchar("id").primaryKey().notNull(),
  name: varchar("name").unique().notNull(),
  slug: varchar("slug").unique().notNull(),
  description: text("description"),
  icon: varchar("icon"),
  color: varchar("color"),
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Subcategories
export const subcategories = pgTable("subcategories", {
  id: varchar("id").primaryKey().notNull(),
  name: varchar("name").notNull(),
  slug: varchar("slug").notNull(),
  description: text("description"),
  categoryId: varchar("category_id").references(() => categories.id, { onDelete: "cascade" }),
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  uniqueSlugCategory: unique().on(table.slug, table.categoryId),
}));

// Tags
export const tags = pgTable("tags", {
  id: varchar("id").primaryKey().notNull(),
  name: varchar("name").unique().notNull(),
  slug: varchar("slug").unique().notNull(),
  color: varchar("color"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Brands
export const brands = pgTable("brands", {
  id: varchar("id").primaryKey().notNull(),
  name: varchar("name").unique().notNull(),
  slug: varchar("slug").unique().notNull(),
  logo: varchar("logo"),
  website: varchar("website"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Products
export const products = pgTable("products", {
  id: varchar("id").primaryKey().notNull(),
  name: varchar("name").notNull(),
  slug: varchar("slug").unique().notNull(),
  description: text("description"),
  model: varchar("model"),
  sku: varchar("sku").unique(),
  images: jsonb("images").$type<string[]>(),
  specifications: jsonb("specifications"),
  currentPrice: decimal("current_price", { precision: 10, scale: 2 }),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
  affiliateLinks: jsonb("affiliate_links").notNull(),
  isActive: boolean("is_active").default(true),
  featured: boolean("featured").default(false),
  rating: decimal("rating", { precision: 3, scale: 2 }),
  reviewCount: integer("review_count").default(0),
  availabilityStatus: varchar("availability_status", { 
    enum: ["AVAILABLE", "OUT_OF_STOCK", "DISCONTINUED", "PRE_ORDER"] 
  }).default("AVAILABLE"),
  brandId: varchar("brand_id").references(() => brands.id),
  categoryId: varchar("category_id").references(() => categories.id),
  subcategoryId: varchar("subcategory_id").references(() => subcategories.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Posts
export const posts = pgTable("posts", {
  id: varchar("id").primaryKey().notNull(),
  title: varchar("title").notNull(),
  slug: varchar("slug").unique().notNull(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  featuredImage: varchar("featured_image"),
  metaTitle: varchar("meta_title"),
  metaDescription: text("meta_description"),
  status: varchar("status", { enum: ["DRAFT", "PUBLISHED", "ARCHIVED", "SCHEDULED"] }).default("DRAFT"),
  type: varchar("type", { enum: ["ARTICLE", "REVIEW", "COMPARISON", "NEWS", "TUTORIAL", "DEALS"] }).default("ARTICLE"),
  viewCount: integer("view_count").default(0),
  likeCount: integer("like_count").default(0),
  isFeatured: boolean("is_featured").default(false),
  publishedAt: timestamp("published_at"),
  authorId: varchar("author_id").references(() => users.id).notNull(),
  categoryId: varchar("category_id").references(() => categories.id),
  subcategoryId: varchar("subcategory_id").references(() => subcategories.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Post-Tag many-to-many
export const postTags = pgTable("post_tags", {
  postId: varchar("post_id").references(() => posts.id, { onDelete: "cascade" }),
  tagId: varchar("tag_id").references(() => tags.id, { onDelete: "cascade" }),
}, (table) => ({
  pk: primaryKey({ columns: [table.postId, table.tagId] }),
}));

// Post-Product many-to-many with additional data
export const postProducts = pgTable("post_products", {
  id: varchar("id").primaryKey().notNull(),
  postId: varchar("post_id").references(() => posts.id, { onDelete: "cascade" }),
  productId: varchar("product_id").references(() => products.id, { onDelete: "cascade" }),
  position: integer("position").default(0),
  prosAndCons: jsonb("pros_and_cons"),
  rating: decimal("rating", { precision: 3, scale: 2 }),
  verdict: text("verdict"),
  isRecommended: boolean("is_recommended").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  uniquePostProduct: unique().on(table.postId, table.productId),
}));

// Deals
export const deals = pgTable("deals", {
  id: varchar("id").primaryKey().notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  productId: varchar("product_id").references(() => products.id, { onDelete: "cascade" }),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }).notNull(),
  dealPrice: decimal("deal_price", { precision: 10, scale: 2 }).notNull(),
  discountPercent: integer("discount_percent").notNull(),
  couponCode: varchar("coupon_code"),
  affiliateLink: varchar("affiliate_link").notNull(),
  store: varchar("store").notNull(),
  isActive: boolean("is_active").default(true),
  isFeatured: boolean("is_featured").default(false),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  clickCount: integer("click_count").default(0),
  conversionCount: integer("conversion_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Comments
export const comments = pgTable("comments", {
  id: varchar("id").primaryKey().notNull(),
  content: text("content").notNull(),
  status: varchar("status", { enum: ["PENDING", "APPROVED", "REJECTED", "SPAM"] }).default("PENDING"),
  postId: varchar("post_id").references(() => posts.id, { onDelete: "cascade" }),
  userId: varchar("user_id").references(() => users.id),
  parentId: varchar("parent_id").references(() => comments.id),
  authorName: varchar("author_name"),
  authorEmail: varchar("author_email"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Newsletter subscribers
export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique().notNull(),
  name: varchar("name"),
  status: varchar("status", { enum: ["ACTIVE", "UNSUBSCRIBED", "BOUNCED"] }).default("ACTIVE"),
  preferences: jsonb("preferences"),
  subscribedAt: timestamp("subscribed_at").defaultNow(),
  unsubscribedAt: timestamp("unsubscribed_at"),
});

// Affiliate clicks tracking
export const affiliateClicks = pgTable("affiliate_clicks", {
  id: varchar("id").primaryKey().notNull(),
  productId: varchar("product_id").references(() => products.id),
  dealId: varchar("deal_id").references(() => deals.id),
  postId: varchar("post_id").references(() => posts.id),
  store: varchar("store").notNull(),
  clickedAt: timestamp("clicked_at").defaultNow(),
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  referrer: varchar("referrer"),
  converted: boolean("converted").default(false),
  commission: decimal("commission", { precision: 10, scale: 2 }),
});

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  comments: many(comments),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  subcategories: many(subcategories),
  posts: many(posts),
  products: many(products),
}));

export const subcategoriesRelations = relations(subcategories, ({ one, many }) => ({
  category: one(categories, {
    fields: [subcategories.categoryId],
    references: [categories.id],
  }),
  posts: many(posts),
  products: many(products),
}));

export const brandsRelations = relations(brands, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  brand: one(brands, {
    fields: [products.brandId],
    references: [brands.id],
  }),
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  subcategory: one(subcategories, {
    fields: [products.subcategoryId],
    references: [subcategories.id],
  }),
  postProducts: many(postProducts),
  deals: many(deals),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [posts.categoryId],
    references: [categories.id],
  }),
  subcategory: one(subcategories, {
    fields: [posts.subcategoryId],
    references: [subcategories.id],
  }),
  postTags: many(postTags),
  postProducts: many(postProducts),
  comments: many(comments),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  postTags: many(postTags),
}));

export const postTagsRelations = relations(postTags, ({ one }) => ({
  post: one(posts, {
    fields: [postTags.postId],
    references: [posts.id],
  }),
  tag: one(tags, {
    fields: [postTags.tagId],
    references: [tags.id],
  }),
}));

export const postProductsRelations = relations(postProducts, ({ one }) => ({
  post: one(posts, {
    fields: [postProducts.postId],
    references: [posts.id],
  }),
  product: one(products, {
    fields: [postProducts.productId],
    references: [products.id],
  }),
}));

export const dealsRelations = relations(deals, ({ one }) => ({
  product: one(products, {
    fields: [deals.productId],
    references: [products.id],
  }),
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  parent: one(comments, {
    fields: [comments.parentId],
    references: [comments.id],
  }),
  replies: many(comments),
}));

// Export types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type InsertCategory = typeof categories.$inferInsert;
export type Category = typeof categories.$inferSelect;

export type InsertSubcategory = typeof subcategories.$inferInsert;
export type Subcategory = typeof subcategories.$inferSelect;

export type InsertTag = typeof tags.$inferInsert;
export type Tag = typeof tags.$inferSelect;

export type InsertBrand = typeof brands.$inferInsert;
export type Brand = typeof brands.$inferSelect;

export type InsertProduct = typeof products.$inferInsert;
export type Product = typeof products.$inferSelect;

export type InsertPost = typeof posts.$inferInsert;
export type Post = typeof posts.$inferSelect;

export type InsertPostTag = typeof postTags.$inferInsert;
export type PostTag = typeof postTags.$inferSelect;

export type InsertPostProduct = typeof postProducts.$inferInsert;
export type PostProduct = typeof postProducts.$inferSelect;

export type InsertDeal = typeof deals.$inferInsert;
export type Deal = typeof deals.$inferSelect;

export type InsertComment = typeof comments.$inferInsert;
export type Comment = typeof comments.$inferSelect;

export type InsertNewsletterSubscriber = typeof newsletterSubscribers.$inferInsert;
export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;

export type InsertAffiliateClick = typeof affiliateClicks.$inferInsert;
export type AffiliateClick = typeof affiliateClicks.$inferSelect;

// Zod schemas
export const insertCategorySchema = createInsertSchema(categories);
export const insertSubcategorySchema = createInsertSchema(subcategories);
export const insertTagSchema = createInsertSchema(tags);
export const insertBrandSchema = createInsertSchema(brands);
export const insertProductSchema = createInsertSchema(products);
export const insertPostSchema = createInsertSchema(posts);
export const insertPostProductSchema = createInsertSchema(postProducts);
export const insertDealSchema = createInsertSchema(deals);
export const insertCommentSchema = createInsertSchema(comments);
export const insertNewsletterSubscriberSchema = createInsertSchema(newsletterSubscribers);
export const insertAffiliateClickSchema = createInsertSchema(affiliateClicks);
