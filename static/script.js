var calendarEl = document.getElementById('calendar');
var calendar = new FullCalendar.Calendar(calendarEl, {
initialView: 'dayGridMonth',
eventDidMount: function(info) {
    var tooltip = new Tooltip(info.el, {
        title: info.event.extendedProps.description,
        placement: 'top',
        trigger: 'hover',
        container: 'body'
    });
}
});
document.addEventListener('DOMContentLoaded', function() {
console.log("DOM content loaded");
calendar.render();

// let savedCsvData = getCookie('csvData');
// if (savedCsvData) {
//     let events = parseCsv(savedCsvData);
//     events.forEach(event => {
//         calendar.addEvent({
//             title: event.ActivityName,
//             start: event.Date,
//             end: event.Date,
//             description: event.Description || ''
//         });
//     });
// }


var xmlHttp = new XMLHttpRequest();
xmlHttp.open("GET", "http://localhost:4443/getEvents",false)
xmlHttp.send(null)
var eventsArray = xmlHttp.responseText.split('\n')
for (const event of eventsArray) {
    calendar.addEvent({
        title: event.split(' ')[0],
        start: event.split(' ')[1],
        end: event.split(' ')[1],
        description: "one two three"
    });
}
});

let csvData = 'Date,ActivityName\n';

function addEvent() {
const eventName = document.getElementById('event-name').value;
const eventDate = document.getElementById('event-date').value;

if (eventName && eventDate) {
    calendar.addEvent({
        title: eventName,
        start: eventDate,
        end: eventDate,
        description: "one two three"
    });
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:4443/createEvent?name=" + encodeURIComponent(eventName) + "&date=" + encodeURIComponent(eventDate));
    xhr.send()
    csvData += `${eventDate},${eventName}\n`;
    console.log(csvData);
    document.cookie += csvData;
    setCookie('csvData', csvData, 7);
} else {
    alert('Please enter both event name and date.');
}
}

function setCookie(cname, cvalue, exdays) {
const d = new Date();
d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
let expires = "expires=" + d.toUTCString();
document.cookie = `${cname}=${encodeURIComponent(cvalue)};${expires};path=/`;
console.log("Cookie set:", document.cookie);
}
function getCookie(cname) {
let name = cname + "=";
let ca = document.cookie.split(';');
for(let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(name) == 0) {
        return decodeURIComponent(c.substring(name.length, c.length));
    }
}
return "";
}

function parseCsv(csv) {
let lines = csv.trim().split("\n");
let result = [];
let headers = lines[0].split(",");
for (let i = 1; i < lines.length; i++) {
    let obj = {};
    let currentline = lines[i].split(",");
    for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j];
    }
    result.push(obj);
}
return result;
}

function getCsvData(key = null) {
let csv = getCookie('csvData');
if (!csv) return null;
let data = parseCsv(csv);
if (key) {
    return data.find(item => item.Date === key || item.ActivityName === key) || null;
}
return data;
}

function clearOutputDoOnce() {
const output = document.getElementById("do-once");
output.textContent = "";
}