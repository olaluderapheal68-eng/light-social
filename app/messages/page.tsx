
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Search,
  Send,
  Phone,
  Video,
  MoreHorizontal,
  ArrowLeft,
  MessageCircle,
} from "lucide-react";

type ChatMessage = {
  id: number;
  text: string;
  mine: boolean;
  time: string;
};

type Conversation = {
  id: number;
  name: string;
  handle: string;
  initials: string;
  preview: string;
  time: string;
  online: boolean;
  messages: ChatMessage[];
};

const initialConversations: Conversation[] = [
  {
    id: 1,
    name: "Ada Builds",
    handle: "@adabuilds",
    initials: "AB",
    preview: "That sounds like a great idea!",
    time: "9:42 AM",
    online: true,
    messages: [
      { id: 1, text: "Hey! How is your project coming along?", mine: false, time: "9:35 AM" },
      { id: 2, text: "It's going well. I'm working on the messaging interface.", mine: true, time: "9:38 AM" },
      { id: 3, text: "That sounds like a great idea!", mine: false, time: "9:42 AM" },
    ],
  },
  {
    id: 2,
    name: "Design with Sam",
    handle: "@designwithsam",
    initials: "DS",
    preview: "I shared the new design.",
    time: "Yesterday",
    online: false,
    messages: [
      { id: 1, text: "I have been refining the new interface.", mine: false, time: "Yesterday" },
      { id: 2, text: "I shared the new design.", mine: false, time: "Yesterday" },
    ],
  },
  {
    id: 3,
    name: "The Learning Space",
    handle: "@learningspace",
    initials: "LS",
    preview: "Thanks for the resources!",
    time: "Tue",
    online: true,
    messages: [
      { id: 1, text: "Here are a few resources to get started.", mine: true, time: "Tuesday" },
      { id: 2, text: "Thanks for the resources!", mine: false, time: "Tuesday" },
    ],
  },
  {
    id: 4,
    name: "Michael Dev",
    handle: "@michaeldev",
    initials: "MD",
    preview: "Let's build something together.",
    time: "Mon",
    online: false,
    messages: [
      { id: 1, text: "I enjoyed our conversation about software.", mine: false, time: "Monday" },
      { id: 2, text: "Let's build something together.", mine: false, time: "Monday" },
    ],
  },
];

export default function MessagesPage() {
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedId, setSelectedId] = useState<number | null>(1);
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [mobileChatOpen, setMobileChatOpen] = useState(false);

  const selectedConversation = conversations.find(
    (conversation) => conversation.id === selectedId
  );

  const filteredConversations = useMemo(
    () =>
      conversations.filter((conversation) =>
        `${conversation.name} ${conversation.handle} ${conversation.preview}`
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [conversations, search]
  );

  function sendMessage() {
    const text = draft.trim();
    if (!text || !selectedConversation) return;

    const newMessage: ChatMessage = {
      id: Date.now(),
      text,
      mine: true,
      time: new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      }),
    };

    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === selectedConversation.id
          ? {
              ...conversation,
              preview: text,
              time: "Now",
              messages: [...conversation.messages, newMessage],
            }
          : conversation
      )
    );

    setDraft("");
  }

  return (
    <main className={`light-app messages-app ${mobileChatOpen ? "mobile-chat-open" : ""}`}>
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
              className={`nav-item ${item.href === "/messages" ? "active" : ""}`}
            >
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <p className="sidebar-note">Your world. Your voice. Your Light.</p>
      </aside>

      <section className="feed messages-feed">
        <header className="feed-header messages-page-heading">
          <div>
            <p className="eyebrow">STAY CONNECTED</p>
            <h1>Messages</h1>
          </div>
        </header>

        <div className="messages-workspace">
          <aside className="conversation-panel">
            <div className="conversation-heading">
              <h2>Inbox</h2>
              <span>{filteredConversations.length}</span>
            </div>

            <label className="conversation-search">
              <Search size={17} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search messages"
                aria-label="Search conversations"
              />
            </label>

            <div className="conversation-list">
              {filteredConversations.map((conversation) => (
                <button
                  type="button"
                  key={conversation.id}
                  className={`conversation-item ${selectedId === conversation.id ? "selected" : ""}`}
                  onClick={() => {
                    setSelectedId(conversation.id);
                    setMobileChatOpen(true);
                  }}
                >
                  <span className="message-avatar">
                    {conversation.initials}
                    {conversation.online && <i />}
                  </span>

                  <span className="conversation-details">
                    <span className="conversation-name-row">
                      <strong>{conversation.name}</strong>
                      <small>{conversation.time}</small>
                    </span>
                    <span className="conversation-preview">
                      {conversation.preview}
                    </span>
                  </span>
                </button>
              ))}

              {filteredConversations.length === 0 && (
                <p className="messages-empty">No conversations found.</p>
              )}
            </div>
          </aside>

          <section className="chat-panel">
            {selectedConversation ? (
              <>
                <header className="chat-header">
                  <button
                    type="button"
                    className="chat-back"
                    onClick={() => setMobileChatOpen(false)}
                    aria-label="Back to conversations"
                  >
                    <ArrowLeft size={19} />
                  </button>

                  <span className="message-avatar">
                    {selectedConversation.initials}
                    {selectedConversation.online && <i />}
                  </span>

                  <div className="chat-contact">
                    <strong>{selectedConversation.name}</strong>
                    <span>
                      {selectedConversation.online ? "Online" : selectedConversation.handle}
                    </span>
                  </div>

                  <div className="chat-header-actions">
                    <button type="button" aria-label="Voice call" title="Voice calls will be connected later">
                      <Phone size={18} />
                    </button>
                    <button type="button" aria-label="Video call" title="Video calls will be connected later">
                      <Video size={18} />
                    </button>
                    <button type="button" aria-label="More options" title="More options">
                      <MoreHorizontal size={20} />
                    </button>
                  </div>
                </header>

                <div className="chat-contact-summary">
                  <span className="message-avatar large">
                    {selectedConversation.initials}
                  </span>
                  <strong>{selectedConversation.name}</strong>
                  <span>{selectedConversation.handle}</span>
                  <p>This is the beginning of your conversation.</p>
                </div>

                <div className="chat-messages" aria-live="polite">
                  {selectedConversation.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`chat-message-row ${message.mine ? "mine" : ""}`}
                    >
                      <div className="chat-bubble">
                        <p>{message.text}</p>
                        <time>{message.time}</time>
                      </div>
                    </div>
                  ))}
                </div>

                <form
                  className="chat-composer"
                  onSubmit={(event) => {
                    event.preventDefault();
                    sendMessage();
                  }}
                >
                  <input
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder="Write a message..."
                    aria-label="Write a message"
                  />
                  <button type="submit" disabled={!draft.trim()} aria-label="Send message">
                    <Send size={18} />
                  </button>
                </form>
              </>
            ) : (
              <div className="chat-no-selection">
                <MessageCircle size={38} />
                <h2>Your messages</h2>
                <p>Choose a conversation to start chatting.</p>
              </div>
            )}
          </section>
        </div>
      </section>

      <aside className="right-sidebar">
        <section className="side-card">
          <h2>Your conversations</h2>
          <p>Keep up with your connections and continue meaningful conversations.</p>
        </section>
        <section className="side-card">
          <h2>Private by design</h2>
          <p>Your conversations should be accessible only to the people allowed to see them.</p>
        </section>
        <p className="footer-note">Light Social · Your world, your voice.</p>
      </aside>
    </main>
  );
}
