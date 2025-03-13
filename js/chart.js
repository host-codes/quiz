async function getStats() {
    try {
        const response = await fetch("https://raw.githubusercontent.com/host-codes/quiz/main/js/visitors.json");
        
        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Fetched Data:", data);

        // ✅ Ensure 'stats' exists and is an array
        if (!data.stats || !Array.isArray(data.stats)) {
            throw new Error("Invalid data format: 'stats' is missing or not an array");
        }

        return data.stats.filter(item => item.date); // Modify as needed
    } catch (error) {
        console.error("Error fetching visitor stats:", error);
        return [];
    }
}

getStats();
function getPreviousDate(daysAgo) {
    let d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString().split("T")[0];
}

function isWithinLastDays(dateStr, days) {
    let date = new Date(dateStr);
    let diff = (new Date() - date) / (1000 * 60 * 60 * 24);
    return diff <= days;
}

// Display Chart
async function renderChart() {
    let stats = await getStats();
    
    new Chart(document.getElementById("visitorChart"), {
        type: "doughnut",
        data: {
            labels: ["Today", "Yesterday", "Last 7 Days", "Last Month"],
            datasets: [{
                data: [stats.todayVisits, stats.yesterdayVisits, stats.last7Days, stats.lastMonth],
                backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#4bc0c0"]
            }]
        }
    });
}

renderChart();
