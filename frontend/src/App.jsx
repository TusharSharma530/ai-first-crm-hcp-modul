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
              <div className="home-page">
                <div className="home-row">
                  <div className="home-card">
                    <LogInteractionForm />
                  </div>
                  <div className="home-card">
                    <ChatInterface />
                  </div>
                </div>
                <div className="home-row">
                  <div className="home-card">
                    <HelpDeskForm />
                  </div>
                  <div className="home-card">
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
