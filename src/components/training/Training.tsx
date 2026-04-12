import { useState } from 'react';
import AIBadge from '../shared/AIBadge';
import './Training.css';

interface Course {
  id: string;
  title: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  progress: number;
  badge?: string;
  category: string;
  isNew?: boolean;
}

const courses: Course[] = [
  {
    id: 't1',
    title: 'Device Protection Plans 101',
    duration: '15 min',
    difficulty: 'Beginner',
    progress: 100,
    badge: 'Device Protection Certified',
    category: 'Product Knowledge',
  },
  {
    id: 't2',
    title: 'Objection handling masterclass',
    duration: '25 min',
    difficulty: 'Intermediate',
    progress: 65,
    category: 'Sales Skills',
  },
  {
    id: 't3',
    title: 'Ather EV Protection Specialist',
    duration: '40 min',
    difficulty: 'Advanced',
    progress: 0,
    category: 'EV Specialisation',
    isNew: true,
  },
  {
    id: 't4',
    title: 'Claims communication best practices',
    duration: '20 min',
    difficulty: 'Intermediate',
    progress: 0,
    category: 'Customer Experience',
  },
  {
    id: 't5',
    title: 'IMEI scan & device verification',
    duration: '10 min',
    difficulty: 'Beginner',
    progress: 100,
    badge: 'Fast Sale Expert',
    category: 'Operations',
  },
  {
    id: 't6',
    title: 'Laptop protection: Selling the value',
    duration: '18 min',
    difficulty: 'Intermediate',
    progress: 30,
    category: 'Sales Skills',
  },
];

const leaders = [
  { name: 'Priya Patel', courses: 12, score: 94 },
  { name: 'Amit Sharma', courses: 10, score: 89 },
  { name: 'Vijay Singh', courses: 9, score: 87 },
];

export default function Training() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const difficultyClass = (d: Course['difficulty']) => {
    if (d === 'Beginner') return 'badge-success';
    if (d === 'Intermediate') return 'badge-warning';
    return 'badge-purple';
  };

  if (selectedCourse) {
    return (
      <div className="training-page">
        <header className="training-detail-header">
          <button className="btn-ghost" onClick={() => setSelectedCourse(null)}>&larr; Back to courses</button>
        </header>
        <div className="training-detail-grid">
          <div className="card training-player">
            <div className="training-video-placeholder">
              <div className="play-icon">&#9654;</div>
              <div className="training-video-title">{selectedCourse.title}</div>
            </div>
            <div className="training-content">
              <h2>{selectedCourse.title}</h2>
              <div className="training-meta">
                <span className={`badge ${difficultyClass(selectedCourse.difficulty)}`}>{selectedCourse.difficulty}</span>
                <span className="text-secondary">{selectedCourse.duration}</span>
              </div>
              <h3>About this course</h3>
              <p className="text-secondary">
                In this course, you’ll learn the fundamentals of {selectedCourse.title.toLowerCase()}.
                By the end, you’ll be able to confidently explain coverage, handle common customer questions,
                and close sales 25% faster on average.
              </p>
              <h3>What you’ll learn</h3>
              <ul className="training-list">
                <li>Product features, pricing, and eligibility criteria</li>
                <li>How to explain coverage vs. exclusions clearly</li>
                <li>Handling price objections with empathy and data</li>
                <li>Closing techniques that feel natural, not pushy</li>
              </ul>

              <div className="training-ai-coach">
                <AIBadge label="AI Sales Coach" shimmer />
                <div>
                  <strong>3 things to focus on during your next sale</strong>
                  <ol>
                    <li>Lead with the "peace of mind" framing before quoting the premium.</li>
                    <li>For mid-range devices, emphasise battery + screen coverage specifically.</li>
                    <li>End the conversation with a clear CTA: "Shall I activate it now?"</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          <aside className="training-sidebar-detail">
            <div className="card">
              <h3>Course progress</h3>
              <div className="training-progress-ring">
                <svg viewBox="0 0 100 100" width="120" height="120">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#E2E8F0" strokeWidth="8" />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 42}`}
                    strokeDashoffset={`${2 * Math.PI * 42 * (1 - selectedCourse.progress / 100)}`}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="training-progress-text">{selectedCourse.progress}%</div>
              </div>
              <button className="btn-primary" style={{ width: '100%' }}>
                {selectedCourse.progress === 100 ? 'Revisit course' : 'Resume course'}
              </button>
            </div>

            <div className="card">
              <h3>Quiz</h3>
              <p className="text-secondary">Test your knowledge with a short 10-question assessment.</p>
              <button className="btn-secondary" style={{ width: '100%' }}>Start quiz</button>
            </div>
          </aside>
        </div>
      </div>
    );
  }

  return (
    <div className="training-page">
      <header className="training-header">
        <div>
          <h1 className="page-title">Training & Skill Development</h1>
          <p className="text-secondary">Learn, certify and get promoted to the next tier</p>
        </div>
      </header>

      <div className="training-new-launch">
        <AIBadge label="New launch" />
        <div>
          <strong>New: Ather EV Protection Specialist</strong>
          <span className="text-secondary">Become certified on EV battery protection plans — unlocks new sale categories</span>
        </div>
        <button className="btn-primary">Start learning</button>
      </div>

      <div className="training-layout">
        <main className="training-main">
          <div className="section-title" style={{ marginBottom: 'var(--space-4)' }}>All courses</div>
          <div className="training-grid">
            {courses.map((c) => (
              <div key={c.id} className="training-card card" onClick={() => setSelectedCourse(c)}>
                <div className="training-thumb">
                  <svg viewBox="0 0 200 120" width="100%" height="100%">
                    <defs>
                      <linearGradient id={`tg-${c.id}`} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="100%" stopColor="#6366F1" />
                      </linearGradient>
                    </defs>
                    <rect width="200" height="120" fill={`url(#tg-${c.id})`} />
                    <circle cx="100" cy="60" r="24" fill="white" fillOpacity="0.25" />
                    <polygon points="93,50 93,70 112,60" fill="white" />
                  </svg>
                  {c.isNew && <span className="training-new-badge">New</span>}
                </div>
                <div className="training-body">
                  <div className="training-category">{c.category}</div>
                  <div className="training-title">{c.title}</div>
                  <div className="training-meta">
                    <span className={`badge ${difficultyClass(c.difficulty)}`}>{c.difficulty}</span>
                    <span className="text-tertiary">{c.duration}</span>
                  </div>
                  <div className="training-progress-bar">
                    <div className="training-progress-fill" style={{ width: `${c.progress}%` }} />
                  </div>
                  {c.progress === 100 && c.badge && (
                    <div className="training-badge-earned">
                      <span>&#127942;</span> {c.badge}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </main>

        <aside className="training-sidebar">
          <div className="card">
            <h3>Top learners</h3>
            <div className="leader-list">
              {leaders.map((l, i) => (
                <div key={l.name} className="leader-row">
                  <div className={`leader-rank rank-${i + 1}`}>{i + 1}</div>
                  <div className="leader-info">
                    <div className="leader-name">{l.name}</div>
                    <div className="leader-meta">{l.courses} courses &middot; {l.score}% avg</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card training-recommend">
            <AIBadge label="Recommended for you" />
            <div className="recommend-body">
              <strong>Claims communication best practices</strong>
              <p className="text-secondary">
                Your screen damage claim rate is high among your customers. Learn how to correctly
                communicate coverage boundaries at point-of-sale.
              </p>
              <button className="btn-secondary">View course</button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
