//create indexDB
let dbPromise = idb.open('currStore', 1, function (db) {
    if (!db.objectStoreNames.contains('curr')) {
        db.createObjectStore('curr', {
            keyPath: 'id'
        });
    }
})

//store data to  indexDB
function storeData(tableName, data) {
    return dbPromise
        .then(function (db) {
            let tran = db.transaction(tableName, 'readwrite');
            let store = tran.objectStore(tableName);
            store.put(data);
            return tran.complete;
        })
}

//get store data from  indexDB
function readData(tableName) {
    return dbPromise
        .then(function (db) {
            let tran = db.transaction(tableName, 'readonly');
            let store = tran.objectStore(tableName);
             return  store.getAll();
        });

}

function clearData(tableName) {
    return dbPromise
      .then(function(db) {
        var tran = db.transaction(tableName, 'readwrite');
        var store = tran.objectStore(tableName);
        store.clear();
        return tran.complete;
      });
  }