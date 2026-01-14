import { SpaceBackground } from "@/components/common/SpaceBackground";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen w-full overflow-hidden px-6">
      <SpaceBackground />

      <div className="flex flex-col items-center gap-5 h-full mb-10">
        <h1>
          <Image
            src="/error/404.svg"
            alt="404"
            width={300}
            height={150}
            priority
          />
        </h1>

        <Image src="/error/oops.svg" alt="oops" width={220} height={80} />

        <Image
          className="w-10 aspect-auto"
          src="/error/double-arrow-icon.svg"
          alt=""
          width={40}
          height={40}
        />
      </div>

      <p className="text-center font-sans text-white/75 font-medium leading-relaxed max-w-[420px]">
        보아뱀이 잘못된 페이지를 삼켜버렸어요.
      </p>
      <p className="text-center font-sans text-sm text-white/55 font-medium leading-relaxed max-w-[420px]">
        찾으려던 글은 아직 소화되지 않았거나, 존재하지 않는 페이지예요.
      </p>

      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2 text-sm font-medium text-white/90 backdrop-blur-md transition hover:bg-white/15 hover:border-white/40"
      >
        <span>홈으로 돌아가기</span>
      </Link>
    </section>
  );
}
