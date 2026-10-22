import Link from "next/link";

type SectionPageProps = {
  title: string;
  description: string;
};

export default function SectionPage({
  title,
  description,
}: SectionPageProps) {
  return (
    <main className="light-app">
      <section className="feed">
        <header className="feed-header">
          <div>
            <p className="eyebrow">LIGHT SOCIAL</p>
            <h1>{title}</h1>
          </div>
          <Link className="account-link" href="/">
            Home
          </Link>
        </header>
        <article className="post-card">
          <h2>{title}</h2>
          <p>{description}</p>
          <p>
            This section is being built. Your Light account and
            social features will be connected as we develop it.
          </p>
        </article>
      </section>
    </main>
  );
}
