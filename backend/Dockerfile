FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx tsx src/db/seed.ts

EXPOSE 8080

CMD ["sh", "-c", "npm run db:migrate && npx tsx src/db/seed.ts && npm run dev"]