FROM nginx:latest

# Copy the nginx configuration file
COPY ./nginx.conf /etc/nginx/nginx.conf

# Set SSL certificates from environment variables and place them in the container
ARG SSL_CERT
ARG SSL_KEY

RUN mkdir -p /etc/ssl/certs /etc/ssl/private

RUN printf "%s\n" "$SSL_CERT" > /etc/ssl/certs/ohgetsu.crt
RUN printf "%s\n" "$SSL_KEY" > /etc/ssl/private/ohgetsu.key

# Debug: Check if files were created successfully
RUN cat /etc/ssl/certs/ohgetsu.crt
RUN cat /etc/ssl/private/ohgetsu.key
