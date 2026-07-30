/**
 * Centralized localStorage manager with versioning and error handling.
 */

interface StorageOptions {
  version?: number;
  ttl?: number; // Time to live in milliseconds
}

interface StoredData<T> {
  data: T;
  version: number;
  timestamp: number;
  ttl?: number;
}

/**
 * Safe localStorage wrapper with versioning
 */
export class StorageManager {
  private static readonly DEFAULT_VERSION = 1;

  /**
   * Get item from localStorage
   */
  static getItem<T = any>(
    key: string,
    options: StorageOptions = {}
  ): T | null {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;

      const stored: StoredData<T> = JSON.parse(item);

      // Check TTL
      if (stored.ttl) {
        const age = Date.now() - stored.timestamp;
        if (age > stored.ttl) {
          this.removeItem(key);
          return null;
        }
      }

      // Check version
      if (options.version && stored.version !== options.version) {
        console.warn(`[v0] Storage version mismatch for key "${key}"`);
        return null;
      }

      return stored.data;
    } catch (error) {
      console.error(`[v0] Error reading localStorage key "${key}":`, error);
      return null;
    }
  }

  /**
   * Set item in localStorage
   */
  static setItem<T = any>(
    key: string,
    value: T,
    options: StorageOptions = {}
  ): boolean {
    try {
      const stored: StoredData<T> = {
        data: value,
        version: options.version ?? this.DEFAULT_VERSION,
        timestamp: Date.now(),
        ttl: options.ttl,
      };

      localStorage.setItem(key, JSON.stringify(stored));
      return true;
    } catch (error) {
      if (error instanceof DOMException && error.code === 22) {
        // QuotaExceededError
        console.warn(`[v0] localStorage quota exceeded for key "${key}"`);
        this.clearExpiredItems();
        try {
          localStorage.setItem(key, JSON.stringify({
            data: value,
            version: options.version ?? this.DEFAULT_VERSION,
            timestamp: Date.now(),
            ttl: options.ttl,
          }));
          return true;
        } catch {
          return false;
        }
      }
      console.error(`[v0] Error writing localStorage key "${key}":`, error);
      return false;
    }
  }

  /**
   * Remove item from localStorage
   */
  static removeItem(key: string): boolean {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`[v0] Error removing localStorage key "${key}":`, error);
      return false;
    }
  }

  /**
   * Clear all items matching pattern
   */
  static clearPattern(pattern: RegExp): boolean {
    try {
      const keys = Object.keys(localStorage);
      const matchingKeys = keys.filter(key => pattern.test(key));
      matchingKeys.forEach(key => localStorage.removeItem(key));
      return true;
    } catch (error) {
      console.error('[v0] Error clearing localStorage pattern:', error);
      return false;
    }
  }

  /**
   * Clear all items with expired TTL
   */
  static clearExpiredItems(): boolean {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        try {
          const item = localStorage.getItem(key);
          if (item) {
            const stored = JSON.parse(item);
            if (stored.ttl) {
              const age = Date.now() - stored.timestamp;
              if (age > stored.ttl) {
                localStorage.removeItem(key);
              }
            }
          }
        } catch {
          // Skip items that can't be parsed
        }
      });
      return true;
    } catch (error) {
      console.error('[v0] Error clearing expired storage items:', error);
      return false;
    }
  }

  /**
   * Clear all localStorage
   */
  static clear(): boolean {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('[v0] Error clearing localStorage:', error);
      return false;
    }
  }

  /**
   * Check if key exists
   */
  static hasItem(key: string): boolean {
    try {
      return localStorage.getItem(key) !== null;
    } catch {
      return false;
    }
  }

  /**
   * Get storage size in bytes
   */
  static getSize(): number {
    try {
      let size = 0;
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        const item = localStorage.getItem(key);
        if (item) {
          size += item.length + key.length;
        }
      });
      return size;
    } catch {
      return 0;
    }
  }

  /**
   * Get all keys
   */
  static getAllKeys(): string[] {
    try {
      return Object.keys(localStorage);
    } catch {
      return [];
    }
  }
}

/**
 * sessionStorage wrapper
 */
export class SessionStorageManager {
  static getItem<T = any>(key: string): T | null {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`[v0] Error reading sessionStorage key "${key}":`, error);
      return null;
    }
  }

  static setItem<T = any>(key: string, value: T): boolean {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`[v0] Error writing sessionStorage key "${key}":`, error);
      return false;
    }
  }

  static removeItem(key: string): boolean {
    try {
      sessionStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`[v0] Error removing sessionStorage key "${key}":`, error);
      return false;
    }
  }

  static clear(): boolean {
    try {
      sessionStorage.clear();
      return true;
    } catch (error) {
      console.error('[v0] Error clearing sessionStorage:', error);
      return false;
    }
  }
}
