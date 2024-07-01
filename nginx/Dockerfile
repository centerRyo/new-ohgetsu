FROM nginx:latest

# Copy the nginx configuration file
COPY ./nginx.conf /etc/nginx/nginx.conf

# Set SSL certificates from environment variables and place them in the container
ARG SSL_CERT
ARG SSL_KEY

RUN mkdir -p /etc/ssl/certs /etc/ssl/private

# Debugging: Print SSL_CERT and SSL_KEY to ensure they are passed correctly
RUN echo "$SSL_CERT" > /tmp/ssl_cert_debug.txt
RUN echo "$SSL_KEY" > /tmp/ssl_key_debug.txt

# Using `printf` to ensure newlines are preserved
RUN printf "%s\n" "$SSL_CERT" > /etc/ssl/certs/ohgetsu.crt
RUN printf "%s\n" "$SSL_KEY" > /etc/ssl/private/ohgetsu.key

# Debug: Check if files were created successfully
RUN cat /tmp/ssl_cert_debug.txt
RUN cat /tmp/ssl_key_debug.txt
RUN cat /etc/ssl/certs/ohgetsu.crt
RUN cat /etc/ssl/private/ohgetsu.key
