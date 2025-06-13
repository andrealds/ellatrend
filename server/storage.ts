import {
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

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export class MemoryStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private categories: Map<string, Category> = new Map();
  private subcategories: Map<string, Subcategory> = new Map();
  private tags: Map<string, Tag> = new Map();
  private brands: Map<string, Brand> = new Map();
  private products: Map<string, Product> = new Map();
  private posts: Map<string, Post> = new Map();
  private postProducts: Map<string, PostProduct> = new Map();
  private deals: Map<string, Deal> = new Map();
  private comments: Map<string, Comment> = new Map();
  private newsletterSubscribers: Map<string, NewsletterSubscriber> = new Map();
  private affiliateClicks: Map<string, AffiliateClick> = new Map();

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed categories
    const categories = [
      {
        id: "1",
        name: "Smartphones",
        slug: "smartphones",
        description: "Análises e comparativos dos melhores smartphones do mercado",
        icon: "📱",
        color: "#3B82F6",
        isActive: true,
        sortOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "2",
        name: "Notebooks",
        slug: "notebooks",
        description: "Reviews detalhados de notebooks para trabalho e gaming",
        icon: "💻",
        color: "#10B981",
        isActive: true,
        sortOrder: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "3",
        name: "Fones de Ouvido",
        slug: "fones-de-ouvido",
        description: "Testes de qualidade de áudio e conforto",
        icon: "🎧",
        color: "#F59E0B",
        isActive: true,
        sortOrder: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "4",
        name: "Smart TVs",
        slug: "smart-tvs",
        description: "Análises de qualidade de imagem e recursos smart",
        icon: "📺",
        color: "#EF4444",
        isActive: true,
        sortOrder: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    categories.forEach(cat => this.categories.set(cat.id, cat));

    // Seed brands
    const brands = [
      {
        id: "1",
        name: "Samsung",
        slug: "samsung",
        description: "Tecnologia sul-coreana de ponta",
        logo: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=100&h=100&fit=crop",
        website: "https://samsung.com",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "2",
        name: "Apple",
        slug: "apple",
        description: "Inovação e design premium",
        logo: "https://images.unsplash.com/photo-1621768216002-5ac171876625?w=100&h=100&fit=crop",
        website: "https://apple.com",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    brands.forEach(brand => this.brands.set(brand.id, brand));

    // Seed products
    const products = [
      {
        id: "1",
        name: "Samsung Galaxy S24 Ultra",
        slug: "samsung-galaxy-s24-ultra",
        description: "O smartphone mais avançado da Samsung com S Pen integrada",
        model: "SM-S928B",
        sku: "GAL-S24U-256-BLK",
        images: [
          "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=600&fit=crop"
        ],
        specifications: {
          tela: "6.8\" Dynamic AMOLED 2X",
          processador: "Snapdragon 8 Gen 3",
          memoria: "12GB RAM",
          armazenamento: "256GB",
          camera: "200MP principal + ultra-wide + teleobjetivas",
          bateria: "5000mAh"
        },
        currentPrice: "6999.00",
        originalPrice: "7999.00",
        affiliateLinks: {
          amazon: "https://amazon.com.br/galaxy-s24-ultra",
          magazineluiza: "https://magazineluiza.com.br/galaxy-s24-ultra",
          mercadolivre: "https://mercadolivre.com.br/galaxy-s24-ultra"
        },
        isActive: true,
        featured: true,
        rating: "4.8",
        reviewCount: 1250,
        availabilityStatus: "EM_STOCK",
        brandId: "1",
        categoryId: "1",
        subcategoryId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "2",
        name: "iPhone 15 Pro Max",
        slug: "iphone-15-pro-max",
        description: "O iPhone mais poderoso já criado com chip A17 Pro",
        model: "iPhone 15 Pro Max",
        sku: "IPH-15PM-256-TIT",
        images: [
          "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1695048133143-1a20484d2569?w=800&h=600&fit=crop"
        ],
        specifications: {
          tela: "6.7\" Super Retina XDR",
          processador: "A17 Pro",
          memoria: "8GB RAM",
          armazenamento: "256GB",
          camera: "48MP principal + ultra-wide + teleobjetiva",
          bateria: "4441mAh"
        },
        currentPrice: "8999.00",
        originalPrice: "9999.00",
        affiliateLinks: {
          amazon: "https://amazon.com.br/iphone-15-pro-max",
          magazineluiza: "https://magazineluiza.com.br/iphone-15-pro-max"
        },
        isActive: true,
        featured: true,
        rating: "4.9",
        reviewCount: 890,
        availabilityStatus: "EM_STOCK",
        brandId: "2",
        categoryId: "1",
        subcategoryId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    products.forEach(product => this.products.set(product.id, product));

    // Seed posts
    const posts = [
      {
        id: "1",
        title: "Galaxy S24 Ultra vs iPhone 15 Pro Max: Qual é o melhor flagship de 2024?",
        slug: "galaxy-s24-ultra-vs-iphone-15-pro-max-comparativo-2024",
        excerpt: "Comparamos os dois smartphones mais avançados do mercado para descobrir qual oferece melhor custo-benefício",
        content: `
# Galaxy S24 Ultra vs iPhone 15 Pro Max: O Confronto dos Gigantes

## Introdução

Em 2024, dois smartphones dominam o topo da categoria premium: o **Samsung Galaxy S24 Ultra** e o **iPhone 15 Pro Max**. Ambos representam o que há de mais avançado em tecnologia móvel, mas qual deles realmente vale a pena?

## Design e Construção

### Samsung Galaxy S24 Ultra
- Corpo em alumínio com traseira em vidro
- S Pen integrada
- Resistência IP68
- Dimensões: 162.3 x 79.0 x 8.6 mm

### iPhone 15 Pro Max  
- Corpo em titânio premium
- Conector USB-C (finalmente!)
- Resistência IP68
- Dimensões: 159.9 x 76.7 x 8.25 mm

## Performance

Ambos os dispositivos entregam performance excepcional, mas com abordagens diferentes:

- **Galaxy S24 Ultra**: Snapdragon 8 Gen 3 otimizado para Android
- **iPhone 15 Pro Max**: A17 Pro com arquitetura de 3nm

## Câmeras

### Galaxy S24 Ultra
- Sensor principal de 200MP
- Ultra-wide de 12MP
- Duas teleobjetivas (3x e 5x)
- Zoom espacial até 100x

### iPhone 15 Pro Max
- Sensor principal de 48MP
- Ultra-wide de 12MP
- Teleobjetiva de 12MP (5x)
- Modo Ação aprimorado

## Veredicto

O Galaxy S24 Ultra se destaca pela versatilidade da S Pen e zoom excepcional, enquanto o iPhone 15 Pro Max impressiona com build quality e ecossistema integrado.

**Para Android**: Galaxy S24 Ultra
**Para iOS**: iPhone 15 Pro Max

*Qual você escolheria? Deixe sua opinião nos comentários!*
        `,
        featuredImage: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=1200&h=600&fit=crop",
        metaTitle: "Galaxy S24 Ultra vs iPhone 15 Pro Max: Comparativo Completo 2024",
        metaDescription: "Análise detalhada dos melhores smartphones premium de 2024. Descubra qual é o melhor para você: Galaxy S24 Ultra ou iPhone 15 Pro Max.",
        status: "PUBLISHED",
        type: "COMPARISON",
        viewCount: 15420,
        likeCount: 892,
        isFeatured: true,
        publishedAt: new Date('2024-01-15'),
        authorId: "admin",
        categoryId: "1",
        subcategoryId: null,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
      },
      {
        id: "2",
        title: "Melhores Notebooks para Home Office em 2024: Guia Completo",
        slug: "melhores-notebooks-home-office-2024-guia-completo",
        excerpt: "Descubra os notebooks ideais para trabalhar em casa com máxima produtividade e conforto",
        content: `
# Os Melhores Notebooks para Home Office em 2024

## Por que escolher o notebook certo é crucial?

Com o home office se tornando cada vez mais comum, ter um notebook adequado às suas necessidades de trabalho é fundamental para manter a produtividade e evitar problemas de saúde.

## Top 5 Notebooks para Home Office

### 1. MacBook Air M3 (2024)
- **Processador**: Apple M3
- **RAM**: 8GB/16GB
- **Tela**: 13.6" Liquid Retina
- **Bateria**: Até 18 horas
- **Preço**: A partir de R$ 10.999

**Prós**: Performance excepcional, bateria duradoura, design premium
**Contras**: Preço elevado, limitações de conectividade

### 2. Dell XPS 13 Plus
- **Processador**: Intel Core i7-13700H
- **RAM**: 16GB LPDDR5
- **Tela**: 13.4" 4K OLED
- **Bateria**: Até 12 horas
- **Preço**: A partir de R$ 8.999

### 3. Lenovo ThinkPad X1 Carbon Gen 11
- **Processador**: Intel Core i7-1355U
- **RAM**: 16GB
- **Tela**: 14" 2.8K OLED
- **Bateria**: Até 16 horas
- **Preço**: A partir de R$ 12.999

## Critérios de Avaliação

1. **Performance**: Capacidade de executar tarefas do dia a dia
2. **Bateria**: Autonomia para um dia de trabalho
3. **Tela**: Qualidade e conforto visual
4. **Teclado**: Conforto para digitação prolongada
5. **Conectividade**: Portas e opções de conexão

## Recomendações por Perfil

### Para Escritório Geral
- **Recomendado**: MacBook Air M3
- **Alternativa**: Dell Inspiron 15 3000

### Para Design/Criação
- **Recomendado**: MacBook Pro 16" M3 Pro
- **Alternativa**: Dell XPS 15 OLED

### Para Programação
- **Recomendado**: ThinkPad X1 Carbon
- **Alternativa**: MacBook Pro 14" M3

## Conclusão

A escolha do notebook ideal depende do seu orçamento e necessidades específicas. Para a maioria dos usuários, o MacBook Air M3 oferece o melhor equilíbrio entre performance, bateria e qualidade de construção.

*Dúvidas? Deixe um comentário que responderemos!*
        `,
        featuredImage: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&h=600&fit=crop",
        metaTitle: "Melhores Notebooks Home Office 2024 - Guia de Compra Completo",
        metaDescription: "Guia definitivo com os melhores notebooks para home office em 2024. Análises, preços e recomendações para cada perfil de usuário.",
        status: "PUBLISHED",
        type: "REVIEW",
        viewCount: 8934,
        likeCount: 456,
        isFeatured: true,
        publishedAt: new Date('2024-01-10'),
        authorId: "admin",
        categoryId: "2",
        subcategoryId: null,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10'),
      }
    ];

    posts.forEach(post => this.posts.set(post.id, post));

    // Seed deals
    const deals = [
      {
        id: "1",
        title: "Galaxy S24 Ultra com 12% OFF + Frete Grátis",
        description: "Oferta imperdível do smartphone mais avançado da Samsung",
        productId: "1",
        originalPrice: "7999.00",
        dealPrice: "6999.00",
        discountPercent: 12.5,
        couponCode: "GALAXY12OFF",
        affiliateLink: "https://amazon.com.br/galaxy-s24-ultra-oferta",
        store: "Amazon",
        isActive: true,
        isFeatured: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        clickCount: 234,
        conversionCount: 18,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "2", 
        title: "iPhone 15 Pro Max - Desconto de R$ 1.000",
        description: "Menor preço histórico do iPhone 15 Pro Max",
        productId: "2",
        originalPrice: "9999.00",
        dealPrice: "8999.00",
        discountPercent: 10,
        couponCode: null,
        affiliateLink: "https://magazineluiza.com.br/iphone-15-pro-max-oferta",
        store: "Magazine Luiza",
        isActive: true,
        isFeatured: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        clickCount: 456,
        conversionCount: 28,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    deals.forEach(deal => this.deals.set(deal.id, deal));
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existingUser = this.users.get(userData.id);
    const user: User = {
      ...userData,
      createdAt: existingUser?.createdAt || new Date(),
      updatedAt: new Date(),
    };
    this.users.set(userData.id, user);
    return user;
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values()).sort((a, b) => a.sortOrder - b.sortOrder);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const id = generateId();
    const newCategory: Category = {
      id,
      ...category,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.categories.set(id, newCategory);
    return newCategory;
  }

  async updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category> {
    const existing = this.categories.get(id);
    if (!existing) throw new Error("Category not found");
    
    const updated: Category = {
      ...existing,
      ...category,
      updatedAt: new Date(),
    };
    this.categories.set(id, updated);
    return updated;
  }

  async deleteCategory(id: string): Promise<void> {
    this.categories.delete(id);
  }

  // Subcategories
  async getSubcategories(categoryId?: string): Promise<Subcategory[]> {
    const subcategories = Array.from(this.subcategories.values());
    return categoryId 
      ? subcategories.filter(sub => sub.categoryId === categoryId)
      : subcategories;
  }

  async createSubcategory(subcategory: InsertSubcategory): Promise<Subcategory> {
    const id = generateId();
    const newSubcategory: Subcategory = {
      id,
      ...subcategory,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.subcategories.set(id, newSubcategory);
    return newSubcategory;
  }

  // Tags
  async getTags(): Promise<Tag[]> {
    return Array.from(this.tags.values());
  }

  async createTag(tag: InsertTag): Promise<Tag> {
    const id = generateId();
    const newTag: Tag = {
      id,
      ...tag,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.tags.set(id, newTag);
    return newTag;
  }

  // Brands
  async getBrands(): Promise<Brand[]> {
    return Array.from(this.brands.values());
  }

  async createBrand(brand: InsertBrand): Promise<Brand> {
    const id = generateId();
    const newBrand: Brand = {
      id,
      ...brand,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.brands.set(id, newBrand);
    return newBrand;
  }

  // Products
  async getProducts(options: { categoryId?: string; featured?: boolean; limit?: number } = {}): Promise<Product[]> {
    let products = Array.from(this.products.values());
    
    if (options.categoryId) {
      products = products.filter(p => p.categoryId === options.categoryId);
    }
    
    if (options.featured) {
      products = products.filter(p => p.featured);
    }
    
    if (options.limit) {
      products = products.slice(0, options.limit);
    }
    
    return products.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = generateId();
    const newProduct: Product = {
      id,
      ...product,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.products.set(id, newProduct);
    return newProduct;
  }

  async updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product> {
    const existing = this.products.get(id);
    if (!existing) throw new Error("Product not found");
    
    const updated: Product = {
      ...existing,
      ...product,
      updatedAt: new Date(),
    };
    this.products.set(id, updated);
    return updated;
  }

  // Posts
  async getPosts(options: { status?: string; featured?: boolean; categoryId?: string; limit?: number } = {}): Promise<Post[]> {
    let posts = Array.from(this.posts.values());
    
    if (options.status) {
      posts = posts.filter(p => p.status === options.status);
    }
    
    if (options.featured) {
      posts = posts.filter(p => p.isFeatured);
    }
    
    if (options.categoryId) {
      posts = posts.filter(p => p.categoryId === options.categoryId);
    }
    
    if (options.limit) {
      posts = posts.slice(0, options.limit);
    }
    
    return posts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getPost(slug: string): Promise<Post | undefined> {
    return Array.from(this.posts.values()).find(p => p.slug === slug);
  }

  async getPostById(id: string): Promise<Post | undefined> {
    return this.posts.get(id);
  }

  async createPost(post: InsertPost): Promise<Post> {
    const id = generateId();
    const newPost: Post = {
      id,
      ...post,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.posts.set(id, newPost);
    return newPost;
  }

  async updatePost(id: string, post: Partial<InsertPost>): Promise<Post> {
    const existing = this.posts.get(id);
    if (!existing) throw new Error("Post not found");
    
    const updated: Post = {
      ...existing,
      ...post,
      updatedAt: new Date(),
    };
    this.posts.set(id, updated);
    return updated;
  }

  async incrementPostViews(id: string): Promise<void> {
    const post = this.posts.get(id);
    if (post) {
      post.viewCount += 1;
      this.posts.set(id, post);
    }
  }

  // Post Products
  async getPostProducts(postId: string): Promise<PostProduct[]> {
    return Array.from(this.postProducts.values()).filter(pp => pp.postId === postId);
  }

  async createPostProduct(postProduct: InsertPostProduct): Promise<PostProduct> {
    const id = generateId();
    const newPostProduct: PostProduct = {
      id,
      ...postProduct,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.postProducts.set(id, newPostProduct);
    return newPostProduct;
  }

  // Deals
  async getDeals(options: { featured?: boolean; active?: boolean; limit?: number } = {}): Promise<Deal[]> {
    let deals = Array.from(this.deals.values());
    
    if (options.active) {
      const now = new Date();
      deals = deals.filter(d => d.isActive && (!d.endDate || d.endDate > now));
    }
    
    if (options.featured) {
      deals = deals.filter(d => d.isFeatured);
    }
    
    if (options.limit) {
      deals = deals.slice(0, options.limit);
    }
    
    return deals.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getDeal(id: string): Promise<Deal | undefined> {
    return this.deals.get(id);
  }

  async createDeal(deal: InsertDeal): Promise<Deal> {
    const id = generateId();
    const newDeal: Deal = {
      id,
      ...deal,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.deals.set(id, newDeal);
    return newDeal;
  }

  async updateDeal(id: string, deal: Partial<InsertDeal>): Promise<Deal> {
    const existing = this.deals.get(id);
    if (!existing) throw new Error("Deal not found");
    
    const updated: Deal = {
      ...existing,
      ...deal,
      updatedAt: new Date(),
    };
    this.deals.set(id, updated);
    return updated;
  }

  // Comments
  async getComments(postId: string): Promise<Comment[]> {
    return Array.from(this.comments.values())
      .filter(c => c.postId === postId && c.status === "APPROVED")
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  async getPendingComments(): Promise<Comment[]> {
    return Array.from(this.comments.values())
      .filter(c => c.status === "PENDING")
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  async createComment(comment: InsertComment): Promise<Comment> {
    const id = generateId();
    const newComment: Comment = {
      id,
      ...comment,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.comments.set(id, newComment);
    return newComment;
  }

  async updateComment(id: string, comment: Partial<InsertComment>): Promise<Comment> {
    const existing = this.comments.get(id);
    if (!existing) throw new Error("Comment not found");
    
    const updated: Comment = {
      ...existing,
      ...comment,
      updatedAt: new Date(),
    };
    this.comments.set(id, updated);
    return updated;
  }

  // Newsletter
  async subscribeNewsletter(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber> {
    const id = generateId();
    const newSubscriber: NewsletterSubscriber = {
      id,
      ...subscriber,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.newsletterSubscribers.set(id, newSubscriber);
    return newSubscriber;
  }

  async getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
    return Array.from(this.newsletterSubscribers.values());
  }

  // Analytics
  async trackAffiliateClick(click: InsertAffiliateClick): Promise<AffiliateClick> {
    const id = generateId();
    const newClick: AffiliateClick = {
      id,
      ...click,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.affiliateClicks.set(id, newClick);
    return newClick;
  }

  async getAffiliateClicks(options: { productId?: string; dealId?: string; postId?: string } = {}): Promise<AffiliateClick[]> {
    let clicks = Array.from(this.affiliateClicks.values());
    
    if (options.productId) {
      clicks = clicks.filter(c => c.productId === options.productId);
    }
    
    if (options.dealId) {
      clicks = clicks.filter(c => c.dealId === options.dealId);
    }
    
    if (options.postId) {
      clicks = clicks.filter(c => c.postId === options.postId);
    }
    
    return clicks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}

export const storage = new MemoryStorage();