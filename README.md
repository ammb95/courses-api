## Requirements

### AWS CLI

- Ensure you have AWS CLI installed. You can download it from [AWS CLI official website](https://aws.amazon.com/cli/).

- Make sure you have your AWS credentials registered. If not, you can register them by running:

```bash
$ aws configure
```

- Any credentials (even fake ones) should work but `AWS_ACCESS_KEY_ID` can contain only letters (A–Z, a–z) and numbers (0–9).

### Docker CLI

- Ensure you have the Docker CLI installed. You can download it from [Docker's official website](https://www.docker.com/products/cli/).

- Make sure you have valid Docker credentials. If not, you can register them by running:

```bash
$ docker login
```

### Set Environment Variables

Create a `.env` file in the project's root folder with the following content:

```dotenv
APP_PORT=3000

AWS_ACCESS_KEY_ID=awsAccessKeyId
AWS_SECRET_ACCESS_KEY=aws-secret-access-key

DB_HOST=http://localhost
DB_PORT=8000
DB_REGION=localhost

JWT_SECRET_KEY=jwt-secret-key
```

This `.env` file will be used when running the Node app in standalone mode. Some environment variables will be overridden in the `docker-compose.yaml` file when the app runs within a Docker container.

## Available Scripts

```bash
$ npm run start       # Runs the app in standalone mode
$ npm run start:npx   # Runs the app in standalone mode using npx to fetch ts-node
$ npm run dev         # Runs the standalone app in watch mode
$ npm run db          # Runs the database image alone
$ npm run compose     # Runs both the app and the database through Docker
$ npm run test        # Runs test suites
$ npm run test:watch  # Runs test suites in watch mode
$ npm run test:clear-cache  # Clears Jest cache and runs test suites
```

## Running the App

### Using Docker

To run both the app and the database together, run:

```bash
$ npm run compose
```

or

```bash
$ docker compose up
```

Wait until you see the message:

```bash
Server is running on http://localhost:3000
```

The app will be available at `localhost:3000`.

### Standalone

#### 1. Install dependencies:

```bash
$ npm install
```

#### 2. Run the database:

```bash
$ npm run db
```

Wait for the database to be up before running the app to avoid connection issues. You can check it by running:

```bash
$ aws dynamodb list-tables --endpoint-url http://localhost:8000
```

#### 3. Run the app in standalone mode:

```bash
$ npm run start
```

or

```bash
$ npm run dev
```

## Routes

For information about available routes and their requirements, check the [related documentation](/routes.docs.md).

## Table Creation and Population

- When running the app for the first time, it will automatically create and populate Users and Courses tables.
- You should see the following messages:

```bash
Users Table Successfully Created
Users Successfully Populated
Courses Table Successfully Created
Courses Successfully Populated
```

- If the app is not running for the first time (tables already exist), you'll see:

```bash
Users Table Creation Skipped
Courses Table Creation Skipped
```

- Check available usernames and passwords at `/src/db/data/users.data.json`.
- To delete tables, run the following command (you need aws cli installed and your aws credentials configured):

```bash
$ aws dynamodb delete-table --table-name {TABLE_NAME} --endpoint-url http://localhost:8000
```

Replace `{TABLE_NAME}` with either `Users` or `Courses`.
