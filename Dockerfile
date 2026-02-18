# ---- Build stage ----
FROM node:20-alpine AS build
WORKDIR /app

# Enable pnpm via corepack
RUN corepack enable

# Copy only manifest first for better layer caching
COPY package.json ./
# If you use pnpm lockfile, copy it too:
# COPY pnpm-lock.yaml ./

# Install deps (use --frozen-lockfile if you have pnpm-lock.yaml)
RUN pnpm install

# Copy the rest and build
COPY . .
RUN pnpm run build

# ---- Runtime stage ----
FROM nginx:1.27-alpine AS runtime
WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

# Copy build output
COPY --from=build /app/dist ./

# SPA fallback (Vite React)
# This makes refresh on routes work (if you add routing later).
RUN printf '%s\n' \
'server {' \
'  listen 80;' \
'  server_name _;' \
'  root /usr/share/nginx/html;' \
'  index index.html;' \
'  location / {' \
'    try_files $uri $uri/ /index.html;' \
'  }' \
'}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

