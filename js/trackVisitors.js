const GITHUB_USERNAME = "host-codes";
const REPO_NAME = "quiz";
const FILE_PATH = "js/visitors.json";
const TOKEN = "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";  // 🔴 Replace this with your actual GitHub token

async function fetchVisitorData() {
    try {
        const response = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/${FILE_PATH}`);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.statusText}`);
        }

        const data = await response.json();
        const content = atob(data.content); // Decode Base64 content
        return JSON.parse(content);
    } catch (error) {
        console.error("Error fetching visitor data:", error);
        return { stats: [] };
    }
}

async function updateVisitorData() {
    const data = await fetchVisitorData();
    const today = new Date().toISOString().split("T")[0];

    let updated = false;
    data.stats = data.stats.map(entry => {
        if (entry.date === today) {
            entry.views += 1;
            updated = true;
        }
        return entry;
    });

    if (!updated) {
        data.stats.push({ date: today, views: 1 });
    }

    const updatedContent = btoa(JSON.stringify(data, null, 2));

    const response = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/${FILE_PATH}`, {
        method: "PUT",
        headers: {
            "Authorization": `token ${TOKEN}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: "Update visitor count",
            content: updatedContent,
            sha: await getFileSHA()
        })
    });

    if (!response.ok) {
        console.error("❌ Error updating GitHub:", await response.json());
    } else {
        console.log("✅ Visitor data updated successfully!");
    }
}

async function getFileSHA() {
    const response = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/${FILE_PATH}`);
    if (!response.ok) return null;
    const data = await response.json();
    return data.sha;
}

// Call this function to update visitors
updateVisitorData();
