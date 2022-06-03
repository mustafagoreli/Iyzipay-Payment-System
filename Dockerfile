FROM node:17-stretch-slim
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package*.json ./
RUN npm install
USER node
COPY --chown=node:node . .
EXPOSE 8080:80
CMD [ "node", "./build/index.js" ]