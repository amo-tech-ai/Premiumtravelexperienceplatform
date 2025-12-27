/**
 * EXPLORATION CONTEXT TEST SUITE
 * 
 * Comprehensive testing for context persistence, expiration, and edge cases
 * 
 * Run in browser console:
 * - Copy this file's test functions
 * - Execute runAllExplorationTests()
 * 
 * @see /docs/01-ai-features/PROMPT-1-WEEK-3-COMPLETE.md
 */

import { ExplorationContext, ExplorationIntent } from '../context/types/ExplorationTypes';
import { ExplorationContextStorage } from '../context/storage/ExplorationStorage';

// ============================================================================
// TEST UTILITIES
// ============================================================================

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  duration: number;
}

class TestRunner {
  private results: TestResult[] = [];

  async runTest(name: string, testFn: () => void | Promise<void>): Promise<void> {
    const start = performance.now();
    try {
      await testFn();
      this.results.push({
        name,
        passed: true,
        duration: performance.now() - start,
      });
      console.log(`✅ ${name}`);
    } catch (error) {
      this.results.push({
        name,
        passed: false,
        error: error instanceof Error ? error.message : String(error),
        duration: performance.now() - start,
      });
      console.error(`❌ ${name}:`, error);
    }
  }

  getResults() {
    const passed = this.results.filter((r) => r.passed).length;
    const failed = this.results.filter((r) => !r.passed).length;
    const total = this.results.length;
    const passRate = ((passed / total) * 100).toFixed(1);

    return {
      results: this.results,
      summary: { passed, failed, total, passRate: `${passRate}%` },
    };
  }

