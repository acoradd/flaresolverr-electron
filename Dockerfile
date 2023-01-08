# use the version that corresponds to your electron version
FROM node:16.17-bullseye-slim as build

# install electron dependencies or more if your library has other dependencies
RUN apt-get update && apt-get install \
    git libx11-xcb1 libxcb-dri3-0 libxtst6 libnss3 libatk-bridge2.0-0 libgtk-3-0 libxss1 libasound2 dpkg fakeroot rpm \
    -yq --no-install-suggests --no-install-recommends \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# copy the source into /app
WORKDIR /app
COPY . .
RUN chown -R node /app

# install node modules and perform an electron rebuild
USER node
RUN npm install
RUN npm run make
# Electron needs root for sand boxing
# see https://github.com/electron/electron/issues/17972
USER root
RUN chown root /app/node_modules/electron/dist/chrome-sandbox
RUN chmod 4755 /app/node_modules/electron/dist/chrome-sandbox

FROM debian:11.6-slim as run

ENV DISPLAY :0.0
ENV XFB_SCREEN 1920x1080x24
ENV DPI_OPTIONS "-dpi 150"
EXPOSE 8191

WORKDIR /app

RUN apt-get update && apt-get install \
    xvfb x11-utils x11-xserver-utils \
    libnotify4 xdg-utils libdrm2 libgbm1 libglib2.0-bin libgtk-3-0 libnss3 libxtst6 libatspi2.0-0 libasound2 libxcb-dri3-0 dpkg \
    -yq --no-install-suggests --no-install-recommends \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/out/make/deb/x64/* ./flaresolverr.deb
COPY --from=build /app/entrypoint-dockerfile.sh /entrypoint.sh

RUN dpkg -i ./flaresolverr.deb \
    && apt-get install -f \
    && apt-get clean && rm -rf /var/lib/apt/lists/* \
    && chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]


