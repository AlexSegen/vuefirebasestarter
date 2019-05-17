import moment from 'moment'
import firebase from 'firebase'


export default {
    formatDate(val) {
        return moment(val).format('MMMM Do YYYY');
    },
    formatDateAndTime(val) {
        return moment(val).format('MMMM Do YYYY, h:mm:ss a');
    },
    formatFirebaseDate(val) {
        return firebase.firestore.Timestamp(val)
    }
}