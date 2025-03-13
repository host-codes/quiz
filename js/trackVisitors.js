const GITHUB_USERNAME = "host-codes"; // Your GitHub username
const REPO_NAME = "quiz"; // Repository name
const FILE_PATH = "js/visitors.json"; // File path in repo
const TOKEN = "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"; // Replace with your new token

async function updateVisitorData(newData) {
    const url = `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/${FILE_PATH}`;

    // Fetch file SHA (required for updating a file)
    const fileResponse = await fetch(url, {
        headers: { Authorization: `token ${TOKEN}` }
    });

    if (!fileResponse.ok) {
        console.error("❌ Failed to fetch file SHA:", fileResponse.statusText);
        return;
    }

    const fileData = await fileResponse.json();
    const sha = fileData.sha; // Extract SHA

    // Encode new data in Base64
    const updatedContent = btoa(JSON.stringify(newData, null, 2));

    // Send the update request
    const response = await fetch(url, {
        method: "PUT",
        headers: {
            "Authorization": `token ${TOKEN}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: "Updating visitor data",
            content: updatedContent,
            sha: sha // Required for updates
        })
    });

    if (response.ok) {
        console.log("✅ Visitor data updated successfully!");
    } else {
        console.error("❌ Failed to update visitor data:", response.statusText);
    }
}

// Example: Increment "today" count and update the JSON file
async function incrementTodayCount() {
    const visitorData = {
        today: 1,
        yesterday: 0,
        last7days: [],
        last30days: []
    };
    await updateVisitorData(visitorData);
}

incrementTodayCount();
