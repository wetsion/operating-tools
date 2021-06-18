import moment from 'moment'

export function formatDate (date) {
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
    console.log(date)
    return moment(date).format('yyyy-MM-DD')
}