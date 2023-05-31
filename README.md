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

This will start the Postgres database and the NestJS API in watch mode. Any changes you make to the source code will be reflected in the container using HMR. It will also run the Prisma migrations and seed the database. There is also a pgAdmin container running, that you can access at `localhost:5050`.

## Installing dependencies

When installing new dependencies with npm, you will need to rebuild the Docker container. You can do this by running the following command:

```bash
docker-compose up --build -V -d
```

The `-V` flag will remove any anonymous volumes that are attached to the container, such as the one were the `node_modules` are stored.

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