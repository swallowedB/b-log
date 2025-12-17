import GiscusComments from "@/app/(layout)/posts/[slug]/_components/post-comments/GiscusComments";

export default function PostComments() {
  return (
    <div className="mt-40" >
      <div className="my-5 border-b border-foreground/30" />
      <GiscusComments />
    </div>
  )
}
