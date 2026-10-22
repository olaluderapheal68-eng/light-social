
import Link from "next/link";

const demoPosts = [
  {
    name: "Light Community",
    handle: "@lightcommunity",
    time: "2h",
    text: "Welcome to Light — a place to share ideas, discover communities, and have meaningful conversations. ✨",
    likes: 24,
    comments: 8,
  },
  {
    name: "Tech Explorer",
    handle: "@techexplorer",
    time: "4h",
    text: "Every great product starts with a problem worth solving. What are you building today?",
    likes: 16,
    comments: 5,
  },
];

const navigation = [
  { label: "Home", href: "/", icon: "⌂" },
  { label: "Explore", href: "/explore", icon: "⌕" },
  { label: "Notifications", href: "/notifications", icon: "♧" },
  { label: "Messages", href: "/messages", icon: "✉" },
  { label: "Communities", href: "/communities", icon: "◎" },
  { label: "Profile", href: "/profile", icon: "♙" },
];

export default function Home() {
  return (
    <main className="light-app">
      <aside className="sidebar">
        <Link href="/" className="brand">
          <span className="brand-icon">L</span>
          <span>Light</span>
        </Link>

        <nav className="nav-links" aria-label="Main navigation">
          {navigation.map((item) => (
            <Link
              key={item.href}
              className={`nav-item ${item.href === "/" ? "active" : ""}`}
              href={item.href}
            >
              <span aria-hidden="true">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <p className="sidebar-note">
          Your world. Your voice. Your Light.
        </p>
      </aside>

      <section className="feed">
        <header className="feed-header">
          <div>
            <p className="eyebrow">YOUR WORLD, CONNECTED</p>
            <h1>Home</h1>
          </div>

          <Link className="account-link" href="/auth/sign-in">
            Sign in
          </Link>
        </header>

        <div className="feed-tabs">
          <button className="selected" type="button">
            For You
          </button>
          <button type="button">
            Following
          </button>
        </div>

        <section className="composer">
          <div className="avatar">L</div>

          <div className="composer-content">
            <textarea
              aria-label="Write a post"
              placeholder="What's happening in your world?"
            />

            <div className="composer-footer">
              <span>Share an idea with the community</span>
              <button type="button" className="post-button">
                Post
              </button>
            </div>
          </div>
        </section>

        <div className="posts">
          {demoPosts.map((post) => (
            <article className="post post-card" key={post.handle}>
              <div className="avatar">
                {post.name.charAt(0)}
              </div>

              <div className="post-content">
                <div className="post-author">
                  <strong>{post.name}</strong>
                  <span>
                    {post.handle} · {post.time}
                  </span>
                </div>

                <p className="post-text">{post.text}</p>

                <div className="post-actions">
                  <button type="button" aria-label="Reply">
                    ♡ <span>{post.comments} replies</span>
                  </button>
                  <button type="button" aria-label="Like">
                    ♡ <span>{post.likes} likes</span>
                  </button>
                  <button type="button" aria-label="Share">
                    ↗ <span>Share</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <aside className="right-sidebar">
        <Link href="/explore" className="search-box">
          ⌕ <span>Search Light</span>
        </Link>

        <section className="side-card">
          <h2>Trending conversations</h2>

          <div className="trend">
            <span>Technology · Trending</span>
            <strong>Building the future</strong>
            <small>1,240 posts</small>
          </div>

          <div className="trend">
            <span>Creators · Popular</span>
            <strong>Share what you create</strong>
            <small>864 posts</small>
          </div>

          <div className="trend">
            <span>Community · Growing</span>
            <strong>Ideas that matter</strong>
            <small>532 posts</small>
          </div>
        </section>

        <section className="side-card">
          <h2>Why Light?</h2>
          <p>
            More meaningful conversations, stronger communities,
            and more control over your experience.
          </p>
        </section>

        <p className="footer-note">
          Light Social · Your world, your voice.
        </p>
      </aside>
    </main>
  );
}
