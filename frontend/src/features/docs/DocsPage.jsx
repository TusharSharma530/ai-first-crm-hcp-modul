import { useState } from 'react';
import '../../styles/docs.css';

const DocsPage = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { id: 'overview', label: '📋 What is this?' },
    { id: 'why-ai', label: '🤖 Why AI?' },
    { id: 'how-to-use', label: '🚀 How to Use' },
    { id: 'form-guide', label: '📝 Form Guide' },
    { id: 'chat-guide', label: '💬 Chat Guide' },
    { id: 'scenarios', label: '💼 Real Scenarios' },
    { id: 'faq', label: '❓ FAQ' },
  ];

  const handleNavClick = (id) => {
    setActiveSection(id);
    setSidebarOpen(false);
  };

  return (
    <div className="docs-container">
      <button className="docs-mobile-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
        {sidebarOpen ? '✕ Close Menu' : '📚 Open Menu'}
      </button>

      <div className={`docs-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <h3 className="docs-sidebar-title">📚 Help Guide</h3>
        {navItems.map(item => (
          <div
            key={item.id}
            onClick={() => handleNavClick(item.id)}
            className={`docs-nav-item ${activeSection === item.id ? 'active' : ''}`}
          >
            {item.label}
          </div>
        ))}
      </div>

      <div className="docs-content">
        {/* OVERVIEW */}
        {activeSection === 'overview' && (
          <div>
            <div className="docs-card">
              <h1 className="docs-title">Welcome to AI-First CRM</h1>
              <p className="docs-subtitle">
                Your smart assistant for logging doctor meetings and calls
              </p>

              <p className="docs-text">
                Hey there! 👋 So you're probably wondering what this tool is all about. 
                Let me explain in simple terms.
              </p>

              <p className="docs-text">
                Every day, field representatives like you meet doctors, have calls, attend conferences, 
                and visit hospitals. After each meeting, you need to write down what happened - 
                who you met, what you discussed, how it went, when to follow up.
              </p>

              <p className="docs-text">
                <strong>Traditionally,</strong> this meant opening a CRM, filling a boring form with 
                10+ fields, and spending 5-10 minutes per interaction. By the end of the day, 
                you're tired of typing.
              </p>

              <p className="docs-text">
                <strong>With this tool,</strong> you just tell the AI what happened in plain English! 
                Something like: "Met Dr. Sharma at AIIMS, discussed new heart medicine, he loved it, 
                follow up next week" - and boom! AI fills everything for you.
              </p>

              <div className="docs-feature-grid">
                <div className="docs-feature-card">
                  <div className="docs-feature-icon">📝</div>
                  <div className="docs-feature-title">Two Ways to Log</div>
                  <div className="docs-feature-desc">Use a form OR just chat with AI</div>
                </div>
                <div className="docs-feature-card">
                  <div className="docs-feature-icon">🤖</div>
                  <div className="docs-feature-title">AI Does the Work</div>
                  <div className="docs-feature-desc">Just tell what happened, AI fills details</div>
                </div>
                <div className="docs-feature-card">
                  <div className="docs-feature-icon">⚡</div>
                  <div className="docs-feature-title">Super Fast</div>
                  <div className="docs-feature-desc">10 seconds instead of 10 minutes</div>
                </div>
                <div className="docs-feature-card">
                  <div className="docs-feature-icon">📊</div>
                  <div className="docs-feature-title">See Your Stats</div>
                  <div className="docs-feature-desc">Instant analytics on your work</div>
                </div>
              </div>

              <div className="docs-success">
                <strong>Quick Start:</strong> Just click "Log Interaction" in the top menu → 
                Click "Auto Fill" → Click "Log Interaction" → Done! You just logged your first interaction!
              </div>
            </div>
          </div>
        )}

        {/* WHY AI */}
        {activeSection === 'why-ai' && (
          <div>
            <div className="docs-card">
              <h1 className="docs-title">Why AI? (The Old vs New Way)</h1>
              <p className="docs-subtitle">See how we're making your life easier</p>

              <p className="docs-text">
                Let me tell you a story. Imagine you just had a great meeting with Dr. Sharma 
                at AIIMS. He's interested in your new drug and wants samples. You need to 
                log this interaction before you forget the details.
              </p>

              <h2 className="docs-section-title">😔 The Old Way (Without AI)</h2>
              
              <div className="docs-old-way">
                <p className="docs-text">1. Open CRM → Wait for it to load</p>
                <p className="docs-text">2. Find the right form → Click 5 times</p>
                <p className="docs-text">3. Type doctor's name → Then email → Then specialty</p>
                <p className="docs-text">4. Select organization from dropdown → Scroll...</p>
                <p className="docs-text">5. Pick date and time → Choose interaction type</p>
                <p className="docs-text">6. Type notes → Remember what you discussed</p>
                <p className="docs-text">7. Fill follow-up fields → Click save</p>
                <p className="docs-text"><strong>Total time: 5-10 minutes per interaction 😫</strong></p>
              </div>

              <h2 className="docs-section-title">😊 The New Way (With AI)</h2>

              <div className="docs-new-way">
                <p className="docs-text">1. Click on the chat box</p>
                <p className="docs-text">2. Type: "Met Dr. Sharma at AIIMS, discussed new heart medicine, he loved it, wants samples, follow up next week"</p>
                <p className="docs-text">3. Press Enter</p>
                <p className="docs-text"><strong>Done! 10 seconds! 🎉</strong></p>
              </div>

              <p className="docs-text">
                The AI automatically figured out:
              </p>
              <ul className="docs-list">
                <li><strong>Doctor name:</strong> Dr. Sharma</li>
                <li><strong>Organization:</strong> AIIMS</li>
                <li><strong>Specialty:</strong> Cardiology (from "heart medicine")</li>
                <li><strong>Sentiment:</strong> Positive (from "loved it")</li>
                <li><strong>Topics:</strong> New drug, Samples</li>
                <li><strong>Follow-up:</strong> Next week</li>
              </ul>

              <h2 className="docs-section-title">⏱️ Time Saved</h2>
              <table className="docs-table">
                <thead>
                  <tr>
                    <th className="docs-th">What You Do</th>
                    <th className="docs-th">Without AI</th>
                    <th className="docs-th">With AI</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="docs-td">Log a meeting</td>
                    <td className="docs-td">5-10 minutes</td>
                    <td className="docs-td"><span className="docs-badge-green">10 seconds</span></td>
                  </tr>
                  <tr>
                    <td className="docs-td">Update a record</td>
                    <td className="docs-td">Find + Open + Edit + Save</td>
                    <td className="docs-td"><span className="docs-badge-green">One message</span></td>
                  </tr>
                  <tr>
                    <td className="docs-td">Find past meetings</td>
                    <td className="docs-td">Navigate + Filter + Scroll</td>
                    <td className="docs-td"><span className="docs-badge-green">"Search for Dr. Smith"</span></td>
                  </tr>
                  <tr>
                    <td className="docs-td">See your stats</td>
                    <td className="docs-td">Export + Excel + Charts</td>
                    <td className="docs-td"><span className="docs-badge-green">"Show analytics"</span></td>
                  </tr>
                </tbody>
              </table>

              <div className="docs-tip">
                <strong>Bottom line:</strong> You focus on building relationships with doctors. 
                Let AI handle the paperwork! 🚀
              </div>
            </div>
          </div>
        )}

        {/* HOW TO USE */}
        {activeSection === 'how-to-use' && (
          <div>
            <div className="docs-card">
              <h1 className="docs-title">How to Use This Tool</h1>
              <p className="docs-subtitle">Step-by-step guide to get started</p>

              <h2 className="docs-section-title">Step 1: Open the Application</h2>
              <p className="docs-text">
                Just open your browser and go to the app. You'll see two sections:
              </p>
              <ul className="docs-list">
                <li><strong>Left side:</strong> A form (like traditional CRM but with Auto Fill)</li>
                <li><strong>Right side:</strong> AI Chat box (the magic happens here!)</li>
              </ul>

              <h2 className="docs-section-title">Step 2: Log Your First Interaction</h2>
              
              <div className="docs-scenario">
                <div className="docs-scenario-title">Option A: Use the Form (Easy)</div>
                <ol className="docs-list">
                  <li>Click the green "⚡ Auto Fill" button</li>
                  <li>Watch! All fields fill automatically with sample data</li>
                  <li>Click "💾 Log Interaction"</li>
                  <li>Done! Green success message appears</li>
                </ol>
              </div>

              <div className="docs-scenario">
                <div className="docs-scenario-title">Option B: Use AI Chat (Super Easy!)</div>
                <ol className="docs-list">
                  <li>Click in the chat box on the right</li>
                  <li>Type something like: "Log a call with Dr. Sharma about new drug"</li>
                  <li>Press Enter or click Send</li>
                  <li>AI does everything! You'll see a success message</li>
                </ol>
              </div>

              <h2 className="docs-section-title">Step 3: See All Your Records</h2>
              <p className="docs-text">
                Click "All Records" in the top menu. You'll see all logged interactions. 
                You can filter by type (Call, Meeting, Email, etc.)
              </p>

              <h2 className="docs-section-title">Step 4: Edit Something</h2>
              <p className="docs-text">
                Made a mistake? No problem! In the chat, type:
              </p>
              <div className="docs-code-block">
{`"Edit interaction 1, change notes to Corrected information"`}
              </div>

              <div className="docs-tip">
                <strong>Pro tip:</strong> First log an interaction, then check "All Records" 
                to see its ID number. Then you can edit it using that ID!
              </div>
            </div>
          </div>
        )}

        {/* FORM GUIDE */}
        {activeSection === 'form-guide' && (
          <div>
            <div className="docs-card">
              <h1 className="docs-title">Using the Form</h1>
              <p className="docs-subtitle">If you prefer filling forms manually (or use Auto Fill)</p>

              <p className="docs-text">
                The form is on the left side of the homepage. It's like any other form, but with 
                a cool Auto Fill button that does everything for you!
              </p>

              <h2 className="docs-section-title">Auto Fill - Your Best Friend</h2>
              <p className="docs-text">
                Click the green "⚡ Auto Fill" button and watch the magic! All fields fill 
                with random but realistic data. Click it multiple times to get different data each time.
              </p>

              <h2 className="docs-section-title">Form Fields Explained</h2>
              <table className="docs-table">
                <thead>
                  <tr>
                    <th className="docs-th">Field</th>
                    <th className="docs-th">What to Enter</th>
                    <th className="docs-th">Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="docs-td"><strong>HCP Name *</strong></td>
                    <td className="docs-td">Doctor's name (must include "Dr.")</td>
                    <td className="docs-td">Dr. Rajesh Sharma</td>
                  </tr>
                  <tr>
                    <td className="docs-td">Email</td>
                    <td className="docs-td">Their email (optional)</td>
                    <td className="docs-td">doctor@hospital.com</td>
                  </tr>
                  <tr>
                    <td className="docs-td">Specialty</td>
                    <td className="docs-td">What they specialize in</td>
                    <td className="docs-td">Cardiology, Neurology, Oncology</td>
                  </tr>
                  <tr>
                    <td className="docs-td">Organization</td>
                    <td className="docs-td">Hospital or clinic name</td>
                    <td className="docs-td">AIIMS Delhi, Apollo Hospital</td>
                  </tr>
                  <tr>
                    <td className="docs-td"><strong>Type *</strong></td>
                    <td className="docs-td">How you interacted</td>
                    <td className="docs-td">Call, Meeting, Email, Visit, Conference</td>
                  </tr>
                  <tr>
                    <td className="docs-td"><strong>Date *</strong></td>
                    <td className="docs-td">When it happened</td>
                    <td className="docs-td">10-07-2026 11:42</td>
                  </tr>
                  <tr>
                    <td className="docs-td"><strong>Notes *</strong></td>
                    <td className="docs-td">What was discussed (be detailed!)</td>
                    <td className="docs-td">Discussed new hypertension drug, doctor interested</td>
                  </tr>
                  <tr>
                    <td className="docs-td">Follow-up?</td>
                    <td className="docs-td">Need to follow up? Select Yes/No</td>
                    <td className="docs-td">Yes → shows date picker</td>
                  </tr>
                </tbody>
              </table>

              <div className="docs-tip">
                <strong>Remember:</strong> Fields with * are required. Everything else is optional. 
                The more details you put in Notes, the better!
              </div>
            </div>
          </div>
        )}

        {/* CHAT GUIDE */}
        {activeSection === 'chat-guide' && (
          <div>
            <div className="docs-card">
              <h1 className="docs-title">Using AI Chat (Recommended!)</h1>
              <p className="docs-subtitle">The fastest way to log interactions</p>

              <p className="docs-text">
                The AI Chat is on the right side of the homepage. It's like texting a smart 
                assistant who understands everything about your work!
              </p>

              <h2 className="docs-section-title">💡 Just Talk Naturally!</h2>
              <p className="docs-text">
                You don't need to learn any special commands. Just type like you're telling 
                a colleague about your meeting. Here's what works:
              </p>

              <h2 className="docs-section-title">📝 Logging Interactions</h2>
              <table className="docs-table">
                <thead>
                  <tr>
                    <th className="docs-th">What You Type</th>
                    <th className="docs-th">What AI Understands</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="docs-td">"Log a call with Dr. Sharma"</td>
                    <td className="docs-td">Creates a call interaction with Dr. Sharma</td>
                  </tr>
                  <tr>
                    <td className="docs-td">"Met Dr. Patel at Apollo, discussed new drug"</td>
                    <td className="docs-td">Meeting with Dr. Patel, topic: new drug</td>
                  </tr>
                  <tr>
                    <td className="docs-td">"I had a great visit with Dr. Kumar, very positive about our stent"</td>
                    <td className="docs-td">Visit, positive sentiment, topic: stent</td>
                  </tr>
                  <tr>
                    <td className="docs-td">"Email exchange with Dr. Gupta about trial results"</td>
                    <td className="docs-td">Email interaction, topic: trial results</td>
                  </tr>
                  <tr>
                    <td className="docs-td">"Conference meeting with Dr. Reddy, need follow up"</td>
                    <td className="docs-td">Conference, follow-up required</td>
                  </tr>
                </tbody>
              </table>

              <h2 className="docs-section-title">✏️ Editing Records</h2>
              <table className="docs-table">
                <thead>
                  <tr>
                    <th className="docs-th">What You Type</th>
                    <th className="docs-th">What Happens</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="docs-td">"Edit interaction 1, change notes to Updated info"</td>
                    <td className="docs-td">Updates notes for record #1</td>
                  </tr>
                  <tr>
                    <td className="docs-td">"Change sentiment to positive for interaction 2"</td>
                    <td className="docs-td">Updates sentiment for record #2</td>
                  </tr>
                  <tr>
                    <td className="docs-td">"Edit 1, change notes to X and sentiment to Y"</td>
                    <td className="docs-td">Updates BOTH fields at once!</td>
                  </tr>
                </tbody>
              </table>

              <h2 className="docs-section-title">🔍 Searching & Viewing</h2>
              <table className="docs-table">
                <thead>
                  <tr>
                    <th className="docs-th">What You Type</th>
                    <th className="docs-th">What You Get</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="docs-td">"Search for Dr. Patel"</td>
                    <td className="docs-td">All interactions with Dr. Patel</td>
                  </tr>
                  <tr>
                    <td className="docs-td">"Get profile for Dr. Sharma"</td>
                    <td className="docs-td">Full profile with stats</td>
                  </tr>
                  <tr>
                    <td className="docs-td">"Show analytics"</td>
                    <td className="docs-td">Your statistics and insights</td>
                  </tr>
                  <tr>
                    <td className="docs-td">"What are my numbers?"</td>
                    <td className="docs-td">Same as analytics</td>
                  </tr>
                </tbody>
              </table>

              <div className="docs-success">
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
            <div className="docs-card">
              <h1 className="docs-title">Real-Life Scenarios</h1>
              <p className="docs-subtitle">See how other field reps use this tool every day</p>

              <h2 className="docs-section-title">💼 Scenario 1: Morning Hospital Visit</h2>
              <div className="docs-scenario">
                <div className="docs-scenario-title">You just visited Dr. Rajesh Sharma at AIIMS Delhi</div>
                <p className="docs-text">
                  You discussed the new hypertension drug. He was impressed with clinical trial results 
                  and wants to prescribe it. Need to follow up next week with sample copies.
                </p>
                <p className="docs-text" style={{ fontWeight: 600 }}>What you type in chat:</p>
                <div className="docs-code-block">
{`"I just visited Dr. Rajesh Sharma at AIIMS Delhi. We discussed 
the new hypertension drug. He was impressed with the clinical 
trial results and wants to prescribe it to his patients. 
Need to follow up next week with sample copies."`}
                </div>
                <p className="docs-text" style={{ fontWeight: 600 }}>AI automatically extracts:</p>
                <ul className="docs-list" style={{ marginBottom: 0 }}>
                  <li>Doctor: Dr. Rajesh Sharma</li>
                  <li>Hospital: AIIMS Delhi</li>
                  <li>Type: Visit</li>
                  <li>Sentiment: Positive</li>
                  <li>Topics: Hypertension drug, Clinical trial</li>
                  <li>Follow-up: Yes (next week)</li>
                </ul>
              </div>

              <h2 className="docs-section-title">📞 Scenario 2: Phone Call Follow-up</h2>
              <div className="docs-scenario">
                <div className="docs-scenario-title">Dr. Priya Patel called asking about side effects</div>
                <p className="docs-text">
                  She's concerned about the side effects of your cardiac drug. You explained 
                  the safety profile. She'll review the data and get back to you.
                </p>
                <p className="docs-text" style={{ fontWeight: 600 }}>What you type:</p>
                <div className="docs-code-block">
{`"Log a call with Dr. Priya Patel from Apollo Hospital. 
She asked about side effects of our new cardiac drug. 
I explained the safety profile. She will review the 
data and get back to me."`}
                </div>
              </div>

              <h2 className="docs-section-title">🎤 Scenario 3: Conference Meeting</h2>
              <div className="docs-scenario">
                <div className="docs-scenario-title">Met Dr. Amit Kumar at cardiology conference</div>
                <p className="docs-text">
                  He's interested in your new stent technology. Very positive about the innovation. 
                  Wants to schedule a demo next month.
                </p>
                <p className="docs-text" style={{ fontWeight: 600 }}>What you type:</p>
                <div className="docs-code-block">
{`"Record a meeting with Dr. Amit Kumar from Fortis Healthcare. 
Met at cardiology conference. He's interested in our new 
stent technology. Very positive about the innovation. 
Schedule demo for next month."`}
                </div>
              </div>

              <h2 className="docs-section-title">✏️ Scenario 4: Fixing a Mistake</h2>
              <div className="docs-scenario">
                <div className="docs-scenario-title">You logged something wrong and need to fix it</div>
                <p className="docs-text" style={{ fontWeight: 600 }}>What you type:</p>
                <div className="docs-code-block">
{`"Edit interaction 1, change notes to Follow-up needed on 
dosage guidelines. Doctor wants detailed pharmacokinetics 
data."`}
                </div>
                <p className="docs-text" style={{ marginBottom: 0 }}>
                  That's it! Record #1 is updated.
                </p>
              </div>

              <h2 className="docs-section-title">🔍 Scenario 5: Finding Past Meetings</h2>
              <div className="docs-scenario">
                <div className="docs-scenario-title">You need to remember what you discussed with Dr. Patel</div>
                <p className="docs-text" style={{ fontWeight: 600 }}>What you type:</p>
                <div className="docs-code-block">
{`"Search for Dr. Patel"`}
                </div>
                <p className="docs-text" style={{ marginBottom: 0 }}>
                  AI shows all interactions with Dr. Patel with dates and topics!
                </p>
              </div>

              <h2 className="docs-section-title">👤 Scenario 6: Getting Doctor's Profile</h2>
              <div className="docs-scenario">
                <div className="docs-scenario-title">You want to see everything about a doctor</div>
                <p className="docs-text" style={{ fontWeight: 600 }}>What you type:</p>
                <div className="docs-code-block">
{`"Get profile for Dr. Sharma"`}
                </div>
                <p className="docs-text" style={{ marginBottom: 0 }}>
                  Shows: Name, specialty, hospital, total meetings, last meeting date, recent topics!
                </p>
              </div>

              <h2 className="docs-section-title">📊 Scenario 7: Checking Your Performance</h2>
              <div className="docs-scenario">
                <div className="docs-scenario-title">Manager wants your weekly stats</div>
                <p className="docs-text" style={{ fontWeight: 600 }}>What you type:</p>
                <div className="docs-code-block">
{`"Show analytics"`}
                </div>
                <p className="docs-text" style={{ marginBottom: 0 }}>
                  Shows: Total interactions, breakdown by type, sentiment distribution, top doctors!
                </p>
              </div>

              <div className="docs-tip">
                <strong>Remember:</strong> You can type ANYTHING in natural English. The AI 
                is smart enough to understand what you want to do!
              </div>
            </div>
          </div>
        )}

        {/* FAQ */}
        {activeSection === 'faq' && (
          <div>
            <div className="docs-card">
              <h1 className="docs-title">Frequently Asked Questions</h1>
              <p className="docs-subtitle">Answers to common questions</p>

              <div style={{ marginBottom: '1.5rem' }}>
                <h3 className="docs-subsection-title">🤔 What is this tool for?</h3>
                <p className="docs-text">
                  It's for pharmaceutical field representatives to log their meetings, calls, 
                  and visits with doctors. Instead of filling boring forms, you just tell 
                  the AI what happened!
                </p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h3 className="docs-subsection-title">🤖 How does the AI work?</h3>
                <p className="docs-text">
                  When you type something like "Met Dr. Sharma, discussed new drug", the AI 
                  automatically extracts: doctor name, hospital, what you discussed, how it went, 
                  and if you need to follow up. It's like having a smart assistant!
                </p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h3 className="docs-subsection-title">📝 Do I need to fill the form?</h3>
                <p className="docs-text">
                  No! You have two options: (1) Use the form with Auto Fill for quick entry, or 
                  (2) Use the AI Chat where you just type what happened. Most people prefer 
                  the chat - it's faster!
                </p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h3 className="docs-subsection-title">✏️ Can I fix mistakes?</h3>
                <p className="docs-text">
                  Absolutely! Just type: "Edit interaction [number], change [what] to [new value]". 
                  You can even change multiple things at once!
                </p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h3 className="docs-subsection-title">🔍 How do I find old records?</h3>
                <p className="docs-text">
                  Type "Search for Dr. [name]" in the chat. Or click "All Records" in the 
                  top menu to see everything with filters.
                </p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h3 className="docs-subsection-title">📊 Can I see my statistics?</h3>
                <p className="docs-text">
                  Yes! Just type "Show analytics" and you'll see: total interactions, 
                  breakdown by type (calls, meetings, etc.), sentiment analysis, 
                  and your top doctors.
                </p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h3 className="docs-subsection-title">📱 Does it work on mobile?</h3>
                <p className="docs-text">
                  Yes! The app works on phones, tablets, and computers. Use it anywhere!
                </p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h3 className="docs-subsection-title">🔒 Is my data safe?</h3>
                <p className="docs-text">
                  Yes! All data is stored securely in the database. Only you can see your interactions.
                </p>
              </div>

              <div className="docs-success">
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
