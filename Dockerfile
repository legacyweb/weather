FROM node:alpine
MAINTAINER Justin Schwartzbeck <justinmschw@gmail.com>

WORKDIR /app

COPY . /app

RUN npm install

EXPOSE 3000

USER node

ENTRYPOINT ["node", "app.js"]
