import { createSlice } from '@reduxjs/toolkit';

const initialComplaints = [
  { id: 1, subject: 'Login page not loading', category: 'bug', status: 'resolved', priority: 'high', date: '2026-07-08', assignee: 'Dev Team', name: 'Dr. Rajesh', email: 'rajesh@hospital.com', description: 'Login page stuck on loading spinner' },
  { id: 2, subject: 'Data export crashing', category: 'bug', status: 'pending', priority: 'critical', date: '2026-07-09', assignee: 'Backend Team', name: 'Dr. Priya', email: 'priya@clinic.com', description: 'CSV export fails with 100+ records' },
  { id: 3, subject: 'Mobile view broken', category: 'ui', status: 'in-progress', priority: 'medium', date: '2026-07-09', assignee: 'Frontend Team', name: 'Dr. Amit', email: 'amit@medical.org', description: 'Form fields overlap on mobile' },
  { id: 4, subject: 'Slow page load time', category: 'performance', status: 'resolved', priority: 'high', date: '2026-07-07', assignee: 'DevOps', name: 'Dr. Sneha', email: 'sneha@healthcare.in', description: 'Interactions page takes 10+ seconds' },
  { id: 5, subject: 'Search showing wrong data', category: 'data', status: 'pending', priority: 'critical', date: '2026-07-10', assignee: 'Backend Team', name: 'Dr. Rahul', email: 'rahul@doctor.net', description: 'Search returns other users data' },
  { id: 6, subject: 'Add dark mode', category: 'feature', status: 'in-progress', priority: 'low', date: '2026-07-06', assignee: 'Frontend Team', name: 'Dr. Rajesh', email: 'rajesh@hospital.com', description: 'Request for dark mode theme' },
  { id: 7, subject: 'CSV export missing columns', category: 'bug', status: 'resolved', priority: 'medium', date: '2026-07-08', assignee: 'Dev Team', name: 'Dr. Priya', email: 'priya@clinic.com', description: 'Summary and topics columns missing' },
  { id: 8, subject: 'Chat not responding', category: 'bug', status: 'pending', priority: 'high', date: '2026-07-10', assignee: 'AI Team', name: 'Dr. Amit', email: 'amit@medical.org', description: 'AI chat shows Thinking forever' },
  { id: 9, subject: 'Dashboard charts lag', category: 'performance', status: 'resolved', priority: 'medium', date: '2026-07-05', assignee: 'DevOps', name: 'Dr. Sneha', email: 'sneha@healthcare.in', description: 'Analytics charts slow to render' },
  { id: 10, subject: 'User session timeout', category: 'security', status: 'in-progress', priority: 'high', date: '2026-07-09', assignee: 'Security Team', name: 'Dr. Rahul', email: 'rahul@doctor.net', description: 'Sessions expire too quickly' },
  { id: 11, subject: 'Form validation missing', category: 'ui', status: 'resolved', priority: 'low', date: '2026-07-04', assignee: 'Frontend Team', name: 'Dr. Rajesh', email: 'rajesh@hospital.com', description: 'Required fields not validated' },
  { id: 12, subject: 'API rate limiting', category: 'security', status: 'pending', priority: 'critical', date: '2026-07-10', assignee: 'Backend Team', name: 'Dr. Priya', email: 'priya@clinic.com', description: 'API returns 429 too often' },
];

const complaintsSlice = createSlice({
  name: 'complaints',
  initialState: {
    items: initialComplaints,
    nextId: 13,
  },
  reducers: {
    addComplaint: (state, action) => {
      const newComplaint = {
        ...action.payload,
        id: state.nextId,
        status: 'pending',
        date: new Date().toISOString().slice(0, 10),
        assignee: 'Unassigned',
      };
      state.items.unshift(newComplaint);
      state.nextId += 1;
    },
    updateComplaintStatus: (state, action) => {
      const { id, status } = action.payload;
      const complaint = state.items.find(c => c.id === id);
      if (complaint) {
        complaint.status = status;
      }
    },
    deleteComplaint: (state, action) => {
      state.items = state.items.filter(c => c.id !== action.payload);
    },
  },
});

export const { addComplaint, updateComplaintStatus, deleteComplaint } = complaintsSlice.actions;
export default complaintsSlice.reducer;
