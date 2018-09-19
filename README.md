# Kumpulin API

## Tech Stack

- [**Express**](https://expressjs.com/) Node.js Framework
- [**Passport**](http://www.passportjs.org/) Authentication
- [**Sendgrid**](https://sendgrid.com/) Email Delivery Service
- [**Knex.js**](https://knexjs.org/) SQL query builder
- [**Objection.js**](https://vincit.github.io/objection.js/) ORM
- [**MySQL**](https://www.mysql.com/) SQL Database
- [**bcrypt**](https://github.com/kelektiv/node.bcrypt.js) Password hashing function

## Preparation

### Database

Install `mysql` or `mariadb`

### Google OAuth 2.0

Get `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` from [Google Developers Console](https://console.developers.google.com/)

### Facebook OAuth 2.0

Get `FACEBOOK_APP_ID` and `FACEBOOK_APP_SECRET` from [Facebook Developers](https://developers.facebook.com/).

### Sendgrid API Key

Get `SENDGRID_API_KEY` from [Sendgrid](https://app.sendgrid.com/)

## Installation and Configuration

1. Run: `npm install` to install the dependencies
2. Create database
3. Edit .env
4. Run: `npm migrate` to create the tables into the database

## Running

### Development

1. Run: `npm run seed` to insert demo data into the database
2. Run: `npm run dev` to run server

### Production

1. Run: `npm run start` to run server

## API Endpoints

### Authentication

`Authorization: Bearer jwt.token.here`

### `/auth`

| Endpoint                  | HTTP | Description                                                                   | Body                | Return                             |
| ------------------------- | ---- | ----------------------------------------------------------------------------- | ------------------- | ---------------------------------- |
| `/auth/signup`            | POST | Sign up                                                                       | `email`, `password` | [user](#user)                      |
| `/auth/signin`            | POST | Sign in                                                                       | `email`, `password` | [user](#user), [token](#jwt-token) |
| `/auth/forgot_password`   | POST | Send email including link for reset password page                             | `email`             | `{ success: true }`                |
| `/auth/reset_password`    | GET  | Redirect to reset password page if token is still valid                       | -                   | -                                  |
| `/auth/reset_password`    | POST | Reset passwod                                                                 | `password`, `token` | [user](#user)                      |
| `/auth/refresh_token`     | POST | Refresh JWT token                                                             | `token`             | [token](#jwt-token)                |
| `/auth/google`            | GET  | Sign in using google                                                          | -                   | -                                  |
| `/auth/google/callback`   | GET  | Path that users are redirected to after they have authenticated with Google   | -                   | [token](#jwt-token)                |
| `/auth/facebook`          | GET  | Sign in using facebook                                                        | -                   | -                                  |
| `/auth/facebook/callback` | GET  | Path that users are redirected to after they have authenticated with Facebook | -                   | [token](#jwt-token)                |

### `/account`

Authentication required

| Endpoint                   | HTTP | Description                  | Body                         | Return        |
| -------------------------- | ---- | ---------------------------- | ---------------------------- | ------------- |
| `/account/`                | GET  | Get current user data        | -                            | [user](#user) |
| `/account/change_password` | POST | Change current user password | `oldPassword`, `newPassword` | [user](#user) |

### `/events`

Authentication required

| Endpoint            | HTTP   | Description                     | Body  | Return                       |
| ------------------- | ------ | ------------------------------- | ----- | ---------------------------  |
| `/events/`          | GET    | Get all events data             | -     | [List of events](#events)    |
| `/:eventId`         | GET    | Get event data by id            | -     | [eventId](#events)           |
| `/:eventId/details` | GET    | Get event details data by id    | -     | [event details](#events)     |
| `/:eventId/join`    | POST   | Update event data by id         | -     | `{ success: true }`          |

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
