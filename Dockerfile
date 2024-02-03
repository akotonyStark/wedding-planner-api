# specify a parent image
FROM node:16-alpine

# specify working directory
WORKDIR /app

COPY package.json .

RUN npm install

# copy from root to working dir
COPY . .

# this is optional
EXPOSE 3003

CMD ["node", "index.js"]

