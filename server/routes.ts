import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
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

export async function registerRoutes(app: Express): Promise<Server> {
  // Rotas da API Pública

  // Categorias
  app.get('/api/categories', async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar categorias" });
    }
  });

  app.post('/api/categories', async (req, res) => {
    try {
      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ message: "Dados inválidos para categoria" });
    }
  });

  app.put('/api/categories/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const categoryData = insertCategorySchema.partial().parse(req.body);
      const category = await storage.updateCategory(id, categoryData);
      res.json(category);
    } catch (error) {
      res.status(400).json({ message: "Erro ao atualizar categoria" });
    }
  });

  app.delete('/api/categories/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteCategory(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Erro ao deletar categoria" });
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
      res.status(500).json({ message: "Erro ao buscar posts" });
    }
  });

  app.get('/api/posts/:slug', async (req, res) => {
    try {
      const { slug } = req.params;
      const post = await storage.getPost(slug);
      if (!post) {
        return res.status(404).json({ message: "Post não encontrado" });
      }
      
      // Incrementar visualizações
      await storage.incrementPostViews(post.id);
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar post" });
    }
  });

  app.post('/api/posts', async (req, res) => {
    try {
      const postData = insertPostSchema.parse(req.body);
      const post = await storage.createPost(postData);
      res.status(201).json(post);
    } catch (error) {
      res.status(400).json({ message: "Dados inválidos para post" });
    }
  });

  app.put('/api/posts/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const postData = insertPostSchema.partial().parse(req.body);
      const post = await storage.updatePost(id, postData);
      res.json(post);
    } catch (error) {
      res.status(400).json({ message: "Erro ao atualizar post" });
    }
  });

  // Produtos
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
      res.status(500).json({ message: "Erro ao buscar produtos" });
    }
  });

  app.get('/api/products/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Produto não encontrado" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar produto" });
    }
  });

  app.post('/api/products', async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ message: "Dados inválidos para produto" });
    }
  });

  app.put('/api/products/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const productData = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(id, productData);
      res.json(product);
    } catch (error) {
      res.status(400).json({ message: "Erro ao atualizar produto" });
    }
  });

  // Ofertas
  app.get('/api/deals', async (req, res) => {
    try {
      const { featured, active, limit } = req.query;
      const deals = await storage.getDeals({
        featured: featured === 'true',
        active: active !== 'false', // Por padrão, mostra apenas ofertas ativas
        limit: limit ? parseInt(limit as string) : undefined
      });
      res.json(deals);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar ofertas" });
    }
  });

  app.get('/api/deals/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const deal = await storage.getDeal(id);
      if (!deal) {
        return res.status(404).json({ message: "Oferta não encontrada" });
      }
      res.json(deal);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar oferta" });
    }
  });

  app.post('/api/deals', async (req, res) => {
    try {
      const dealData = insertDealSchema.parse(req.body);
      const deal = await storage.createDeal(dealData);
      res.status(201).json(deal);
    } catch (error) {
      res.status(400).json({ message: "Dados inválidos para oferta" });
    }
  });

  app.put('/api/deals/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const dealData = insertDealSchema.partial().parse(req.body);
      const deal = await storage.updateDeal(id, dealData);
      res.json(deal);
    } catch (error) {
      res.status(400).json({ message: "Erro ao atualizar oferta" });
    }
  });

  // Comentários
  app.get('/api/posts/:postId/comments', async (req, res) => {
    try {
      const { postId } = req.params;
      const comments = await storage.getComments(postId);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar comentários" });
    }
  });

  app.post('/api/posts/:postId/comments', async (req, res) => {
    try {
      const { postId } = req.params;
      const commentData = insertCommentSchema.parse({
        ...req.body,
        postId,
        status: "PENDING" // Comentários começam como pendentes
      });
      const comment = await storage.createComment(commentData);
      res.status(201).json(comment);
    } catch (error) {
      res.status(400).json({ message: "Dados inválidos para comentário" });
    }
  });

  app.get('/api/admin/comments/pending', async (req, res) => {
    try {
      const comments = await storage.getPendingComments();
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar comentários pendentes" });
    }
  });

  app.put('/api/admin/comments/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const commentData = insertCommentSchema.partial().parse(req.body);
      const comment = await storage.updateComment(id, commentData);
      res.json(comment);
    } catch (error) {
      res.status(400).json({ message: "Erro ao atualizar comentário" });
    }
  });

  // Newsletter
  app.post('/api/newsletter/subscribe', async (req, res) => {
    try {
      const subscriberData = insertNewsletterSubscriberSchema.parse(req.body);
      const subscriber = await storage.subscribeNewsletter(subscriberData);
      res.status(201).json({ message: "Inscrição realizada com sucesso!" });
    } catch (error) {
      res.status(400).json({ message: "Erro ao realizar inscrição na newsletter" });
    }
  });

  app.get('/api/admin/newsletter/subscribers', async (req, res) => {
    try {
      const subscribers = await storage.getNewsletterSubscribers();
      res.json(subscribers);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar inscritos da newsletter" });
    }
  });

  // Marcas
  app.get('/api/brands', async (req, res) => {
    try {
      const brands = await storage.getBrands();
      res.json(brands);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar marcas" });
    }
  });

  app.post('/api/brands', async (req, res) => {
    try {
      const brandData = insertBrandSchema.parse(req.body);
      const brand = await storage.createBrand(brandData);
      res.status(201).json(brand);
    } catch (error) {
      res.status(400).json({ message: "Dados inválidos para marca" });
    }
  });

  // Tags
  app.get('/api/tags', async (req, res) => {
    try {
      const tags = await storage.getTags();
      res.json(tags);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar tags" });
    }
  });

  // Cliques de afiliados
  app.post('/api/affiliate/click', async (req, res) => {
    try {
      const clickData = insertAffiliateClickSchema.parse(req.body);
      const click = await storage.trackAffiliateClick(clickData);
      res.status(201).json({ message: "Clique registrado com sucesso" });
    } catch (error) {
      res.status(400).json({ message: "Erro ao registrar clique" });
    }
  });

  app.get('/api/admin/analytics/clicks', async (req, res) => {
    try {
      const { productId, dealId, postId } = req.query;
      const clicks = await storage.getAffiliateClicks({
        productId: productId as string,
        dealId: dealId as string,
        postId: postId as string
      });
      res.json(clicks);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar analytics de cliques" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}