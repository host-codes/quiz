async function getStats() {
    const rawURL = "https://raw.githubusercontent.com/host-codes/quiz/main/js/visitors.json";

    try {
        const response = await fetch(rawURL);
        if (!response.ok) throw new Error("Failed to fetch visitor stats");

        const stats = await response.json();
        console.log("Visitor Stats:", stats);
        renderChart(stats);
    } catch (error) {
        console.error("❌ Error fetching visitor stats:", error);
    }
}

function renderChart(stats) {
    const ctx = document.getElementById("visitorChart").getContext("2d");

    new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Today", "Yesterday", "Last 7 Days", "Last 30 Days"],
            datasets: [{
                data: [stats.today, stats.yesterday, stats.last7days.length, stats.last30days.length],
                backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#4bc0c0"]
            }]
        }
    });
}

getStats();
