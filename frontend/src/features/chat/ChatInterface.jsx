import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage, addUserMessage, clearChat } from './chatSlice';
import HCPProfileCard from './HCPProfileCard';

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
      <span className="crm-tool-badge" style={{ backgroundColor: t.color + '15', color: t.color }}>
        {t.icon} {t.text}
      </span>
    );
  };

  const quickActions = [
    { label: "Log a call with Dr. Smith", icon: "📞" },
    { label: "Edit interaction", icon: "✏️" },
    { label: "Search for Dr. Patel", icon: "🔍" },
    { label: "Get profile for Dr. Smith", icon: "👤" },
    { label: "Show analytics", icon: "📊" },
  ];

  return (
    <div className="crm-card">
      <div className="crm-card-header">
        <div className="crm-card-header-left">
          <div className="crm-card-header-icon green">🤖</div>
          <div>
            <h2 className="crm-card-title">AI Assistant</h2>
            <p className="crm-card-subtitle">Powered by LangGraph + Groq</p>
          </div>
        </div>
        <button onClick={() => dispatch(clearChat())} className="crm-btn" style={{ flex: 'none', padding: '8px 16px', backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', fontSize: '0.8rem' }}>Clear</button>
      </div>

      <div className="crm-chat">
        <div className="crm-chat-messages">
          {messages.length === 0 && (
            <div className="crm-chat-empty">
              <div className="crm-chat-empty-icon">💬</div>
              <h3 className="crm-chat-empty-title">How can I help you?</h3>
              <p className="crm-chat-empty-desc">I can log interactions, search, get profiles & analytics</p>
              <div className="crm-chat-quick-actions">
                {quickActions.map((action, index) => (
                  <button key={index} onClick={() => {
                    dispatch(addUserMessage(action.label));
                    dispatch(sendMessage({ message: action.label, sessionId: sessionId || null }));
                  }} className="crm-chat-quick-btn">
                    {action.icon} {action.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, index) => (
            <div key={index} className={`crm-msg ${msg.role === 'user' ? 'crm-msg-user' : 'crm-msg-ai'}`}>
              <div className={`crm-msg-bubble ${msg.role === 'user' ? 'crm-msg-bubble-user' : 'crm-msg-bubble-ai'} ${msg.isError ? 'crm-msg-bubble-error' : ''}`}>
                <div>{msg.isError && '⚠️ '}{msg.content}</div>
                {msg.extractedData && msg.extractedData.profile && (
                  <HCPProfileCard profile={msg.extractedData.profile} />
                )}
                {msg.toolUsed && (
                  <div style={{ marginTop: '6px', paddingTop: '6px', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                    {getToolBadge(msg.toolUsed)}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {status === 'loading' && (
            <div className="crm-msg crm-msg-ai">
              <div className="crm-msg-bubble crm-msg-bubble-ai" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ animation: 'pulse 1.5s infinite' }}>⏳</span>
                <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>Thinking...</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="crm-chat-input">
          <input
            type="text" value={input} onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={status === 'loading'}
            className="crm-chat-text-input"
          />
          <button type="submit" disabled={status === 'loading' || !input.trim()} className="crm-chat-send-btn" data-tooltip="Send">
            Send ➤
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
