
"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type MediaType = "image" | "video" | "file";

type BackendPost = {
  id: string;
  user_id: string;
  content: string;
  image_url: string | null;
  created_at: string;
};

type FeedPost = {
  id: string;
  user_id: string;
  name: string;
  handle: string;
  time: string;
  text: string;
  image_url: string | null;
  mediaUrl: string | null;
  mediaType: MediaType | null;
  likes: number;
  comments: number;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://light-social-backend.onrender.com";

const demoPosts: FeedPost[] = [
  {
    id: "demo-light-community",
    user_id: "",
    name: "Light Community",
    handle: "@lightcommunity",
    time: "2h",
    text: "Welcome to Light — a place to share ideas, discover communities, and have meaningful conversations. ?",
    image_url: null,
    mediaUrl: null,
    mediaType: null,
    likes: 24,
    comments: 8,
  },
  {
    id: "demo-tech-explorer",
    user_id: "",
    name: "Tech Explorer",
    handle: "@techexplorer",
    time: "4h",
    text: "Every great product starts with a problem worth solving. What are you building today?",
    image_url: null,
    mediaUrl: null,
    mediaType: null,
    likes: 16,
    comments: 5,
  },
];

const navigation = [
  { label: "Home", href: "/", icon: "¦" },
  { label: "Explore", href: "/explore", icon: "?" },
  { label: "Notifications", href: "/notifications", icon: "?" },
  { label: "Messages", href: "/messages", icon: "?" },
  { label: "Communities", href: "/communities", icon: "?" },
  { label: "Profile", href: "/profile", icon: "?" },
];

function getMediaType(value: string): MediaType {
  const path = value.split("?")[0].toLowerCase();

  if (/\.(mp4|webm|mov|m4v|ogv)$/.test(path)) {
    return "video";
  }

  if (/\.(pdf)$/.test(path)) {
    return "file";
  }

  return "image";
}

function formatPostTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleString();
}

