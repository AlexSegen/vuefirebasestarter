import moment from 'moment'
export default {
    buildDate(val) {

        var d = new Date(parseInt(val));
        var month = "" + (d.getMonth() +  1);
        var day = "" + d.getDate();
        var year = "" + d.getFullYear();
        var hours = "" + d.getHours();
        var minutes = "" + d.getMinutes();
        var seconds = "" + d.getSeconds();
        var time = ` ${hours}:${minutes}:${seconds}`

        if(month.length > 2) month = "0" + month;
        if(day.length > 2) day = "0" + day;
        if(minutes.length == 0) minutes = "0" + minutes;

        return [month,day,year].join("/") + time;
    },
    formatDate(val) {
        return moment(val).format('MMMM Do YYYY');
    },
    formatDateAndTime(val) {
        return moment(val).format('MMMM Do YYYY, h:mm:ss a');
    },
    formatFirebaseDate(val) {
        return moment(val * 1000).format('MMMM Do YYYY');
    },
    formatFirebaseDateAndTime(val) {

        var date = this.buildDate(val);

        return moment(date).format('MMMM Do YYYY, h:mm:ss a')
    }
}