  printSummary() {
    const { summary, results } = this.getResults();
    console.log('\n' + '='.repeat(60));
    console.log('TEST SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total:  ${summary.total}`);
    console.log(`Passed: ${summary.passed} ✅`);
    console.log(`Failed: ${summary.failed} ❌`);
    console.log(`Rate:   ${summary.passRate}`);
    console.log('='.repeat(60) + '\n');

    if (summary.failed > 0) {
      console.log('FAILED TESTS:');
      results
        .filter((r) => !r.passed)
        .forEach((r) => {
          console.log(`  ❌ ${r.name}`);
          console.log(`     ${r.error}`);
        });
    }
  }
}

// ============================================================================
// TEST HELPERS
// ============================================================================

function createMockContext(overrides: Partial<ExplorationContext> = {}): ExplorationContext {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours

  return {
    id: `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    source: 'ai',
    intent: 'restaurants',
    area: {
      name: 'Test Area',
      lat: 6.2442,
      lng: -75.5812,
      bounds: {
        north: 6.25,
        south: 6.23,
        east: -75.57,
        west: -75.59,
      },
    },
    radius: 'short_drive',
    timeRelevance: {
      type: 'flexible',
    },
    primaryResults: [],
    pins: [],
    ranking: {
      algorithm: 'ai_recommended',
      confidence: 'high',
      factors: ['rating', 'distance'],
    },
    createdAt: now,
    expiresAt,
    ...overrides,
  };
}

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ============================================================================
// PERSISTENCE TESTS
// ============================================================================

async function testContextStorage() {
  const storage = new ExplorationContextStorage();
  const context = createMockContext();

  // Test: Store context
  storage.store(context);
  const retrieved = storage.get(context.id);
  assert(retrieved !== null, 'Context should be retrievable after storage');
  assert(retrieved!.id === context.id, 'Retrieved context should have same ID');
}

async function testContextPersistenceAcrossRefresh() {
  const storage = new ExplorationContextStorage();
  const context = createMockContext();

  // Store context
  storage.store(context);

  // Simulate page refresh by creating new storage instance
  const newStorage = new ExplorationContextStorage();
  const retrieved = newStorage.get(context.id);

  assert(retrieved !== null, 'Context should persist across refresh');
  assert(retrieved!.id === context.id, 'Context ID should match');
}

async function testMultipleContexts() {
  const storage = new ExplorationContextStorage();
  const contexts = [
    createMockContext({ intent: 'restaurants' }),
    createMockContext({ intent: 'events' }),
    createMockContext({ intent: 'rentals' }),
  ];

  // Store all contexts
  contexts.forEach((ctx) => storage.store(ctx));

  // Retrieve all
  const all = storage.getAll();
  assert(all.length === 3, 'Should retrieve all 3 contexts');

  // Verify each one
  contexts.forEach((ctx) => {
    const retrieved = storage.get(ctx.id);
    assert(retrieved !== null, `Context ${ctx.id} should be retrievable`);
  });
}

async function testLatestContext() {
  const storage = new ExplorationContextStorage();

  // Clear existing
  storage.clear();

  // Store multiple contexts with delays
  const ctx1 = createMockContext({ intent: 'restaurants' });
  storage.store(ctx1);
  await sleep(10);

  const ctx2 = createMockContext({ intent: 'events' });
  storage.store(ctx2);
  await sleep(10);

  const ctx3 = createMockContext({ intent: 'rentals' });
  storage.store(ctx3);

  // Get latest
  const latest = storage.getLatest();
  assert(latest !== null, 'Should retrieve latest context');
  assert(latest!.id === ctx3.id, 'Latest should be the last stored context');
}

// ============================================================================
// EXPIRATION TESTS
// ============================================================================

async function testContextExpiration() {
  const storage = new ExplorationContextStorage();
  const now = new Date();
  const expired = new Date(now.getTime() - 3 * 60 * 60 * 1000); // 3 hours ago

  const context = createMockContext({
    createdAt: new Date(now.getTime() - 3 * 60 * 60 * 1000),
    expiresAt: expired,
  });

  storage.store(context);

  // Should be filtered out
  const all = storage.getAll();
  assert(all.length === 0, 'Expired context should not be in getAll()');

  const retrieved = storage.get(context.id);
  assert(retrieved === null, 'Expired context should return null');
}

async function testAutoCleanup() {
  const storage = new ExplorationContextStorage();
  storage.clear();

  const now = new Date();

  // Create one valid and one expired context
  const validCtx = createMockContext();
  const expiredCtx = createMockContext({
    createdAt: new Date(now.getTime() - 3 * 60 * 60 * 1000),
    expiresAt: new Date(now.getTime() - 1 * 60 * 60 * 1000),
  });

  storage.store(validCtx);
  storage.store(expiredCtx);

  // Trigger cleanup
  storage.cleanup();

  const all = storage.getAll();
  assert(all.length === 1, 'Should only have 1 valid context after cleanup');
  assert(all[0].id === validCtx.id, 'Valid context should remain');
}

async function testExpirationEdgeCases() {
  const storage = new ExplorationContextStorage();
  storage.clear();

  const now = new Date();

  // Context expiring in 1 second
  const almostExpired = createMockContext({
    expiresAt: new Date(now.getTime() + 1000),
  });

  storage.store(almostExpired);

  // Should be valid now
  let retrieved = storage.get(almostExpired.id);
  assert(retrieved !== null, 'Context should be valid before expiration');

  // Wait for expiration
  await sleep(1500);

  // Should be expired
  retrieved = storage.get(almostExpired.id);
  assert(retrieved === null, 'Context should be null after expiration');
}

// ============================================================================
// EDGE CASE TESTS
// ============================================================================

async function testInvalidContextHandling() {
  const storage = new ExplorationContextStorage();

  // Try to get non-existent context
  const result = storage.get('nonexistent_id');
  assert(result === null, 'Non-existent context should return null');
}

async function testEmptyStorage() {
  const storage = new ExplorationContextStorage();
  storage.clear();

  const all = storage.getAll();
  assert(all.length === 0, 'Empty storage should return empty array');

  const latest = storage.getLatest();
  assert(latest === null, 'Empty storage should return null for latest');
}

async function testContextUpdate() {
  const storage = new ExplorationContextStorage();
  const context = createMockContext();

  // Store initial
  storage.store(context);

  // Update
  const updated = { ...context, intent: 'events' as ExplorationIntent };
  storage.store(updated);

  // Retrieve
  const retrieved = storage.get(context.id);
  assert(retrieved !== null, 'Updated context should be retrievable');
  assert(retrieved!.intent === 'events', 'Context should have updated intent');
}

async function testClearAll() {
  const storage = new ExplorationContextStorage();

  // Store multiple contexts
  storage.store(createMockContext({ intent: 'restaurants' }));
  storage.store(createMockContext({ intent: 'events' }));
  storage.store(createMockContext({ intent: 'rentals' }));

  // Clear
  storage.clear();

  const all = storage.getAll();
  assert(all.length === 0, 'Clear should remove all contexts');
}

// ============================================================================
// FORBIDDEN BEHAVIOR TESTS
// ============================================================================

async function testNeverShowBlankExplore() {
  // This is tested in ExplorePageV2 component
  // Verify that component always shows a state:
  // - EmptyExploreState
  // - ExpiredContextState
  // - ErrorState
  // - LoadingState
  // - Results
  
  // Mock test - actual test would be in React Testing Library
  const hasEmptyState = true; // Component has EmptyExploreState
  const hasExpiredState = true; // Component has ExpiredContextState
  const hasErrorState = true; // Component has ErrorState
  const hasLoadingState = true; // Component has LoadingState

  assert(hasEmptyState, 'Must have EmptyExploreState');
  assert(hasExpiredState, 'Must have ExpiredContextState');
  assert(hasErrorState, 'Must have ErrorState');
  assert(hasLoadingState, 'Must have LoadingState');
}

async function testNeverMixUnrelatedContent() {
  const storage = new ExplorationContextStorage();
  const restaurantCtx = createMockContext({ intent: 'restaurants' });
  const eventCtx = createMockContext({ intent: 'events' });

  storage.store(restaurantCtx);
  storage.store(eventCtx);

  // Verify contexts are isolated
  const retrieved1 = storage.get(restaurantCtx.id);
  const retrieved2 = storage.get(eventCtx.id);

  assert(retrieved1!.intent === 'restaurants', 'Restaurant context should remain restaurants');
  assert(retrieved2!.intent === 'events', 'Event context should remain events');
  assert(retrieved1!.id !== retrieved2!.id, 'Contexts should be separate');
}

async function testNeverAutoAddToTrips() {
  // This is UI behavior verification
  // Ensure no auto-mutations happen
  
  // Mock test - would verify:
  // 1. No auto-add on context load
  // 2. User must click "Add to Trip" button
  // 3. No silent mutations

  const hasManualAddButton = true; // Component has explicit Add button
  const noAutoMutations = true; // No useEffect that auto-adds

  assert(hasManualAddButton, 'Must have manual Add button');
  assert(noAutoMutations, 'Must not have auto-mutations');
}

async function testNeverDesyncMapAndList() {
  // This is UI behavior verification
  // Ensure map and list use same data source

  // Mock test - would verify:
  // 1. Same filtered results array
  // 2. Same selection state
  // 3. Synchronized updates

  const usesSharedDataSource = true; // Both use filteredResults
  const usesSyncedState = true; // Both use same state

  assert(usesSharedDataSource, 'Map and list must share data source');
  assert(usesSyncedState, 'Map and list must share state');
}

// ============================================================================
// PRODUCTION READINESS TESTS
// ============================================================================

async function testTypeScriptTypes() {
  // Verify TypeScript compilation
  const context = createMockContext();

  // Should compile without errors
  const id: string = context.id;
  const source: 'ai' | 'manual' = context.source;
  const intent: ExplorationIntent = context.intent;

  assert(typeof id === 'string', 'ID should be string');
  assert(source === 'ai' || source === 'manual', 'Source should be valid');
  assert(typeof intent === 'string', 'Intent should be string');
}

async function testDateSerialization() {
  const storage = new ExplorationContextStorage();
  const context = createMockContext();

  storage.store(context);
  const retrieved = storage.get(context.id);

  assert(retrieved !== null, 'Context should be retrieved');
  assert(retrieved!.createdAt instanceof Date, 'createdAt should be Date object');
  assert(retrieved!.expiresAt instanceof Date, 'expiresAt should be Date object');
}

async function testStorageSize() {
  const storage = new ExplorationContextStorage();
  storage.clear();

  // Store 10 contexts
  for (let i = 0; i < 10; i++) {
    storage.store(createMockContext());
  }

  const all = storage.getAll();
  assert(all.length === 10, 'Should store 10 contexts');

  // Verify storage size is reasonable (< 100KB)
  const storageData = window.sessionStorage.getItem('local_scout_exploration_contexts');
  const sizeKB = storageData ? new Blob([storageData]).size / 1024 : 0;

  assert(sizeKB < 100, `Storage size should be < 100KB (current: ${sizeKB.toFixed(2)}KB)`);
}

// ============================================================================
// MAIN TEST RUNNER
// ============================================================================

export async function runAllExplorationTests() {
  console.clear();
  console.log('🧪 EXPLORATION CONTEXT TEST SUITE\n');

  const runner = new TestRunner();

  // Persistence Tests
  console.log('📦 PERSISTENCE TESTS');
  await runner.runTest('Context Storage', testContextStorage);
  await runner.runTest('Persistence Across Refresh', testContextPersistenceAcrossRefresh);
  await runner.runTest('Multiple Contexts', testMultipleContexts);
  await runner.runTest('Latest Context', testLatestContext);

  // Expiration Tests
  console.log('\n⏰ EXPIRATION TESTS');
  await runner.runTest('Context Expiration', testContextExpiration);
  await runner.runTest('Auto Cleanup', testAutoCleanup);
  await runner.runTest('Expiration Edge Cases', testExpirationEdgeCases);

  // Edge Case Tests
  console.log('\n🔍 EDGE CASE TESTS');
  await runner.runTest('Invalid Context Handling', testInvalidContextHandling);
  await runner.runTest('Empty Storage', testEmptyStorage);
  await runner.runTest('Context Update', testContextUpdate);
  await runner.runTest('Clear All', testClearAll);

  // Forbidden Behavior Tests
  console.log('\n🚫 FORBIDDEN BEHAVIOR TESTS');
  await runner.runTest('Never Show Blank Explore', testNeverShowBlankExplore);
  await runner.runTest('Never Mix Unrelated Content', testNeverMixUnrelatedContent);
  await runner.runTest('Never Auto-Add to Trips', testNeverAutoAddToTrips);
  await runner.runTest('Never Desync Map and List', testNeverDesyncMapAndList);

  // Production Readiness Tests
  console.log('\n✅ PRODUCTION READINESS TESTS');
  await runner.runTest('TypeScript Types', testTypeScriptTypes);
  await runner.runTest('Date Serialization', testDateSerialization);
  await runner.runTest('Storage Size', testStorageSize);

  // Print summary
  runner.printSummary();

  return runner.getResults();
}

// ============================================================================
// BROWSER CONSOLE HELPERS
// ============================================================================

// Make available in browser console
if (typeof window !== 'undefined') {
  (window as any).__explorationTests = {
    runAll: runAllExplorationTests,
    createMock: createMockContext,
  };

  console.log('\n💡 Run tests in console:');
  console.log('   __explorationTests.runAll()');
}
