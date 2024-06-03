# phone-number-management

This project contains the necessary Lambda functions to develop an API to manage phone numbers of an organization. This API allows the user to allocate and deallocate numbers of an organization. The code is developed entirely in TypeScript to run on AWS Lambda using the traditional Serverless Framework.

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Setup](#setup)
- [Deployment](#deployment)
- [Usage](#usage)
- [Endpoints](#endpoints)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

## Features

- Create organizations.
- Allocate phone numbers to users within an organization.
- Deallocate phone numbers from users.
- List users with allocated phone numbers for an organization.
- Secure API endpoints with organization-specific API keys.

## Architecture

- **AWS Lambda:** Serverless compute service that runs your code in response to events.
- **AWS API Gateway:** Managed service that makes it easy for developers to create, publish, maintain, monitor, and secure APIs.
- **MongoDB:** NoSQL database used for storing organization, user, and phone number data.
- **Docker:** Used for local development and testing of MongoDB.

## Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.x or higher)
- [Serverless Framework](https://www.serverless.com/framework/docs/getting-started/)
- [Docker](https://www.docker.com/products/docker-desktop)

### Installation

1. Clone the repository:

```bash
$ git clone https://github.com/lbenart/phone-number-management.git
$ cd phone-number-management
```

2. Install dependencies:
```bash
$ yarn install
```

3. Build project:
```bash
$ yarn run build
```

### Running MongoDB with Docker for local dev and testing
```bash
$ docker pull mongo
$ docker run --name mongodb -d -p 27017:27017 mongo
```

### Populate and setup DB

1. Create a .csv file with phone numbers (one per line)

2. Use the following scripts:

```bash
$ ts-node src/db/populate_db.ts
$ ts-node src/db/setup_index.ts
```

### Testing

The project contains unit testing and medium testing suites using Jest.


To run the Jest tests you must use the command:

```bash
$ yarn run test
```

To run only unit tests use:
```bash
$ yarn run test:s
```

For the tests to run correctly, remember to have a MongoDB test database running on localhost beforehand.

### Deployment to AWS using the Serverless Framework

In order to deploy the lambdas to AWS cloud, you need to run the following command:

```
$ serverless deploy --stage <stage-name> --region <aws-region> --verbose
```


### Local development

You can expose the functions for local invocation by using the following command:

```bash
$ yarn run offline
```

Which should result in response similar to the following:

DOTENV: Loading environment variables from .env:
	 - MONGODB_URI

Starting Offline at stage dev (us-east-1)

Offline [http for lambda] listening on http://localhost:3002
Function names exposed for local invocation by aws-sdk:
           * allocateNumber: number-management-dev-allocateNumber
           * deallocateNumber: number-management-dev-deallocateNumber
           * listUsers: number-management-dev-listUsers
           * createOrganization: number-management-dev-createOrganization

   ┌──────────────────────────────────────────────────────────────────────────────────────┐
   │   POST | http://localhost:3000/dev/allocate                                          |
   │   POST | http://localhost:3000/dev/deallocate                                        |
   │   GET  | http://localhost:3000/dev/users/{organization_id}                           |
   │   POST | http://localhost:3000/dev/organizations                                     |
   └──────────────────────────────────────────────────────────────────────────────────────┘

Server ready: http://localhost:3000 🚀

## Usage

### Accessing the API

The Phone Number Management API is now deployed and ready to use. You can access it at the following URL:

```
https://rf2q7pg9rd.execute-api.us-east-2.amazonaws.com/dev/phone-numbers
```

### API Documentation

For detailed information on how to use the API endpoints and their respective request and response formats, please refer to the API documentation:

[API documentation](https://rf2q7pg9rd.execute-api.us-east-2.amazonaws.com/dev/phone-numbers/docs)


The API documentation provides descriptions of each endpoint, their parameters, and expected responses, helping you understand how to interact with the API effectively.


### Contributing
This project welcomes contributions. Please open an issue or submit a pull request for any improvements or new features. Remember to add unit and integration tests for every new feature incorporated.
