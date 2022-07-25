FROM node:14-alpine AS builder
ENV NODE_ENV production

WORKDIR /app
COPY ./web .

# update npm
RUN npm i -g npm@8
RUN npm ci --include=dev
RUN npm run build

# nginx
FROM nginx:alpine

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

