FROM node:14-alpine

EXPOSE 19000
EXPOSE 19001
EXPOSE 19002

RUN apk --update-cache --repository http://dl-3.alpinelinux.org/alpine/edge/testing/ add android-tools

WORKDIR /src

COPY package.json .
COPY package-lock.json .
COPY app.json .
COPY tsconfig.json .

RUN npm install
RUN npm install -g expo-cli

COPY . .

CMD adb connect $ADB_IP && \
        expo start

# docker run -e ADB_IP=100.72.254.131 -e REACT_NATIVE_PACKAGER_HOSTNAME=10.10.11.83 -p 19000:19000 -p 19001:19001 zahidali5/temp:test

# ADB_IP="IP of mobile device"
# REACT_NATIVE_PACKAGER_HOSTNAME="10.10.11.83"