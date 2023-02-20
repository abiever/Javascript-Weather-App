//this is used to "set the standards" for our icons and how they will change based on API data
//use these paramaters from this URL to help you customize this weather app for more granularity 
//https://open-meteo.com/en/docs#api-documentation
//under "WMO Weather interpretation codes (WW)"

export const ICON_MAP = new Map();

//these will set our icons based off their coding from the Open-Meteo API site
//make sure these match your icon file names
addMapping([0], "clear-sky");
addMapping([1, 2, 3], "mainly-clear");
addMapping([45, 48], "fog");
addMapping([51, 53, 55], "drizzle");
addMapping([56, 57], "freezing-drizzle");
addMapping([61, 63, 65], "rain");
addMapping([66, 67], "freezing-rain");
addMapping([71, 73, 75], "snow-fall");
addMapping([77, 85, 86], "snow-grains-snow-showers");
addMapping([80, 81, 82], "rain-showers");
addMapping([95, 96, 99], "thunderstorm");

function addMapping(values, icon) {
    values.forEach(value => {
        ICON_MAP.set(value, icon)
    })
}