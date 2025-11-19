# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Option 1: Docker (Recommended)

```bash
# 1. Start all services
docker-compose up -d

# 2. Wait for services to be healthy (30 seconds)
docker-compose ps

# 3. Run migrations
docker-compose exec api npx prisma migrate deploy

# 4. Seed database
docker-compose exec api npx ts-node prisma/seed.ts

# 5. Access the API
# API: http://localhost:3000/api
# Swagger: http://localhost:3000/api/docs
```

### Option 2: Local Development

```bash
# 1. Install dependencies
npm install

# 2. Setup PostgreSQL and Redis
# Make sure PostgreSQL is running on port 5432
# Make sure Redis is running on port 6379

# 3. Configure environment
cp .env.example .env
# Edit .env with your database credentials

# 4. Run migrations
npx prisma migrate dev

# 5. Seed database
npm run prisma:seed

# 6. Start development server
npm run start:dev

# 7. Access the API
# API: http://localhost:3000/api
# Swagger: http://localhost:3000/api/docs
```

## 🔑 Default Login Credentials

After seeding:

**Admin User:**
- Username: `admin`
- Password: `admin123`

**Sales Representative:**
- Username: `sr1`
- Password: `sr123`

## 📝 Test the API

### 1. Login (Get JWT Token)

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "name": "Admin User",
    "role": "ADMIN"
  }
}
```

### 2. Get Retailers (as Sales Rep)

```bash
# Login as SR first
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"sr1","password":"sr123"}'

# Use the token from response
curl -X GET "http://localhost:3000/api/retailers?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 3. Update Retailer

```bash
curl -X PATCH http://localhost:3000/api/retailers/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"points":200,"routes":"Route A","notes":"Updated via API"}'
```

### 4. Create Master Data (Admin Only)

```bash
# Login as admin first
curl -X POST http://localhost:3000/api/admin/master-data/regions \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"name":"Rajshahi"}'
```

### 5. Assign Retailers to SR (Admin Only)

```bash
curl -X POST http://localhost:3000/api/admin/retailer-management/assign \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"salesRepId":2,"retailerIds":[6,7,8,9,10]}'
```

## 📚 API Documentation

Visit **http://localhost:3000/api/docs** for interactive Swagger documentation.

You can also import `postman-collection.json` into Postman for a complete API collection.

## 🧪 Run Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:cov

# Run specific test
npm test -- auth.service.spec.ts
```

## 🛠️ Common Commands

```bash
# Generate Prisma client
npm run prisma:generate

# Create new migration
npx prisma migrate dev --name migration_name

# View database in Prisma Studio
npx prisma studio

# Format code
npm run format

# Lint code
npm run lint

# Build for production
npm run build

# Start production server
npm run start:prod
```

## 📦 Import Retailers from CSV

1. Prepare CSV file (see `prisma/sample-retailers.csv` for format)
2. Login as admin and get token
3. Upload CSV:

```bash
curl -X POST http://localhost:3000/api/admin/retailer-management/import-csv \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE" \
  -F "file=@path/to/retailers.csv"
```

## 🐛 Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env
- Verify database exists: `createdb retailer_sales`

### Redis Connection Error
- Ensure Redis is running: `redis-cli ping`
- Check REDIS_HOST and REDIS_PORT in .env

### Port Already in Use
- Change PORT in .env
- Or kill process: `lsof -ti:3000 | xargs kill` (Mac/Linux)

### Migration Errors
- Reset database: `npx prisma migrate reset`
- This will drop all data and re-run migrations

## 📊 Database Schema

View the complete schema in `prisma/schema.prisma`

Key tables:
- `regions` - Geographic regions
- `areas` - Areas within regions
- `distributors` - Product distributors
- `territories` - Sales territories
- `retailers` - Retailer information
- `sales_reps` - Sales representatives
- `sales_rep_retailers` - Assignment mapping

## 🔒 Security Notes

- Change JWT_SECRET in production
- Use strong passwords
- Enable HTTPS in production
- Set up rate limiting
- Configure CORS properly

## 📈 Performance Tips

- Redis caching is enabled by default
- Master data cached for 1 hour
- Retailer lists cached for 60 seconds
- Use pagination for large datasets
- Indexes are optimized for common queries

## 🎯 Next Steps

1. Customize business logic in services
2. Add more validation rules
3. Implement additional features
4. Set up CI/CD pipeline
5. Deploy to production

## 📞 Support

For issues or questions, check:
- README.md for detailed documentation
- SCALING.md for scaling strategies
- Swagger docs for API reference
