## L2A2 – Product Store

A clean and simple product listing application built with Next.js and deployed on Vercel.

🔗 Live Demo: https://l2-a2-phi.vercel.app

📦 GitHub Repo: https://github.com/jisan-05/L2A2

🌟 Features

🛍️ Fetches products dynamically

🎨 Clean, minimal, modern UI

⚡ Deployed on Vercel

⚙️ Organized components and clean code structure

🧱 Tech Stack
```
Node.js + TypeScript
Express.js (web framework)
PostgreSQL (database)
bcrypt (password hashing)
jsonwebtoken (JWT authentication)
```

📁 Project Structure
```
L2A2/
 src/
 ├── config/
 ├── middleware/
 │    └── auth.ts
 ├── modules/
 │    ├── Auth/
 │    │    ├── auth.controller.ts
 │    │    ├── auth.routes.ts
 │    │    └── auth.service.ts
 │    ├── Bookings/
 │    │    ├── bookings.controller.ts
 │    │    ├── bookings.routes.ts
 │    │    └── bookings.service.ts
 │    ├── users/
 │    └── Vehicles/
 ├── types/
 ├── app.ts
 └── server.ts

.env
.env.local
.gitignore
package.json
package-lock.json
Readme.md
tsconfig.json
vercel.json

```

🧪 How to Run Locally
git clone https://github.com/jisan-05/L2A2
cd L2A2
npm install
npm run dev


App runs on:

http://localhost:3000

🔗 API / Data Source

The app fetches real-time product data from a public API (depending on your setup).
You can update the API endpoint in the fetch function inside page.js.


📡 Deployment

This project is deployed on Vercel.

vercel deploy


Your live version:
👉 https://l2-a2-phi.vercel.app