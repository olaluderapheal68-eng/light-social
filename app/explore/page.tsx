
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Search,
  TrendingUp,
  Users,
  Hash,
  MessageCircle,
  Heart,
  ArrowUpRight,
  Compass,
  X,
} from "lucide-react";

const trends = [
  { category: "Technology", topic: "The future of web development", posts: "1,240 posts" },
  { category: "Creators", topic: "Show us what you're building", posts: "864 posts" },
  { category: "Community", topic: "Ideas that make a difference", posts: "532 posts" },
  { category: "Design", topic: "Building better digital experiences", posts: "428 posts" },
  { category: "Education", topic: "What are you learning today?", posts: "316 posts" },
];

const creators = [
  { name: "Ada Builds", handle: "@adabuilds", bio: "Developer sharing projects and lessons.", initials: "AB", category: "Technology" },
  { name: "Design with Sam", handle: "@designwithsam", bio: "UI/UX design, creativity and product thinking.", initials: "DS", category: "Design" },
  { name: "The Learning Space", handle: "@learningspace", bio: "A community for curious minds.", initials: "LS", category: "Education" },
];

const posts = [
  {
    name: "Ada Builds",
    handle: "@adabuilds",
    initials: "AB",
    category: "Technology",
    text: "Building a product is more than writing code. Understand the problem, listen to users, and improve one step at a time. What are you working on?",
    likes: 42,
    replies: 12,
  },
  {
    name: "Design with Sam",
    handle: "@designwithsam",
    initials: "DS",
    category: "Design",
    text: "Good design is not only about how a product looks. It is about how easily people can use it to achieve their goals.",
    likes: 28,
    replies: 7,
  },
  {
    name: "The Learning Space",
    handle: "@learningspace",
    initials: "LS",
    category: "Education",
    text: "Today's reminder: you don't have to know everything before you start learning something new. Start small and keep going.",
    likes: 35,
    replies: 9,
  },
];

const categories = ["For you", "Technology", "Design", "Education", "Community"];

