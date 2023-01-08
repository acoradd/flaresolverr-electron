# FlareSolverr - Electron

- [GitHub](https://github.com/acoradd/flaresolverr-electron)
- [DockerHub](https://hub.docker.com/r/accoradd/flaresolver-electron)

## Fork of FlareSolverr project
FlareSolverr - Electron is based on same API than Flaresolverr

- [GitHub](https://github.com/FlareSolverr/FlareSolverr)
- [DockerHub](https://hub.docker.com/r/flaresolverr/flaresolverr)

## Limitations
- No captcha solver implemented
- No support for ARM
- No support for proxy

## ENV variables

| NAME                 | DEFAULT VALUE      | DESCRIPTION                                                     |
|----------------------|--------------------|-----------------------------------------------------------------|
| PORT                 | 8191               | Listen port                                                     |
| HOST                 | 0.0.0.0            | Listen host                                                     |
| TEST_URL             | https://google.com | URL used to test if server configuration ok                     |
| DISABLE_LOG_COOKIE   | FALSE              | Disable if you don't want to log incoming request cookies       |
