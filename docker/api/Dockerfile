# API Dockerfile
# Must be run from project root, like so:
#   docker build -f ./docker/api/Dockerfile -t api .

FROM alpine:edge
EXPOSE 3001

# Installs latest Chromium package.
RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      freetype-dev \
      harfbuzz \
      ca-certificates \
      ttf-freefont \
      nodejs-current \
      nodejs-current-npm

# Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Add user so we don't need --no-sandbox.
RUN addgroup -S pptruser && adduser -S -g pptruser pptruser \
    && mkdir -p /home/pptruser/Downloads /api /snapshots \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /api /snapshots

ADD package.json package-lock.json api/ /api/
WORKDIR /api
RUN npm ci \
 && chown -R pptruser:pptruser /api /snapshots

# Run everything after as non-privileged user.
USER pptruser
CMD node api
