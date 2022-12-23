FROM node:18-alpine as build

WORKDIR /usr/src/app

COPY . .

RUN npm ci --prefer-offline --legacy-peer-deps
RUN npm run build
RUN npm prune --legacy-peer-deps --production

FROM node:18-alpine

ENV NODE_ENV production
WORKDIR /usr/src/app

COPY --from=build /usr/src/app/dist /usr/src/app/dist
COPY --from=build /usr/src/app/node_modules /usr/src/app/node_modules

expose 3000
CMD [ "node", "dist/main.js" ]
