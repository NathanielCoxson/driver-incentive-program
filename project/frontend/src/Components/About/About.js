// Function to make the HTTP request
async function fetchData() {
    // URL of the API endpoint
    const apiUrl = "http://34.225.199.196:3000/about";

    // Make the GET request
    fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
        // Handle the JSON response data here
        displayData(data);
    })
    .catch((error) => {
        console.error("Error fetching data:", error);
    });
}

// Function to display the JSON data
function displayData(data) {
    // Assuming you have an element with the id "aboutData" to display the data
    const aboutDataElement = document.getElementById("aboutData");

    // Construct the HTML to display the JSON data
    const html = `
    <div style="text-align: center;">
        <!-- <p><strong>RID:</strong> ${data.RID}</p> -->
        <p><strong>Team Number:</strong> ${data.TeamNumber}</p>
        <p><strong>Version Number:</strong> ${data.VersionNumber}</p>
        <p><strong>Release Date:</strong> ${new Date(data.ReleaseDate).toLocaleString()}</p>
        <p><strong>Product Name:</strong> ${data.ProductName}</p>
        <p><strong>Product Description:</strong> ${data.ProductDescription}</p>
    </div>
    `;

    // Set the HTML content of the element
    aboutDataElement.innerHTML = html;
}

function About() {
    fetchData()

    return (<main>
        <section className="hero">
            <h2>About Page</h2>
            <div id="aboutData"></div>
        </section>
    </main>)
}

export default About;