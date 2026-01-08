# Dahua Dubai - Official Dahua Authorized Dealer Website

A modern, full-stack e-commerce website for Dahua security products built with Next.js 16, Supabase, and Tailwind CSS.

## 🚀 Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase (PostgreSQL)
- **Authentication**: JWT with session tracking
- **Image Storage**: Cloudinary
- **Deployment**: Docker, Docker Compose

## 📋 Prerequisites

- Node.js 20+
- Docker & Docker Compose (for production)
- Supabase account
- Cloudinary account

## 🛠️ Installation

### Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/muynuddinr/dahua-dubai.com.git
   cd dahua-dubai.com
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your credentials.

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open browser**
   ```
   https://dahua-dubai.com
   ```

### Production (Docker)

1. **Set up production environment**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your production credentials.

2. **Build and run with Docker Compose**
   ```bash
   docker-compose up -d --build
   ```

3. **Access the application**
   ```
   https://dahua-dubai.com
   ```

## 📁 Project Structure

```
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   │   ├── admin/        # Admin CRUD (JWT protected)
│   │   │   ├── category/     # Public category API
│   │   │   ├── product/      # Public product API
│   │   │   └── health/       # Health check endpoint
│   │   ├── admin/            # Admin dashboard
│   │   ├── product/          # Product pages
│   │   └── components/       # Shared components
│   ├── lib/
│   │   ├── auth.ts           # JWT authentication helper
│   │   ├── supabase.ts       # Supabase client
│   │   └── cloudinary.ts     # Cloudinary config
│   └── middleware.ts         # Next.js middleware
├── public/                   # Static assets
├── scripts/                  # Database scripts
├── Dockerfile               # Production Docker image
├── docker-compose.yml       # Docker Compose config
└── next.config.ts           # Next.js configuration
```

## 🔐 Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Public API URL |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `ADMIN_EMAIL` | Admin login email |
| `ADMIN_PASSWORD` | Admin login password |
| `JWT_SECRET` | JWT signing secret (min 32 chars) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

## 🗄️ Database Setup

Run these SQL scripts in Supabase SQL Editor (in order):

1. `scripts/supabase-schema.sql` - Main database schema
2. `scripts/admin-sessions-table.sql` - Admin sessions table

## 🔒 Security Features

- JWT authentication for admin routes
- Session tracking in database
- Rate limiting ready
- Security headers configured
- Non-root Docker user
- Environment variables protection

## 📝 API Endpoints

### Public (No Auth)
- `GET /api/navbar-category` - List navbar categories
- `GET /api/category` - List categories
- `GET /api/sub-category` - List sub-categories
- `GET /api/product` - List products
- `GET /api/products` - List products (with featured filter)
- `GET /api/seo` - Get SEO metadata
- `GET /api/health` - Health check

### Admin (JWT Required)
- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout
- `GET /api/admin/verify` - Verify token
- `CRUD /api/admin/navbar-categories`
- `CRUD /api/admin/categories`
- `CRUD /api/admin/sub-categories`
- `CRUD /api/admin/products`

## 🐳 Docker Commands

```bash
# Build and start
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop
docker-compose down

# Rebuild without cache
docker-compose build --no-cache

# Check health
curl https://dahua-dubai.com/api/health
```

## 📈 Production Checklist

- [ ] Set strong `JWT_SECRET` (min 32 characters)
- [ ] Set secure `ADMIN_PASSWORD`
- [ ] Configure Supabase RLS policies if needed
- [ ] Set up SSL/TLS (use reverse proxy like Nginx)
- [ ] Configure domain DNS
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software for Dahua Dubai.

## 📞 Support

For support, email sales@dahua-dubai.com
