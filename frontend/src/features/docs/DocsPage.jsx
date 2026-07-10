import { useState } from 'react';

const DocsPage = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const styles = {
    container: { maxWidth: '100%', display: 'flex', gap: '2rem' },
    sidebar: {
      width: '250px', flexShrink: 0, backgroundColor: 'white',
      borderRadius: '12px', padding: '1.5rem', height: 'fit-content',
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #e8eaed',
      position: 'sticky', top: '100px'
    },
    sidebarTitle: {
      fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 600,
      color: '#1a1a2e', marginBottom: '1rem', paddingBottom: '0.5rem',
      borderBottom: '2px solid #e8eaed'
    },
    navItem: (isActive) => ({
      display: 'block', padding: '10px 12px', marginBottom: '4px',
      borderRadius: '8px', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
      fontSize: '0.85rem', transition: 'all 0.2s',
      backgroundColor: isActive ? '#eff6ff' : 'transparent',
      color: isActive ? '#1d4ed8' : '#374151',
      borderLeft: isActive ? '3px solid #1d4ed8' : '3px solid transparent'
    }),
    content: { flex: 1, minWidth: 0 },
    card: {
      backgroundColor: 'white', borderRadius: '12px', padding: '2rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #e8eaed',
      marginBottom: '1.5rem'
    },
    title: {
      fontFamily: 'Inter, sans-serif', fontSize: '1.75rem', fontWeight: 700,
      color: '#1a1a2e', marginBottom: '0.5rem'
    },
    subtitle: {
      fontFamily: 'Inter, sans-serif', fontSize: '1rem', color: '#666',
      marginBottom: '1.5rem'
    },
    sectionTitle: {
      fontFamily: 'Inter, sans-serif', fontSize: '1.25rem', fontWeight: 600,
      color: '#1a1a2e', marginTop: '2rem', marginBottom: '1rem',
      paddingBottom: '0.5rem', borderBottom: '2px solid #e8eaed'
    },
    subsectionTitle: {
      fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 600,
      color: '#374151', marginTop: '1.5rem', marginBottom: '0.75rem'
    },
    text: {
      fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: '#4b5563',
      lineHeight: '1.7', marginBottom: '1rem'
    },
    codeBlock: {
      backgroundColor: '#1f2937', color: '#e5e7eb', padding: '1rem',
      borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.85rem',
      overflowX: 'auto', marginBottom: '1rem', lineHeight: '1.5'
    },
    table: {
      width: '100%', borderCollapse: 'collapse', marginBottom: '1rem',
      fontFamily: 'Inter, sans-serif', fontSize: '0.85rem'
    },
    th: {
      backgroundColor: '#f9fafb', padding: '12px', textAlign: 'left',
      borderBottom: '2px solid #e8eaed', fontWeight: 600, color: '#374151'
    },
    td: {
      padding: '10px 12px', borderBottom: '1px solid #e8eaed', color: '#4b5563'
    },
    badge: (color) => ({
      display: 'inline-block', padding: '4px 10px', borderRadius: '12px',
      fontSize: '0.75rem', fontWeight: 500,
      backgroundColor: color + '15', color: color
    }),
    tip: {
      backgroundColor: '#fef3c7', border: '1px solid #fcd34d', borderRadius: '8px',
      padding: '1rem', marginBottom: '1rem'
    },
    success: {
      backgroundColor: '#ecfdf5', border: '1px solid #6ee7b7', borderRadius: '8px',
      padding: '1rem', marginBottom: '1rem'
    },
    scenario: {
      backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px',
      padding: '1.25rem', marginBottom: '1rem'
    },
    scenarioTitle: {
      fontFamily: 'Inter, sans-serif', fontSize: '0.95rem', fontWeight: 600,
      color: '#0369a1', marginBottom: '0.5rem'
    },
    chatBubble: (isUser) => ({
      maxWidth: '85%', padding: '10px 14px', borderRadius: '16px',
      marginBottom: '0.5rem', fontFamily: 'Inter, sans-serif', fontSize: '0.85rem',
      lineHeight: '1.5', alignSelf: isUser ? 'flex-end' : 'flex-start',
      backgroundColor: isUser ? '#1a73e8' : '#f3f4f6',
      color: isUser ? 'white' : '#1f2937'
    }),
    featureGrid: {
      display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem', marginBottom: '1.5rem'
    },
    featureCard: {
      backgroundColor: '#f9fafb', borderRadius: '8px', padding: '1rem',
      border: '1px solid #e8eaed'
    },
    featureIcon: { fontSize: '2rem', marginBottom: '0.5rem' },
    featureTitle: {
      fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', fontWeight: 600,
      color: '#1a1a2e', marginBottom: '0.25rem'
    },
    featureDesc: {
      fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', color: '#6b7280'
    }
  };

  const navItems = [
    { id: 'overview', label: '📋 What is this?' },
    { id: 'why-ai', label: '🤖 Why AI?' },
    { id: 'how-to-use', label: '🚀 How to Use' },
    { id: 'form-guide', label: '📝 Form Guide' },
    { id: 'chat-guide', label: '💬 Chat Guide' },
    { id: 'scenarios', label: '💼 Real Scenarios' },
    { id: 'faq', label: '❓ FAQ' },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <h3 style={styles.sidebarTitle}>📚 Help Guide</h3>
        {navItems.map(item => (
          <div
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            style={styles.navItem(activeSection === item.id)}
          >
            {item.label}
          </div>
        ))}
      </div>

      <div style={styles.content}>
        {/* OVERVIEW */}
        {activeSection === 'overview' && (
          <div>
            <div style={styles.card}>
              <h1 style={styles.title}>Welcome to AI-First CRM</h1>
              <p style={styles.subtitle}>
                Your smart assistant for logging doctor meetings and calls
              </p>

              <p style={styles.text}>
                Hey there! 👋 So you're probably wondering what this tool is all about. 
                Let me explain in simple terms.
              </p>

              <p style={styles.text}>
                Every day, field representatives like you meet doctors, have calls, attend conferences, 
                and visit hospitals. After each meeting, you need to write down what happened - 
                who you met, what you discussed, how it went, when to follow up.
              </p>

              <p style={styles.text}>
                <strong>Traditionally,</strong> this meant opening a CRM, filling a boring form with 
                10+ fields, and spending 5-10 minutes per interaction. By the end of the day, 
                you're tired of typing.
              </p>

              <p style={styles.text}>
                <strong>With this tool,</strong> you just tell the AI what happened in plain English! 
                Something like: "Met Dr. Sharma at AIIMS, discussed new heart medicine, he loved it, 
                follow up next week" - and boom! AI fills everything for you.
              </p>

              <div style={styles.featureGrid}>
                <div style={styles.featureCard}>
                  <div style={styles.featureIcon}>📝</div>
                  <div style={styles.featureTitle}>Two Ways to Log</div>
                  <div style={styles.featureDesc}>Use a form OR just chat with AI</div>
                </div>
                <div style={styles.featureCard}>
                  <div style={styles.featureIcon}>🤖</div>
                  <div style={styles.featureTitle}>AI Does the Work</div>
                  <div style={styles.featureDesc}>Just tell what happened, AI fills details</div>
                </div>
                <div style={styles.featureCard}>
                  <div style={styles.featureIcon}>⚡</div>
                  <div style={styles.featureTitle}>Super Fast</div>
                  <div style={styles.featureDesc}>10 seconds instead of 10 minutes</div>
                </div>
                <div style={styles.featureCard}>
                  <div style={styles.featureIcon}>📊</div>
                  <div style={styles.featureTitle}>See Your Stats</div>
                  <div style={styles.featureDesc}>Instant analytics on your work</div>
                </div>
              </div>

              <div style={styles.success}>
                <strong>Quick Start:</strong> Just click "Log Interaction" in the top menu → 
                Click "Auto Fill" → Click "Log Interaction" → Done! You just logged your first interaction!
              </div>
            </div>
          </div>
        )}

        {/* WHY AI */}
        {activeSection === 'why-ai' && (
          <div>
            <div style={styles.card}>
              <h1 style={styles.title}>Why AI? (The Old vs New Way)</h1>
              <p style={styles.subtitle}>See how we're making your life easier</p>

              <p style={styles.text}>
                Let me tell you a story. Imagine you just had a great meeting with Dr. Sharma 
                at AIIMS. He's interested in your new drug and wants samples. You need to 
                log this interaction before you forget the details.
              </p>

              <h2 style={styles.sectionTitle}>😔 The Old Way (Without AI)</h2>
              
              <div style={{ backgroundColor: '#fef2f2', borderRadius: '8px', padding: '1.5rem', marginBottom: '1.5rem' }}>
                <p style={styles.text}>1. Open CRM → Wait for it to load</p>
                <p style={styles.text}>2. Find the right form → Click 5 times</p>
                <p style={styles.text}>3. Type doctor's name → Then email → Then specialty</p>
                <p style={styles.text}>4. Select organization from dropdown → Scroll...</p>
                <p style={styles.text}>5. Pick date and time → Choose interaction type</p>
                <p style={styles.text}>6. Type notes → Remember what you discussed</p>
                <p style={styles.text}>7. Fill follow-up fields → Click save</p>
                <p style={styles.text}><strong>Total time: 5-10 minutes per interaction 😫</strong></p>
              </div>

              <h2 style={styles.sectionTitle}>😊 The New Way (With AI)</h2>

              <div style={{ backgroundColor: '#ecfdf5', borderRadius: '8px', padding: '1.5rem', marginBottom: '1.5rem' }}>
                <p style={styles.text}>1. Click on the chat box</p>
                <p style={styles.text}>2. Type: "Met Dr. Sharma at AIIMS, discussed new heart medicine, he loved it, wants samples, follow up next week"</p>
                <p style={styles.text}>3. Press Enter</p>
                <p style={styles.text}><strong>Done! 10 seconds! 🎉</strong></p>
              </div>

              <p style={styles.text}>
                The AI automatically figured out:
              </p>
              <ul style={{ ...styles.text, paddingLeft: '1.5rem' }}>
                <li><strong>Doctor name:</strong> Dr. Sharma</li>
                <li><strong>Organization:</strong> AIIMS</li>
                <li><strong>Specialty:</strong> Cardiology (from "heart medicine")</li>
                <li><strong>Sentiment:</strong> Positive (from "loved it")</li>
                <li><strong>Topics:</strong> New drug, Samples</li>
                <li><strong>Follow-up:</strong> Next week</li>
              </ul>

              <h2 style={styles.sectionTitle}>⏱️ Time Saved</h2>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>What You Do</th>
                    <th style={styles.th}>Without AI</th>
                    <th style={styles.th}>With AI</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={styles.td}>Log a meeting</td>
                    <td style={styles.td}>5-10 minutes</td>
                    <td style={styles.td}><span style={styles.badge('#10b981')}>10 seconds</span></td>
                  </tr>
                  <tr>
                    <td style={styles.td}>Update a record</td>
                    <td style={styles.td}>Find + Open + Edit + Save</td>
                    <td style={styles.td}><span style={styles.badge('#10b981')}>One message</span></td>
                  </tr>
                  <tr>
                    <td style={styles.td}>Find past meetings</td>
                    <td style={styles.td}>Navigate + Filter + Scroll</td>
                    <td style={styles.td}><span style={styles.badge('#10b981')}>"Search for Dr. Smith"</span></td>
                  </tr>
                  <tr>
                    <td style={styles.td}>See your stats</td>
                    <td style={styles.td}>Export + Excel + Charts</td>
                    <td style={styles.td}><span style={styles.badge('#10b981')}>"Show analytics"</span></td>
                  </tr>
                </tbody>
              </table>

              <div style={styles.tip}>
                <strong>Bottom line:</strong> You focus on building relationships with doctors. 
                Let AI handle the paperwork! 🚀
              </div>
            </div>
          </div>
        )}

        {/* HOW TO USE */}
        {activeSection === 'how-to-use' && (
          <div>
            <div style={styles.card}>
              <h1 style={styles.title}>How to Use This Tool</h1>
              <p style={styles.subtitle}>Step-by-step guide to get started</p>

              <h2 style={styles.sectionTitle}>Step 1: Open the Application</h2>
              <p style={styles.text}>
                Just open your browser and go to the app. You'll see two sections:
              </p>
              <ul style={{ ...styles.text, paddingLeft: '1.5rem' }}>
                <li><strong>Left side:</strong> A form (like traditional CRM but with Auto Fill)</li>
                <li><strong>Right side:</strong> AI Chat box (the magic happens here!)</li>
              </ul>

              <h2 style={styles.sectionTitle}>Step 2: Log Your First Interaction</h2>
              
              <div style={styles.scenario}>
                <div style={styles.scenarioTitle}>Option A: Use the Form (Easy)</div>
                <ol style={{ ...styles.text, paddingLeft: '1.5rem', marginBottom: 0 }}>
                  <li>Click the green "⚡ Auto Fill" button</li>
                  <li>Watch! All fields fill automatically with sample data</li>
                  <li>Click "💾 Log Interaction"</li>
                  <li>Done! Green success message appears</li>
                </ol>
              </div>

              <div style={styles.scenario}>
                <div style={styles.scenarioTitle}>Option B: Use AI Chat (Super Easy!)</div>
                <ol style={{ ...styles.text, paddingLeft: '1.5rem', marginBottom: 0 }}>
                  <li>Click in the chat box on the right</li>
                  <li>Type something like: "Log a call with Dr. Sharma about new drug"</li>
                  <li>Press Enter or click Send</li>
                  <li>AI does everything! You'll see a success message</li>
                </ol>
              </div>

              <h2 style={styles.sectionTitle}>Step 3: See All Your Records</h2>
              <p style={styles.text}>
                Click "All Records" in the top menu. You'll see all logged interactions. 
                You can filter by type (Call, Meeting, Email, etc.)
              </p>

              <h2 style={styles.sectionTitle}>Step 4: Edit Something</h2>
              <p style={styles.text}>
                Made a mistake? No problem! In the chat, type:
              </p>
              <div style={styles.codeBlock}>
{`"Edit interaction 1, change notes to Corrected information"`}
              </div>

              <div style={styles.tip}>
                <strong>Pro tip:</strong> First log an interaction, then check "All Records" 
                to see its ID number. Then you can edit it using that ID!
              </div>
            </div>
          </div>
        )}

        {/* FORM GUIDE */}
        {activeSection === 'form-guide' && (
          <div>
            <div style={styles.card}>
              <h1 style={styles.title}>Using the Form</h1>
              <p style={styles.subtitle}>If you prefer filling forms manually (or use Auto Fill)</p>

              <p style={styles.text}>
                The form is on the left side of the homepage. It's like any other form, but with 
                a cool Auto Fill button that does everything for you!
              </p>

              <h2 style={styles.sectionTitle}>Auto Fill - Your Best Friend</h2>
              <p style={styles.text}>
                Click the green "⚡ Auto Fill" button and watch the magic! All fields fill 
                with random but realistic data. Click it multiple times to get different data each time.
              </p>

              <h2 style={styles.sectionTitle}>Form Fields Explained</h2>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Field</th>
                    <th style={styles.th}>What to Enter</th>
                    <th style={styles.th}>Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={styles.td}><strong>HCP Name *</strong></td>
                    <td style={styles.td}>Doctor's name (must include "Dr.")</td>
                    <td style={styles.td}>Dr. Rajesh Sharma</td>
                  </tr>
                  <tr>
                    <td style={styles.td}>Email</td>
                    <td style={styles.td}>Their email (optional)</td>
                    <td style={styles.td}>doctor@hospital.com</td>
                  </tr>
                  <tr>
                    <td style={styles.td}>Specialty</td>
                    <td style={styles.td}>What they specialize in</td>
                    <td style={styles.td}>Cardiology, Neurology, Oncology</td>
                  </tr>
                  <tr>
                    <td style={styles.td}>Organization</td>
                    <td style={styles.td}>Hospital or clinic name</td>
                    <td style={styles.td}>AIIMS Delhi, Apollo Hospital</td>
                  </tr>
                  <tr>
                    <td style={styles.td}><strong>Type *</strong></td>
                    <td style={styles.td}>How you interacted</td>
                    <td style={styles.td}>Call, Meeting, Email, Visit, Conference</td>
                  </tr>
                  <tr>
                    <td style={styles.td}><strong>Date *</strong></td>
                    <td style={styles.td}>When it happened</td>
                    <td style={styles.td}>10-07-2026 11:42</td>
                  </tr>
                  <tr>
                    <td style={styles.td}><strong>Notes *</strong></td>
                    <td style={styles.td}>What was discussed (be detailed!)</td>
                    <td style={styles.td}>Discussed new hypertension drug, doctor interested</td>
                  </tr>
                  <tr>
                    <td style={styles.td}>Follow-up?</td>
                    <td style={styles.td}>Need to follow up? Select Yes/No</td>
                    <td style={styles.td}>Yes → shows date picker</td>
                  </tr>
                </tbody>
              </table>

              <div style={styles.tip}>
                <strong>Remember:</strong> Fields with * are required. Everything else is optional. 
                The more details you put in Notes, the better!
              </div>
            </div>
          </div>
        )}

        {/* CHAT GUIDE */}
        {activeSection === 'chat-guide' && (
          <div>
            <div style={styles.card}>
              <h1 style={styles.title}>Using AI Chat (Recommended!)</h1>
              <p style={styles.subtitle}>The fastest way to log interactions</p>

              <p style={styles.text}>
                The AI Chat is on the right side of the homepage. It's like texting a smart 
                assistant who understands everything about your work!
              </p>

              <h2 style={styles.sectionTitle}>💡 Just Talk Naturally!</h2>
              <p style={styles.text}>
                You don't need to learn any special commands. Just type like you're telling 
                a colleague about your meeting. Here's what works:
              </p>

              <h2 style={styles.sectionTitle}>📝 Logging Interactions</h2>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>What You Type</th>
                    <th style={styles.th}>What AI Understands</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={styles.td}>"Log a call with Dr. Sharma"</td>
                    <td style={styles.td}>Creates a call interaction with Dr. Sharma</td>
                  </tr>
                  <tr>
                    <td style={styles.td}>"Met Dr. Patel at Apollo, discussed new drug"</td>
                    <td style={styles.td}>Meeting with Dr. Patel, topic: new drug</td>
                  </tr>
                  <tr>
                    <td style={styles.td}>"I had a great visit with Dr. Kumar, very positive about our stent"</td>
                    <td style={styles.td}>Visit, positive sentiment, topic: stent</td>
                  </tr>
                  <tr>
                    <td style={styles.td}>"Email exchange with Dr. Gupta about trial results"</td>
                    <td style={styles.td}>Email interaction, topic: trial results</td>
                  </tr>
                  <tr>
                    <td style={styles.td}>"Conference meeting with Dr. Reddy, need follow up"</td>
                    <td style={styles.td}>Conference, follow-up required</td>
                  </tr>
                </tbody>
              </table>

              <h2 style={styles.sectionTitle}>✏️ Editing Records</h2>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>What You Type</th>
                    <th style={styles.th}>What Happens</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={styles.td}>"Edit interaction 1, change notes to Updated info"</td>
                    <td style={styles.td}>Updates notes for record #1</td>
                  </tr>
                  <tr>
                    <td style={styles.td}>"Change sentiment to positive for interaction 2"</td>
                    <td style={styles.td}>Updates sentiment for record #2</td>
                  </tr>
                  <tr>
                    <td style={styles.td}>"Edit 1, change notes to X and sentiment to Y"</td>
                    <td style={styles.td}>Updates BOTH fields at once!</td>
                  </tr>
                </tbody>
              </table>

              <h2 style={styles.sectionTitle}>🔍 Searching & Viewing</h2>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>What You Type</th>
                    <th style={styles.th}>What You Get</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={styles.td}>"Search for Dr. Patel"</td>
                    <td style={styles.td}>All interactions with Dr. Patel</td>
                  </tr>
                  <tr>
                    <td style={styles.td}>"Get profile for Dr. Sharma"</td>
                    <td style={styles.td}>Full profile with stats</td>
                  </tr>
                  <tr>
                    <td style={styles.td}>"Show analytics"</td>
                    <td style={styles.td}>Your statistics and insights</td>
                  </tr>
                  <tr>
                    <td style={styles.td}>"What are my numbers?"</td>
                    <td style={styles.td}>Same as analytics</td>
                  </tr>
                </tbody>
              </table>

              <div style={styles.success}>
                <strong>Pro tip:</strong> The more details you include, the better AI extracts! 
                Mention doctor name, hospital, what you discussed, how they reacted, 
                and if you need to follow up.
              </div>
            </div>
          </div>
        )}

        {/* REAL SCENARIOS */}
        {activeSection === 'scenarios' && (
          <div>
            <div style={styles.card}>
              <h1 style={styles.title}>Real-Life Scenarios</h1>
              <p style={styles.subtitle}>See how other field reps use this tool every day</p>

              <h2 style={styles.sectionTitle}>💼 Scenario 1: Morning Hospital Visit</h2>
              <div style={styles.scenario}>
                <div style={styles.scenarioTitle}>You just visited Dr. Rajesh Sharma at AIIMS Delhi</div>
                <p style={styles.text}>
                  You discussed the new hypertension drug. He was impressed with clinical trial results 
                  and wants to prescribe it. Need to follow up next week with sample copies.
                </p>
                <p style={{ ...styles.text, fontWeight: 600 }}>What you type in chat:</p>
                <div style={styles.codeBlock}>
{`"I just visited Dr. Rajesh Sharma at AIIMS Delhi. We discussed 
the new hypertension drug. He was impressed with the clinical 
trial results and wants to prescribe it to his patients. 
Need to follow up next week with sample copies."`}
                </div>
                <p style={{ ...styles.text, fontWeight: 600 }}>AI automatically extracts:</p>
                <ul style={{ ...styles.text, paddingLeft: '1.5rem', marginBottom: 0 }}>
                  <li>Doctor: Dr. Rajesh Sharma</li>
                  <li>Hospital: AIIMS Delhi</li>
                  <li>Type: Visit</li>
                  <li>Sentiment: Positive</li>
                  <li>Topics: Hypertension drug, Clinical trial</li>
                  <li>Follow-up: Yes (next week)</li>
                </ul>
              </div>

              <h2 style={styles.sectionTitle}>📞 Scenario 2: Phone Call Follow-up</h2>
              <div style={styles.scenario}>
                <div style={styles.scenarioTitle}>Dr. Priya Patel called asking about side effects</div>
                <p style={styles.text}>
                  She's concerned about the side effects of your cardiac drug. You explained 
                  the safety profile. She'll review the data and get back to you.
                </p>
                <p style={{ ...styles.text, fontWeight: 600 }}>What you type:</p>
                <div style={styles.codeBlock}>
{`"Log a call with Dr. Priya Patel from Apollo Hospital. 
She asked about side effects of our new cardiac drug. 
I explained the safety profile. She will review the 
data and get back to me."`}
                </div>
              </div>

              <h2 style={styles.sectionTitle}>🎤 Scenario 3: Conference Meeting</h2>
              <div style={styles.scenario}>
                <div style={styles.scenarioTitle}>Met Dr. Amit Kumar at cardiology conference</div>
                <p style={styles.text}>
                  He's interested in your new stent technology. Very positive about the innovation. 
                  Wants to schedule a demo next month.
                </p>
                <p style={{ ...styles.text, fontWeight: 600 }}>What you type:</p>
                <div style={styles.codeBlock}>
{`"Record a meeting with Dr. Amit Kumar from Fortis Healthcare. 
Met at cardiology conference. He's interested in our new 
stent technology. Very positive about the innovation. 
Schedule demo for next month."`}
                </div>
              </div>

              <h2 style={styles.sectionTitle}>✏️ Scenario 4: Fixing a Mistake</h2>
              <div style={styles.scenario}>
                <div style={styles.scenarioTitle}>You logged something wrong and need to fix it</div>
                <p style={{ ...styles.text, fontWeight: 600 }}>What you type:</p>
                <div style={styles.codeBlock}>
{`"Edit interaction 1, change notes to Follow-up needed on 
dosage guidelines. Doctor wants detailed pharmacokinetics 
data."`}
                </div>
                <p style={{ ...styles.text, marginBottom: 0 }}>
                  That's it! Record #1 is updated.
                </p>
              </div>

              <h2 style={styles.sectionTitle}>🔍 Scenario 5: Finding Past Meetings</h2>
              <div style={styles.scenario}>
                <div style={styles.scenarioTitle}>You need to remember what you discussed with Dr. Patel</div>
                <p style={{ ...styles.text, fontWeight: 600 }}>What you type:</p>
                <div style={styles.codeBlock}>
{`"Search for Dr. Patel"`}
                </div>
                <p style={{ ...styles.text, marginBottom: 0 }}>
                  AI shows all interactions with Dr. Patel with dates and topics!
                </p>
              </div>

              <h2 style={styles.sectionTitle}>👤 Scenario 6: Getting Doctor's Profile</h2>
              <div style={styles.scenario}>
                <div style={styles.scenarioTitle}>You want to see everything about a doctor</div>
                <p style={{ ...styles.text, fontWeight: 600 }}>What you type:</p>
                <div style={styles.codeBlock}>
{`"Get profile for Dr. Sharma"`}
                </div>
                <p style={{ ...styles.text, marginBottom: 0 }}>
                  Shows: Name, specialty, hospital, total meetings, last meeting date, recent topics!
                </p>
              </div>

              <h2 style={styles.sectionTitle}>📊 Scenario 7: Checking Your Performance</h2>
              <div style={styles.scenario}>
                <div style={styles.scenarioTitle}>Manager wants your weekly stats</div>
                <p style={{ ...styles.text, fontWeight: 600 }}>What you type:</p>
                <div style={styles.codeBlock}>
{`"Show analytics"`}
                </div>
                <p style={{ ...styles.text, marginBottom: 0 }}>
                  Shows: Total interactions, breakdown by type, sentiment distribution, top doctors!
                </p>
              </div>

              <div style={styles.tip}>
                <strong>Remember:</strong> You can type ANYTHING in natural English. The AI 
                is smart enough to understand what you want to do!
              </div>
            </div>
          </div>
        )}

        {/* FAQ */}
        {activeSection === 'faq' && (
          <div>
            <div style={styles.card}>
              <h1 style={styles.title}>Frequently Asked Questions</h1>
              <p style={styles.subtitle}>Answers to common questions</p>

              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={styles.subsectionTitle}>🤔 What is this tool for?</h3>
                <p style={styles.text}>
                  It's for pharmaceutical field representatives to log their meetings, calls, 
                  and visits with doctors. Instead of filling boring forms, you just tell 
                  the AI what happened!
                </p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={styles.subsectionTitle}>🤖 How does the AI work?</h3>
                <p style={styles.text}>
                  When you type something like "Met Dr. Sharma, discussed new drug", the AI 
                  automatically extracts: doctor name, hospital, what you discussed, how it went, 
                  and if you need to follow up. It's like having a smart assistant!
                </p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={styles.subsectionTitle}>📝 Do I need to fill the form?</h3>
                <p style={styles.text}>
                  No! You have two options: (1) Use the form with Auto Fill for quick entry, or 
                  (2) Use the AI Chat where you just type what happened. Most people prefer 
                  the chat - it's faster!
                </p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={styles.subsectionTitle}>✏️ Can I fix mistakes?</h3>
                <p style={styles.text}>
                  Absolutely! Just type: "Edit interaction [number], change [what] to [new value]". 
                  You can even change multiple things at once!
                </p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={styles.subsectionTitle}>🔍 How do I find old records?</h3>
                <p style={styles.text}>
                  Type "Search for Dr. [name]" in the chat. Or click "All Records" in the 
                  top menu to see everything with filters.
                </p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={styles.subsectionTitle}>📊 Can I see my statistics?</h3>
                <p style={styles.text}>
                  Yes! Just type "Show analytics" and you'll see: total interactions, 
                  breakdown by type (calls, meetings, etc.), sentiment analysis, 
                  and your top doctors.
                </p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={styles.subsectionTitle}>📱 Does it work on mobile?</h3>
                <p style={styles.text}>
                  Yes! The app works on phones, tablets, and computers. Use it anywhere!
                </p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={styles.subsectionTitle}>🔒 Is my data safe?</h3>
                <p style={styles.text}>
                  Yes! All data is stored securely in the database. Only you can see your interactions.
                </p>
              </div>

              <div style={styles.success}>
                <strong>Still have questions?</strong> Just try it out! The best way to learn 
                is by using the system. Start with Auto Fill and explore from there! 🚀
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocsPage;