import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="hero is-info">
      <div className="hero-body">
        <p className="title is-1">404 - Page not found</p>
        <p className="subtitle is-3">Could not find requested resource</p>
        <p className="subtitle is-3 has-text-white">
          <Link href="/">Return Home</Link>
        </p>
      </div>
    </section>
  );
}