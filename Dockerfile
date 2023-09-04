FROM ubuntu:jammy

RUN apt update -y

RUN apt install -y libstdc++-9-dev curl

RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash -

RUN apt install -y nodejs

# Copy necessary files
COPY src src
COPY test test
COPY index.ts package-lock.json package.json tsconfig.json ./

# Install npm dependencies
RUN npm install

# Expose the 4000 port
EXPOSE 4000

# Run the cook-door-api
CMD ["npm", "start"]
