# looties-backend

## Requirements

- Node v18
- Docker

> We also use npm instead of yarn or pnpm to be consistent with the frontend.

## Running locally

First install the vscode extensions for a better dev experience. You can find them in the `.vscode/extensions.json` file. To install them, go to the Extensions tab, filter by Recommended and click on the `Workspace Recommendations` tab. [Docs if you need help](https://code.visualstudio.com/docs/editor/extension-marketplace#_extensions-view-filter-and-commands)

Setup the environment variables. There is an `.env.example` file in the root of the project. Copy it and rename it to `.env`. Fill in the values.

After you have Docker installed, run the following command:

```bash
docker-compose up -d
```

This will start the Postgres database and the NestJS API in watch mode. Any changes you make to the source code will be reflected in the container using webpack HMR. It will also run the Prisma migrations and seed the database.

## Deploying manually to the DigitalOcean droplet

We already have a droplet setup in DigitalOcean [here](https://cloud.digitalocean.com/droplets/358593516/graphs?i=6686cd&period=hour).

To deploy the docker-compose file manually to the droplet, do the following

- Setup a docker remote context for the droplet: `docker context create remote --docker "host=ssh://deployer@64.226.91.7"`.
- Switch to the remote context: `docker context use remote`.
- Run `docker compose -f docker-compose.yml up --build -dV` to deploy the docker-compose file to the droplet.
- Inspect changes with `docker compose ps`
- Change your context back to local with `docker context use default`

[Deploy guide](https://danielwachtel.com/devops/deploying-multiple-dockerized-apps-digitalocean-docker-compose-contexts)

## Ports

The only exposed port is `3000`.

 - To use the REST APIs, call `localhost:3000`
 - To use the Chat websocket, call `localhost:3000/chat`
 - To use the Live Drops websocket, call `localhost:3000/live-drops`

Going to `localhost:3000/api` will also open up the swagger page.

There is also a pgAdmin container running, that you can access at `localhost:5050`.

## Installing dependencies

When installing new dependencies with npm, you will need to rebuild the Docker container. You can do this by running the following command:

```bash
docker-compose up --build -V -d
```

The `-V` flag will remove any anonymous volumes that are attached to the container, such as the one were the `node_modules` are stored.

## Working with migrations

Because Prisma is a terrible piece of software, it will crash if you try to do this inside docker:

  - Change the schema file
  - Run `prisma generate`
  - Restart the container
  - Run `prisma migrate` from inside the container

This works locally, but not in docker for some reason. So instead, you will need to do the following:

  - Have the container already running
  - Change the schema file
  - Run `npx prisma migrate dev --name NameOfMigration` fom inside the container with the name of the new migration
  - Restart the container

This will ensure that everything works as expected.

To reset the db, run `npx prisma migrate reset` inside the docker container terminal.

To seed the db, run `npx prisma db seed` inside the docker container terminal.

## Running tests

Tests are run with Jest. You can run them with the following command:

```bash
npm run test
```

E2E test are run with:

```bash
npm run test:e2e
```

## Troubleshooting

### Prisma

Sometimes you might get this message in the docker logs:

```
Error: Prisma Migrate has detected that the environment is non-interactive, which is not supported.

`prisma migrate dev` is an interactive command designed to create new migrations and evolve the database in development.
To apply existing migrations in deployments, use prisma migrate deploy.
See https://www.prisma.io/docs/reference/api-reference/command-reference#migrate-deploy
```

This is because prisma thinks the shell it is being run from is non interactive. To fix this, run the docker-compose in interactive mode.

### CORS

Be aware that you need 2 cors configurations:

- One for the NestJS API
- One for the websockets server

There is a [cors middleware in the NestJS API setup](./src/main.ts), but you also need to configure cors in the websockets server [(chat for example)](./src/chat/chat.gateway.ts).