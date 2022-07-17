FROM node:14.2.0-alpine3.11 as build
WORKDIR /app

RUN npm install -g @angular/cli@11.1.2

COPY ./package.json .
RUN npm install
COPY . .
RUN ng build --prod

FROM nginx as runtime
COPY --from=build /app/dist/recimage /usr/share/nginx/html