FROM nginx:latest

# Copy the nginx configuration file
COPY ./nginx.conf /etc/nginx/nginx.conf

RUN mkdir -p /etc/ssl/certs /etc/ssl/private

# Copy the SSL certificate and key
COPY ssl_cert.pem /etc/ssl/certs/ohgetsu.crt
COPY ssl_key.pem /etc/ssl/private/ohgetsu.key

