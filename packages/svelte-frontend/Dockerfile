FROM node:13

RUN echo "Building DEV env for svelte."

# Setting working directory. All the path will be relative to WORKDIR
WORKDIR /usr/src/app

# Copy over required files
COPY ./ ./

# Install packages
RUN ls
RUN npm i

# Dev mode
CMD [ "npm", "run", "dev" ]
