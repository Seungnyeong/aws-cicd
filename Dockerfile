# Build Stage

# 애플 실리콘은 플랫폼 줘야함. amd
FROM --platform=linux/amd64 node:18 as build
# package.json 이 변경되지 않으면, 캐시를 이용해서  npm install 이 진행됨.
WORKDIR /usr/src/my-app

COPY package*.json . 

RUN npm install

COPY . .

RUN npm run build


# Production Stage
FROM --platform=linux/amd64 node:18 as production

WORKDIR /usr/src/my-app

COPY --from=build ./usr/src/my-app/build ./build
COPY --from=build ./usr/src/my-app/package.json ./package.json
COPY --from=build ./usr/src/my-app/package-lock.json ./package-lock.json

RUN npm install --only=production

CMD ["node", "build/index.js"]

