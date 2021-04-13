
# Iteration 3 Team Vibing Cats <!-- omit in toc -->

[![Server Build Status](../../actions/workflows/server.yml/badge.svg)](../../actions/workflows/server.yml)
[![Client Build Status](../../actions/workflows/client.yaml/badge.svg)](../../actions/workflows/client.yaml)
[![End to End Build Status](../../actions/workflows/e2e.yaml/badge.svg)](../../actions/workflows/e2e.yaml)

[![BCH compliance](https://bettercodehub.com/edge/badge/UMM-CSci-3601-S21/it-3-vibing-cats?branch=main)](https://bettercodehub.com/)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/UMM-CSci-3601-S21/it-3-vibing-cats.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/UMM-CSci-3601-S21/it-3-vibing-cats/alerts/)
- [Development](#development)
  - [Common commands](#common-commands)
- [Deployment](#deployment)
- [Resources](#resources)
- [Contributors](#contributors)

For teachers who wish to support beginners’ engagement with language,
Word River is a tool that supports the management and analysis of language exploration.
Unlike managing all of this information by hand, our product makes it easy to manage what words are available (through the creation, viewing, and assignment of personalized content) and understand more about a learner’s exploration and progress (by providing information about language exposure and the results of various activities).

## [Development](DEVELOPMENT.md)

Instructions on setting up the development environment and working with the code are in [the development guide](DEVELOPMENT.md).

### Common commands

From the `server` directory:
- `./gradlew run` to start the server
- `./gradlew test` to test the server

From the `client` directory:
- `ng serve` to run the client
- `ng test` to test the client
- `ng e2e` and `ng e2e --watch` to run end-to-end tests

From the `database` directory:
- `./mongoseed.sh` (or `.\mongoseed.bat` on Windows) to seed the database

## [Deployment](DEPLOYMENT.md)

Instructions on how to create a DigitalOcean Droplet and setup your project are in [the deployment guide](DEPLOYMENT.md).

## [Resources](RESOURCES.md)

Additional resources on tooling and techniques are in [the resources list](RESOURCES.md).

## Contributors

This contributors to this project can be seen [here](../../graphs/contributors).
