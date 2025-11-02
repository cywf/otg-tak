import { useEffect, useState } from 'react';

interface Discussion {
  title: string;
  author: string;
  url: string;
  createdAt: string;
  category: string;
}

export default function DiscussionsList() {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    const base = import.meta.env.BASE_URL;
    fetch(`${base}/data/discussions.json`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch discussions');
        return res.json();
      })
      .then((data) => {
        setDiscussions(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filteredDiscussions = discussions.filter((discussion) => {
    const matchesSearch =
      discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      discussion.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === 'all' || discussion.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(discussions.map((d) => d.category)))];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="card bg-base-200">
              <div className="card-body">
                <div className="skeleton h-6 w-3/4 mb-2"></div>
                <div className="skeleton h-4 w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="alert alert-warning">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>Discussions data not available. Run the data fetch scripts to generate discussions list.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="form-control flex-1">
          <input
            type="text"
            placeholder="Search discussions by title or author..."
            className="input input-bordered w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="form-control md:w-64">
          <select
            className="select select-bordered w-full"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-sm opacity-70">
          Showing {filteredDiscussions.length} of {discussions.length} discussions
        </p>
      </div>

      {/* Discussions List */}
      {filteredDiscussions.length === 0 ? (
        <div className="alert">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>No discussions found matching your criteria.</span>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDiscussions.map((discussion, index) => (
            <div key={index} className="card bg-base-200 shadow-xl hover:shadow-2xl transition-shadow">
              <div className="card-body">
                <h3 className="card-title">
                  <a
                    href={discussion.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link link-hover text-primary"
                  >
                    {discussion.title}
                  </a>
                </h3>
                <div className="flex flex-wrap gap-2 items-center text-sm opacity-70">
                  <div className="badge badge-outline">{discussion.category}</div>
                  <span>by {discussion.author}</span>
                  <span>•</span>
                  <span>{new Date(discussion.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="card-actions justify-end mt-2">
                  <a
                    href={discussion.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-ghost gap-2"
                  >
                    View on GitHub
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
