FROM node:22-alpine

WORKDIR /usr/src/app

COPY package*.json ./

COPY . .

RUN cd client && npm i && npm run build:subfolder

RUN cd server && npm i && npm run build

CMD [ "node", "server/dist/server.js" ]
