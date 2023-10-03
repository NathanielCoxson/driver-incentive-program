// Function to make the HTTP request
function fetchData() {
  // URL of the API endpoint
  const apiUrl = "http://34.225.199.196:3000/about";
          
  // Make the GET request
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      // Handle the JSON response data here
      return data
    })
    .catch((error) => {
      return "Error fetching data"
    });
}

export default fetchData;