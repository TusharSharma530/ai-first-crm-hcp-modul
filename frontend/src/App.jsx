import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import Layout from './components/Layout';
import LogInteractionForm from './features/interactions/LogInteractionForm';
import InteractionsPage from './features/interactions/InteractionsPage';
import ChatInterface from './features/chat/ChatInterface';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1.5rem',
                maxWidth: '1400px',
                margin: '0 auto',
                alignItems: 'start'
              }}>
                <div>
                  <LogInteractionForm />
                </div>
                <div style={{ position: 'sticky', top: '80px' }}>
                  <ChatInterface />
                </div>
              </div>
            } />
            <Route path="/interactions" element={<InteractionsPage />} />
            <Route path="/chat" element={
              <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <ChatInterface />
              </div>
            } />
          </Routes>
        </Layout>
      </Router>
    </Provider>
  );
}

export default App;
