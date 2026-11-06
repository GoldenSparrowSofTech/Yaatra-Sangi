# ==========================================
# YaatraSangi Web App Dockerfile
# Multi-stage production build (Next.js Static Export)
# ==========================================

# Stage 1: Build static assets
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Set build-time API URL
ARG NEXT_PUBLIC_API_URL=/api
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN npm run build

# Stage 2: Serve with lightweight Nginx
FROM nginx:alpine AS runner

COPY --from=builder /app/out /usr/share/nginx/html

# Custom nginx config to support Next.js SPA client-side routing & assets
RUN echo 'server { \
    listen 3000; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri.html $uri/ /index.html =404; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]

