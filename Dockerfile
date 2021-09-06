FROM node:16-alpine3.11

# create destination directory
RUN mkdir production
WORKDIR production

# update and install dependency
RUN apk update && apk upgrade

# copy the app, note .dockerignore
COPY . .

# Install dependecies
RUN npm install

# build necessary, even if no static files are needed,
# since it builds the server as well
RUN npm run build
