FROM node:22-alpine

WORKDIR /usr/src/app

COPY package*.json ./

COPY . .

# Build client with VITE_STATIC=1 so it uses window.location.origin (served by backend)
RUN cd client && npm i && VITE_STATIC=1 npm run build

# Copy built client files to server's static folder
RUN mkdir -p server/static && cp -r client/dist/* server/static/

RUN cd server && npm i && npm run build

CMD [ "node", "server/dist/server.js" ]
