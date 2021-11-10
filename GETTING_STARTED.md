## Getting started locally on your machine

- Rename .env.example to .env to use the enviroment variables needed.
- IN CASE OF USING DOCKER: Change whatever configurations in the docker-compose.yml and Dockerfile file to fit your required needed enviroment.
- Run docker-compose up in order to build images and your enviroment ready
- IN CASE OF NOT USING DOCKER: Make sure to get LTS node verion and mongodb installed and run these commands respectively different terminals:

  - npm run watch-ts
  - npm run watch-node

## Backend endpoints and what they are used for

- use /POST 'http://localhost:3000/api/user/signup' to register user in system.
- use /POST 'http://localhost:3000/api/user/login' and take the JWT token from the "www-authenticate" response header to use it in the all API calls.
- use /GET 'http://localhost:3000/api/user/verify/:id/:code' to verify registered use.
- use /POST 'http://localhost:3000/api/check' to create check.
- use /PATCH 'http://localhost:3000/api/check/:checkId' to edit check.
- use /DELETE 'http://localhost:3000/api/check/:checkId' to delete check.
- use /GET 'http://localhost:3000/api/check/:checkId/pause' to stop cronjob running on specific check.
- use /GET 'http://localhost:3000/api/check/:checkId/resume' to resume cronjob running on specific check.
- use /GET 'http://localhost:3000/api/report/:checkId' to generate report for specific check's url.
