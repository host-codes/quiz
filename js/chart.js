async function getStats() {
    try {
        const response = await fetch("https://raw.githubusercontent.com/host-codes/quiz/main/js/visitors.json");
        if (!response.ok) throw new Error("Failed to fetch visitor data");
        
        const data = await response.json();
        console.log("Fetched Data:", data);

        if (!data.stats || !Array.isArray(data.stats)) {
            throw new Error("Invalid data format");
        }

        return data.stats;
    } catch (error) {
        console.error("Error fetching visitor stats:", error);
        return [];
    }
}

async function renderChart() {
    const stats = await getStats();
    
    const dates = stats.map(entry => entry.date);
    const views = stats.map(entry => entry.views);

    new Chart(document.getElementById("visitorChart"), {
        type: "doughnut",
        data: {
            labels: dates,
            datasets: [{
                label: "Visitors",
                data: views,
                backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#4bc0c0"]
            }]
        }
    });
}

renderChart();
