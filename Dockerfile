FROM nginx:alpine

COPY default.conf /etc/nginx/nginx.conf

COPY /site /usr/share/nginx/html

