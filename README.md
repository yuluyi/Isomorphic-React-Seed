

### Directory Layout

```
.
├── /dist/                      # The folder for compiled output
├── /docs/                      # Documentation files for the project
├── /node_modules/              # 3rd-party libraries and utilities
├── /configs/                   # Configs for webpack
├── /scripts/                   # Scripts used for deploying
├── /src/                       # The source code of the application
│   ├── /apis/                  # REST API / Relay endpoints
│   ├── /desktop/               # Desktop source code
│   │   ├── components          # common components used by desktop codes
│   │   ├── containers          # route level components used by desktop codes
│   │   ├── store               # actions and reducers related to redux
│   │   ├── style               # global style and style reset
│   │   ├── routes.js           # rotues used by react-router
│   │   └── index.js            # client entry which is bundled by webpack
│   ├── /mobile/                # Mobile source code
│   ├── /common/                # common components used by both desktop and mobile
│   ├── /core/                  # Framework level core codes
│   ├── /static/                # Static files which are copied into the /dist/static folder served by server
│   ├── /utils/                 # Utility classes and functions
│   └── /server.js              # Server-side startup script
│── package.json                # The list of 3rd party libraries and utilities
```

### Getting Started

```shell
$ npm install                   # Install Node.js components listed in ./package.json
```

### How to Build

```shell
$ npm run build                 
```

### How to Run

```shell
$ npm run watch
```

This will start a lightweight development server with Hot Reload

### How to Deploy

```shell
$ npm run deploy-test                                          # Build and deploy to test server
$ npm run deploy-to-production-server-i-confirm                # Build and deploy to production server, USE WITH CAUTION!!!
```
