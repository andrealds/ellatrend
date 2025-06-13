import {
  users,
  categories,
  subcategories,
  tags,
  brands,
  products,
  posts,
  postTags,
  postProducts,
  deals,
  comments,
  newsletterSubscribers,
  affiliateClicks,
  type User,
  type UpsertUser,
  type Category,
  type InsertCategory,
  type Subcategory,
  type InsertSubcategory,
  type Tag,
  type InsertTag,
  type Brand,
  type InsertBrand,
  type Product,
  type InsertProduct,
  type Post,
  type InsertPost,
  type PostProduct,
  type InsertPostProduct,
  type Deal,
  type InsertDeal,
  type Comment,
  type InsertComment,
  type NewsletterSubscriber,
  type InsertNewsletterSubscriber,
  type AffiliateClick,
  type InsertAffiliateClick,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql, ilike, inArray } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Categories
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category>;
  deleteCategory(id: string): Promise<void>;

  // Subcategories
  getSubcategories(categoryId?: string): Promise<Subcategory[]>;
  createSubcategory(subcategory: InsertSubcategory): Promise<Subcategory>;

  // Tags
  getTags(): Promise<Tag[]>;
  createTag(tag: InsertTag): Promise<Tag>;

  // Brands
  getBrands(): Promise<Brand[]>;
  createBrand(brand: InsertBrand): Promise<Brand>;

  // Products
  getProducts(options?: { categoryId?: string; featured?: boolean; limit?: number }): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product>;

  // Posts
  getPosts(options?: { status?: string; featured?: boolean; categoryId?: string; limit?: number }): Promise<Post[]>;
  getPost(slug: string): Promise<Post | undefined>;
  getPostById(id: string): Promise<Post | undefined>;
  createPost(post: InsertPost): Promise<Post>;
  updatePost(id: string, post: Partial<InsertPost>): Promise<Post>;
  incrementPostViews(id: string): Promise<void>;

  // Post Products
  getPostProducts(postId: string): Promise<PostProduct[]>;
  createPostProduct(postProduct: InsertPostProduct): Promise<PostProduct>;

  // Deals
  getDeals(options?: { featured?: boolean; active?: boolean; limit?: number }): Promise<Deal[]>;
  getDeal(id: string): Promise<Deal | undefined>;
  createDeal(deal: InsertDeal): Promise<Deal>;
  updateDeal(id: string, deal: Partial<InsertDeal>): Promise<Deal>;

  // Comments
  getComments(postId: string): Promise<Comment[]>;
  getPendingComments(): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  updateComment(id: string, comment: Partial<InsertComment>): Promise<Comment>;

  // Newsletter
  subscribeNewsletter(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber>;
  getNewsletterSubscribers(): Promise<NewsletterSubscriber[]>;

  // Analytics
  trackAffiliateClick(click: InsertAffiliateClick): Promise<AffiliateClick>;
  getAffiliateClicks(options?: { productId?: string; dealId?: string; postId?: string }): Promise<AffiliateClick[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories).where(eq(categories.isActive, true)).orderBy(categories.sortOrder);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }

  async updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category> {
    const [updated] = await db
      .update(categories)
      .set({ ...category, updatedAt: new Date() })
      .where(eq(categories.id, id))
      .returning();
    return updated;
  }

  async deleteCategory(id: string): Promise<void> {
    await db.delete(categories).where(eq(categories.id, id));
  }

  // Subcategories
  async getSubcategories(categoryId?: string): Promise<Subcategory[]> {
    const query = db.select().from(subcategories).where(eq(subcategories.isActive, true));
    if (categoryId) {
      return await query.where(eq(subcategories.categoryId, categoryId)).orderBy(subcategories.sortOrder);
    }
    return await query.orderBy(subcategories.sortOrder);
  }

  async createSubcategory(subcategory: InsertSubcategory): Promise<Subcategory> {
    const [newSubcategory] = await db.insert(subcategories).values(subcategory).returning();
    return newSubcategory;
  }

  // Tags
  async getTags(): Promise<Tag[]> {
    return await db.select().from(tags).orderBy(tags.name);
  }

  async createTag(tag: InsertTag): Promise<Tag> {
    const [newTag] = await db.insert(tags).values(tag).returning();
    return newTag;
  }

  // Brands
  async getBrands(): Promise<Brand[]> {
    return await db.select().from(brands).where(eq(brands.isActive, true)).orderBy(brands.name);
  }

  async createBrand(brand: InsertBrand): Promise<Brand> {
    const [newBrand] = await db.insert(brands).values(brand).returning();
    return newBrand;
  }

  // Products
  async getProducts(options: { categoryId?: string; featured?: boolean; limit?: number } = {}): Promise<Product[]> {
    let query = db.select().from(products).where(eq(products.isActive, true));

    if (options.categoryId) {
      query = query.where(eq(products.categoryId, options.categoryId));
    }

    if (options.featured) {
      query = query.where(eq(products.featured, true));
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }

    return await query.orderBy(desc(products.createdAt));
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product> {
    const [updated] = await db
      .update(products)
      .set({ ...product, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    return updated;
  }

  // Posts
  async getPosts(options: { status?: string; featured?: boolean; categoryId?: string; limit?: number } = {}): Promise<Post[]> {
    let query = db.select().from(posts);

    const conditions = [];
    
    if (options.status) {
      conditions.push(eq(posts.status, options.status as any));
    }

    if (options.featured) {
      conditions.push(eq(posts.isFeatured, true));
    }

    if (options.categoryId) {
      conditions.push(eq(posts.categoryId, options.categoryId));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }

    return await query.orderBy(desc(posts.publishedAt));
  }

  async getPost(slug: string): Promise<Post | undefined> {
    const [post] = await db.select().from(posts).where(eq(posts.slug, slug));
    return post;
  }

  async getPostById(id: string): Promise<Post | undefined> {
    const [post] = await db.select().from(posts).where(eq(posts.id, id));
    return post;
  }

  async createPost(post: InsertPost): Promise<Post> {
    const [newPost] = await db.insert(posts).values(post).returning();
    return newPost;
  }

  async updatePost(id: string, post: Partial<InsertPost>): Promise<Post> {
    const [updated] = await db
      .update(posts)
      .set({ ...post, updatedAt: new Date() })
      .where(eq(posts.id, id))
      .returning();
    return updated;
  }

  async incrementPostViews(id: string): Promise<void> {
    await db
      .update(posts)
      .set({ viewCount: sql`${posts.viewCount} + 1` })
      .where(eq(posts.id, id));
  }

  // Post Products
  async getPostProducts(postId: string): Promise<PostProduct[]> {
    return await db.select().from(postProducts).where(eq(postProducts.postId, postId)).orderBy(postProducts.position);
  }

  async createPostProduct(postProduct: InsertPostProduct): Promise<PostProduct> {
    const [newPostProduct] = await db.insert(postProducts).values(postProduct).returning();
    return newPostProduct;
  }

  // Deals
  async getDeals(options: { featured?: boolean; active?: boolean; limit?: number } = {}): Promise<Deal[]> {
    let query = db.select().from(deals);

    const conditions = [];

    if (options.active) {
      conditions.push(eq(deals.isActive, true));
    }

    if (options.featured) {
      conditions.push(eq(deals.isFeatured, true));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }

    return await query.orderBy(desc(deals.createdAt));
  }

  async getDeal(id: string): Promise<Deal | undefined> {
    const [deal] = await db.select().from(deals).where(eq(deals.id, id));
    return deal;
  }

  async createDeal(deal: InsertDeal): Promise<Deal> {
    const [newDeal] = await db.insert(deals).values(deal).returning();
    return newDeal;
  }

  async updateDeal(id: string, deal: Partial<InsertDeal>): Promise<Deal> {
    const [updated] = await db
      .update(deals)
      .set({ ...deal, updatedAt: new Date() })
      .where(eq(deals.id, id))
      .returning();
    return updated;
  }

  // Comments
  async getComments(postId: string): Promise<Comment[]> {
    return await db.select().from(comments)
      .where(and(eq(comments.postId, postId), eq(comments.status, "APPROVED")))
      .orderBy(desc(comments.createdAt));
  }

  async getPendingComments(): Promise<Comment[]> {
    return await db.select().from(comments)
      .where(eq(comments.status, "PENDING"))
      .orderBy(desc(comments.createdAt));
  }

  async createComment(comment: InsertComment): Promise<Comment> {
    const [newComment] = await db.insert(comments).values(comment).returning();
    return newComment;
  }

  async updateComment(id: string, comment: Partial<InsertComment>): Promise<Comment> {
    const [updated] = await db
      .update(comments)
      .set({ ...comment, updatedAt: new Date() })
      .where(eq(comments.id, id))
      .returning();
    return updated;
  }

  // Newsletter
  async subscribeNewsletter(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber> {
    const [newSubscriber] = await db.insert(newsletterSubscribers).values(subscriber).returning();
    return newSubscriber;
  }

  async getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
    return await db.select().from(newsletterSubscribers).where(eq(newsletterSubscribers.status, "ACTIVE"));
  }

  // Analytics
  async trackAffiliateClick(click: InsertAffiliateClick): Promise<AffiliateClick> {
    const [newClick] = await db.insert(affiliateClicks).values(click).returning();
    return newClick;
  }

  async getAffiliateClicks(options: { productId?: string; dealId?: string; postId?: string } = {}): Promise<AffiliateClick[]> {
    let query = db.select().from(affiliateClicks);

    const conditions = [];

    if (options.productId) {
      conditions.push(eq(affiliateClicks.productId, options.productId));
    }

    if (options.dealId) {
      conditions.push(eq(affiliateClicks.dealId, options.dealId));
    }

    if (options.postId) {
      conditions.push(eq(affiliateClicks.postId, options.postId));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return await query.orderBy(desc(affiliateClicks.clickedAt));
  }
}

export const storage = new DatabaseStorage();
