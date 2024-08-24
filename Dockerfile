FROM node:18.19-alpine

WORKDIR /app

COPY . /app

RUN npm install

EXPOSE 3000

USER node

ENTRYPOINT ["node", "app.js"]
