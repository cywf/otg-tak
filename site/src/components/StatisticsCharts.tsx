import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface RepoStats {
  stars: number;
  forks: number;
  watchers: number;
  languages: Record<string, number>;
  commitActivity: Array<{ week: string; commits: number }>;
}

export default function StatisticsCharts() {
  const [stats, setStats] = useState<RepoStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const base = import.meta.env.BASE_URL;
    fetch(`${base}/data/stats.json`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch stats');
        return res.json();
      })
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <div className="skeleton h-8 w-48 mb-4"></div>
                <div className="skeleton h-64 w-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="alert alert-warning">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>Statistics data not available. Run the data fetch scripts to generate stats.</span>
        </div>
      </div>
    );
  }

  // Language breakdown for pie chart
  const languageData = {
    labels: Object.keys(stats.languages),
    datasets: [
      {
        label: 'Lines of Code',
        data: Object.values(stats.languages),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Commit activity
  const commitData = {
    labels: stats.commitActivity.map((a) => a.week),
    datasets: [
      {
        label: 'Commits',
        data: stats.commitActivity.map((a) => a.commits),
        backgroundColor: 'rgba(0, 255, 159, 0.6)',
        borderColor: 'rgba(0, 255, 159, 1)',
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  // Repository metrics
  const metricsData = {
    labels: ['Stars', 'Forks', 'Watchers'],
    datasets: [
      {
        label: 'Count',
        data: [stats.stars, stats.forks, stats.watchers],
        backgroundColor: [
          'rgba(255, 215, 0, 0.8)',
          'rgba(0, 191, 255, 0.8)',
          'rgba(50, 205, 50, 0.8)',
        ],
        borderColor: [
          'rgba(255, 215, 0, 1)',
          'rgba(0, 191, 255, 1)',
          'rgba(50, 205, 50, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: 'hsl(var(--bc))',
        },
      },
    },
  };

  const barOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: 'hsl(var(--bc))',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      x: {
        ticks: {
          color: 'hsl(var(--bc))',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  };

  const lineOptions = {
    ...barOptions,
    plugins: {
      ...chartOptions.plugins,
      title: {
        display: true,
        text: 'Last 12 Weeks',
        color: 'hsl(var(--bc))',
      },
    },
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Repository Metrics */}
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">Repository Metrics</h2>
            <div className="h-64">
              <Bar data={metricsData} options={barOptions} />
            </div>
          </div>
        </div>

        {/* Language Breakdown */}
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">Language Breakdown</h2>
            <div className="h-64 flex items-center justify-center">
              <Pie data={languageData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Commit Activity */}
        <div className="card bg-base-200 shadow-xl lg:col-span-2">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">Commit Activity</h2>
            <div className="h-64">
              <Line data={commitData} options={lineOptions} />
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="card bg-base-200 shadow-xl lg:col-span-2">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">Summary</h2>
            <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
              <div className="stat">
                <div className="stat-figure text-warning">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                  </svg>
                </div>
                <div className="stat-title">Stars</div>
                <div className="stat-value text-warning">{stats.stars}</div>
                <div className="stat-desc">GitHub stars</div>
              </div>

              <div className="stat">
                <div className="stat-figure text-info">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                  </svg>
                </div>
                <div className="stat-title">Forks</div>
                <div className="stat-value text-info">{stats.forks}</div>
                <div className="stat-desc">Repository forks</div>
              </div>

              <div className="stat">
                <div className="stat-figure text-success">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="stat-title">Watchers</div>
                <div className="stat-value text-success">{stats.watchers}</div>
                <div className="stat-desc">Active watchers</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
