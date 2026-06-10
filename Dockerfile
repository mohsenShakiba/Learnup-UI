FROM node:24-alpine as build
WORKDIR /app
RUN corepack enable
COPY package.json package-lock.json ./
RUN npm install --force
COPY . .
RUN npm run build
FROM nginx:latest
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /usr/share/nginx/html
