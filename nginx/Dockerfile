FROM nginx:latest

# Copy the nginx configuration file
COPY ./nginx.conf /etc/nginx/nginx.conf

# Set SSL certificates from environment variables and place them in the container
ARG SSL_CERT
ARG SSL_KEY

RUN mkdir -p /etc/ssl/certs /etc/ssl/private

RUN printf "%s" "$SSL_CERT" > /etc/ssl/certs/ohgetsu.crt
RUN printf "%s" "$SSL_KEY" > /etc/ssl/private/ohgetsu.key
