import fs from 'fs';
(async () => {
    try {
      const runsRes = await fetch('https://api.github.com/repos/batrapulkit/shield-spark-score/actions/runs');
      const runsData = await runsRes.json();
      const latestRun = runsData.workflow_runs[0];
      
      console.log(`Status: ${latestRun.status}, Conclusion: ${latestRun.conclusion}`);
    } catch (e) {
      console.error(e);
    }
})();
