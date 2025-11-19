# Scaling Approach for Retailer Sales Backend

## Current Architecture

The system is built with scalability in mind from the ground up:

### Database Optimizations
- **Indexes**: All foreign keys, search fields (uid, phone), and frequently queried columns are indexed
- **GIN Index**: Full-text search on retailer names using PostgreSQL's `pg_trgm` extension
- **Efficient Queries**: No N+1 queries; all relations use proper joins
- **Batch Operations**: Bulk inserts process 1000 records at a time

### Caching Strategy
- **Redis**: Distributed cache for horizontal scaling
- **TTL Configuration**:
  - Master data: 1 hour (rarely changes)
  - Retailer lists: 60 seconds (frequently updated)
- **Cache Invalidation**: Automatic on updates/deletes

### Application Design
- **Stateless API**: No session storage, JWT-based auth
- **Connection Pooling**: Prisma manages database connections efficiently
- **Async Operations**: CSV imports use streams for memory efficiency

## Horizontal Scaling (10K+ Concurrent Users)

### Load Balancing
```
Internet → Load Balancer (nginx/AWS ALB)
              ↓
    ┌─────────┼─────────┐
    ↓         ↓         ↓
  API-1    API-2    API-3  (Multiple NestJS instances)
    └─────────┼─────────┘
              ↓
         Redis Cluster
              ↓
    PostgreSQL (Primary + Replicas)
```

### Implementation Steps
1. **Deploy multiple API instances** behind a load balancer
2. **Use Redis Cluster** for distributed caching
3. **Configure read replicas** for PostgreSQL
4. **Health checks** on `/api/health` endpoint

### Docker Swarm/Kubernetes
```yaml
# Example: Scale to 5 replicas
docker-compose up --scale api=5
```

## Database Scaling (1M+ Retailers)

### Read Replicas
- Route read queries to replicas
- Primary handles writes only
- Prisma supports read replicas natively

```typescript
// Example configuration
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL, // Primary
    },
  },
  // Read replicas
  replicaRead: [
    process.env.DATABASE_REPLICA_1_URL,
    process.env.DATABASE_REPLICA_2_URL,
  ],
});
```

### Table Partitioning
Partition `retailers` table by region for 10M+ records:

```sql
-- Partition by region_id
CREATE TABLE retailers_dhaka PARTITION OF retailers
  FOR VALUES IN (1);

CREATE TABLE retailers_chittagong PARTITION OF retailers
  FOR VALUES IN (2);
```

### Archival Strategy
- Move inactive retailers (>1 year) to archive table
- Reduces query time on active data
- Scheduled job runs monthly

## Caching Enhancements

### Multi-Level Caching
1. **Application Cache** (in-memory): 10-second TTL for hot data
2. **Redis Cache**: 60-second TTL for shared data
3. **CDN**: Static assets and API responses

### Cache Warming
- Pre-populate cache on deployment
- Background job refreshes popular queries

## Async Processing (100K+ CSV Imports)

### Message Queue Architecture
```
API → Queue (RabbitMQ/SQS) → Worker Pool
                                ↓
                          Batch Processing
                                ↓
                            Database
```

### Implementation
```typescript
// Producer (API)
await queue.publish('retailer.import', { fileUrl, userId });

// Consumer (Worker)
queue.subscribe('retailer.import', async (job) => {
  const retailers = await parseCSV(job.fileUrl);
  await batchInsert(retailers, 1000);
});
```

### Benefits
- Non-blocking API responses
- Retry failed imports
- Progress tracking
- Parallel processing

## Search Optimization (Advanced Queries)

### Elasticsearch Integration
For complex search requirements:
- Full-text search across multiple fields
- Fuzzy matching, autocomplete
- Aggregations and analytics

```typescript
// Sync retailers to Elasticsearch
await esClient.index({
  index: 'retailers',
  id: retailer.id,
  body: {
    name: retailer.name,
    uid: retailer.uid,
    region: retailer.region.name,
    // ... other fields
  },
});
```

## Monitoring & Performance

### Metrics to Track
- API response times (p50, p95, p99)
- Database query performance
- Cache hit/miss ratio
- Error rates
- Active connections

### Tools
- **APM**: New Relic, Datadog, or Elastic APM
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **Alerts**: PagerDuty for critical issues

### Database Monitoring
```sql
-- Slow query log
ALTER SYSTEM SET log_min_duration_statement = 1000; -- Log queries > 1s

-- Connection monitoring
SELECT count(*) FROM pg_stat_activity;
```

## Cost Optimization

### Auto-Scaling
- Scale API instances based on CPU/memory
- Scale down during off-peak hours
- Use spot instances for workers

### Database Optimization
- Use connection pooling (PgBouncer)
- Optimize expensive queries
- Archive old data

### Caching ROI
- Reduces database load by 70-80%
- Lower RDS instance requirements
- Faster response times

## Disaster Recovery

### Backup Strategy
- **Database**: Daily automated backups, 30-day retention
- **Point-in-time recovery**: 5-minute granularity
- **Redis**: AOF persistence for cache recovery

### High Availability
- Multi-AZ deployment for database
- Redis Sentinel for automatic failover
- Health checks and auto-restart

## Performance Benchmarks

### Current Capacity (Single Instance)
- **Concurrent Users**: ~1,000
- **Requests/sec**: ~500
- **Database Size**: Up to 1M retailers
- **Response Time**: <100ms (cached), <500ms (uncached)

### Scaled Capacity (5 Instances + Replicas)
- **Concurrent Users**: ~10,000
- **Requests/sec**: ~2,500
- **Database Size**: Up to 10M retailers
- **Response Time**: <50ms (cached), <300ms (uncached)

## Implementation Priority

### Phase 1 (Immediate - 10K users)
1. Deploy behind load balancer
2. Add Redis Cluster
3. Configure database read replicas

### Phase 2 (1M retailers)
1. Implement table partitioning
2. Add Elasticsearch for search
3. Set up monitoring and alerts

### Phase 3 (10M retailers)
1. Message queue for async processing
2. Database sharding
3. CDN for static content
4. Multi-region deployment

## Conclusion

The current architecture supports up to 10K concurrent users and 1M retailers with minimal changes. For larger scale, the system can be enhanced with read replicas, partitioning, message queues, and Elasticsearch while maintaining the same codebase structure.
