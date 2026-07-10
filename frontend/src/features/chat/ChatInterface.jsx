import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage, addUserMessage, clearChat } from './chatSlice';

const ChatInterface = () => {
  const dispatch = useDispatch();
  const { messages, status, toolUsed, sessionId } = useSelector(state => state.chat);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    dispatch(addUserMessage(input));
    dispatch(sendMessage({ message: input, sessionId: sessionId || null }));
    setInput('');
  };

  const getToolBadge = (tool) => {
    const toolNames = {
      log_interaction_tool: { text: 'Logged', icon: '📝', color: '#10b981' },
      edit_interaction_tool: { text: 'Edited', icon: '✏️', color: '#f59e0b' },
      search_interactions_tool: { text: 'Searched', icon: '🔍', color: '#3b82f6' },
      get_hcp_profile_tool: { text: 'Profile', icon: '👤', color: '#8b5cf6' },
      get_analytics_tool: { text: 'Analytics', icon: '📊', color: '#ec4899' }
    };
    const t = toolNames[tool] || { text: tool, icon: '🔧', color: '#6b7280' };
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: '4px',
        padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem',
        backgroundColor: t.color + '15', color: t.color, fontWeight: 500
      }}>
        {t.icon} {t.text}
      </span>
    );
  };

  const quickActions = [
    { label: "Log a call with Dr. Smith", icon: "📞" },
    { label: "Search for Dr. Patel", icon: "🔍" },
    { label: "Show analytics", icon: "📊" },
  ];

  const styles = {
    container: {
      maxWidth: '100%', height: 'calc(100vh - 160px)',
      display: 'flex', flexDirection: 'column'
    },
    header: {
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem'
    },
    headerLeft: { display: 'flex', alignItems: 'center', gap: '10px' },
    headerIcon: {
      width: '36px', height: '36px',
      background: 'linear-gradient(135deg, #10b981, #059669)',
      borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '18px', boxShadow: '0 2px 8px rgba(16,185,129,0.3)'
    },
    title: { fontFamily: 'Inter, sans-serif', fontSize: '1.25rem', fontWeight: 600, color: '#1a1a2e', margin: 0 },
    subtitle: { fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#666', margin: 0 },
    clearBtn: {
      padding: '6px 12px', backgroundColor: '#f3f4f6', color: '#374151',
      border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer',
      fontFamily: 'Inter, sans-serif', fontSize: '0.8rem'
    },
    chatBox: {
      flex: 1, backgroundColor: 'white', borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)',
      border: '1px solid #e8eaed', overflow: 'hidden', display: 'flex', flexDirection: 'column'
    },
    messages: {
      flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex',
      flexDirection: 'column', gap: '0.75rem'
    },
    userMsg: {
      display: 'flex', justifyContent: 'flex-end'
    },
    userBubble: {
      maxWidth: '80%', padding: '10px 14px', borderRadius: '16px 16px 4px 16px',
      background: 'linear-gradient(135deg, #1a73e8, #1557b0)',
      color: 'white', fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', lineHeight: '1.4'
    },
    aiMsg: {
      display: 'flex', justifyContent: 'flex-start'
    },
    aiBubble: {
      maxWidth: '80%', padding: '10px 14px', borderRadius: '16px 16px 16px 4px',
      backgroundColor: '#f3f4f6', color: '#1f2937', fontFamily: 'Inter, sans-serif',
      fontSize: '0.9rem', lineHeight: '1.4'
    },
    inputArea: {
      padding: '12px', borderTop: '1px solid #e8eaed', display: 'flex', gap: '8px',
      backgroundColor: '#fafafa'
    },
    input: {
      flex: 1, padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '20px',
      fontSize: '0.9rem', fontFamily: 'Inter, sans-serif', outline: 'none'
    },
    sendBtn: {
      padding: '10px 20px',
      background: status === 'loading' || !input.trim() ? '#d1d5db' : 'linear-gradient(135deg, #10b981, #059669)',
      color: 'white', border: 'none', borderRadius: '20px', cursor: status === 'loading' || !input.trim() ? 'not-allowed' : 'pointer',
      fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.9rem'
    },
    quickBar: {
      padding: '8px 12px', borderTop: '1px solid #e8eaed', display: 'flex', gap: '6px', flexWrap: 'wrap'
    },
    quickBtn: {
      padding: '4px 10px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe',
      borderRadius: '12px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#1d4ed8'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.headerIcon}>🤖</div>
          <div>
            <h2 style={styles.title}>AI Assistant</h2>
            <p style={styles.subtitle}>Powered by LangGraph + Groq</p>
          </div>
        </div>
        <button onClick={() => dispatch(clearChat())} style={styles.clearBtn}>🗑️ Clear</button>
      </div>

      <div style={styles.chatBox}>
        <div style={styles.messages}>
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#6b7280' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>💬</div>
              <h3 style={{ fontFamily: 'Inter, sans-serif', color: '#374151', fontSize: '1rem', marginBottom: '8px' }}>
                How can I help you?
              </h3>
              <p style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>
                I can log interactions, search, get profiles & analytics
              </p>
              <div style={{ 
                padding: '10px 14px', 
                backgroundColor: '#fef3c7', 
                borderRadius: '8px', 
                fontSize: '0.75rem',
                color: '#92400e',
                marginBottom: '1rem',
                textAlign: 'left'
              }}>
                <strong>Edit Tip:</strong> Type "Edit interaction [ID], change [field] to [value]"<br/>
                Example: "Edit interaction 1, change notes to Updated discussion"
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center' }}>
                {quickActions.map((action, index) => (
                  <button key={index} onClick={() => {
                    dispatch(addUserMessage(action.label));
                    dispatch(sendMessage({ message: action.label, sessionId: sessionId || null }));
                  }} style={styles.quickBtn}>
                    {action.icon} {action.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, index) => (
            <div key={index} style={msg.role === 'user' ? styles.userMsg : styles.aiMsg}>
              <div style={msg.role === 'user' ? styles.userBubble : styles.aiBubble}>
                <div>{msg.content}</div>
                {msg.toolUsed && (
                  <div style={{ marginTop: '6px', paddingTop: '6px', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                    {getToolBadge(msg.toolUsed)}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {status === 'loading' && (
            <div style={styles.aiMsg}>
              <div style={{ ...styles.aiBubble, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ animation: 'pulse 1.5s infinite' }}>⏳</span>
                <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>Thinking...</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div style={styles.quickBar}>
          {quickActions.map((action, index) => (
            <button key={index} onClick={() => {
              dispatch(addUserMessage(action.label));
              dispatch(sendMessage({ message: action.label, sessionId: sessionId || null }));
            }} style={styles.quickBtn}>
              {action.icon} {action.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={styles.inputArea}>
          <input
            type="text" value={input} onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={status === 'loading'}
            style={styles.input}
            onFocus={(e) => { e.target.style.borderColor = '#10b981'; e.target.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.1)'; }}
            onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; }}
          />
          <button type="submit" disabled={status === 'loading' || !input.trim()} style={styles.sendBtn}>
            Send ➤
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
