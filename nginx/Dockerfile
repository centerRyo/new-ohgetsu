FROM nginx:latest

# Copy the nginx configuration file
COPY ./nginx.conf /etc/nginx/nginx.conf

# TLS certificates are no longer baked into the image.
# They are issued by Let's Encrypt (certbot) at runtime and mounted from
# host volumes: /etc/letsencrypt (certificates) and /var/www/certbot (ACME challenges).
