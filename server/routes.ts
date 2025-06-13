import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertPostSchema, 
  insertProductSchema, 
  insertDealSchema, 
  insertCommentSchema,
  insertNewsletterSubscriberSchema,
  insertAffiliateClickSchema,
  insertCategorySchema,
  insertBrandSchema
} from "@shared/schema";
import { nanoid } from "nanoid";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Public API routes

  // Categories
  app.get('/api/categories', async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Posts
  app.get('/api/posts', async (req, res) => {
    try {
      const { status, featured, categoryId, limit } = req.query;
      const posts = await storage.getPosts({
        status: status as string,
        featured: featured === 'true',
        categoryId: categoryId as string,
        limit: limit ? parseInt(limit as string) : undefined
      });
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  app.get('/api/posts/:slug', async (req, res) => {
    try {
      const post = await storage.getPost(req.params.slug);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      // Increment view count
      await storage.incrementPostViews(post.id);
      
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch post" });
    }
  });

  // Products
  app.get('/api/products', async (req, res) => {
    try {
      const { categoryId, featured, limit } = req.query;
      const products = await storage.getProducts({
        categoryId: categoryId as string,
        featured: featured === 'true',
        limit: limit ? parseInt(limit as string) : undefined
      });
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  // Deals
  app.get('/api/deals', async (req, res) => {
    try {
      const { featured, active, limit } = req.query;
      const deals = await storage.getDeals({
        featured: featured === 'true',
        active: active === 'true',
        limit: limit ? parseInt(limit as string) : undefined
      });
      res.json(deals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch deals" });
    }
  });

  // Comments
  app.get('/api/posts/:postId/comments', async (req, res) => {
    try {
      const comments = await storage.getComments(req.params.postId);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  app.post('/api/posts/:postId/comments', async (req, res) => {
    try {
      const commentData = insertCommentSchema.parse({
        ...req.body,
        id: nanoid(),
        postId: req.params.postId
      });
      
      const comment = await storage.createComment(commentData);
      res.status(201).json(comment);
    } catch (error) {
      res.status(400).json({ message: "Invalid comment data" });
    }
  });

  // Newsletter subscription
  app.post('/api/newsletter/subscribe', async (req, res) => {
    try {
      const subscriberData = insertNewsletterSubscriberSchema.parse({
        ...req.body,
        id: nanoid()
      });
      
      const subscriber = await storage.subscribeNewsletter(subscriberData);
      res.status(201).json(subscriber);
    } catch (error) {
      res.status(400).json({ message: "Invalid subscription data" });
    }
  });

  // Affiliate click tracking
  app.post('/api/affiliate/click', async (req, res) => {
    try {
      const clickData = insertAffiliateClickSchema.parse({
        ...req.body,
        id: nanoid(),
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        referrer: req.get('Referer')
      });
      
      const click = await storage.trackAffiliateClick(clickData);
      res.status(201).json(click);
    } catch (error) {
      res.status(400).json({ message: "Invalid click data" });
    }
  });

  // Protected Admin API routes
  app.post('/api/admin/posts', isAuthenticated, async (req: any, res) => {
    try {
      const postData = insertPostSchema.parse({
        ...req.body,
        id: nanoid(),
        authorId: req.user.claims.sub
      });
      
      const post = await storage.createPost(postData);
      res.status(201).json(post);
    } catch (error) {
      res.status(400).json({ message: "Invalid post data" });
    }
  });

  app.put('/api/admin/posts/:id', isAuthenticated, async (req, res) => {
    try {
      const updates = insertPostSchema.partial().parse(req.body);
      const post = await storage.updatePost(req.params.id, updates);
      res.json(post);
    } catch (error) {
      res.status(400).json({ message: "Invalid post data" });
    }
  });

  app.post('/api/admin/products', isAuthenticated, async (req, res) => {
    try {
      const productData = insertProductSchema.parse({
        ...req.body,
        id: nanoid()
      });
      
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ message: "Invalid product data" });
    }
  });

  app.put('/api/admin/products/:id', isAuthenticated, async (req, res) => {
    try {
      const updates = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(req.params.id, updates);
      res.json(product);
    } catch (error) {
      res.status(400).json({ message: "Invalid product data" });
    }
  });

  app.post('/api/admin/deals', isAuthenticated, async (req, res) => {
    try {
      const dealData = insertDealSchema.parse({
        ...req.body,
        id: nanoid()
      });
      
      const deal = await storage.createDeal(dealData);
      res.status(201).json(deal);
    } catch (error) {
      res.status(400).json({ message: "Invalid deal data" });
    }
  });

  app.put('/api/admin/deals/:id', isAuthenticated, async (req, res) => {
    try {
      const updates = insertDealSchema.partial().parse(req.body);
      const deal = await storage.updateDeal(req.params.id, updates);
      res.json(deal);
    } catch (error) {
      res.status(400).json({ message: "Invalid deal data" });
    }
  });

  app.post('/api/admin/categories', isAuthenticated, async (req, res) => {
    try {
      const categoryData = insertCategorySchema.parse({
        ...req.body,
        id: nanoid()
      });
      
      const category = await storage.createCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ message: "Invalid category data" });
    }
  });

  app.post('/api/admin/brands', isAuthenticated, async (req, res) => {
    try {
      const brandData = insertBrandSchema.parse({
        ...req.body,
        id: nanoid()
      });
      
      const brand = await storage.createBrand(brandData);
      res.status(201).json(brand);
    } catch (error) {
      res.status(400).json({ message: "Invalid brand data" });
    }
  });

  // Comment moderation
  app.get('/api/admin/comments/pending', isAuthenticated, async (req, res) => {
    try {
      const comments = await storage.getPendingComments();
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pending comments" });
    }
  });

  app.put('/api/admin/comments/:id', isAuthenticated, async (req, res) => {
    try {
      const updates = insertCommentSchema.partial().parse(req.body);
      const comment = await storage.updateComment(req.params.id, updates);
      res.json(comment);
    } catch (error) {
      res.status(400).json({ message: "Invalid comment data" });
    }
  });

  // Analytics
  app.get('/api/admin/analytics/clicks', isAuthenticated, async (req, res) => {
    try {
      const { productId, dealId, postId } = req.query;
      const clicks = await storage.getAffiliateClicks({
        productId: productId as string,
        dealId: dealId as string,
        postId: postId as string
      });
      res.json(clicks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  app.get('/api/admin/newsletter/subscribers', isAuthenticated, async (req, res) => {
    try {
      const subscribers = await storage.getNewsletterSubscribers();
      res.json(subscribers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch subscribers" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
