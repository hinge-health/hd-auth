FROM node:lts

WORKDIR /usr/src/app

COPY . .

ENV NPM_CONFIG_LOGLEVEL warn
ENV NODE_CONFIG_DIR /usr/src/app/config

RUN npm install 
