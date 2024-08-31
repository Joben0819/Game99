export const connectAdjustIndexDB = async (): Promise<any> => {
  try {
    const openDBRequest: IDBOpenDBRequest = indexedDB.open('adjust-sdk', 1);

    const db: IDBDatabase = await new Promise((resolve, reject) => {
      openDBRequest.onsuccess = (event: Event) => {
        resolve((event.target as IDBOpenDBRequest).result);
      };

      openDBRequest.onerror = (event: Event) => {
        reject(new Error(`Error opening IndexDB: ${(event.target as IDBOpenDBRequest).error}`));
      };
    });

    if (db.objectStoreNames.length === 0) {
      indexedDB.deleteDatabase('adjust-sdk');
      return;
    }

    const objectStoreName: string = db.objectStoreNames[0];

    const transaction: IDBTransaction = db.transaction(objectStoreName, 'readonly');
    const objectStore: IDBObjectStore = transaction.objectStore(objectStoreName);

    return new Promise<any>((resolve, reject) => {
      const getRequest: IDBRequest = objectStore.openCursor();

      getRequest.onsuccess = (event: Event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          const userAdId = cursor.value?.at?.a;
          resolve(userAdId);
        } else {
          resolve(null);
        }
      };

      getRequest.onerror = (event: Event) => {
        console.error('Error getting value:', (event.target as IDBRequest).error);
        reject((event.target as IDBRequest).error);
      };
    });
  } catch (error) {
    console.error('Failed to open IndexDB:', error);
    throw error;
  }
};
