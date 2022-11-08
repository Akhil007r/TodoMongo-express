// jshint esversion:6
module.exports.getDate = getDate;
console.log(module)
function getDate() {
    const today = new Date()
    const options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }
    let day = today.toLocaleString("en-US", options)
    return day;
}
// modularized
exports.getDay = function getDay() {
    const today = new Date()
    const options = {
        weekday: 'long'
    }
    return today.toLocaleString("en-US", options)
}