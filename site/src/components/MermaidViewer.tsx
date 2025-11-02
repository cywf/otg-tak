import { useEffect, useState, useRef } from 'react';
import mermaid from 'mermaid';

interface Diagram {
  name: string;
  filename: string;
  content: string;
}

export default function MermaidViewer() {
  const [diagrams, setDiagrams] = useState<Diagram[]>([]);
  const [selectedDiagram, setSelectedDiagram] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mermaidRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      themeVariables: {
        darkMode: true,
        background: '#0f0f0f',
        primaryColor: '#00ff9f',
        secondaryColor: '#ff00ff',
        tertiaryColor: '#00ffff',
      },
    });

    // Fetch list of diagrams
    const base = import.meta.env.BASE_URL;
    const diagramFiles = [
      'architecture.mmd',
      'flowchart.mmd',
      'bpmnish.mmd',
      'er.mmd',
      'ci-sequence.mmd',
    ];

    Promise.all(
      diagramFiles.map((file) =>
        fetch(`${base}/diagrams/${file}`)
          .then((res) => {
            if (!res.ok) throw new Error(`Failed to load ${file}`);
            return res.text();
          })
          .then((content) => ({
            name: file.replace('.mmd', '').replace(/-/g, ' ').toUpperCase(),
            filename: file,
            content,
          }))
          .catch(() => null)
      )
    )
      .then((results) => {
        const validDiagrams = results.filter((d): d is Diagram => d !== null);
        setDiagrams(validDiagrams);
        if (validDiagrams.length > 0) {
          setSelectedDiagram(validDiagrams[0].filename);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (selectedDiagram && mermaidRef.current) {
      const diagram = diagrams.find((d) => d.filename === selectedDiagram);
      if (diagram) {
        mermaidRef.current.innerHTML = '';
        const div = document.createElement('div');
        div.className = 'mermaid';
        div.textContent = diagram.content;
        mermaidRef.current.appendChild(div);

        mermaid.run({
          querySelector: '.mermaid',
        }).catch((err) => {
          console.error('Mermaid rendering error:', err);
          if (mermaidRef.current) {
            mermaidRef.current.innerHTML = `
              <div class="alert alert-error">
                <span>Error rendering diagram: ${err.message}</span>
              </div>
            `;
          }
        });
      }
    }
  }, [selectedDiagram, diagrams]);

  // Handle hash-based deep linking
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash && diagrams.some((d) => d.filename === hash)) {
      setSelectedDiagram(hash);
    }
  }, [diagrams]);

  const handleDiagramChange = (filename: string) => {
    setSelectedDiagram(filename);
    window.location.hash = filename;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <span className="loading loading-spinner loading-lg mb-4"></span>
          <p>Loading diagrams...</p>
        </div>
      </div>
    );
  }

  if (error || diagrams.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="alert alert-warning">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>No diagrams found. Make sure Mermaid files are copied to the public/diagrams folder.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Diagram Selector */}
      <div className="mb-6">
        <div className="tabs tabs-boxed bg-base-200 flex-wrap">
          {diagrams.map((diagram) => (
            <button
              key={diagram.filename}
              className={`tab ${selectedDiagram === diagram.filename ? 'tab-active' : ''}`}
              onClick={() => handleDiagramChange(diagram.filename)}
            >
              {diagram.name}
            </button>
          ))}
        </div>
      </div>

      {/* Diagram Display */}
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <div
            ref={mermaidRef}
            className="flex items-center justify-center overflow-auto min-h-[400px] bg-base-100 rounded-lg p-6"
          />
        </div>
      </div>

      {/* Info */}
      <div className="mt-6">
        <div className="alert alert-info">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div>
            <h3 className="font-bold">About these diagrams</h3>
            <div className="text-sm">
              These Mermaid diagrams are sourced from the{' '}
              <a
                href="https://github.com/cywf/otg-tak/tree/main/mermaid"
                target="_blank"
                rel="noopener noreferrer"
                className="link"
              >
                /mermaid directory
              </a>{' '}
              in the repository. Add new .mmd files there to include them here.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
