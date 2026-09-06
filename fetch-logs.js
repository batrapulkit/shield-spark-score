import fs from 'fs';
(async () => {
    try {
      const runsRes = await fetch('https://api.github.com/repos/batrapulkit/shield-spark-score/actions/runs');
      const runsData = await runsRes.json();
      const latestRun = runsData.workflow_runs[0];
      
      const jobsRes = await fetch(`https://api.github.com/repos/batrapulkit/shield-spark-score/actions/runs/${latestRun.id}/jobs`);
      const jobsData = await jobsRes.json();
      const job = jobsData.jobs[0];

      const logsRes = await fetch(`https://api.github.com/repos/batrapulkit/shield-spark-score/actions/jobs/${job.id}/logs`);
      const logsText = await logsRes.text();
      
      fs.writeFileSync('gh-logs.txt', logsText);
      console.log('Logs saved to gh-logs.txt');
    } catch (e) {
      console.error(e);
    }
})();
