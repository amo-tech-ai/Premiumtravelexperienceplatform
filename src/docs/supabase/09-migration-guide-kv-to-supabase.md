# MIGRATION GUIDE - KV TO SUPABASE
## Complete Migration Procedure

**Document:** 09-migration-guide-kv-to-supabase.md  
**Last Updated:** December 22, 2024  
**Status:** Implementation guide

---

## 🎯 MIGRATION OVERVIEW

### From: KV Store Pattern
```typescript
// Old approach
await kv.set('trips:user123:trip456', tripData);
const trip = await kv.get('trips:user123:trip456');
```

### To: Supabase PostgreSQL
```typescript
// New approach
const { data } = await supabase
  .from('trips')
  .insert(tripData);
```

---

## 📊 MIGRATION STEPS

### Step 1: Export KV Data
```typescript
// Export all trips
const tripsKeys = await kv.getByPrefix('trips:');
const trips = await Promise.all(
  tripsKeys.map(key => kv.get(key))
);

// Save to JSON
await Deno.writeTextFile('backup-trips.json', JSON.stringify(trips));
```

### Step 2: Transform Data
```typescript
// Transform KV format to SQL format
const sqlTrips = trips.map(trip => ({
  id: trip.id,
  user_id: trip.user_id,
  title: trip.title,
  destination: trip.destination,
  start_date: trip.start_date,
  end_date: trip.end_date,
  created_at: trip.created_at || new Date().toISOString(),
  updated_at: new Date().toISOString()
}));
```

### Step 3: Import to PostgreSQL
```sql
-- Batch insert
INSERT INTO trips (id, user_id, title, destination, start_date, end_date, created_at, updated_at)
VALUES 
  ('uuid1', 'user1', 'Paris Trip', 'Paris', '2024-06-01', '2024-06-07', NOW(), NOW()),
  ('uuid2', 'user2', 'Tokyo Adventure', 'Tokyo', '2024-07-15', '2024-07-22', NOW(), NOW());
```

### Step 4: Verify Migration
```typescript
// Count records
const kvCount = (await kv.getByPrefix('trips:')).length;
const { count: sqlCount } = await supabase
  .from('trips')
  .select('*', { count: 'exact', head: true });

console.log('KV:', kvCount, 'SQL:', sqlCount);
// Should match!
```

---

## 🔄 ROLLBACK PROCEDURE

### If Migration Fails
```typescript
// 1. Restore from backup
const backup = JSON.parse(
  await Deno.readTextFile('backup-trips.json')
);

// 2. Re-insert to KV
for (const trip of backup) {
  await kv.set(`trips:${trip.user_id}:${trip.id}`, trip);
}

// 3. Clear PostgreSQL (if needed)
await supabase.from('trips').delete().neq('id', '');
```

---

## ⚠️ COMMON ISSUES

### Issue 1: Date Format Mismatch
```typescript
// KV uses ISO strings
kv_date: "2024-06-01T00:00:00.000Z"

// PostgreSQL expects DATE type
sql_date: "2024-06-01"

// Fix: Strip time component
const date = new Date(kv_date).toISOString().split('T')[0];
```

### Issue 2: Missing Fields
```typescript
// Some KV records may lack fields
// Add defaults during transformation
const sqlRecord = {
  ...kvRecord,
  created_at: kvRecord.created_at || new Date().toISOString(),
  status: kvRecord.status || 'draft'
};
```

### Issue 3: Foreign Key Constraints
```sql
-- Disable temporarily if needed
ALTER TABLE trip_items DISABLE TRIGGER ALL;

-- Re-enable after migration
ALTER TABLE trip_items ENABLE TRIGGER ALL;
```

---

## 📋 MIGRATION CHECKLIST

### Pre-Migration
- [ ] Backup all KV data
- [ ] Test migration in dev environment
- [ ] Document current data counts
- [ ] Prepare rollback scripts
- [ ] Schedule maintenance window
- [ ] Notify users

### During Migration
- [ ] Enable maintenance mode
- [ ] Export KV data
- [ ] Transform data format
- [ ] Import to PostgreSQL
- [ ] Verify data integrity
- [ ] Test CRUD operations
- [ ] Check RLS policies

### Post-Migration
- [ ] Compare data counts
- [ ] Test all features
- [ ] Monitor performance
- [ ] Collect user feedback
- [ ] Keep KV backup for 30 days
- [ ] Document lessons learned

---

**Document Location:** `/docs/supabase/09-migration-guide-kv-to-supabase.md`  
**Previous Location:** `/docs/MIGRATION-GUIDE-KV-TO-SUPABASE.md`  
**Status:** Ready for implementation
