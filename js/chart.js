async function getStats() {
    let data = await fetchVisitorData();
    let today = new Date().toISOString().split("T")[0];

    let todayVisits = data.filter(d => d.date === today).reduce((sum, d) => sum + d.count, 0);
    let yesterdayVisits = data.filter(d => d.date === getPreviousDate(1)).reduce((sum, d) => sum + d.count, 0);
    let last7Days = data.filter(d => isWithinLastDays(d.date, 7)).reduce((sum, d) => sum + d.count, 0);
    let lastMonth = data.filter(d => isWithinLastDays(d.date, 30)).reduce((sum, d) => sum + d.count, 0);

    return { todayVisits, yesterdayVisits, last7Days, lastMonth };
}

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
