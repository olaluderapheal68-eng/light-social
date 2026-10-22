
"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Heart,
  MessageCircle,
  UserPlus,
  Users,
  AtSign,
  Settings2,
  CheckCheck,
  Bell,
} from "lucide-react";

type NotificationType = "like" | "reply" | "follow" | "community" | "mention";

type NotificationItem = {
  id: number;
  type: NotificationType;
  name: string;
  handle: string;
  initials: string;
  message: string;
  detail: string;
  time: string;
  read: boolean;
};

const initialNotifications: NotificationItem[] = [
  {
    id: 1,
    type: "like",
    name: "Ada Builds",
    handle: "@adabuilds",
    initials: "AB",
    message: "liked your post",
    detail: "Great products start with understanding the people who use them.",
    time: "5m ago",
    read: false,
  },
  {
    id: 2,
    type: "reply",
    name: "Design with Sam",
    handle: "@designwithsam",
    initials: "DS",
    message: "replied to your conversation",
    detail: "I agree! Good design makes complicated things feel simple.",
    time: "18m ago",
    read: false,
  },
  {
    id: 3,
    type: "follow",
    name: "Michael Dev",
    handle: "@michaeldev",
    initials: "MD",
    message: "started following you",
    detail: "",
    time: "1h ago",
    read: false,
  },
  {
    id: 4,
    type: "community",
    name: "Developers Hub",
    handle: "@developershub",
    initials: "DH",
    message: "has a new discussion",
    detail: "What technology are you most excited to learn this year?",
    time: "3h ago",
    read: true,
  },
  {
    id: 5,
    type: "mention",
    name: "The Learning Space",
    handle: "@learningspace",
    initials: "LS",
    message: "mentioned you in a post",
    detail: "Sharing useful learning resources with the community.",
    time: "Yesterday",
    read: true,
  },
  {
    id: 6,
    type: "like",
    name: "Jordan Creates",
    handle: "@jordancreates",
    initials: "JC",
    message: "liked your post",
    detail: "Taking an idea from a notebook to a working product.",
    time: "Yesterday",
    read: true,
  },
];

const filters = ["All", "Unread", "Replies", "Follows", "Likes"] as const;
type NotificationFilter = (typeof filters)[number];

function NotificationIcon({ type }: { type: NotificationType }) {
  switch (type) {
    case "like":
      return <Heart size={18} />;
    case "reply":
      return <MessageCircle size={18} />;
    case "follow":
      return <UserPlus size={18} />;
    case "community":
      return <Users size={18} />;
    case "mention":
      return <AtSign size={18} />;
  }
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>("All");

  const unreadCount = notifications.filter((item) => !item.read).length;

  const visibleNotifications = notifications.filter((item) => {
    switch (activeFilter) {
      case "Unread":
        return !item.read;
      case "Replies":
        return item.type === "reply" || item.type === "mention";
      case "Follows":
        return item.type === "follow";
      case "Likes":
        return item.type === "like";
      default:
        return true;
    }
  });

  function markAllRead() {
    setNotifications((current) =>
      current.map((item) => ({ ...item, read: true }))
    );
  }

  function markOneRead(id: number) {
    setNotifications((current) =>
      current.map((item) =>
        item.id === id ? { ...item, read: true } : item
      )
    );
  }

  return (
    <main className="light-app">
      <aside className="sidebar">
        <Link href="/" className="brand">
          <span className="brand-icon">L</span>
          <span>Light</span>
        </Link>

        <nav className="nav-links" aria-label="Main navigation">
          {[
            { label: "Home", href: "/" },
            { label: "Explore", href: "/explore" },
            { label: "Notifications", href: "/notifications" },
            { label: "Messages", href: "/messages" },
            { label: "Communities", href: "/communities" },
            { label: "Profile", href: "/profile" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${item.href === "/notifications" ? "active" : ""}`}
            >
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <p className="sidebar-note">Your world. Your voice. Your Light.</p>
      </aside>

      <section className="feed notifications-feed">
        <header className="feed-header">
          <div>
            <p className="eyebrow">STAY IN THE LOOP</p>
            <h1>Notifications</h1>
            <p className="notifications-subtitle">
              You have {unreadCount} unread {unreadCount === 1 ? "notification" : "notifications"}.
            </p>
          </div>

          <button
            type="button"
            className="notifications-mark-all"
            onClick={markAllRead}
            disabled={unreadCount === 0}
          >
            <CheckCheck size={16} />
            <span>Mark all read</span>
          </button>
        </header>

        <div className="notifications-filters" aria-label="Filter notifications">
          {filters.map((filter) => (
            <button
              type="button"
              key={filter}
              className={activeFilter === filter ? "notification-filter active" : "notification-filter"}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
              {filter === "Unread" && unreadCount > 0 && (
                <span className="notification-filter-count">{unreadCount}</span>
              )}
            </button>
          ))}
        </div>

        <div className="notifications-list">
          {visibleNotifications.map((item) => (
            <article
              key={item.id}
              className={`notification-item ${item.read ? "read" : "unread"}`}
            >
              <div className={`notification-type-icon ${item.type}`}>
                <NotificationIcon type={item.type} />
              </div>

              <div className="notification-avatar">{item.initials}</div>

              <div className="notification-content">
                <div className="notification-heading">
                  <strong>{item.name}</strong>
                  <span>{item.handle}</span>
                  <time>{item.time}</time>
                </div>

                <p className="notification-message">{item.message}</p>

                {item.detail && (
                  <p className="notification-detail">{item.detail}</p>
                )}

                {!item.read && (
                  <button
                    type="button"
                    className="notification-read-button"
                    onClick={() => markOneRead(item.id)}
                  >
                    Mark as read
                  </button>
                )}
              </div>

              {!item.read && <span className="notification-unread-dot" />}
            </article>
          ))}

          {visibleNotifications.length === 0 && (
            <div className="notifications-empty">
              <Bell size={30} />
              <h2>You're all caught up</h2>
              <p>There are no notifications in this category right now.</p>
            </div>
          )}
        </div>

        <p className="notifications-demo-note">
          These are sample notifications. Real account activity will be connected later.
        </p>
      </section>

      <aside className="right-sidebar">
        <section className="side-card">
          <h2>Your activity</h2>
          <p>
            Notifications help you keep up with the people and communities
            that matter to you.
          </p>
        </section>

        <section className="side-card">
          <h2>Notification preferences</h2>
          <p>Control which updates you receive in your account settings.</p>
          <Link className="notifications-settings-link" href="/settings">
            <Settings2 size={16} />
            Notification settings
          </Link>
        </section>

        <p className="footer-note">Light Social · Your world, your voice.</p>
      </aside>
    </main>
  );
}
