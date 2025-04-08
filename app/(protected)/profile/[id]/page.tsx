
// "use client"

import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { useBlogService, IBlog } from "_services";
import { Spinner } from "_components";
// import { useSession } from "next-auth/react";
import BlogSection from "./blogSection";

export default Profile;

async function Profile({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  // const { data: session } = useSession();
  const authorId = (await params).id;



  return (
    <>
      <section className="hero is-dark mt-5">
        <div className="hero-body">
          {/* <p className="title">{session?.user?.username}</p> */}
        </div>
      </section>
      <BlogSection authorId={authorId} />
    </>
  );

}
