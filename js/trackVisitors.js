//const GITHUB_USERNAME = "host-codes";  // Change this
//const REPO_NAME = "quiz";  // Change this
//const FILE_PATH = "https://quiz.a-web.online/js/visitors.json";  // JSON file path
//const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/${FILE_PATH}`;




const GITHUB_USERNAME = "host-codes";  
const REPO_NAME = "quiz";  
const FILE_PATH = "js/visitors.json";  // ✅ Use a relative path

const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/${FILE_PATH}`;

const GITHUB_TOKEN = "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";  // Store securely, NOT in frontend!

async function fetchVisitorData() {
    try {
        const response = await fetch(GITHUB_API_URL, {
            headers: { Authorization: `token ${GITHUB_TOKEN}` }
        });
        const data = await response.json();
        const fileContent = atob(data.content);  // Decode base64 file
        return { stats: JSON.parse(fileContent), sha: data.sha };
    } catch (error) {
        console.error("Error fetching visitor data:", error);
        return { stats: [], sha: null };
    }
}

async function updateVisitorData() {
    let { stats, sha } = await fetchVisitorData();
    let today = new Date().toISOString().split("T")[0];
    let page = window.location.pathname.replace("/", "") || "index";  // Get page name

    let found = stats.find(entry => entry.date === today && entry.page === page);
    if (found) {
        found.count++;
    } else {
        stats.push({ date: today, page: page, count: 1 });
    }

    await pushToGitHub(stats, sha);
}

async function pushToGitHub(stats, sha) {
    let updatedContent = btoa(JSON.stringify({ stats }, null, 2));  // Encode to base64

    let response = await fetch(GITHUB_API_URL, {
        method: "PUT",
        headers: {
            "Authorization": `token ${GITHUB_TOKEN}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: "Update visitor count",
            content: updatedContent,
            sha: sha
        })
    });

    if (response.ok) {
        console.log("✅ Successfully updated visitors.json");
    } else {
        console.error("❌ Error updating GitHub:", await response.json());
    }
}

// Run visitor tracking on page load
updateVisitorData();
