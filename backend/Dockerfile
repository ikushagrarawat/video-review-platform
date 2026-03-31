FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY src ./src
COPY .env.example ./
COPY uploads ./uploads
RUN mkdir -p processed

EXPOSE 4000

CMD ["npm", "start"]
