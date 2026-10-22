
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Home,
  Compass,
  Bell,
  Mail,
  Users,
  UserRound,
  Settings,
  Search,
  CalendarDays,
  MapPin,
  Link as LinkIcon,
  MoreHorizontal,
  MessageCircle,
  Repeat2,
  Heart,
  Share2,
  Image as ImageIcon,
  ArrowLeft,
} from "lucide-react";

const profilePosts = [
  {
    id: 1,
    text: "Building Light has been an exciting journey. The goal is to create a social platform where people can connect, learn, build communities, and share ideas.",
    date: "2 hours ago",
    replies: 12,
    reposts: 5,
    likes: 48,
  },
  {
    id: 2,
    text: "Every great product starts with a problem worth solving. Keep learning, keep building, and keep improving.",
    date: "1 day ago",
    replies: 8,
    reposts: 3,
    likes: 31,
  },
];

const navigation = [
  { label: "Home", href: "/", icon: Home },
  { label: "Explore", href: "/explore", icon: Compass },
  { label: "Notifications", href: "/notifications", icon: Bell },
  { label: "Messages", href: "/messages", icon: Mail },
  { label: "Communities", href: "/communities", icon: Users },
  { label: "Profile", href: "/profile", icon: UserRound },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("Posts");
  const [following, setFollowing] = useState(false);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("Light Creator");
  const [username, setUsername] = useState("lightcreator");
  const [bio, setBio] = useState(
    "Building, learning, and connecting. Welcome to my corner of Light."
  );
  const [location, setLocation] = useState("Lagos, Nigeria");
  const [website, setWebsite] = useState("light.social");
  const [draftName, setDraftName] = useState(name);
  const [draftBio, setDraftBio] = useState(bio);
  const [draftLocation, setDraftLocation] = useState(location);
  const [draftWebsite, setDraftWebsite] = useState(website);
  const [likedPosts, setLikedPosts] = useState<number[]>([]);

  function openEditor() {
    setDraftName(name);
    setDraftBio(bio);
    setDraftLocation(location);
    setDraftWebsite(website);
    setEditing(true);
  }

  function saveProfile() {
    setName(draftName.trim() || name);
    setBio(draftBio);
    setLocation(draftLocation);
    setWebsite(draftWebsite);
    setEditing(false);
  }

  return (
    <main className="light-app profile-layout">
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
              className={`nav-item ${label === "Profile" ? "active" : ""}`}
            >
              <Icon size={21} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <Link href="/settings" className="nav-item">
          <Settings size={21} />
          <span>Settings</span>
        </Link>
      </aside>

      <section className="feed profile-feed">
        <header className="feed-header profile-topbar">
          <Link href="/" className="profile-back">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1>{name}</h1>
            <p className="muted-text">{profilePosts.length} posts</p>
          </div>
        </header>

        <div className="profile-cover">
          <div className="profile-cover-decoration">L</div>
        </div>

        <section className="profile-details">
          <div className="profile-actions">
            <div className="profile-avatar">L</div>
            <div className="profile-action-buttons">
              <button
                className="profile-icon-button"
                aria-label="More profile options"
                onClick={() => alert("More profile options will be added later.")}
              >
                <MoreHorizontal size={20} />
              </button>

              <button
                className={`profile-follow-button ${following ? "following" : ""}`}
                onClick={() => setFollowing(!following)}
              >
                {following ? "Following" : "Follow"}
              </button>

              <button className="profile-edit-button" onClick={openEditor}>
                Edit profile
              </button>
            </div>
          </div>

          <h2 className="profile-name">{name}</h2>
          <p className="profile-username">@{username}</p>
          <p className="profile-bio">{bio}</p>

          <div className="profile-meta">
            {location && (
              <span><MapPin size={16} />{location}</span>
            )}
            {website && (
              <span>
                <LinkIcon size={16} />
                <a href={`https://${website}`} target="_blank" rel="noreferrer">
                  {website}
                </a>
              </span>
            )}
            <span><CalendarDays size={16} />Joined October 2026</span>
          </div>

          <div className="profile-follow-stats">
            <span><strong>128</strong> Following</span>
            <span><strong>1,240</strong> Followers</span>
          </div>
        </section>

        {editing && (
          <section className="profile-editor">
            <div className="profile-editor-heading">
              <h2>Edit profile</h2>
              <button onClick={() => setEditing(false)}>Cancel</button>
            </div>

            <label>
              Display name
              <input
                value={draftName}
                onChange={(event) => setDraftName(event.target.value)}
                maxLength={50}
              />
            </label>

            <label>
              Bio
              <textarea
                value={draftBio}
                onChange={(event) => setDraftBio(event.target.value)}
                maxLength={160}
                rows={3}
              />
              <span className="profile-character-count">
                {draftBio.length}/160
              </span>
            </label>

            <label>
              Location
              <input
                value={draftLocation}
                onChange={(event) => setDraftLocation(event.target.value)}
                maxLength={80}
              />
            </label>

            <label>
              Website
              <input
                value={draftWebsite}
                onChange={(event) => setDraftWebsite(event.target.value)}
                placeholder="example.com"
                maxLength={120}
              />
            </label>

            <button className="profile-save-button" onClick={saveProfile}>
              Save changes
            </button>
          </section>
        )}

        <div className="profile-tabs">
          {["Posts", "Replies", "Media", "Likes"].map((tab) => (
            <button
              key={tab}
              className={activeTab === tab ? "active" : ""}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "Posts" ? (
          profilePosts.map((post) => {
            const liked = likedPosts.includes(post.id);

            return (
              <article className="post-card profile-post" key={post.id}>
                <div className="profile-post-avatar">L</div>
                <div className="profile-post-content">
                  <div className="profile-post-heading">
                    <div>
                      <strong>{name}</strong>
                      <span className="muted-text"> @{username} · {post.date}</span>
                    </div>
                    <MoreHorizontal size={20} />
                  </div>

                  <p>{post.text}</p>

                  <div className="profile-post-actions">
                    <button onClick={() => alert("Replies will be connected later.")}>
                      <MessageCircle size={17} />{post.replies}
                    </button>
                    <button onClick={() => alert("Reposts will be connected later.")}>
                      <Repeat2 size={17} />{post.reposts}
                    </button>
                    <button
                      className={liked ? "liked" : ""}
                      onClick={() =>
                        setLikedPosts((current) =>
                          liked
                            ? current.filter((id) => id !== post.id)
                            : [...current, post.id]
                        )
                      }
                    >
                      <Heart size={17} fill={liked ? "currentColor" : "none"} />
                      {post.likes + (liked ? 1 : 0)}
                    </button>
                    <button
                      aria-label="Share post"
                      onClick={() => alert("Post sharing will be added later.")}
                    >
                      <Share2 size={17} />
                    </button>
                  </div>
                </div>
              </article>
            );
          })
        ) : (
          <div className="profile-empty-state">
            <ImageIcon size={30} />
            <h3>{activeTab}</h3>
            <p>
              This section will display your {activeTab.toLowerCase()} when
              the corresponding features are connected.
            </p>
          </div>
        )}
      </section>

      <aside className="right-sidebar">
        <div className="side-card">
          <h3><Search size={18} /> Search Light</h3>
          <input placeholder="Search Light" />
        </div>

        <div className="side-card">
          <h3>Profile tips</h3>
          <p>Add a clear bio and useful links so people can learn more about you.</p>
          <button className="profile-tip-button" onClick={openEditor}>
            Complete your profile
          </button>
        </div>

        <div className="side-card">
          <h3>Explore Light</h3>
          <p>Discover communities and connect with people who share your interests.</p>
          <Link href="/explore">Explore people and topics</Link>
        </div>
      </aside>
    </main>
  );
}
