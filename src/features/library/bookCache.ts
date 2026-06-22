interface StoredEntry {
  fileName: string;
  data: ArrayBuffer;
  expiry: number;
}

const TTL_MS = 3 * 60 * 60 * 1000; // 3 hours
const DB_NAME = 'book-cache';
const STORE_NAME = 'books';

let dbPromise: Promise<IDBDatabase> | null = null;

function openDB (): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE_NAME, { keyPath: 'fileName' });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });

  return dbPromise;
}

export async function getCachedBook (fileName: string): Promise<ArrayBuffer | null> {
  try {
    const db = await openDB();
    const entry = await new Promise<StoredEntry | undefined>((resolve, reject) => {
      const req = db.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).get(fileName);
      req.onsuccess = () => resolve(req.result as StoredEntry | undefined);
      req.onerror = () => reject(req.error);
    });

    if (!entry) return null;
    return entry.data;
  } catch {
    return null;
  }
}

export async function setCachedBook (fileName: string, data: ArrayBuffer): Promise<void> {
  try {
    const db = await openDB();
    const entry: StoredEntry = { fileName, data, expiry: Date.now() + TTL_MS };
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).put(entry);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    console.log('saved to db');
  } catch {
    console.log('error in saving the book');
    // Quota exceeded or unavailable — skip caching rather than throw.
  }
}

export async function deleteCachedBook (fileName: string): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).delete(fileName);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // ignore
  }
}