export default function Home() {
  const [postText, setPostText] = useState("");
  const [backendPosts, setBackendPosts] = useState<FeedPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState("");
  const [posting, setPosting] = useState(false);
  const [currentName, setCurrentName] = useState("Light");
  const [currentAvatar, setCurrentAvatar] = useState("");

  useEffect(() => {
    if (!selectedFile) {
      setMediaPreview("");
      return;
    }

    const previewUrl = URL.createObjectURL(selectedFile);
    setMediaPreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [selectedFile]);

  useEffect(() => {
    async function loadCurrentUser() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const { data } = await supabase
          .from("profiles")
          .select("first_name, last_name, display_name, avatar_url")
          .eq("id", user.id)
          .maybeSingle();

        const name =
          [data?.first_name, data?.last_name]
            .filter(Boolean)
            .join(" ") ||
          data?.display_name ||
          user.user_metadata?.display_name ||
          "Light User";

        setCurrentName(name);
        setCurrentAvatar(data?.avatar_url || "");
      } catch (error) {
        console.error("Loading account details failed:", error);
      }
    }

    void loadCurrentUser();
  }, []);

  async function refreshPosts() {
    try {
      const response = await fetch(`${API_URL}/api/posts`);

      if (!response.ok) {
        throw new Error("Could not load posts");
      }

      const result = await response.json();
      const postList: BackendPost[] = result.data ?? result.posts ?? [];
      const supabase = createClient();

      const mappedPosts = await Promise.all(
        postList.map(async (post) => {
          let mediaUrl: string | null = null;
          let mediaType: MediaType | null = null;

          if (post.image_url) {
            mediaType = getMediaType(post.image_url);

            if (/^https?:\/\//i.test(post.image_url)) {
              mediaUrl = post.image_url;
            } else {
              const { data, error } = await supabase.storage
                .from("light-media")
                .createSignedUrl(post.image_url, 3600);

              if (error) {
                console.error("Could not open post attachment:", error);
              } else {
                mediaUrl = data.signedUrl;
              }
            }
          }

          return {
            id: post.id,
            user_id: post.user_id,
            name: "Light Member",
            handle: `@${post.user_id.slice(0, 8)}`,
            time: formatPostTime(post.created_at),
            text: post.content,
            image_url: post.image_url,
            mediaUrl,
            mediaType,
            likes: 0,
            comments: 0,
          };
        })
      );

      setBackendPosts(mappedPosts);
    } catch (error) {
      console.error("Loading posts failed:", error);
    } finally {
      setLoadingPosts(false);
    }
  }

  useEffect(() => {
    void refreshPosts();
  }, []);

  function handleFileSelect(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowed =
      file.type.startsWith("image/") ||
      ["video/mp4", "video/webm"].includes(file.type) ||
      file.type === "application/pdf";

    if (!allowed) {
      alert("Choose an image, an MP4/WebM video, or a PDF document.");
      event.target.value = "";
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      alert("Your file must be 50 MB or smaller.");
      event.target.value = "";
      return;
    }

    setSelectedFile(file);
  }

  async function handlePost() {
    const text = postText.trim();

    if (!text && !selectedFile) {
      alert("Write something or attach a file before posting.");
      return;
    }

    setPosting(true);

    let uploadedPath: string | null = null;

    try {
      const supabase = createClient();
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) throw sessionError;

      if (!session) {
        alert("Please sign in before publishing a post.");
        return;
      }

      if (selectedFile) {
        const safeName = selectedFile.name.replace(
          /[^a-zA-Z0-9._-]/g,
          "_"
        );

        uploadedPath =
          `${session.user.id}/${crypto.randomUUID()}-${safeName}`;

        const { error: uploadError } = await supabase.storage
          .from("light-media")
          .upload(uploadedPath, selectedFile, {
            contentType: selectedFile.type,
            upsert: false,
          });

        if (uploadError) throw uploadError;
      }

      const response = await fetch(`${API_URL}/api/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          content: text || "Shared an attachment.",
          image_url: uploadedPath,
        }),
      });

      if (!response.ok) {
        const message = await response.text();

        // Avoid leaving an unreferenced upload if publishing fails.
        if (uploadedPath) {
          const { error: cleanupError } = await supabase.storage
            .from("light-media")
            .remove([uploadedPath]);

          if (cleanupError) {
            console.error("Could not clean up failed upload:", cleanupError);
          }
        }

        throw new Error(message || "Your post could not be published.");
      }

      setPostText("");
      setSelectedFile(null);

      const fileInput = document.getElementById(
        "light-media-input"
      ) as HTMLInputElement | null;

      if (fileInput) fileInput.value = "";

      await refreshPosts();
      alert("Your post was published successfully!");
    } catch (error) {
      console.error("Publishing post failed:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong while publishing."
      );
    } finally {
      setPosting(false);
    }
  }

  const posts = [...backendPosts, ...demoPosts];

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

        <Link href="#composer" className="sidebar-post-button">
          Post
        </Link>
        <p className="sidebar-note">Your world. Your voice. Your Light.</p>
      </aside>

      <section className="feed">
        <header className="feed-header">
          <div>
            <p className="eyebrow">YOUR WORLD, CONNECTED</p>
            <h1>Home</h1>
          </div>

          <Link className="account-link" href="/auth/login">
            Sign in
          </Link>
        </header>

        <div className="feed-tabs">
          <button className="selected" type="button">
            For You
          </button>
          <button type="button">Following</button>
        </div>

        <section id="composer" className="composer">
          <div className="avatar">
            {currentAvatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={currentAvatar}
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            ) : (
              currentName.charAt(0).toUpperCase()
            )}
          </div>

          <div className="composer-content">
            <textarea
              aria-label="Write a post"
              placeholder="What's happening in your world?"
              value={postText}
              onChange={(event) => setPostText(event.target.value)}
            />

            <input
              id="light-media-input"
              type="file"
              accept="image/*,video/mp4,video/webm,application/pdf"
              hidden
              onChange={handleFileSelect}
            />

            {selectedFile && mediaPreview && (
              <div style={{ marginTop: 12 }}>
                {selectedFile.type.startsWith("image/") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={mediaPreview}
                    alt="Selected attachment preview"
                    style={{
                      width: "100%",
                      maxHeight: 320,
                      objectFit: "contain",
                      borderRadius: 12,
                    }}
                  />
                ) : selectedFile.type.startsWith("video/") ? (
                  <video
                    src={mediaPreview}
                    controls
                    style={{
                      width: "100%",
                      maxHeight: 320,
                      borderRadius: 12,
                    }}
                  />
                ) : (
                  <p>?? {selectedFile.name}</p>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);

                    const input = document.getElementById(
                      "light-media-input"
                    ) as HTMLInputElement | null;

                    if (input) input.value = "";
                  }}
                >
                  Remove attachment
                </button>
              </div>
            )}

            <div className="composer-toolbar" aria-label="Post options">
              <button
                type="button"
                aria-label="Attach image, video, or PDF"
                title="Attach image, video, or PDF"
                onClick={() =>
                  document.getElementById("light-media-input")?.click()
                }
              >
                <span aria-hidden="true">?</span>
              </button>

              <button
                type="button"
                aria-label="Add GIF"
                title="GIF upload is not yet supported"
                onClick={() =>
                  alert("GIF search and upload will be added separately.")
                }
              >
                <span aria-hidden="true">GIF</span>
              </button>

              <button
                type="button"
                aria-label="Add poll"
                title="Polls are not yet supported"
                onClick={() =>
                  alert("Poll creation will be added in a future update.")
                }
              >
                <span aria-hidden="true">?</span>
              </button>

              <button
                type="button"
                aria-label="Add emoji"
                title="Add emoji"
                onClick={() => setPostText((current) => current + " ??")}
              >
                <span aria-hidden="true">?</span>
              </button>
            </div>

            <div className="composer-footer">
              <span>Share an idea with the community</span>

              <button
                type="button"
                className="post-button"
                onClick={handlePost}
                disabled={posting}
              >
                {posting ? "Publishing…" : "Post"}
              </button>
            </div>
          </div>
        </section>

        <div className="posts">
          {loadingPosts && <p>Loading posts...</p>}

          {!loadingPosts && posts.length === demoPosts.length && (
            <p>No published posts loaded yet. Demo posts are shown below.</p>
          )}

          {posts.map((post) => (
            <article className="post post-card" key={post.id}>
              <div className="avatar">{post.name.charAt(0)}</div>

              <div className="post-content">
                <div className="post-author">
                  <strong>{post.name}</strong>
                  <span>
                    {post.handle} · {post.time}
                  </span>
                </div>

                {post.text && <p className="post-text">{post.text}</p>}

                {post.mediaUrl && post.mediaType === "image" && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.mediaUrl}
                    alt="Post attachment"
                    style={{
                      width: "100%",
                      maxHeight: 440,
                      objectFit: "contain",
                      borderRadius: 12,
                      marginTop: 12,
                    }}
                  />
                )}

                {post.mediaUrl && post.mediaType === "video" && (
                  <video
                    src={post.mediaUrl}
                    controls
                    preload="metadata"
                    style={{
                      width: "100%",
                      maxHeight: 440,
                      borderRadius: 12,
                      marginTop: 12,
                    }}
                  />
                )}

                {post.mediaUrl && post.mediaType === "file" && (
                  <a
                    href={post.mediaUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="post-file-link"
                  >
                    ?? Open attached PDF
                  </a>
                )}

                {post.image_url && !post.mediaUrl && (
                  <p role="status">
                    Attachment unavailable. It may have expired or access
                    may be restricted.
                  </p>
                )}

                <div className="post-actions">
                  <button type="button" aria-label="Reply">
                    ? <span>{post.comments} replies</span>
                  </button>
                  <button type="button" aria-label="Like">
                    ? <span>{post.likes} likes</span>
                  </button>
                  <button
                    type="button"
                    aria-label="Share"
                    onClick={() => {
                      if (navigator.share) {
                        void navigator.share({
                          title: "Light post",
                          text: post.text,
                          url: window.location.href,
                        }).catch(() => {});
                      } else {
                        void navigator.clipboard.writeText(
                          `${post.text}\n${window.location.href}`
                        );
                        alert("Post text and page link copied.");
                      }
                    }}
                  >
                    ? <span>Share</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <aside className="right-sidebar">
        <Link href="/explore" className="search-box">
          ? <span>Search Light</span>
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

        <p className="footer-note">Light Social · Your world, your voice.</p>
      </aside>
    </main>
  );
}
