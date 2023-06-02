# looties-backend

## Requirements

- Node v18
- Docker

> We also use npm instead of yarn or pnpm to be consistent with the frontend.

## Running locally

Setup the environment variables. There is an `.env.example` file in the root of the project. Copy it and rename it to `.env`. Fill in the values.

After you have Docker installed, run the following command:

```bash
docker-compose up -d
```

This will start the Postgres database and the NestJS API in watch mode. Any changes you make to the source code will be reflected in the container using webpack HMR. It will also run the Prisma migrations and seed the database.

## Ports

The ports that are exposed are:

- 3000: NestJS API
- 3001: Chat websocket server
- 3002: Live Drops websocket server

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

## Running tests

Tests are run with Jest. You can run them with the following command:

```bash
npm run test
```

## Troubleshooting

Sometimes you might get this message in the docker logs:

```
Error: Prisma Migrate has detected that the environment is non-interactive, which is not supported.

`prisma migrate dev` is an interactive command designed to create new migrations and evolve the database in development.
To apply existing migrations in deployments, use prisma migrate deploy.
See https://www.prisma.io/docs/reference/api-reference/command-reference#migrate-deploy
```

This is because prisma thinks the shell it is being run from is non interactive. To fix this, run the docker-compose in interactive mode.