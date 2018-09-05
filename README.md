# Kumpulin API
## Preparation
### Database
Install `mysql` or `mariadb`

### Google OAuth 2.0
you must register an application with Google. If you have not already done so, a new project can be created in the [Google Developers Console](https://console.developers.google.com/)

## Installation and Configuration
Install dependencies.
```sh
npm i
```

Then edit .env contents in your editor. Refer to .env.defaults for the default values.

```conf
PORT=8080

DB_HOST=
DB_USER=
DB_PASS=
DB_NAME=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

JWT_SECRET=
```

Create database.

Run `migrate` script only once to run the migration files, create the tables into the database.
```sh
npm run migrate
```

You can run `seed` script only once also to run the seeder files, insert demo data into the database.
```sh
npm run seed
```

## Running
### Development
```sh
npm run dev
```

### Production
```sh
npm start
```

## API Endpoints
### Authentication
`Authorization: Bearer jwt.token.here`

### `/auth`
| Endpoint | HTTP | Description | Body | Return |
|---|---|---|---|---|
| `/auth/signup` | POST | Sign up | `email`, `password` | [user](#user) |
| `/auth/signin` | POST | Sign in | `email`, `password` | [token](#jwt-token) |
| `/auth/google` | GET | Sign in using google | - | - |
| `/auth/google/callback` | GET | Path that users are redirected to after they have authenticated with Google | - | [token](#jwt-token) |

### `/account`
Authentication required

| Endpoint | HTTP | Description | Body | Return |
|---|---|---|---|---|
| `/account/current_user` | GET | Get current user data | - | [user](#user) |
| `/account/change_password` | POST | Change current user password | `oldPassword`, `newPassword` | [user](#user) |

### `/users`
Authentication required

| Endpoint | HTTP | Description | Body | Return |
|---|---|---|---|---|
| `/users/` | GET | Get all users data | - | [List of users](#users) |
| `/users/:id` | GET | Get one user user by id | - | [user](#user) |
| `/users/:id` | PATCH | Update one user data by id | `all` | [user](#user) |
| `/users/:id` | DELETE | Delete one user data by id | - | `{ }` |

## JSON Objects returned by API
### User
```JSON
{
  "user": {
    "id": 6,
    "googleId": null,
    "facebookId": null,
    "name": null,
    "email": "Dillon.Johnston@yahoo.com",
    "created_at": "2018-08-31T03:15:14.000Z",
    "updated_at": "2018-08-31T03:15:14.000Z"
  }
}
```

### List of users
```JSON
{
  "users": [
    {
      "id": 1,
      "googleId": null,
      "facebookId": null,
      "name": "Kali Keeling PhD",
      "email": "Mercedes_Hamill76@gmail.com",
      "created_at": "2018-08-31T03:09:40.000Z",
      "updated_at": "2018-08-31T03:09:40.000Z"
    },
    {
      "id": 2,
      "googleId": null,
      "facebookId": null,
      "name": "Mia Roberts V",
      "email": "Adah_Quigley47@hotmail.com",
      "created_at": "2018-08-31T03:09:40.000Z",
      "updated_at": "2018-08-31T03:09:40.000Z"
    }
  ]
}
```

### JWT Token
```JSON
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiZW1haWwiOiJnaWJyYW5raHJpc25hcHV0cmFAZ21haWwuY29tIiwiaWF0IjoxNTM1Njg4MDA2LCJleHAiOjE1MzYyOTI4MDZ9.jwVZHCsGKb6pLlYR--qJlLAlo8zSdK9H7Nc5tlreTXc"
}
```
