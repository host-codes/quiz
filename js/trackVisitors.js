const rawURL = "https://raw.githubusercontent.com/host-codes/quiz/main/js/visitors.json";
const githubAPI = "https://api.github.com/repos/host-codes/quiz/contents/js/visitors.json";
const TOKEN = "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"; // ⚠️ Replace with your GitHub token

async function fetchVisitorData() {
    try {
        const response = await fetch(rawURL);
        if (!response.ok) throw new Error("Failed to fetch visitor data");

        const data = await response.json();
        console.log("Fetched Visitor Data:", data);
        return data;
    } catch (error) {
        console.error("❌ Error fetching visitor data:", error);
    }
}

async function updateVisitorData() {
    const data = await fetchVisitorData();
    if (!data) return;

    // Update visitor count
    data.today += 1;

    // Push updates to GitHub
    const newContent = btoa(JSON.stringify(data, null, 2)); // Encode as Base64
    const response = await fetch(githubAPI, {
        method: "PUT",
        headers: {
            "Authorization": `token ${TOKEN}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: "Update visitor count",
            content: newContent,
            sha: await getFileSHA()
        })
    });

    if (response.ok) console.log("✅ Visitor data updated successfully!");
    else console.error("❌ Failed to update visitor data.");
}

async function getFileSHA() {
    try {
        const response = await fetch(githubAPI, {
            headers: { "Authorization": `token ${TOKEN}` }
        });
        const data = await response.json();
        return data.sha; // Required for updating file
    } catch (error) {
        console.error("❌ Error fetching file SHA:", error);
    }
}

updateVisitorData();
