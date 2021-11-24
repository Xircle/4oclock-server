FROM node:13 AS dev

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app/
COPY package.json /usr/src/app/
RUN npm install
COPY . /usr/src/app
RUN npm run build

FROM node:13 as prod
WORKDIR /usr/src/app/
COPY package.json /usr/src/app/
RUN npm install
COPY . .
COPY --from=dev /usr/src/app/dist /usr/src/app/
ENV NODE_ENV=prod
EXPOSE 3080
CMD ["npm", "run", "start:prod"]