export default function ExplorePage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("For you");
  const [following, setFollowing] = useState<string[]>([]);

  const filteredTrends = useMemo(() => {
    return trends.filter((trend) => {
      const matchesSearch = `${trend.topic} ${trend.category}`
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory =
        activeCategory === "For you" ||
        activeCategory === "Community" ||
        trend.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  const filteredCreators = useMemo(() => {
    return creators.filter((creator) => {
      const matchesSearch = `${creator.name} ${creator.handle} ${creator.bio}`
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory =
        activeCategory === "For you" ||
        activeCategory === "Community" ||
        creator.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch = `${post.name} ${post.handle} ${post.text} ${post.category}`
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory =
        activeCategory === "For you" ||
        activeCategory === "Community" ||
        post.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

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
              className={`nav-item ${item.href === "/explore" ? "active" : ""}`}
            >
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <p className="sidebar-note">Your world. Your voice. Your Light.</p>
      </aside>

      <section className="feed explore-feed">
        <header className="feed-header">
          <div>
            <p className="eyebrow">FIND YOUR NEXT INTEREST</p>
            <h1>Explore</h1>
            <p className="explore-subtitle">
              Discover conversations, creators, and ideas across Light.
            </p>
          </div>
          <Link className="account-link" href="/">
            Home
          </Link>
        </header>

        <div className="explore-search">
          <Search size={20} aria-hidden="true" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search people, topics, and conversations"
            aria-label="Search people, topics, and conversations"
          />
          {search && (
            <button
              type="button"
              className="explore-clear"
              onClick={() => setSearch("")}
              aria-label="Clear search"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <div className="explore-categories" aria-label="Explore categories">
          {categories.map((category) => (
            <button
              type="button"
              key={category}
              className={activeCategory === category ? "explore-chip active" : "explore-chip"}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <section className="explore-section">
          <div className="explore-section-heading">
            <div className="explore-heading-icon">
              <TrendingUp size={20} />
            </div>
            <div>
              <h2>Trending conversations</h2>
              <p>Topics people are talking about</p>
            </div>
          </div>

          <div className="explore-trends">
            {filteredTrends.map((trend, index) => (
              <button
                type="button"
                className="explore-trend"
                key={trend.topic}
                onClick={() => setSearch(trend.topic)}
              >
                <span className="explore-trend-number">{index + 1}</span>
                <span className="explore-trend-info">
                  <small>{trend.category} · Trending</small>
                  <strong>{trend.topic}</strong>
                  <small>{trend.posts}</small>
                </span>
                <ArrowUpRight size={18} />
              </button>
            ))}
            {filteredTrends.length === 0 && (
              <p className="explore-empty">No trending topics match your search.</p>
            )}
          </div>
        </section>

        <section className="explore-section">
          <div className="explore-section-heading">
            <div className="explore-heading-icon">
              <Users size={20} />
            </div>
            <div>
              <h2>People to discover</h2>
              <p>Meet people with ideas worth sharing</p>
            </div>
          </div>

          <div className="explore-creators">
            {filteredCreators.map((creator) => {
              const isFollowing = following.includes(creator.handle);

              return (
                <article className="explore-creator" key={creator.handle}>
                  <div className="explore-avatar">{creator.initials}</div>
                  <div className="explore-creator-info">
                    <strong>{creator.name}</strong>
                    <span>{creator.handle}</span>
                    <p>{creator.bio}</p>
                  </div>
                  <button
                    type="button"
                    className={isFollowing ? "explore-follow following" : "explore-follow"}
                    onClick={() =>
                      setFollowing((current) =>
                        isFollowing
                          ? current.filter((handle) => handle !== creator.handle)
                          : [...current, creator.handle]
                      )
                    }
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </button>
                </article>
              );
            })}
            {filteredCreators.length === 0 && (
              <p className="explore-empty">No creators match this search.</p>
            )}
          </div>
        </section>

        <section className="explore-section">
          <div className="explore-section-heading">
            <div className="explore-heading-icon">
              <Compass size={20} />
            </div>
            <div>
              <h2>Conversations for you</h2>
              <p>Discover ideas from across the community</p>
            </div>
          </div>

          <div className="explore-posts">
            {filteredPosts.map((post) => (
              <article className="explore-post" key={post.handle}>
                <div className="explore-avatar">{post.initials}</div>
                <div className="explore-post-content">
                  <div className="explore-post-author">
                    <strong>{post.name}</strong>
                    <span>{post.handle}</span>
                    <span className="explore-post-category">{post.category}</span>
                  </div>
                  <p>{post.text}</p>
                  <div className="explore-post-actions">
                    <span><MessageCircle size={16} /> {post.replies} replies</span>
                    <span><Heart size={16} /> {post.likes} likes</span>
                    <Hash size={16} />
                  </div>
                </div>
              </article>
            ))}
            {filteredPosts.length === 0 && (
              <p className="explore-empty">No conversations match your search.</p>
            )}
          </div>
        </section>

        <p className="explore-disclaimer">
          You’re exploring Light. More conversations will appear as the community grows.
        </p>
      </section>

      <aside className="right-sidebar">
        <section className="side-card">
          <h2>Explore Light</h2>
          <p>
            Find your people, follow your interests, and discover conversations
            that matter to you.
          </p>
        </section>

        <section className="side-card">
          <h2>Popular interests</h2>
          {["Technology", "Design", "Education", "Creators"].map((interest) => (
            <button
              type="button"
              className="explore-interest"
              key={interest}
              onClick={() => setActiveCategory(interest === "Creators" ? "For you" : interest)}
            >
              <Hash size={15} />
              {interest}
            </button>
          ))}
        </section>

        <section className="side-card">
          <h2>Why Light?</h2>
          <p>
            Meaningful conversations, stronger communities, and more control
            over your experience.
          </p>
        </section>

        <p className="footer-note">Light Social · Your world, your voice.</p>
      </aside>
    </main>
  );
}
