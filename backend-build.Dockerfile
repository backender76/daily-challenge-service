# Образ контейнера для сборки релизной версии
FROM node:20.11.0-alpine

WORKDIR /app

RUN npm i concurrently@9.1.2 nodemon@3.1.10 typescript@5.8.3

COPY ./package*.json backend/
RUN npm ci --prefix backend

ENV PATH="/app/node_modules/.bin/:$PATH"
