# Stage 1
FROM node:14 as build-step
RUN mkdir -p /app/src
WORKDIR /app/src

COPY package.json /app/src
RUN npm install
COPY . /app/src
RUN npm run build

FROM node:14
RUN mkdir -p /app/edumeserver
WORKDIR /app/edumeserver
COPY --from=build-step /app/src/build /app/edumeserver
COPY package*.json /app/edumeserver
RUN npm install && npm i -g nodemon 

CMD [ "npm", "run", "run-build" ]
EXPOSE 3300
