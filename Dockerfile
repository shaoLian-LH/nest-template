FROM node:18-alpine

ENV NODE_ENV production
WORKDIR /usr/src/app
COPY ./package.json .
COPY ./package-lock.json .
COPY ./build ./build

expose 3000
CMD [ "node", "build/index.js" ]
