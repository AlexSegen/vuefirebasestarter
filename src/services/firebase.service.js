import {database} from '@/config/firebase.config'

class RequestError extends Error {
    constructor(errorCode, message) {
        super(message)
        this.name = this.constructor.name
        this.message = message
        this.errorCode = errorCode
    }
}

const RESOURCE_NAME = 'products'

const dbRef = database.ref();
const recordsRef = dbRef.child(RESOURCE_NAME);

const FirebaseService = {

    /**
     * Get all records width given resource name. 
     * 
     * @returns records
     * @throws RequestError 
     **/
    getAll: () => {
        
        try {

            return recordsRef

        } catch (error) {
            throw new RequestError(error.code, error.message)
        }

    },

    createRecord: (record) => {
        return new Promise((resolve, reject) => {
            recordsRef.push({
            name: record.name,
            price: record.price
          }).then(result => {
            resolve(true);
          }).catch(err => {
            reject(false);
         });
        });
    },
    getRecords: () => {
        return new Promise((resolve, reject) => {
          var records = [];
          recordsRef.once('value', snapshot => {
            snapshot.forEach(child => {
                records.push({
                id: child.key,
                name: child.val().name,
                price: child.val().price
              });
            });
            resolve(records);
          });
        })
    },
    updateRecord: (id, record) => {
        return new Promise((resolve, reject) => {
            recordsRef.child(id).update(record).then(result => {
            resolve(true);
          }).catch(err => {
            reject(false);
          });
        })
    },
    deleteRecord: (id) => {
        return new Promise((resolve, reject) => {
        recordsRef.child(id).remove().then(result => {
          resolve(true);
          }).catch(err => {
            reject(false);
          });
        })
    }

}

export default FirebaseService

export {
    FirebaseService,
    RequestError
}