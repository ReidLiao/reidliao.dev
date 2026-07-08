import Link from 'next/link'

export default function NotFoundPage() {
  return (
    <main className="flex h-screen flex-col items-center justify-center bg-zinc-50 px-6 text-center dark:bg-zinc-900">
      <p className="text-8xl font-bold tracking-tighter text-zinc-300 dark:text-zinc-700">
        404
      </p>
      <h1 className="mt-4 text-2xl font-semibold text-zinc-800 dark:text-zinc-100">
        页面不存在
      </h1>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
        你访问的页面可能已被移除，或地址输入有误。
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        返回主页
      </Link>
    </main>
  )
}
