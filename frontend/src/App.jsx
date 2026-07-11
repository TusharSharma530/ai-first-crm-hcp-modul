import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import Layout from './components/Layout';
import LogInteractionForm from './features/interactions/LogInteractionForm';
import InteractionsPage from './features/interactions/InteractionsPage';
import ChatInterface from './features/chat/ChatInterface';
import HelpDeskForm from './features/helpdesk/HelpDeskForm';
import ComplaintStatus from './features/helpdesk/ComplaintStatus';
import DocsPage from './features/docs/DocsPage';
import './styles/layout.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={
              <div className="home-grid">
                <div className="home-form-wrapper">
                  <LogInteractionForm />
                </div>
                <div className="home-sidebar">
                  <div className="home-chat-wrapper">
                    <ChatInterface />
                  </div>
                  <div className="helpdesk-row">
                    <HelpDeskForm />
                    <ComplaintStatus />
                  </div>
                </div>
              </div>
            } />
            <Route path="/interactions" element={<InteractionsPage />} />
            <Route path="/docs" element={<DocsPage />} />
          </Routes>
        </Layout>
      </Router>
    </Provider>
  );
}

export default App;
