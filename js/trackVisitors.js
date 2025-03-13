const GITHUB_USERNAME = "host-codes";
const REPO_NAME = "quiz";
const FILE_PATH = "js/visitors.json";
const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/${FILE_PATH}`;

async function fetchVisitorData() {
    try {
        const response = await fetch(GITHUB_API_URL);

        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const decodedData = atob(data.content); // Decode Base64
        const visitorData = JSON.parse(decodedData); // Convert to JSON

        console.log("Fetched Data:", visitorData);
        return visitorData;
    } catch (error) {
        console.error("Error fetching visitor data:", error);
        return null;
    }
}

fetchVisitorData();
