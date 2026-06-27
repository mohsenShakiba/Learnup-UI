interface StoredEntry {
  bookId: number;
  data: ArrayBuffer;
}

const DB_NAME = 'book-cache';
const STORE_NAME = 'books';

let dbPromise: Promise<IDBDatabase> | null = null;

function openDB (): Promise<IDBDatabase> {

  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 2);
    req.onupgradeneeded = () => {
      if (req.result.objectStoreNames.contains(STORE_NAME)) {
        req.result.deleteObjectStore(STORE_NAME);
      }
      req.result.createObjectStore(STORE_NAME, { keyPath: 'bookId' });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });

  return dbPromise;
}

export async function getCachedBook (bookId: number): Promise<ArrayBuffer | null> {
  try {
    const db = await openDB();
    const entry = await new Promise<StoredEntry | undefined>((resolve, reject) => {
      const req = db.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).get(bookId);
      req.onsuccess = () => resolve(req.result as StoredEntry | undefined);
      req.onerror = () => reject(req.error);
    });

    if (!entry) return null;
    return entry.data;
  } catch {
    return null;
  }
}

export async function setCachedBook (bookId: number, data: ArrayBuffer): Promise<void> {
  try {
    const db = await openDB();
    const entry: StoredEntry = { bookId, data };
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).put(entry);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // Quota exceeded or unavailable — skip caching rather than throw.
  }
}

