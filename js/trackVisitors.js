const GITHUB_RAW_URL = "https://raw.githubusercontent.com/host-codes/quiz/main/js/visitors.json";

async function fetchVisitorData() {
    try {
        const response = await fetch(GITHUB_RAW_URL);
        if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);
        
        const data = await response.json();
        console.log("📊 Fetched Visitor Data:", data);
        
        return data;
    } catch (error) {
        console.error("❌ Error fetching visitor data:", error);
        return { stats: [] }; // Default empty stats
    }
}

fetchVisitorData();
