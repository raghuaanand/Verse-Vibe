FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npx prisma migrate dev --name init_schema
RUN npx prisma generate --no-engine
COPY . .
EXPOSE 8787
CMD ["npm", "run", "dev"]


