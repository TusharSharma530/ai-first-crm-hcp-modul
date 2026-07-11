import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Settings, Shield, Bell, Palette, Globe, Clock, Key, Smartphone,
  Mail, Lock, Server, RefreshCw, Bot, Zap, Info, ChevronRight
} from 'lucide-react';
import '../../styles/auth.css';

export default function SettingsPage() {
  const navigate = useNavigate();

  const [settings, setSettings] = useState({
    theme: 'light',
    language: 'en',
    timezone: 'UTC',
    emailNotifications: true,
    pushNotifications: false,
    autoAnalysis: true,
    smartSuggestions: true,
  });

  const toggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1>Settings</h1>
          <p>Manage your application preferences and configurations</p>
        </div>

        <div className="settings-grid">
          <SettingsSection
            icon={<Palette size={20} />}
            title="General"
            description="Basic application preferences"
          >
            <SettingsItem label="Theme" description="Choose your preferred color scheme">
              <select
                className="settings-select"
                value={settings.theme}
                onChange={(e) => handleChange('theme', e.target.value)}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </SettingsItem>
            <SettingsItem label="Language" description="Select your display language">
              <select
                className="settings-select"
                value={settings.language}
                onChange={(e) => handleChange('language', e.target.value)}
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
            </SettingsItem>
            <SettingsItem label="Timezone" description="Set your local timezone">
              <select
                className="settings-select"
                value={settings.timezone}
                onChange={(e) => handleChange('timezone', e.target.value)}
              >
                <option value="UTC">UTC</option>
                <option value="EST">EST</option>
                <option value="PST">PST</option>
                <option value="CST">CST</option>
              </select>
            </SettingsItem>
          </SettingsSection>

          <SettingsSection
            icon={<Shield size={20} />}
            title="Security"
            description="Protect your account"
          >
            <SettingsItem label="Change Password" description="Update your password regularly">
              <button className="settings-btn" onClick={() => navigate('/change-password')}>
                <Key size={16} />
                Change
                <ChevronRight size={16} />
              </button>
            </SettingsItem>
            <SettingsItem label="Two-Factor Authentication" description="Add an extra layer of security">
              <div className="settings-placeholder">
                <Lock size={16} />
                Coming Soon
              </div>
            </SettingsItem>
            <SettingsItem label="Active Sessions" description="Manage your logged-in devices">
              <div className="settings-info">
                <Smartphone size={16} />
                <span>2 active sessions</span>
              </div>
            </SettingsItem>
          </SettingsSection>

          <SettingsSection
            icon={<Bell size={20} />}
            title="Notifications"
            description="Control how you receive updates"
          >
            <SettingsItem label="Email Notifications" description="Receive updates via email">
              <ToggleSwitch
                checked={settings.emailNotifications}
                onChange={() => toggleSetting('emailNotifications')}
              />
            </SettingsItem>
            <SettingsItem label="Push Notifications" description="Receive browser push notifications">
              <ToggleSwitch
                checked={settings.pushNotifications}
                onChange={() => toggleSetting('pushNotifications')}
              />
            </SettingsItem>
          </SettingsSection>

          <SettingsSection
            icon={<Bot size={20} />}
            title="AI Preferences"
            description="Configure AI-powered features"
          >
            <SettingsItem label="Auto-Analysis" description="Automatically analyze incoming data">
              <ToggleSwitch
                checked={settings.autoAnalysis}
                onChange={() => toggleSetting('autoAnalysis')}
              />
            </SettingsItem>
            <SettingsItem label="Smart Suggestions" description="Get AI-powered recommendations">
              <ToggleSwitch
                checked={settings.smartSuggestions}
                onChange={() => toggleSetting('smartSuggestions')}
              />
            </SettingsItem>
          </SettingsSection>

          <SettingsSection
            icon={<Server size={20} />}
            title="System Information"
            description="Application status and details"
          >
            <SettingsItem label="Version" description="Current application version">
              <div className="settings-info">
                <Info size={16} />
                <span>v1.0.0</span>
              </div>
            </SettingsItem>
            <SettingsItem label="API Status" description="Backend service status">
              <div className="settings-status">
                <span className="status-dot status-online"></span>
                <span>Connected</span>
              </div>
            </SettingsItem>
            <SettingsItem label="Last Sync" description="When data was last synchronized">
              <div className="settings-info">
                <RefreshCw size={16} />
                <span>{new Date().toLocaleString()}</span>
              </div>
            </SettingsItem>
          </SettingsSection>
        </div>
      </div>
    </div>
  );
}

function SettingsSection({ icon, title, description, children }) {
  return (
    <div className="settings-card">
      <div className="settings-card-header">
        <div className="settings-card-icon">{icon}</div>
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </div>
      <div className="settings-card-content">{children}</div>
    </div>
  );
}

function SettingsItem({ label, description, children }) {
  return (
    <div className="settings-item">
      <div className="settings-item-info">
        <span className="settings-item-label">{label}</span>
        <span className="settings-item-description">{description}</span>
      </div>
      <div className="settings-item-control">{children}</div>
    </div>
  );
}

function ToggleSwitch({ checked, onChange }) {
  return (
    <button
      type="button"
      className={`settings-toggle ${checked ? 'active' : ''}`}
      onClick={onChange}
      role="switch"
      aria-checked={checked}
    >
      <span className="settings-toggle-thumb" />
    </button>
  );
}
