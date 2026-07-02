# Reid Liao's Personal Blog (reidliao.dev)

Welcome to the source code repository for my personal blog, running live at [reidliao.dev](https://reidliao.dev).

## 💡 Acknowledgements

This project is a customized fork of the excellent open-source blog project **[cali.so](https://github.com/CaliCastle/cali.so)**. A huge thanks to the original author for providing such an amazing foundation, modern design, and robust Next.js architecture.

## 🛠️ Deployment Adjustments

While the original `cali.so` repository is highly optimized for PaaS platforms like Vercel, this fork has been specifically adapted and refactored for **Self-hosted VPS environments** (specifically low-RAM instances like a 2GB DMIT server). 

To completely resolve Out-Of-Memory (OOM) crashes during server-side building and to bypass `pnpm v9` strict lifecycle script restrictions, the deployment workflow has been shifted to a **Build-Run Separation (构建与运行隔离)** model:

*   **Local High-Performance Build:** Compiling the Next.js application and generating Prisma engines is executed locally on a Mac using Docker Buildx (`linux/amd64` cross-compilation). 
*   **Offline Image Transfer:** The built image is exported as a `.tar` package and transferred to the VPS via SFTP.
*   **Zero-Overhead Run:** The server solely focuses on running the pre-built image managed by **Dockge** and reverse-proxied by **Nginx Proxy Manager**, reducing server CPU/RAM build overhead to 0.
*   **Cleaned Dependencies:** Removed all Vercel and GitHub Actions-specific configurations (`vercel.json`, `.github/workflows`) for a 100% pure self-hosted environment.

## 💻 Tech Stack

*   **Framework:** Next.js (App Router) + Tailwind CSS
*   **Database:** Prisma ORM + Neon (Serverless PostgreSQL)
*   **CMS:** Sanity
*   **Services:** Clerk (Auth), Resend (Email), Upstash (Redis)
*   **Infrastructure:** Docker, Dockge, Nginx Proxy Manager

## 📄 License

This project follows the original license of the upstream `cali.so` repository.