import { useMemo, useState } from 'react';
import './App.css';
import { stories } from './stories/registry';

function App() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeStory = useMemo(() => stories.find((story) => story.id === activeId) ?? null, [activeId]);

  return (
    <div className={`app-shell${activeStory ? ' app-shell--story' : ''}`}>
      <header className="app-header">
        <h1>AI 互动动画案例库</h1>
        <p>挑选一个案例，看看 GSAP 积木如何帮 AI 讲清复杂商业故事。</p>
      </header>

      {activeStory ? (
        <div className="story-container">{activeStory.render({ onBack: () => setActiveId(null) })}</div>
      ) : (
        <main className="stories-grid">
          {stories.map((story) => (
            <article key={story.id} className="story-card">
              <div className="story-card__body">
                <h2>{story.title}</h2>
                <p>{story.summary}</p>
              </div>
              <div className="story-card__meta">
                <div className="story-card__tags">
                  {story.tags?.map((tag) => (
                    <span key={tag} className="story-tag">
                      {tag}
                    </span>
                  ))}
                </div>
                <button type="button" className="primary-button" onClick={() => setActiveId(story.id)}>
                  进入案例
                </button>
              </div>
            </article>
          ))}
        </main>
      )}
    </div>
  );
}

export default App;

