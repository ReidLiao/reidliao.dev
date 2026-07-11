export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { warmCriticalImages } = await import('./lib/warm-images')
    // Fire-and-forget: don't block boot on Sanity.
    void warmCriticalImages()
  }
}
