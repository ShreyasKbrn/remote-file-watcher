FROM node:12
WORKDIR /home/shreyas/mybin/remote-file-watcher
COPY package*.json ./
RUN npm install
COPY . .
CMD ["node", "app.js"]

