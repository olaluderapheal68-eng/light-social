
"use client";

import Link from "next/link";
import { useState } from "react";
import { useTheme } from "next-themes";
import {
  Home,
  Compass,
  Bell,
  Mail,
  Users,
  UserRound,
  Settings as SettingsIcon,
  Sun,
  Moon,
  ShieldCheck,
  UserCog,
  Eye,
  ArrowLeft,
  Check,
} from "lucide-react";

const navigation = [
  { label: "Home", href: "/", icon: Home },
  { label: "Explore", href: "/explore", icon: Compass },
  { label: "Notifications", href: "/notifications", icon: Bell },
  { label: "Messages", href: "/messages", icon: Mail },
  { label: "Communities", href: "/communities", icon: Users },
  { label: "Profile", href: "/profile", icon: UserRound },
];

const settingTabs = [
  { label: "Account", icon: UserCog },
  { label: "Appearance", icon: Sun },
  { label: "Privacy", icon: ShieldCheck },
  { label: "Notifications", icon: Bell },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("Account");
  const { theme, setTheme } = useTheme();

  const [emailUpdates, setEmailUpdates] = useState(true);
  const [likesNotifications, setLikesNotifications] = useState(true);
  const [replyNotifications, setReplyNotifications] = useState(true);
  const [followNotifications, setFollowNotifications] = useState(true);
  const [privateAccount, setPrivateAccount] = useState(false);
  const [showActivity, setShowActivity] = useState(true);
  const [allowMessages, setAllowMessages] = useState(true);
  const [saved, setSaved] = useState(false);

  function showSavedMessage() {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  }

  function toggleSetting(action: () => void) {
    action();
    setSaved(false);
  }

  return (
    <main className="light-app settings-layout">
      <aside className="sidebar">
        <Link href="/" className="brand">
          <span className="brand-icon">L</span>
          <span>Light</span>
        </Link>

        <nav className="nav-links">
          {navigation.map(({ label, href, icon: Icon }) => (
            <Link
              href={href}
              key={label}
              className="nav-item"
            >
              <Icon size={21} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <Link href="/settings" className="nav-item active">
          <SettingsIcon size={21} />
          <span>Settings</span>
        </Link>
      </aside>

      <section className="feed settings-feed">
        <header className="feed-header settings-header">
          <Link href="/" className="settings-back" aria-label="Back home">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <p className="eyebrow">YOUR EXPERIENCE</p>
            <h1>Settings</h1>
            <p className="settings-subtitle">
              Manage your Light experience and preferences.
            </p>
          </div>
        </header>

        <div className="settings-tabs">
          {settingTabs.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={activeTab === label ? "active" : ""}
              onClick={() => {
                setActiveTab(label);
                setSaved(false);
              }}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}
        </div>

        <div className="settings-content">
          {activeTab === "Account" && (
            <section className="settings-section">
              <h2>Account information</h2>
              <p className="settings-description">
                Review the information associated with your Light account.
              </p>

              <div className="settings-info-row">
                <div>
                  <strong>Username</strong>
                  <p>@lightcreator</p>
                </div>
                <span className="settings-demo-label">Demo account</span>
              </div>

              <div className="settings-info-row">
                <div>
                  <strong>Email address</strong>
                  <p>Not connected yet</p>
                </div>
                <span className="settings-status">Pending setup</span>
              </div>

              <div className="settings-info-row">
                <div>
                  <strong>Password and security</strong>
                  <p>Password changes will be available after authentication is connected.</p>
                </div>
              </div>

              <div className="settings-info-row">
                <div>
                  <strong>Account data</strong>
                  <p>Your real account data will be managed through Supabase.</p>
                </div>
              </div>
            </section>
          )}

          {activeTab === "Appearance" && (
            <section className="settings-section">
              <h2>Appearance</h2>
              <p className="settings-description">
                Choose how Light looks on your device.
              </p>

              <div className="settings-theme-options">
                <button
                  className={`settings-theme-option ${theme === "light" ? "selected" : ""}`}
                  onClick={() => toggleSetting(() => setTheme("light"))}
                >
                  <Sun size={24} />
                  <strong>Light mode</strong>
                  <span>Bright and clear</span>
                  {theme === "light" && <Check size={18} />}
                </button>

                <button
                  className={`settings-theme-option ${theme === "dark" ? "selected" : ""}`}
                  onClick={() => toggleSetting(() => setTheme("dark"))}
                >
                  <Moon size={24} />
                  <strong>Dark mode</strong>
                  <span>Comfortable in low light</span>
                  {theme === "dark" && <Check size={18} />}
                </button>

                <button
                  className={`settings-theme-option ${theme === "system" ? "selected" : ""}`}
                  onClick={() => toggleSetting(() => setTheme("system"))}
                >
                  <Eye size={24} />
                  <strong>Use device setting</strong>
                  <span>Follow your device preference</span>
                  {theme === "system" && <Check size={18} />}
                </button>
              </div>
            </section>
          )}

          {activeTab === "Privacy" && (
            <section className="settings-section">
              <h2>Privacy and safety</h2>
              <p className="settings-description">
                Choose how people can interact with your profile.
              </p>

              <SettingSwitch
                title="Private account"
                description="In the finished app, only approved followers will be able to see restricted posts."
                checked={privateAccount}
                onChange={() => toggleSetting(() => setPrivateAccount(!privateAccount))}
              />

              <SettingSwitch
                title="Show activity status"
                description="Allow other users to see when you are active."
                checked={showActivity}
                onChange={() => toggleSetting(() => setShowActivity(!showActivity))}
              />

              <SettingSwitch
                title="Allow direct messages"
                description="Allow people to send you messages."
                checked={allowMessages}
                onChange={() => toggleSetting(() => setAllowMessages(!allowMessages))}
              />

              <p className="settings-notice">
                These privacy switches currently demonstrate the interface only.
                They do not enforce privacy rules on posts or messages yet.
              </p>
            </section>
          )}

          {activeTab === "Notifications" && (
            <section className="settings-section">
              <h2>Notification preferences</h2>
              <p className="settings-description">
                Choose which updates you want to receive.
              </p>

              <SettingSwitch
                title="Email updates"
                description="Receive account and product updates by email."
                checked={emailUpdates}
                onChange={() => toggleSetting(() => setEmailUpdates(!emailUpdates))}
              />

              <SettingSwitch
                title="Likes"
                description="Get notified when someone likes your posts."
                checked={likesNotifications}
                onChange={() => toggleSetting(() => setLikesNotifications(!likesNotifications))}
              />

              <SettingSwitch
                title="Replies"
                description="Get notified when someone replies to your posts."
                checked={replyNotifications}
                onChange={() => toggleSetting(() => setReplyNotifications(!replyNotifications))}
              />

              <SettingSwitch
                title="New followers"
                description="Get notified when someone follows you."
                checked={followNotifications}
                onChange={() => toggleSetting(() => setFollowNotifications(!followNotifications))}
              />
            </section>
          )}

          <div className="settings-save-area">
            {saved && (
              <p className="settings-saved-message">
                <Check size={17} /> Preference updated for this session.
              </p>
            )}
            <button
              className="settings-save-button"
              onClick={showSavedMessage}
            >
              Save preferences
            </button>
          </div>
        </div>
      </section>

      <aside className="right-sidebar">
        <div className="side-card">
          <h3>Account and privacy</h3>
          <p>
            Your settings will be connected to your Light account when
            authentication and the database are ready.
          </p>
        </div>

        <div className="side-card">
          <h3>Need help?</h3>
          <p>Visit the other sections of Light to continue exploring the app.</p>
          <Link href="/explore">Explore Light</Link>
        </div>
      </aside>
    </main>
  );
}

type SettingSwitchProps = {
  title: string;
  description: string;
  checked: boolean;
  onChange: () => void;
};

function SettingSwitch({
  title,
  description,
  checked,
  onChange,
}: SettingSwitchProps) {
  return (
    <div className="settings-switch-row">
      <div className="settings-switch-copy">
        <strong>{title}</strong>
        <p>{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={title}
        className={`settings-switch ${checked ? "checked" : ""}`}
        onClick={onChange}
      >
        <span />
      </button>
    </div>
  );
}
