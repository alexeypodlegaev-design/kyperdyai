FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package.json package-lock.json* ./
RUN npm install

COPY tsconfig.json ./
COPY src ./src

COPY package.json package-lock.json* ./
RUN npm install

COPY prisma ./prisma
COPY tsconfig.json ./
COPY src ./src

RUN npx prisma generate
RUN npm run build

ENV NODE_ENV=production

EXPOSE 8080

CMD ["node", "dist/index.js"]
CMD ["sh", "-c", "npx prisma db push && node dist/index.js"]
