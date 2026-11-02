# Use the official Node.js image as the base image
FROM node:23-alpine

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the Next.js application for production
RUN pnpm build

# Expose port 3000 to the outside world
EXPOSE 3000

# Command to run the application
CMD ["pnpm", "start"]
