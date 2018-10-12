FROM node

RUN set -ex;
RUN npm install -g @angular/cli;
RUN npm cache verify;

RUN mkdir -p /opt/gwapit
WORKDIR /opt/gwapit

ENTRYPOINT ["ng"]
CMD ["serve"]
