const data = {
  labels: ["Cold Email", "Job Board ", "Website Application"],
  values: [25, 4, 21]
};

const ctx = document.getElementById('applicationPerPlatformChart');

new Chart(ctx, {
  type: 'bar',
  data: {
    labels: data.labels,
    datasets: [{
      label: 'Applications per Platform',
      data: data.values
    }]
  }
});