import { auth } from "@/auth";
import BlogSection from "./blogSection";

export default Profile;

async function Profile({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth();
  const authorId = (await params).id;

  return (
    <>
      <section className="hero is-dark mt-5">
        <div className="hero-body">
          <p className="title">{session?.user?.username}</p>
        </div>
      </section>
      <BlogSection authorId={authorId} />
    </>
  );

}
