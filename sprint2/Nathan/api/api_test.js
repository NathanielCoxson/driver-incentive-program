// Generate a free api key here: https://api.nasa.gov/
// Replace api_key value with your api key and open index.html to view picture of the day from NASA
const api_key = "YOUR_API_KEY_HERE";
const url = "https://api.nasa.gov/planetary/apod";

// Sample get request to NASA's APOD api
const request = async () => {
    await fetch(`${url}?api_key=${api_key}`)
    .then(res => res.json())
    .then(res => {
        console.log(res);
        const video = document.getElementById('space-video');
        const img = document.getElementById('space-image');
        if (res.url.includes("youtube")) { 
            img.style.display = "none";
            video.style.display = "block";
            video.setAttribute('src', res.url);
        }
        else {
            img.style.display = "block";
            video.style.display = "none";
            img.setAttribute('src', res.url);
        } 
    });
}
request();