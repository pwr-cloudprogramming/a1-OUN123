FROM node:14-alpine
WORKDIR /usr/src/app
COPY src/package*.json ./
RUN npm install
COPY src .
ENV HOST=0.0.0.0 PORT=3000
EXPOSE 3000
CMD [ "node", "server.js" ]
