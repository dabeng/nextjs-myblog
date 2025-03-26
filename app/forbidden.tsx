import Link from 'next/link';

export default function Forbidden() {
  return (
    <section className="hero is-info">
      <div className="hero-body">
        <div className="">
          <p className="title is-1">Forbidden</p>
          <p className="subtitle is-3">You are not authorized to access this resource.</p>
          <Link className="subtitle is-3 has-text-white" href="/">Return Home</Link>
        </div>
      </div>
    </section>
  )
}