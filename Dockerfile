# Use the official Node.js image as the base image
FROM node:22.15.0-alpine

# Install pnpm globally
RUN npm install -g pnpm@latest-10

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies
RUN pnpm install --dangerously-allow-all-builds

# Copy the rest of the application files
COPY . .

# Build the NestJS application
RUN pnpm run build


COPY entrypoint.sh ./entrypoint.sh
RUN apk add --no-cache dos2unix \
 && dos2unix ./entrypoint.sh \
 && chmod +x ./entrypoint.sh

# Expose the application port
EXPOSE 1406 1407

ENTRYPOINT ["sh", "./entrypoint.sh"]