FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Create uploads directory
RUN mkdir -p uploads

EXPOSE 5000

# Default environment
ENV PORT=5000
ENV NODE_ENV=development
ENV SPRING_BOOT_URL=http://api-gateway:3000

CMD ["npm", "start"]
