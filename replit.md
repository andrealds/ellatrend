# TecReview - Technology Review Platform

## Overview

TecReview is a full-stack web application for technology product reviews, comparisons, and deals. Built with React (frontend) and Express.js (backend), it features content management capabilities, affiliate marketing integration, and user authentication through Replit Auth.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with Shadcn/ui component library
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: Express sessions with PostgreSQL store
- **Authentication**: Replit Auth (OpenID Connect)

### Database Design
The application uses a comprehensive schema supporting:
- **User Management**: Users with role-based access (ADMIN, EDITOR, AUTHOR)
- **Content Structure**: Categories, subcategories, tags, and hierarchical content organization
- **Product Catalog**: Brands, products with specifications and affiliate links
- **Content Management**: Posts (reviews/comparisons), comments, and engagement metrics
- **E-commerce Features**: Deals, affiliate click tracking, and pricing data
- **Marketing**: Newsletter subscriptions with preference management

## Key Components

### Authentication System
- Replit Auth integration with OpenID Connect
- Session-based authentication with PostgreSQL storage
- Role-based access control for admin features
- Automatic login redirect for authenticated users

### Content Management
- Rich text post creation and editing
- Category and tag management
- Featured content promotion
- SEO optimization with meta tags
- Image handling for featured content

### Product Management
- Product catalog with specifications
- Brand management and categorization
- Affiliate link management for monetization
- Price tracking and comparison features

### Deal System
- Time-limited deals with expiration tracking
- Featured deal promotion
- Affiliate click tracking for analytics
- Store-based deal organization

## Data Flow

1. **User Authentication**: Users authenticate via Replit Auth, sessions stored in PostgreSQL
2. **Content Serving**: Posts and products fetched via REST API with query-based filtering
3. **Admin Operations**: Authenticated users can create/edit content through admin interface
4. **Affiliate Tracking**: Click events tracked when users interact with affiliate links
5. **Newsletter Management**: User subscriptions and preferences managed separately

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity
- **drizzle-orm**: Type-safe database ORM with PostgreSQL dialect
- **@tanstack/react-query**: Server state management and caching
- **@radix-ui/**: Comprehensive UI component library
- **tailwindcss**: Utility-first CSS framework

### Development Tools
- **vite**: Fast build tool with HMR support
- **tsx**: TypeScript execution for development
- **esbuild**: Production bundling for server code

### Replit Integrations
- **@replit/vite-plugin-runtime-error-modal**: Development error handling
- **@replit/vite-plugin-cartographer**: Development tooling integration

## Deployment Strategy

### Development Environment
- Uses Vite dev server with Express backend
- Hot module replacement for frontend changes
- TypeScript compilation via tsx for server development
- PostgreSQL database provisioned through Replit

### Production Build Process
1. Frontend built with Vite to `dist/public`
2. Backend bundled with esbuild to `dist/index.js`
3. Static assets served from Express in production
4. Database migrations handled via Drizzle Kit

### Replit Configuration
- Autoscale deployment target
- Port 5000 mapped to external port 80
- PostgreSQL 16 and Node.js 20 modules enabled
- Environment variables for database and session management

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- June 13, 2025. Initial setup