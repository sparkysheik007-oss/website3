# Taste the Moment — 3D Beverage Campaign

A production-style React + Vite + Three.js/R3F + GSAP + Express/MongoDB campaign starter. The visual product is procedural, so the project works immediately without a GLB file.

> This is a fictional campaign concept inspired by premium beverage advertising. It is not affiliated with or endorsed by The Coca-Cola Company.

## 1. Requirements

- Node.js 20+
- npm
- MongoDB is optional for demo mode

## 2. Install

```bash
npm install
```

Copy `.env.example` to `.env`.

For instant demo mode:

```env
DEMO_MODE=true
MONGODB_URI=
PORT=5000
CLIENT_URL=http://localhost:5173
JWT_SECRET=use-a-long-random-value
```

## 3. Run

```bash
npm run dev
```

Open `http://localhost:5173`.

The command runs Vite and Express together.

## 4. Production-style MongoDB mode

Set:

```env
DEMO_MODE=false
MONGODB_URI=mongodb://127.0.0.1:27017/taste_the_moment
CLIENT_URL=http://localhost:5173
JWT_SECRET=your-long-random-secret
```

Then run:

```bash
npm run dev
```

The public product, campaign, newsletter and contact routes are implemented. If MongoDB is unavailable, public read/form routes fall back safely to demo behavior.

## 5. API

- `GET /api/health`
- `GET /api/products`
- `GET /api/products/:id`
- `GET /api/campaigns`
- `GET /api/analytics`
- `POST /api/newsletter`
- `POST /api/contact`

Example newsletter body:

```json
{"name":"Alex","email":"alex@example.com"}
```

Example contact body:

```json
{"name":"Alex","email":"alex@example.com","subject":"Campaign","message":"Hello!"}
```

## 6. Architecture

```text
src/
  App.jsx
  main.jsx
  styles.css
  data/products.js

server/
  server.js
  data/demo.js
  models/
  routes/
  middleware/

public/
```

## 7. 3D

The hero/product viewer uses a procedural can assembled from Three.js primitives with PBR materials, dynamic lighting, bubbles and condensation. To use a real GLB later, add a model under `public/models/` and replace `ProductMesh` with a `useGLTF()` component from `@react-three/drei`.

## 8. Admin architecture

The API is intentionally authentication-ready, but this starter does not ship with fake production credentials. Add JWT/session authentication and role middleware before exposing CRUD admin routes. The UI can be mounted at `/admin` once those protected routes are connected.

## 9. Performance

- R3F canvas uses high-performance GPU preference.
- Bubbles use one BufferGeometry/Points system rather than hundreds of DOM nodes.
- Reduced-motion CSS is included.
- Responsive breakpoints reduce particle counts on smaller screens.
- Vite provides production code splitting/minification.

## 10. Production hardening checklist

Before deployment, add:
- HTTPS and secure headers
- CSRF protection if cookie auth is introduced
- Strong authentication + RBAC for admin
- Persistent analytics provider
- CDN/compressed GLB assets
- image optimization
- server-side request logging/monitoring
- stricter per-route rate limits
- MongoDB indexes and backups
- secret management through your deployment platform
