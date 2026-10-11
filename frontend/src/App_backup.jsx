import { useState } from 'react';
import './App.css';

function App() {
const [activePage, setActivePage] = useState('Dashboard');
const [tasks, setTasks] = useState([
{ id: 1, title: 'Revise Python fundamentals', subject: 'Python', priority: 'High', completed: false },
{ id: 2, title: 'Practice SQL queries', subject: 'Database Management', priority: 'Medium', completed: false },
{ id: 3, title: 'Read React components', subject: 'Web Development', priority: 'Low', completed: true },
]);

const completedTasks = tasks.filter((task) => task.completed).length;
const progress = tasks.length
? Math.round((completedTasks / tasks.length) * 100)
: 0;

const toggleTask = (id) => {
setTasks((previousTasks) =>
previousTasks.map((task) =>
task.id === id ? { ...task, completed: !task.completed } : task
)
);
};

const addTask = () => {
const title = window.prompt('Enter your new study task:');

if (title && title.trim()) {
  setTasks((previousTasks) => [
    ...previousTasks,
    {
      id: Date.now(),
      title: title.trim(),
      subject: 'General',
      priority: 'Medium',
      completed: false,
    },
  ]);
}

};

const menuItems = [
{ name: 'Dashboard', icon: '▦' },
{ name: 'My Subjects', icon: '📚' },
{ name: 'Study Tasks', icon: '✓' },
{ name: 'AI Study Planner', icon: '🤖' },
];

return (
<div className="app-layout">
<aside className="sidebar">
<div className="brand">
<div className="brand-icon">S</div>
<div>
<h2>StudyMate<span> AI</span></h2>
<p>YOUR STUDY COMPANION</p>
</div>
</div>

    <div className="menu-label">WORKSPACE</div>

    <nav className="sidebar-menu">
      {menuItems.map((item) => (
        <button
          key={item.name}
          className={`menu-item ${activePage === item.name ? 'active' : ''}`}
          onClick={() => setActivePage(item.name)}
        >
          <span className="menu-icon">{item.icon}</span>
          {item.name}
        </button>
      ))}
    </nav>

    <div className="sidebar-bottom">
      <div className="ai-card">
        <span className="ai-card-icon">✨</span>
        <h3>Study smarter!</h3>
        <p>Let AI help you plan your learning journey.</p>
        <button onClick={() => setActivePage('AI Study Planner')}>
          Explore AI →
        </button>
      </div>

      <div className="profile">
        <div className="avatar">S</div>
        <div>
          <strong>Student</strong>
          <p>Learning every day</p>
        </div>
      </div>
    </div>
  </aside>

  <main className="main-content">
    <header className="topbar">
      <div>
        <span className="breadcrumb">Workspace / </span>
        <strong>{activePage}</strong>
      </div>
      <div className="topbar-right">
        <span className="today-badge">✦ Stay focused</span>
        <div className="avatar small-avatar">S</div>
      </div>
    </header>

    <section className="page-content">
      <div className="welcome-section">
        <div>
          <p className="eyebrow">YOUR PERSONAL LEARNING SPACE</p>
          <h1>
            Good morning, Student <span>👋</span>
          </h1>
          <p className="welcome-description">
            Small steps every day lead to big achievements. Ready to learn?
          </p>
        </div>
        <div className="welcome-illustration">📖</div>
      </div>

      <div className="section-heading">
        <div>
          <h2>Your overview</h2>
          <p>Here's how your learning journey is going.</p>
        </div>
        <button className="primary-button" onClick={addTask}>
          + Add study task
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-top">
            <span className="stat-icon purple">📚</span>
            <span className="stat-label">LEARNING</span>
          </div>
          <h3>4</h3>
          <p>Subjects to explore</p>
          <div className="stat-footer">Keep building your knowledge</div>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <span className="stat-icon orange">📝</span>
            <span className="stat-label">YOUR TASKS</span>
          </div>
          <h3>{tasks.length}</h3>
          <p>Study tasks created</p>
          <div className="stat-footer">{completedTasks} tasks completed</div>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <span className="stat-icon green">🎯</span>
            <span className="stat-label">PROGRESS</span>
          </div>
          <h3>{progress}%</h3>
          <p>Task completion rate</p>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <section className="panel tasks-panel">
          <div className="panel-heading">
            <div>
              <h2>{activePage === 'Study Tasks' ? 'All study tasks' : 'Upcoming study tasks'}</h2>
              <p>One task at a time. You've got this!</p>
            </div>
            <button className="text-button" onClick={() => setActivePage('Study Tasks')}>
              View all →
            </button>
          </div>

          <div className="task-list">
            {tasks.map((task) => (
              <div className="task-row" key={task.id}>
                <button
                  className={`task-checkbox ${task.completed ? 'checked' : ''}`}
                  onClick={() => toggleTask(task.id)}
                  aria-label={task.completed ? 'Mark task incomplete' : 'Mark task complete'}
                >
                  {task.completed ? '✓' : ''}
                </button>
                <div className="task-details">
                  <strong className={task.completed ? 'task-completed' : ''}>
                    {task.title}
                  </strong>
                  <span>{task.subject}</span>
                </div>
                <span className={`priority priority-${task.priority.toLowerCase()}`}>
                  {task.priority}
                </span>
              </div>
            ))}

            {tasks.length === 0 && (
              <div className="empty-state">
                No study tasks yet. Add your first task!
              </div>
            )}
          </div>

          <button className="add-task-link" onClick={addTask}>
            + Create another task
          </button>
        </section>

        <section className="panel subjects-panel">
          <div className="panel-heading">
            <div>
              <h2>My subjects</h2>
              <p>Your learning categories</p>
            </div>
            <button className="text-button" onClick={() => setActivePage('My Subjects')}>
              View all →
            </button>
          </div>

          <div className="subject-list">
            <div className="subject-row">
              <div className="subject-icon subject-purple">🐍</div>
              <div className="subject-details">
                <strong>Python Programming</strong>
                <span>Programming</span>
              </div>
              <span className="subject-arrow">→</span>
            </div>

            <div className="subject-row">
              <div className="subject-icon subject-blue">🗄️</div>
              <div className="subject-details">
                <strong>Database Management</strong>
                <span>Database</span>
              </div>
              <span className="subject-arrow">→</span>
            </div>

            <div className="subject-row">
              <div className="subject-icon subject-orange">💻</div>
              <div className="subject-details">
                <strong>Web Development</strong>
                <span>Development</span>
              </div>
              <span className="subject-arrow">→</span>
            </div>

            <div className="subject-row">
              <div className="subject-icon subject-green">🧠</div>
              <div className="subject-details">
                <strong>Artificial Intelligence</strong>
                <span>AI & Technology</span>
              </div>
              <span className="subject-arrow">→</span>
            </div>
          </div>
        </section>
      </div>

      <section className="ai-banner">
        <div className="ai-banner-icon">🤖</div>
        <div className="ai-banner-text">
          <span>YOUR PERSONAL AI ASSISTANT</span>
          <h2>Make a plan. Reach your goals.</h2>
          <p>Get a personalized study plan to make the most of your learning time.</p>
        </div>
        <button
          className="ai-button"
          onClick={() => setActivePage('AI Study Planner')}
        >
          Create AI Study Plan →
        </button>
      </section>

      <footer className="footer">
        <span>© 2026 StudyMate_AI</span>
        <span>Built for better learning, one day at a time 💜</span>
      </footer>
    </section>
  </main>
</div>

);
}

export default App;