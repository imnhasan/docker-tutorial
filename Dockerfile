FROM node:20.15.0-alpine3.20

RUN addgroup app && adduser -S -G app app

WORKDIR /app

RUN chown -R app:app /app

USER app

COPY . .

RUN npm install

ENV API_URL=http://api.myapp.dev

EXPOSE 3000

CMD [ "npm", "start" ]
