
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Search,
  Users,
  Compass,
  Plus,
  Code2,
  Palette,
  BookOpen,
  Gamepad2,
  BriefcaseBusiness,
  Globe,
} from "lucide-react";

const communities = [
  {
    name: "Developers Hub",
    slug: "developers-hub",
    category: "Technology",
    description: "Share projects, solve coding problems, and grow with fellow developers.",
    members: 1240,
    initials: "DH",
  },
  {
    name: "Design Circle",
    slug: "design-circle",
    category: "Design",
    description: "Explore UI/UX, share feedback, and discuss better digital experiences.",
    members: 864,
    initials: "DC",
  },
  {
    name: "Learning Together",
    slug: "learning-together",
    category: "Education",
    description: "A welcoming place to exchange knowledge, resources, and learning goals.",
    members: 532,
    initials: "LT",
  },
  {
    name: "Gaming Lounge",
    slug: "gaming-lounge",
    category: "Gaming",
    description: "Discuss games, share discoveries, and meet other gaming enthusiasts.",
    members: 2180,
    initials: "GL",
  },
  {
    name: "Business Builders",
    slug: "business-builders",
    category: "Business",
    description: "Talk about ideas, entrepreneurship, product building, and business growth.",
    members: 976,
    initials: "BB",
  },
  {
    name: "Global Conversations",
    slug: "global-conversations",
    category: "General",
    description: "Connect with people from different backgrounds and share perspectives.",
    members: 1540,
    initials: "GC",
  },
];

const categories = [
  "All",
  "Technology",
  "Design",
  "Education",
  "Gaming",
  "Business",
  "General",
];

const categoryIcons: Record<string, typeof Code2> = {
  Technology: Code2,
  Design: Palette,
  Education: BookOpen,
  Gaming: Gamepad2,
  Business: BriefcaseBusiness,
  General: Globe,
};

export default function CommunitiesPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [joined, setJoined] = useState<string[]>([]);

  const filteredCommunities = useMemo(() => {
    return communities.filter((community) => {
      const matchesSearch =
        `${community.name} ${community.description} ${community.category}`
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesCategory =
        activeCategory === "All" || community.category === activeCategory;

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
              className={`nav-item ${item.href === "/communities" ? "active" : ""}`}
            >
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <p className="sidebar-note">Your world. Your voice. Your Light.</p>
      </aside>

      <section className="feed communities-feed">
        <header className="feed-header">
          <div>
            <p className="eyebrow">FIND YOUR PEOPLE</p>
            <h1>Communities</h1>
            <p className="community-subtitle">
              Join conversations around the things you care about.
            </p>
          </div>

          <button
            type="button"
            className="community-create-button"
            onClick={() =>
              alert("Community creation will be connected to your Light account next.")
            }
          >
            <Plus size={17} />
            Create
          </button>
        </header>

        <div className="community-search">
          <Search size={19} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Find a community"
            aria-label="Find a community"
          />
        </div>

        <div className="community-categories" aria-label="Community categories">
          {categories.map((category) => (
            <button
              type="button"
              key={category}
              className={
                activeCategory === category
                  ? "community-chip active"
                  : "community-chip"
              }
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="community-results-heading">
          <div>
            <h2>Discover communities</h2>
            <p>{filteredCommunities.length} communities to explore</p>
          </div>
          <Compass size={21} />
        </div>

        <div className="community-grid">
          {filteredCommunities.map((community) => {
            const Icon = categoryIcons[community.category] ?? Globe;
            const isJoined = joined.includes(community.slug);

            return (
              <article className="community-card" key={community.slug}>
                <div className="community-card-banner">
                  <div className="community-category-icon">
                    <Icon size={24} />
                  </div>
                  <span>{community.category}</span>
                </div>

                <div className="community-card-body">
                  <div className="community-card-title">
                    <div className="community-avatar">{community.initials}</div>
                    <div>
                      <h3>{community.name}</h3>
                      <p>{community.members.toLocaleString()} members</p>
                    </div>
                  </div>

                  <p className="community-description">
                    {community.description}
                  </p>

                  <div className="community-card-footer">
                    <span>
                      <Users size={15} />
                      {(
                        community.members + (isJoined ? 1 : 0)
                      ).toLocaleString()}
                    </span>

                    <button
                      type="button"
                      className={
                        isJoined
                          ? "community-join joined"
                          : "community-join"
                      }
                      onClick={() =>
                        setJoined((current) =>
                          isJoined
                            ? current.filter(
                                (slug) => slug !== community.slug
                              )
                            : [...current, community.slug]
                        )
                      }
                    >
                      {isJoined ? "Joined" : "Join"}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {filteredCommunities.length === 0 && (
          <div className="community-empty">
            <Users size={30} />
            <h3>No communities found</h3>
            <p>Try a different search or select another category.</p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setActiveCategory("All");
              }}
            >
              Clear filters
            </button>
          </div>
        )}
      </section>

      <aside className="right-sidebar">
        <section className="side-card">
          <h2>About communities</h2>
          <p>
            Find your people, exchange ideas, and build stronger connections
            around shared interests.
          </p>
        </section>

        <section className="side-card">
          <h2>Community guidelines</h2>
          <p>Be respectful, contribute meaningfully, and help everyone feel welcome.</p>
        </section>

        <section className="side-card">
          <h2>Your communities</h2>
          <p>
            {joined.length === 0
              ? "You haven't joined any communities yet."
              : `You've joined ${joined.length} ${joined.length === 1 ? "community" : "communities"}.`}
          </p>
        </section>

        <p className="footer-note">Light Social · Your world, your voice.</p>
      </aside>
    </main>
  );
}
