FROM nginx:alpine

COPY . /usr/share/nginx/html/

RUN rm -f /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d/nullroute.conf

EXPOSE 8888
