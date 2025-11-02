import { useEffect, useState } from 'react';

interface ProjectItem {
  title: string;
  status: string;
  labels: string[];
  assignees: string[];
  url: string;
}

interface ProjectsData {
  columns: Record<string, ProjectItem[]>;
}

export default function DevelopmentBoard() {
  const [projects, setProjects] = useState<ProjectsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const base = import.meta.env.BASE_URL;
    fetch(`${base}/data/projects.json`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch projects');
        return res.json();
      })
      .then((data) => {
        setProjects(data);
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4">
              <div className="skeleton h-8 w-32 mb-4"></div>
              <div className="skeleton h-32 w-full"></div>
              <div className="skeleton h-32 w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !projects) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="alert alert-warning">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>Project data not available. Run the data fetch scripts to generate the development board.</span>
        </div>
      </div>
    );
  }

  const columnNames = Object.keys(projects.columns);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {columnNames.map((column) => (
          <div key={column} className="flex flex-col">
            <div className="bg-base-300 rounded-t-lg p-4">
              <h2 className="text-xl font-bold flex items-center justify-between">
                <span>{column}</span>
                <span className="badge badge-primary">{projects.columns[column].length}</span>
              </h2>
            </div>
            <div className="bg-base-200 rounded-b-lg p-4 flex-1 space-y-4">
              {projects.columns[column].length === 0 ? (
                <div className="text-center py-8 opacity-50">
                  <p>No items</p>
                </div>
              ) : (
                projects.columns[column].map((item, index) => (
                  <div key={index} className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
                    <div className="card-body p-4">
                      <h3 className="card-title text-sm">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link link-hover"
                        >
                          {item.title}
                        </a>
                      </h3>
                      {item.labels.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.labels.slice(0, 3).map((label, i) => (
                            <span key={i} className="badge badge-sm badge-outline">
                              {label}
                            </span>
                          ))}
                          {item.labels.length > 3 && (
                            <span className="badge badge-sm badge-ghost">
                              +{item.labels.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                      {item.assignees.length > 0 && (
                        <div className="flex items-center gap-2 mt-2 text-xs opacity-70">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                          </svg>
                          <span>{item.assignees.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
