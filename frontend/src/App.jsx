import { useEffect, useState } from 'react';
import './App.css';

const API_URL = 'http://127.0.0.1:8000/api';

function App() {
  const [activePage, setActivePage] = useState('Dashboard');
  const [tasks, setTasks] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [aiSubject, setAiSubject] = useState('Python');
  const [aiDays, setAiDays] = useState(7);
  const [aiHours, setAiHours] = useState(2);
  const [aiPlan, setAiPlan] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError('');

    try {
      const [tasksResponse, subjectsResponse] = await Promise.all([
        fetch(`${API_URL}/tasks/`),
        fetch(`${API_URL}/subjects/`),
      ]);

      if (!tasksResponse.ok || !subjectsResponse.ok) {
        throw new Error('Could not load data from Django.');
      }

      const tasksData = await tasksResponse.json();
      const subjectsData = await subjectsResponse.json();

      setTasks(tasksData);
      setSubjects(subjectsData);
    } catch (err) {
      setError(
        'Unable to connect to the backend. Please check that Django is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const completedTasks = tasks.filter(
    (task) => task.status === 'COMPLETED'
  ).length;

  const progress = tasks.length
    ? Math.round((completedTasks / tasks.length) * 100)
    : 0;

  const toggleTask = async (task) => {
    const newStatus =
      task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';

    try {
      const response = await fetch(
        `${API_URL}/tasks/${task.id}/update_status/`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error('Task status update failed.');
      }

      const updatedTask = await response.json();

      setTasks((previousTasks) =>
        previousTasks.map((item) =>
          item.id === updatedTask.id ? updatedTask : item
        )
      );
    } catch (err) {
      alert('Could not update task status. Please try again.');
    }
  };

  const addTask = async () => {
  const title = window.prompt('Enter your new study task:');

  if (!title || !title.trim()) {
    return;
  }

  if (subjects.length === 0) {
    alert('Please create a subject before adding a study task.');
    return;
  }

  const subjectOptions = subjects
    .map((subject, index) => `${index + 1}. ${subject.name}`)
    .join('\n');

  const subjectChoice = window.prompt(
    `Select a subject by entering its number:\n\n${subjectOptions}`,
    '1'
  );

  if (subjectChoice === null) {
    return;
  }

  const choiceNumber = Number(subjectChoice);

  if (
    !Number.isInteger(choiceNumber) ||
    choiceNumber < 1 ||
    choiceNumber > subjects.length
  ) {
    alert('Invalid selection. Please try again.');
    return;
  }

  const selectedSubject = subjects[choiceNumber - 1];

  try {
    const response = await fetch(`${API_URL}/tasks/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: title.trim(),
        description: '',
        subject: selectedSubject.id,
        deadline: null,
        priority: 'MEDIUM',
        status: 'PENDING',
      }),
    });

    if (!response.ok) {
      throw new Error('Could not create task.');
    }

    const newTask = await response.json();

    setTasks((previousTasks) => [...previousTasks, newTask]);

    alert(`Study task added successfully under ${selectedSubject.name}!`);
  } catch (err) {
    alert('Could not add the task. Please try again.');
  }
};

const addSubject = async () => {
const name = window.prompt('Enter the new subject name:');

if (!name || !name.trim()) {
return;
}

const description = window.prompt(
'Enter a short description (optional):',
''
);

try {
const response = await fetch('http://127.0.0.1:8000/api/subjects/', {
method: 'POST',
headers: {
'Content-Type': 'application/json',
},
body: JSON.stringify({
name: name.trim(),
description: description ? description.trim() : '',
}),
});

if (!response.ok) {
  const errorData = await response.json();
  throw new Error(
    errorData.name?.[0] ||
    errorData.detail ||
    'Could not create subject.'
  );
}

const newSubject = await response.json();

setSubjects((previousSubjects) =>
  [...previousSubjects, newSubject].sort((a, b) =>
    a.name.localeCompare(b.name)
  )
);

alert(`Subject "${newSubject.name}" added successfully!`);

} catch (err) {
alert(err.message || 'Could not add the subject. Please try again.');
}
};
const generateAIStudyPlan = async () => {
    if (!aiSubject.trim()) {
      alert('Please enter a subject.');
      return;
    }

    setAiLoading(true);
    setAiPlan('');

    try {
      const response = await fetch(`${API_URL}/ai-study-plan/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: aiSubject.trim(),
          days: Number(aiDays),
          hours_per_day: Number(aiHours),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Could not generate a study plan.');
      }

      setAiPlan(data.study_plan);
    } catch (err) {
      setAiPlan(`Error: ${err.message}`);
    } finally {
      setAiLoading(false);
    }
  };

  const menuItems = [
    { name: 'Dashboard', icon: '▦' },
    { name: 'My Subjects', icon: '📚' },
    { name: 'Study Tasks', icon: '✓' },
    { name: 'AI Study Planner', icon: '🤖' },
  ];

  const visibleTasks =
    activePage === 'Study Tasks'
      ? tasks
      : tasks.filter((task) => task.status !== 'COMPLETED');

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">S</div>
          <div>
            <h2>
              StudyMate<span> AI</span>
            </h2>
            <p>YOUR STUDY COMPANION</p>
          </div>
        </div>

        <div className="menu-label">WORKSPACE</div>

        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <button
              key={item.name}
              className={`menu-item ${
                activePage === item.name ? 'active' : ''
              }`}
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
          
         {activePage === 'My Subjects' && (
<section className="panel subjects-page">
<div className="panel-heading">
<div>
<h2>📚 My Subjects</h2>
<p>Manage your subjects and organize your learning.</p>
</div>

            <button className="primary-button" onClick={addSubject}>
              + Add Subject
            </button>
          </div>

          <div className="subject-list">
            {subjects.map((subject) => (
              <div className="subject-row" key={subject.id}>
                <div className="subject-icon subject-purple">📚</div>

                <div className="subject-details">
                  <strong>{subject.name}</strong>
                  <span>
                    {subject.description || 'Study subject'}
                  </span>
                </div>
              </div>
            ))}

            {subjects.length === 0 && (
              <div className="empty-state">
                No subjects yet. Click + Add Subject to create one.
              </div>
            )}
          </div>
        </section>
      )}
       {activePage === 'AI Study Planner' && (
            <section className="panel ai-planner-panel">
              <div className="panel-heading">
                <div>
                  <h2>🤖 AI Study Planner</h2>
                  <p>
                    Create a personalized study plan using Ollama AI.
                  </p>
                </div>
              </div>

              <div className="ai-planner-form">
                <label htmlFor="ai-subject">Subject</label>
                <input
                  id="ai-subject"
                  type="text"
                  value={aiSubject}
                  onChange={(event) => setAiSubject(event.target.value)}
                  placeholder="Enter a subject, e.g. Python"
                />

                <label htmlFor="ai-days">Number of days</label>
                <input
                  id="ai-days"
                  type="number"
                  min="1"
                  max="30"
                  value={aiDays}
                  onChange={(event) => setAiDays(event.target.value)}
                />

                <label htmlFor="ai-hours">Study hours per day</label>
                <input
                  id="ai-hours"
                  type="number"
                  min="0.5"
                  max="12"
                  step="0.5"
                  value={aiHours}
                  onChange={(event) => setAiHours(event.target.value)}
                />

                <button
                  className="primary-button"
                  onClick={generateAIStudyPlan}
                  disabled={aiLoading}
                >
                  {aiLoading
                    ? 'Generating your plan...'
                    : '✨ Generate Study Plan'}
                </button>
              </div>

              {aiPlan && (
                <div className="ai-plan-result">
  <h3>Your Personalized Study Plan</h3>

  <div className="ai-plan-text">
    {aiPlan.split('\n').map((line, index) => {
      const cleanedLine = line
        .replace(/\*\*/g, '')
        .replace(/^\s*\*\s+/, '')
        .trim();

      if (!cleanedLine) {
        return <div key={index} className="plan-spacer" />;
      }

      const isDayHeading = /^Day \d+:/i.test(cleanedLine);

      const labelMatch = cleanedLine.match(
        /^(Topic|Time|Activity \d+|Break|Remember):\s*(.*)$/i
      );

      if (isDayHeading) {
        return <h4 key={index}>{cleanedLine}</h4>;
      }

      if (labelMatch) {
        return (
          <p key={index}>
            <strong>{labelMatch[1]}:</strong>{' '}
            {labelMatch[2]}
          </p>
        );
      }

      return <p key={index}>{cleanedLine}</p>;
    })}
  </div>
</div>
              )}
            </section>
          )}
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

          {error && (
            <div className="empty-state">
              {error}
              <button className="text-button" onClick={loadData}>
                Retry
              </button>
            </div>
          )}

          {loading ? (
            <div className="empty-state">Loading your study data...</div>
          ) : (
            <>
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
                  <h3>{subjects.length}</h3>
                  <p>Subjects to explore</p>
                  <div className="stat-footer">
                    Keep building your knowledge
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-top">
                    <span className="stat-icon orange">📝</span>
                    <span className="stat-label">YOUR TASKS</span>
                  </div>
                  <h3>{tasks.length}</h3>
                  <p>Study tasks created</p>
                  <div className="stat-footer">
                    {completedTasks} tasks completed
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-top">
                    <span className="stat-icon green">🎯</span>
                    <span className="stat-label">PROGRESS</span>
                  </div>
                  <h3>{progress}%</h3>
                  <p>Task completion rate</p>
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="dashboard-grid">
                <section className="panel tasks-panel">
                  <div className="panel-heading">
                    <div>
                      <h2>
                        {activePage === 'Study Tasks'
                          ? 'All study tasks'
                          : 'Upcoming study tasks'}
                      </h2>
                      <p>One task at a time. You've got this!</p>
                    </div>

                    <button
                      className="text-button"
                      onClick={() => setActivePage('Study Tasks')}
                    >
                      View all →
                    </button>
                  </div>

                  <div className="task-list">
                    {visibleTasks.map((task) => (
                      <div className="task-row" key={task.id}>
                        <button
                          className={`task-checkbox ${
                            task.status === 'COMPLETED' ? 'checked' : ''
                          }`}
                          onClick={() => toggleTask(task)}
                          aria-label={
                            task.status === 'COMPLETED'
                              ? 'Mark task incomplete'
                              : 'Mark task complete'
                          }
                        >
                          {task.status === 'COMPLETED' ? '✓' : ''}
                        </button>

                        <div className="task-details">
                          <strong
                            className={
                              task.status === 'COMPLETED'
                                ? 'task-completed'
                                : ''
                            }
                          >
                            {task.title}
                          </strong>
                          <span>{task.subject_name || 'General'}</span>
                        </div>

                        <span
                          className={`priority priority-${(
                            task.priority || 'MEDIUM'
                          ).toLowerCase()}`}
                        >
                          {task.priority}
                        </span>
                      </div>
                    ))}

                    {visibleTasks.length === 0 && (
                      <div className="empty-state">
                        No study tasks to display.
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
                    <button
                      className="text-button"
                      onClick={() => setActivePage('My Subjects')}
                    >
                      View all →
                    </button>
                  </div>

                  <div className="subject-list">
                    {subjects.map((subject) => (
                      <div className="subject-row" key={subject.id}>
                        <div className="subject-icon subject-purple">📚</div>
                        <div className="subject-details">
                          <strong>{subject.name}</strong>
                          <span>{subject.description || 'Study subject'}</span>
                        </div>
                        <span className="subject-arrow">→</span>
                      </div>
                    ))}

                    {subjects.length === 0 && (
                      <div className="empty-state">
                        No subjects found. Add a subject through the API.
                      </div>
                    )}
                  </div>
                </section>
              </div>

              <section className="ai-banner">
                <div className="ai-banner-icon">🤖</div>
                <div className="ai-banner-text">
                  <span>YOUR PERSONAL AI ASSISTANT</span>
                  <h2>Make a plan. Reach your goals.</h2>
                  <p>
                    Get a personalized study plan to make the most of your
                    learning time.
                  </p>
                </div>
                <button
                  className="ai-button"
                  onClick={() => setActivePage('AI Study Planner')}
                >
                  Create AI Study Plan →
                </button>
              </section>
            </>
          )}

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