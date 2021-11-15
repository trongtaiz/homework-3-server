FROM node:12.18.3

RUN ln -sf /usr/share/zoneinfo/Asia/Bangkok /etc/localtime

WORKDIR /var/www/app

ADD package.json package-lock.json ./

RUN npm install

EXPOSE 3000

COPY . .

CMD ["npm", "run", "start:prod"]