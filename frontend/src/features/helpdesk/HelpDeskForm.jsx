import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addComplaint } from './complaintsSlice';

const HelpDeskForm = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'bug',
    priority: 'medium',
    subject: '',
    description: '',
    steps: '',
  });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const autoFill = () => {
    const names = ['Dr. Rajesh Sharma', 'Dr. Priya Patel', 'Dr. Amit Kumar', 'Dr. Sneha Gupta', 'Dr. Rahul Verma'];
    const emails = ['rajesh@hospital.com', 'priya@clinic.com', 'amit@medical.org', 'sneha@healthcare.in', 'rahul@doctor.net'];
    const categories = ['bug', 'feature', 'performance', 'ui', 'data', 'security'];
    const priorities = ['low', 'medium', 'high', 'critical'];
    const subjects = [
      'Login page not loading properly',
      'Data export feature crashing',
      'Search results showing wrong data',
      'Dashboard charts not updating',
      'Mobile view layout broken',
      'Slow page load time on interactions',
      'CSV export missing columns',
      'Chat assistant not responding'
    ];
    const descriptions = [
      'When I try to login, the page keeps loading indefinitely. This happens every time after the latest update.',
      'The export to CSV feature crashes when there are more than 100 records. It shows a blank page instead.',
      'Search results are showing records from other users instead of my own data.',
      'The analytics dashboard charts are not refreshing even after new data is added.',
      'On mobile devices, the form fields overlap each other making it impossible to fill.',
      'The interactions page takes more than 10 seconds to load with 500+ records.',
      'When exporting to CSV, the summary and topics columns are missing from the output.',
      'The AI chat assistant shows "Thinking..." forever and never responds to messages.'
    ];
    const steps = [
      '1. Go to the login page\n2. Enter valid credentials\n3. Click Login button\n4. Page shows loading spinner indefinitely',
      '1. Navigate to All Records\n2. Select 100+ records\n3. Click Export CSV\n4. Page goes blank',
      '1. Click on search bar\n2. Type any search term\n3. Results show other users\' data',
      '1. Go to dashboard\n2. Add new interaction\n3. Refresh page\n4. Charts still show old data',
      '1. Open on mobile device\n2. Navigate to Log Interaction form\n3. Fields overlap on small screens',
      '1. Login to the app\n2. Go to All Records with 500+ entries\n3. Wait for page to load\n4. Takes 10+ seconds',
      '1. Go to All Records\n2. Click Export CSV\n3. Open the CSV file\n4. Summary and Topics columns are missing',
      '1. Open AI Chat\n2. Type any message\n3. Click Send\n4. Shows "Thinking..." forever'
    ];

    const idx = Math.floor(Math.random() * names.length);
    const catIdx = Math.floor(Math.random() * categories.length);
    const priIdx = Math.floor(Math.random() * priorities.length);
    const subIdx = Math.floor(Math.random() * subjects.length);

    setFormData({
      name: names[idx],
      email: emails[idx],
      category: categories[catIdx],
      priority: priorities[priIdx],
      subject: subjects[subIdx],
      description: descriptions[subIdx],
      steps: steps[subIdx],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('loading');

    setTimeout(() => {
      dispatch(addComplaint({
        name: formData.name,
        email: formData.email,
        category: formData.category,
        priority: formData.priority,
        subject: formData.subject,
        description: formData.description,
        steps: formData.steps,
      }));

      setStatus('success');
      setFormData({ name: '', email: '', category: 'bug', priority: 'medium', subject: '', description: '', steps: '' });
      setTimeout(() => setStatus(null), 3000);
    }, 800);
  };

  const priorityConfig = {
    low: { color: '#10b981', bg: '#ecfdf5', icon: '🟢' },
    medium: { color: '#f59e0b', bg: '#fffbeb', icon: '🟡' },
    high: { color: '#f97316', bg: '#fff7ed', icon: '🟠' },
    critical: { color: '#dc2626', bg: '#fef2f2', icon: '🔴' }
  };

  const categoryConfig = {
    bug: { icon: '🐛', label: 'Bug Report' },
    feature: { icon: '💡', label: 'Feature Request' },
    performance: { icon: '⚡', label: 'Performance' },
    ui: { icon: '🎨', label: 'UI Issue' },
    data: { icon: '📊', label: 'Data Issue' },
    security: { icon: '🔒', label: 'Security' }
  };

  return (
    <div className="crm-card">
      <div className="crm-card-header">
        <div className="crm-card-header-left">
          <div className="crm-card-header-icon amber">🎧</div>
          <div>
            <h2 className="crm-card-title">Help Desk</h2>
            <p className="crm-card-subtitle">Report issues & get support</p>
          </div>
        </div>
      </div>

      <div className="crm-card-body">
        {status === 'success' && (
          <div className="crm-alert crm-alert-success">
            <span>✅</span> Complaint submitted successfully! We'll get back to you soon.
          </div>
        )}

        {status === 'error' && (
          <div className="crm-alert crm-alert-error">
            <span>❌</span> Failed to submit. Please try again.
          </div>
        )}

        <form onSubmit={handleSubmit} className="crm-form">
          <div className="crm-form-row">
            <div className="crm-field">
              <label className="crm-label">Name <span className="required">*</span></label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="crm-input"
                placeholder="Your name"
              />
            </div>
            <div className="crm-field">
              <label className="crm-label">Email <span className="required">*</span></label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="crm-input"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div className="crm-form-row">
            <div className="crm-field">
              <label className="crm-label">Category <span className="required">*</span></label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="crm-select"
              >
                {Object.entries(categoryConfig).map(([key, config]) => (
                  <option key={key} value={key}>{config.icon} {config.label}</option>
                ))}
              </select>
            </div>
            <div className="crm-field">
              <label className="crm-label">Priority <span className="required">*</span></label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="crm-select"
              >
                {Object.entries(priorityConfig).map(([key, config]) => (
                  <option key={key} value={key}>{config.icon} {key.charAt(0).toUpperCase() + key.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="crm-field">
            <label className="crm-label">Subject <span className="required">*</span></label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="crm-input"
              placeholder="Brief summary of the issue"
            />
          </div>

          <div className="crm-field">
            <label className="crm-label">Description <span className="required">*</span></label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              className="crm-textarea"
              placeholder="Describe the issue in detail..."
            />
          </div>

          <div className="crm-field">
            <label className="crm-label">Steps to Reproduce</label>
            <textarea
              name="steps"
              value={formData.steps}
              onChange={handleChange}
              rows={3}
              className="crm-textarea"
              placeholder="1. Go to...&#10;2. Click on...&#10;3. Observe..."
            />
          </div>

          <div className="crm-btn-row">
            <button type="button" onClick={autoFill} className="crm-btn crm-btn-success" data-tooltip="Auto Fill">
              ⚡ Auto Fill
            </button>
            <button 
              type="submit" 
              disabled={status === 'loading'} 
              className={`submit-complaint-btn ${status === 'success' ? 'success' : ''} ${status === 'error' ? 'error' : ''}`}
              aria-label={status === 'loading' ? 'Submitting complaint...' : 'Submit complaint'}
            >
              {status === 'loading' ? (
                <>
                  <span className="submit-complaint-spinner"></span>
                  <span>Submitting...</span>
                </>
              ) : status === 'success' ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>Complaint Submitted</span>
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    <path d="M12 8v4"/>
                    <path d="M12 16h.01"/>
                  </svg>
                  <span>Submit Complaint</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HelpDeskForm;
