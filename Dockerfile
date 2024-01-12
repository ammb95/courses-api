FROM node:16-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

COPY --from=ghcr.io/ufoscout/docker-compose-wait:latest /wait /wait
RUN chmod +x /wait

CMD /wait && npm run start
