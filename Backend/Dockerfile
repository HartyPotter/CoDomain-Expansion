# Stage 1: Build
FROM node:20-alpine as build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies (including dev dependencies)
RUN npm install

# Copy the entire project to the working directory
COPY . .

# Generate Prisma migrations
RUN npx prisma generate

# Build the NestJS project
RUN npm run build

# Stage 2: Production
FROM node:20-alpine as production

# Set the working directory
WORKDIR /app

# Copy only the production dependencies from the build stage
COPY --from=build /app/package*.json ./

# Install dependencies
RUN npm install --only=prod

# Copy the built application from the build stage
COPY --from=build /app/dist ./dist

# Copy the Prisma schema and other necessary files
COPY --from=build /app/prisma ./prisma

# Expose the port the app runs on
EXPOSE 3001

# Start the application
CMD ["npm", "run", "start:prod"]
