(function () {
  "use strict";

  if (typeof Chart === "undefined") return;

  Chart.defaults.font.family =
    '"Inter", "Segoe UI", system-ui, -apple-system, sans-serif';
  Chart.defaults.color = "#6f675d";

  var FOREST = "#2e4a3f";
  var FOREST_SOFT = "#dbe5de";
  var TERRACOTTA = "#c47555";
  var SAND = "#e6d9c3";
  var IVORY = "#faf5ee";

  var chartConfigs = {
    chartApproval: {
      type: "bar",
      data: {
        labels: ["Before", "After"],
        datasets: [
          {
            label: "First-pass approval rate (%)",
            data: [62, 89],
            backgroundColor: [SAND, TERRACOTTA],
            borderRadius: 10,
            borderSkipped: false,
            barThickness: 56,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true, max: 100, ticks: { callback: function (v) { return v + "%"; } } },
          x: { grid: { display: false } },
        },
        plugins: { legend: { display: false } },
      },
    },
    chartClaims: {
      type: "doughnut",
      data: {
        labels: ["Accepted claims", "Rejected claims"],
        datasets: [
          {
            data: [88, 12],
            backgroundColor: [FOREST, TERRACOTTA],
            borderColor: IVORY,
            borderWidth: 4,
            hoverOffset: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "62%",
        plugins: {
          legend: { position: "bottom", labels: { usePointStyle: true, boxWidth: 8 } },
          tooltip: { callbacks: { label: function (ctx) { return " " + ctx.label + ": " + ctx.parsed + "%"; } } },
        },
      },
    },
    chartOnboarding: {
      type: "line",
      data: {
        labels: ["Before", "Step 1", "Step 2", "Step 3", "After"],
        datasets: [
          {
            label: "Days to onboard",
            data: [14, 12, 10, 8, 6],
            borderColor: TERRACOTTA,
            backgroundColor: "rgba(196, 117, 85, 0.12)",
            fill: true,
            tension: 0.4,
            pointBackgroundColor: FOREST,
            pointBorderColor: IVORY,
            pointBorderWidth: 2,
            pointRadius: 5,
            borderWidth: 3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { min: 0, max: 16, ticks: { callback: function (v) { return v + "d"; } } },
          x: { grid: { display: false } },
        },
        plugins: { legend: { display: false } },
      },
    },
  };

  var created = {};
  var section = document.getElementById("metrics");

  function makeChart(id) {
    var canvas = document.getElementById(id);
    if (!canvas || created[id] || !chartConfigs[id]) return;
    new Chart(canvas.getContext("2d"), chartConfigs[id]);
    created[id] = true;
  }

  if (section && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          Object.keys(chartConfigs).forEach(function (id) {
            if (entry.target.querySelector("#" + id)) makeChart(id);
          });
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15 }
    );
    observer.observe(section);
  } else {
    Object.keys(chartConfigs).forEach(makeChart);
  }
})();
