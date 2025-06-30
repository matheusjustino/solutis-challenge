<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]:
	https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

# **Description**

The project is a basic API. The project was built with **`Node.js`**,
**`TypeScript`**, **`NestJS`**, and **`PostgreSQL`**. It also uses **`Jest`**
for testing and **`Docker`**.

[Frontend repository here.](https://github.com/matheusjustino/solutis-challenge-frontend)

# **API Documentation**

## **Swagger** - `/api/docs`

## **AUTH** - `/api/{version}/auth`

- ![POST](https://img.shields.io/badge/POST-49CC90?style=for-the-badge&logo=http)
  `/register`
- ![POST](https://img.shields.io/badge/POST-49CC90?style=for-the-badge&logo=http)
  `/login`

## **PRODUCER** - `/api/{version}/producer`

- ![POST](https://img.shields.io/badge/POST-49CC90?style=for-the-badge&logo=http)
  `/`
- ![GET](https://img.shields.io/badge/GET-61AFEF?style=for-the-badge&logo=http)
  `/`
- ![GET](https://img.shields.io/badge/GET-61AFEF?style=for-the-badge&logo=http)
  `/{id}`
- ![PATCH](https://img.shields.io/badge/PATCH-50e3c2?style=for-the-badge&logo=http)
  `/{id}`
- ![DELETE](https://img.shields.io/badge/DELETE-f93e3e?style=for-the-badge&logo=http)
  `/{id}`

## **FARM** - `/api/{version}/farm`

- ![POST](https://img.shields.io/badge/POST-49CC90?style=for-the-badge&logo=http)
  `/`
- ![GET](https://img.shields.io/badge/GET-61AFEF?style=for-the-badge&logo=http)
  `/`
- ![GET](https://img.shields.io/badge/GET-61AFEF?style=for-the-badge&logo=http)
  `/{id}`
- ![PATCH](https://img.shields.io/badge/PATCH-50e3c2?style=for-the-badge&logo=http)
  `/{id}`
- ![DELETE](https://img.shields.io/badge/DELETE-f93e3e?style=for-the-badge&logo=http)
  `/{id}/producer/{producerId}`

## **CULTURE** - `/api/{version}/culture`

- ![POST](https://img.shields.io/badge/POST-49CC90?style=for-the-badge&logo=http)
  `/`
- ![GET](https://img.shields.io/badge/GET-61AFEF?style=for-the-badge&logo=http)
  `/`
- ![PATCH](https://img.shields.io/badge/PATCH-50e3c2?style=for-the-badge&logo=http)
  `/{id}`

## **PLANTED CULTURE** - `/api/{version}/planted-culture`

- ![POST](https://img.shields.io/badge/POST-49CC90?style=for-the-badge&logo=http)
  `/`
- ![GET](https://img.shields.io/badge/GET-61AFEF?style=for-the-badge&logo=http)
  `/`

## **STATISTICS** - `/api/{version}/statistics`

- ![GET](https://img.shields.io/badge/GET-61AFEF?style=for-the-badge&logo=http)
  `/kpis`
- ![GET](https://img.shields.io/badge/GET-61AFEF?style=for-the-badge&logo=http)
  `/farms-by`

# Scripts

- run `yarn start:dev`
- run in docker `docker compose up`
- test `yarn test`
- infra AWS `terraform apply`. Set up your AWS credentials.

# CI/CD

Set up the following Github vars and secrets to be able to run Github CI/CD
properly.

- VARS
    - `AWS_REGION`: ${{ vars.AWS_REGION }}
    - `ECR_REPOSITORY`: ${{ vars.ECR_REPOSITORY }}
    - `ECS_SERVICE`: ${{ vars.ECS_SERVICE }}
    - `ECS_CLUSTER`: ${{ vars.ECS_CLUSTER }}
    - `ECS_TASK_DEFINITION`: ${{ vars.ECS_TASK_DEFINITION }}
    - `CONTAINER_NAME`: ${{ vars.CONTAINER_NAME }}

- SECRETS
    - `AWS_ACCESS_KEY_ID`
    - `AWS_SECRET_ACCESS_KEY`
