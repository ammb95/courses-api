# Index

- [Requirements](#requirements)
  - [ts-node](#aws-cli)
  - [AWS CLI](#aws-cli)
  - [Docker CLI](#docker-cli)
    - [What If I don't want to use Docker?](#what-if-i-dont-want-to-use-docker)
      - [Download and Extract it With bash (linux or macOS)](#download-and-extract-it-with-bash-linux-or-macos)
      - [Download and Extract it With Windows PowerShell](#download-and-extract-it-with-windows-powershell)
  - [IMPORTANT](#important)
  - [Set Environment Variables](#set-environment-variables)
- [Available Scripts](#available-scripts)
- [Install App Dependencies](#install-app-dependencies)
- [Running the App](#running-the-app)
  - [1. Using Docker](#1-using-docker)
  - [2. Standalone](#2-standalone)
    - [2.1. Make sure you have ts-node globally installed](#21-make-sure-you-have-ts-node-globally-installed)
    - [2.2. Install dependencies](#22-install-dependencies)
    - [2.3. Run the database](#23-run-the-database)
    - [2.4. Run the app in standalone mode](#24-run-the-app-in-standalone-mode)
- [Routes](#routes)
- [Table Creation and Population](#table-creation-and-population)

- [Default Available Users](#default-available-users)

## Requirements

### ts-node

Make sure you have ts-node installed globally.

```bash
npm install -g ts-node
```

### AWS CLI

- Ensure you have AWS CLI installed. You can download it from [AWS CLI official website](https://aws.amazon.com/cli/).

- Make sure you have your AWS credentials registered. If not, you can register them by running:

```bash
aws configure
```

- Any credentials (even fake ones) should work but `AWS_ACCESS_KEY_ID` can contain only letters (A–Z, a–z) and numbers (0–9).

### Docker CLI

- Ensure you have the Docker CLI installed. You can download it from [Docker's official website](https://www.docker.com/products/cli/).

- Make sure you have valid Docker credentials. If not, you can register them by running:

```bash
docker login
```

#### What If I don't want to use Docker?

- If you don't want to use Docker, I recommend to download DynamoDB local from [AWS website](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.DownloadingAndRunning.html) and follow the instructions there.

##### Download and Extract it With bash (Linux or macOS)

```bash
curl -O https://d1ni2b6xgvw0s0.cloudfront.net/v2.x/dynamodb_local_latest.tar.gz

mkdir dynamodblocal

tar -xzvf dynamodb_local_latest.tar.gz -C ./dynamodblocal
```

##### Download and Extract it With Windows PowerShell

```bash
Invoke-WebRequest -Uri "https://d1ni2b6xgvw0s0.cloudfront.net/v2.x/dynamodb_local_latest.tar.gz" -OutFile "dynamodb_local_latest.tar.gz"

New-Item -ItemType Directory -Path "dynamodblocal"

tar -xzvf .\dynamodb_local_latest.tar.gz -C .\dynamodblocal
```

In order to use this version of the database there are a few things you should have in mind:

- You must have the `Java Runtime Environment (JRE)` version `11.x` or newer.
- Before running the database this way, you must configure your AWS credentials using `aws configure` command of the AWS CLI to set up credentials. You can set up fake credentials as below or use your real ones.

```bash
AWS Access Key ID: "fakeMyKeyId"
AWS Secret Access Key: "fakeSecretAccessKey"
Default Region Name: "fakeRegion"
```

- Please, notice that `AWS_ACCESS_KEY_ID` can contain only letters (A–Z, a–z) and numbers (0–9).
- To run the database using this approach, navigate to the directory where you extracted DynamoDBLocal.jar, and enter the following command.

```bash
java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb
```

- The Database will be available on `localhost:8000`. To test it, run:

```bash
aws dynamodb list-tables --endpoint-url http://localhost:8000
```

### IMPORTANT

```
Notice that, to avoid connectivity issues with the database, it is recommended that both the node app and the database should be running in the same environment.

Examples

- Both on WSL, linux, macOS
- Both on Windows
- Both on Docker

The only exception is:

- Node app is run standalone with `npm run start`, and database is run with Docker. However, even with this approach, both the database and docker container must be within the same evironment (e.g. both on Windows or both on Linux/maxOS)
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
npm run start       # Runs the app in standalone mode
npm run start:npx   # Runs the app in standalone mode using npx to fetch ts-node
npm run dev         # Runs the standalone app in watch mode
npm run db          # Runs the database image alone (only available with Docker)
npm run compose     # Runs both the app and the database through Docker
npm run test        # Runs test suites
npm run test:watch  # Runs test suites in watch mode
npm run test:clear-cache  # Clears Jest cache and runs test suites
```

## Install App Dependencies

#### Make sure you have ts-node globally installed:

```bash
npm i -g ts-node
```

Then, on the app root directory run:

```bash
npm install
```

## Running the App

### 1. Using Docker

#### 1.1 Make sure you have ts-node globally installed:

```bash
npm i -g ts-node
```

To run both the app and the database together, run:

```bash
npm run compose
```

or

```bash
docker compose up
```

Wait until you see the message:

```bash
Server is running on http://localhost:3000
```

The app will be available at `localhost:3000`.

### 2. Standalone

#### 2.1. Make sure you have ts-node globally installed:

```bash
npm i -g ts-node
```

#### 2.2. Install dependencies:

```bash
npm install
```

#### 2.3. Run the database:

```bash
npm run db
```

Wait for the database to be up before running the app to avoid connection issues. You can check it by running:

```bash
aws dynamodb list-tables --endpoint-url http://localhost:8000
```

#### 2.4. Run the app in standalone mode:

```bash
npm run start
```

or

```bash
npm run dev
```

If you have any `ts-node` namespace related problems, you can use the `npx` alternative scripts.

## Routes

For information about available routes and their requirements, check the [related documentation](/routes.docs.md).

## Table Creation and Population

- When running the app for the first time, it will automatically create and populate Users and Courses tables.
- You should see the following messages:

```bash
Users Table Successfully Created
Users Table Successfully Populated
Courses Table Successfully Created
Courses Table Successfully Populated
```

- If the app is not running for the first time (tables already exist), you'll see:

```bash
Users Table Creation Skipped
Courses Table Creation Skipped
```

- Check available usernames and passwords at `/src/db/data/users.data.json`.
- To delete tables, run the following command (you need AWS CLI installed and your AWS credentials configured):

```bash
aws dynamodb delete-table --table-name {TABLE_NAME} --endpoint-url http://localhost:8000
```

Replace `{TABLE_NAME}` with either `Users` or `Courses`.

## Default Available Users

- To check the users created on table population, their passwords and roles, please check [this file](/src/db/data/users.data.json).
