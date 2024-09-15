import Link from "next/link";

export default function Page() {
  return (
    <div>
      这是一个langdingpage
      <div>
        <Link href="/auth/signin">登录系统</Link>
      </div>
      !
    </div>
  );
}
