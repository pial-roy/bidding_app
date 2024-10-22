FROM node:14

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json .
RUN npm install

# Copy the app code
COPY ./ ./

# Expose the port and define the command to run the app
EXPOSE 3000
CMD ["npm", "start"]