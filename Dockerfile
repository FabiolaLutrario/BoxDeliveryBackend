FROM node:20
RUN mkdir -p /home/app
COPY . /home/app
EXPOSE $PORT_LOCAL_APP
CMD ["node","/home/app/server.js"]