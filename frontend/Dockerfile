FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

# --host flag makes Vite accessible outside the container
CMD ["npm", "run", "dev", "--", "--host"]