# Setup Project

#### Create .env file

```
DATABASE_URL="mysql://{username}:{password}@localhost:3306/{dbName}"
```

#### Install and run project

```shell

npm install

npx prisma migrate dev

npx prisma generate

npm run build

npm run start

```

#### API Documentation

[Link Postman](https://documenter.getpostman.com/view/33657932/2sAXxS9Bxi)
