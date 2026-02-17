# Build stage (Debian-based: @swc/core native binary needs glibc; Alpine can cause SIGBUS)
FROM node:20-slim AS builder

WORKDIR /app

# Copy package files (--legacy-peer-deps: react-katex supports React ≤18, project uses React 19)
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# Copy source and build (VITE_API_URL is set at build time for API endpoint)
ARG VITE_API_URL=http://localhost:3001
ENV VITE_API_URL=$VITE_API_URL

COPY . .
# Use tsc + vite build directly (package.json build uses require() which fails under ESM)
RUN npx tsc -b && npx vite build && cp public/research-informationsheet-exemptresearchstudy.pdf dist/ 2>/dev/null || true

# Production stage - serve with nginx
FROM nginx:alpine

# Serve app at /division_counting/ to match Vite base path
COPY --from=builder /app/dist /usr/share/nginx/html/division_counting

# Nginx config: SPA routing + optional proxy to API (if same host)
RUN echo 'server { \
  listen 80; \
  root /usr/share/nginx/html; \
  index index.html; \
  location /division_counting/ { \
    alias /usr/share/nginx/html/division_counting/; \
    try_files $uri $uri/ /division_counting/index.html; \
  } \
  location / { \
    return 301 /division_counting/; \
  } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
