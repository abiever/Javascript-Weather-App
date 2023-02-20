import { getWeather } from "/weather.js";
import { ICON_MAP } from "/iconMap.js";

navigator.geolocation.getCurrentPosition(positionSuccess, positionError) 

function positionSuccess( { coords }) {
  getWeather(
    coords.latitude, 
    coords.longitude, 
    Intl.DateTimeFormat().resolvedOptions().timeZone
  )
    .then(renderWeather)
    .catch(e => {
      console.error(e)
      alert("Error getting weather.")
  });
}

function positionError() {
  alert("There was an error getting your location. Please allow us to use your location and refresh the page.");
}


function renderWeather({ current, daily, hourly }) {
  renderCurrentWeather(current)
  renderDailyWeather(daily)
  renderHourlyWeather(hourly)
  document.body.classList.remove("blurred");
}

//help function for helping us access/select data selector things in our HTML doc
function setValue(selector, value, { parent = document } = {}) {
  parent.querySelector(`[data-${selector}]`).textContent = value;
}

function getIconUrl(iconCode) {
  return `icons/${ICON_MAP.get(iconCode)}.png` //this file type should change to "svg" if you ever plan to use those instead
}

const currentIcon = document.querySelector("[data-current-icon]");
function renderCurrentWeather(current) {
  currentIcon.src = getIconUrl(current.iconCode);
  //the data selectors we put into our HTML earlier
  //document.querySelector("[data-current-temp]").textContent = current.currentTemp
  //instead of the above original code line, we can use the setValue() help function we made to make things much easier
  setValue("current-temp", current.currentTemp)
  setValue("current-high", current.highTemp)
  setValue("current-low", current.lowTemp)
  setValue("current-fl-high", current.highFeelsLike)
  setValue("current-fl-low", current.lowFeelsLike)
  setValue("current-wind", current.windSpeed)
  setValue("current-precip", current.precip)
  //all of these data sets are in the main headers of the HTML doc
}


const DAY_FORMATTER =  new Intl.DateTimeFormat(undefined, { weekday: "long" });
const dailySection = document.querySelector("[data-day-section]");
const dayCardTemplate = document.getElementById("day-card-template");
function renderDailyWeather(daily) {
  dailySection.innerHTML = "";
  daily.forEach(day => {
    //this is how you clone a template
    const element = dayCardTemplate.content.cloneNode(true);
    setValue("temp", day.maxTemp, { parent: element });
    setValue("temp-lo", day.minTemp, { parent: element });
    setValue("date", DAY_FORMATTER.format(day.timestamp), { parent: element });
    element.querySelector("[data-icon]").src = getIconUrl(day.iconCode);
    dailySection.append(element);
  })
}


const HOUR_FORMATTER =  new Intl.DateTimeFormat(undefined, { hour: "numeric" });
const hourlySection = document.querySelector("[data-hour-section]");
const hourRowTemplate = document.getElementById("hour-row-template");
function renderHourlyWeather(hourly) {
  hourlySection.innerHTML = "";
  hourly.forEach(hour => {
    //this is how you clone a template
    const element = hourRowTemplate.content.cloneNode(true);
    setValue("temp", hour.temp, { parent: element });
    //setValue("fl-temp", hour.feelsLike, { parent: element });
    //setValue("wind", hour.windSpeed, { parent: element });
    //setValue("precip", hour.precip, { parent: element });
    setValue("day", DAY_FORMATTER.format(hour.timestamp), { parent: element });
    setValue("time", HOUR_FORMATTER.format(hour.timestamp), { parent: element });
    element.querySelector("[data-icon]").src = getIconUrl(hour.iconCode);
    hourlySection.append(element);
  })
}

//for getting user's location via IPaddress API lookup
//this doesn't seem to be the most accurate locater though . . .

var city; //took these variables out so that I can use them outside of the below function
var time;
var country;
async function fetchText() {
  let url = 'https://ipinfo.io/json?token=b212f98af65031';
  let response = await fetch(url);
  let data = await response.json();
  console.log(data);
  city = data.city;
  country = data.country;
  time = data.timezone;
  document.getElementById("location").innerHTML = city + ", " + country;
} 
fetchText();


//constantly updates the displayed time via timezone from the above fetchText()
function updateTime() {
  var date = new Date();
  var currentTime = date.toLocaleString("en-US", {weekday: "short", month: "numeric", day: "numeric", year: "numeric", hour: "numeric", minute: "numeric", timeZone: time});
  var timeElem = document.getElementById("current-time");
  timeElem.innerHTML = currentTime;
  setTimeout(updateTime, 1000) //setting this to anything other than 1000 makes it revert to my laptop's time setting for the first minute
}
updateTime();
