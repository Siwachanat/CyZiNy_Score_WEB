const isMain = document.getElementById("scoreboard");
const isForm = document.getElementById("scoreForm");

// Load and display the scoreboard with ranking
if (isMain) {
  async function loadScores() {
    const res = await fetch("/api/scores");
    const scores = await res.json();
    const scoreboard = document.getElementById("scoreboard");
    scoreboard.innerHTML = "";

    // Sort scores descending
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);

    // Display each team with rank and score
    sorted.forEach(([team, score], index) => {
      const div = document.createElement("div");
      div.className = "score-item";

      let rankIcon = "";
      if (index === 0) rankIcon = "🥇 ";
      else if (index === 1) rankIcon = "🥈 ";
      else if (index === 2) rankIcon = "🥉 ";

      div.textContent = `${rankIcon}#${index + 1} - ${team}: ${score}`;
      scoreboard.appendChild(div);
    });
  }

  // Initial load and auto-refresh every 2 seconds
  loadScores();
  setInterval(loadScores, 2000);
}

// Handle form submission to add points to a team
if (isForm) {
  isForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const team = document.getElementById("team").value;
    const points = parseInt(document.getElementById("points").value);

    await fetch("/api/scores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ team, points }),
    });

    alert(`Added ${points} to ${team}`);
    isForm.reset();
  });
}

// Reset all scores to 1000 points per team
async function resetScores() {
  if (confirm("Are you sure you want to reset all scores to 1000?")) {
    // Call backend reset endpoint (resets scores to zero)
    await fetch("/api/reset", { method: "POST" });

    // List of all teams
    const teams = [
      "Brown",
      "Orange",
      "Yellow",
      "Red",
      "Purple",
      "Navy Blue",
      "Pink",
      "Sky Blue",
      "Pale Green",
      "Dark Green",
    ];

    for (const team of teams) {
      await fetch("/api/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ team, points: 100 }),
      });
    }

    alert("Scores reset successfully to 1000.");
  }
}
