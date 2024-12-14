# API specification

This is the specification of our great RESTful api!
🔐 symbolizes that the route requires an `auth_token` or a `password_reset_token`.
Read more about these tokens [here](#tokens).

-   **/user**
    -   [POST **/sign-up**](#▶️post-usersign-up) ▶️ Registers a new user (as player).
    -   [POST **/log-in**](#▶️post-userlog-in) ▶️ Logs in an existing user.
    -   🔐[POST **/log-out**](#▶️post-userlog-out) ▶️ Logs out a logged in user.
    -   🔐[DELETE **/**](#delete-user) ▶️ Deletes a logged in user.
    -   🔐[POST **/security-questions**](#▶️post-usersecurity-questions) ▶️ Set the security questions of the logged in user.
    -   [PATCH **/security-questions**](#▶️patch-usersecurity-questions) ▶️ Validate the answered security questions.
    -   🔐[POST **/reset-password**](#▶️post-userreset-password) ▶️ Reset the password of an existing user.
-   **/player**
    -   🔐[GET **/trophy-count**](#▶️get-playertrophy-count) ▶️ Get the trophy count of the logged in player.
-   **/questions**
    -   🔐[GET **/**](#▶️-get-questions) ▶️ Get all questions.
    -   🔐[GET **/game-of-the-day**](#▶️get-questionsgame-of-the-day) ▶️ Get the questions of the game of the day.
    -   🔐[GET **/quick-game**](#▶️get-questionsquick-game) ▶️ Get random questions for a quick game.
    -   🔐[GET **/latest-show**](#▶️get-questionslatest-show) ▶️ Get the questions of the latest show.
    -   🔐[GET **/train**](#▶️get-questionstraincategory1category2) ▶️ Get random questions for training.
    -   🔐[POST **/:id**](#▶️-post-questionsid) ▶️ Create a new question.
    -   🔐[PATCH **/:id**](#▶️-patch-questionsid) ▶️ Update an existing question.
    -   🔐[DELETE **/:id**](#▶️-delete-questionsid) ▶️ Delete a question.
-   **/highscores**
    -   🔐[POST **/**](#▶️post-highscores) ▶️ Upload the result of a finished game.
    -   🔐[GET **/today**](#▶️get-highscorestoday) ▶️ Get the highscores of today.
    -   🔐[GET **/week**](#▶️get-highscoresweek) ▶️ Get the highscores of the current week.
    -   🔐[GET **/month**](#▶️get-highscoresmonth) ▶️ Get the highscores of the current month.

## ▶️ GET **/questions**

[Back to top](#api-specification)

Get all questions.

### Request header

```
auth_token = 8dc19f14-01d4-4b20-8640-11dfef2e74d8
```

The token needs admin rights.

### Responses

#### ✅ Success _200_

```json
{
    "success": true,
    "questions": [
        {
            "id": 5,
            "question": {
                "en": "What percentage of the world is allergic to cats?",
                "de": "Wieviel Prozent der Menschheit hat eine Katzenallergie?",
            },
            "answers": [
                {
                    "en": "10%",
                    "de": "10%",
                },
                {
                    "en": "30%",
                    "de": "30%",
                },
                {
                    "en": "5%",
                    "de": "5%",
                },
                {
                    "en": "40%",
                    "de": "40%",
                }
            ],
            "category": "animals",
            "difficulty": 1000,
        },
        ...
    ]
}
```

#### ❌ Error

```json
{
    "success": false,
    "message": "An error happend!",
    "error_id": "An error_id"
}
```

<table style="border: 1px solid white; border-collapse: collapse; width: 100%">
<thead>
    <th>error_id</th>
    <th>Description</th>
    <th>Status</th>
<thead>
    <tr>
        <td><i>auth_error</i></td>
        <td>The authentification token is invalid or outdated.</td>
        <td>401</td>
    </tr>
    <tr>
        <td><i>admin_error</i></td>
        <td>The user does not have administrative rights.</td>
        <td>403</td>
    </tr>
    <tr>
        <td><i>fatal_error</i></td>
        <td>An unhandled error. This should never happen. Please notify the backend team!</td>
        <td>500</td>
    </tr>
</table>

## ▶️ POST **/questions/:id**

[Back to top](#api-specification)

Create a new question.

### Request header

```
auth_token = 8dc19f14-01d4-4b20-8640-11dfef2e74d8
```

The token needs admin rights.

### Request body

```json
{
    "question": {
        "en": "What percentage of the world is allergic to cats?",
        "de": "Wieviel Prozent der Menschheit hat eine Katzenallergie?"
    },
    "answers": [
        {
            "en": "10%",
            "de": "10%"
        },
        {
            "en": "30%",
            "de": "30%"
        },
        {
            "en": "5%",
            "de": "5%"
        },
        {
            "en": "40%",
            "de": "40%"
        }
    ],
    "category": "animals",
    "difficulty": 1000
}
```

### Responses

#### ✅ Success _201_

```json
{
    "success": true,
    "id": 5
}
```

#### ❌ Error

```json
{
    "success": false,
    "message": "An error happend!",
    "error_id": "An error_id"
}
```

<table style="border: 1px solid white; border-collapse: collapse; width: 100%">
<thead>
    <th>error_id</th>
    <th>Description</th>
    <th>Dtatus</th>
<thead>
    <tr>
        <td><i>question_format_error</i></td>
        <td>At least one attribute is missing or empty.</td>
        <td>400</td>
    </tr>
    <tr>
        <td><i>auth_error</i></td>
        <td>The authentification token is invalid or outdated.</td>
        <td>401</td>
    </tr>
    <tr>
        <td><i>admin_error</i></td>
        <td>The user does not have administrative rights.</td>
        <td>403</td>
    </tr>
    <tr>
        <td><i>fatal_error</i></td>
        <td>An unhandled error. This should never happen. Please notify the backend team!</td>
        <td>500</td>
    </tr>
</table>

## ▶️ PATCH **/questions/:id**

[Back to top](#api-specification)

Update an existing question. You need to pass the full question (no empty fields!).

### Request header

```
auth_token = 8dc19f14-01d4-4b20-8640-11dfef2e74d8
```

The token needs admin rights.

### Request body

```json
{
    "question": {
        "en": "What percentage of the world is allergic to cats?",
        "de": "Wieviel Prozent der Menschheit hat eine Katzenallergie?"
    },
    "answers": [
        {
            "en": "10%",
            "de": "10%"
        },
        {
            "en": "30%",
            "de": "30%"
        },
        {
            "en": "5%",
            "de": "5%"
        },
        {
            "en": "40%",
            "de": "40%"
        }
    ],
    "category": "animals",
    "difficulty": 1000
}
```

### Responses

#### ✅ Success _200_

```json
{
    "success": true
}
```

#### ❌ Error

<table style="border: 1px solid white; border-collapse: collapse; width: 100%">
<thead>
    <th>error_id</th>
    <th>Description</th>
    <th>Status</th>
<thead>
    <tr>
        <td><i>auth_error</i></td>
        <td>The authentification token is invalid or outdated.</td>
        <td>401</td>
    </tr>
    <tr>
        <td><i>question_format_error</i></td>
        <td>At least one attribute is missing or empty.</td>
        <td>400</td>
    </tr>
    <tr>
        <td><i>admin_error</i></td>
        <td>The user does not have administrative rights.</td>
        <td>403</td>
    </tr>
    <tr>
        <td><i>invalid_id_error</i></td>
        <td>The question to be updated does not exist.</td>
        <td>404</td>
    </tr>
    <tr>
        <td><i>fatal_error</i></td>
        <td>An unhandled error. This should never happen. Please notify the backend team!</td>
        <td>500</td>
    </tr>
</table>

## ▶️ DELETE **/questions/:id**

[Back to top](#api-specification)

Delete an existing question.

### Request header

```
auth_token = 8dc19f14-01d4-4b20-8640-11dfef2e74d8
```

The token needs admin rights.

### Responses

#### ✅ Success _204_

```json
{
    "success": true
}
```

#### ❌ Error

```json
{
    "success": false,
    "message": "An error happend!",
    "error_id": "An error_id"
}
```

<table style="border: 1px solid white; border-collapse: collapse; width: 100%">
<thead>
    <th>error_id</th>
    <th>Description</th>
    <th>Status</th>
<thead>
    <tr>
        <td><i>auth_error</i></td>
        <td>The authentification token is invalid or outdated.</td>
        <td>401</td>
    </tr>
    <tr>
        <td><i>admin_error</i></td>
        <td>The user does not have administrative rights.</td>
        <td>403</td>
    </tr>
    <tr>
        <td><i>invalid_id_error</i></td>
        <td>The question to be deleted does not exist.</td>
        <td>404</td>
    </tr>
    <tr>
        <td><i>fatal_error</i></td>
        <td>An unhandled error. This should never happen. Please notify the backend team!</td>
        <td>500</td>
    </tr>
</table>

## ▶️POST **/user/sign-up**

[Back to top](#api-specification)

Registers a new user. Validates the inputs. Returns an `auth_token` if the registration succeeds.

### Request body

```json
{
    "surname": "Nicole",
    "lastname": "Sebastian",
    "email": "nicolesebastia@gmail.com",
    "birthday": "15.02.2000",
    "password": "fhaachen2023"
}
```

### Responses

#### ✅ Success _201_

```json
{
    "success": true,
    "username": "nicole_sebastian",
    "auth_token": "8dc19f14-01d4-4b20-8640-11dfef2e74d8"
}
```

#### ❌ Error

```json
{
    "success": false,
    "message": "An error happend!",
    "error_id": "An error_id"
}
```

<table style="border: 1px solid white; border-collapse: collapse; width: 100%">
<thead>
    <th>error_id</th>
    <th>Description</th>
    <th>Status</th>
<thead>
    <tr>
        <td><i>email_error</i></td>
        <td>Entered email is not an email!</td>
        <td>400</td>
    </tr>
    <tr>
        <td><i>password_error</i></td>
        <td>No password has been specified!</td>
        <td>400</td>
    </tr>
    <tr>
        <td><i>surname_error</i></td>
        <td>No surname has been specified!</td>
        <td>400</td>
    </tr>
    <tr>
        <td><i>lastname_error</i></td>
        <td>No place of birth has been specified!</td>
        <td>400</td>
    </tr>
    <tr>
        <td><i>date_error</i></td>
        <td>Entered birthday is not a date!</td>
        <td>400</td>
    </tr>
    <tr>
        <td><i>birthday_error</i></td>
        <td>The user must be at least 15 years old to play this game!</td>
        <td>403</td>
    </tr>
    <tr>
        <td><i>duplicate_email_error</i></td>
        <td>The entered email is already used!</td>
        <td>409</td>
    </tr>
    <tr>
        <td><i>fatal_error</i></td>
        <td>An unhandled error. This should never happen. Please notify the backend team!</td>
        <td>500</td>
    </tr>
</table>

## ▶️POST **/user/log-in**

[Back to top](#api-specification)

Allows an existing user to log in. Returns an `auth_token`.

### Request body

```json
{
    "user_identity": "nicolesebastian@gmail.com", // email or username
    "password": "fhaachen2023"
}
```

### Responses

#### ✅ Success _201_

```json
{
    "success": true,
    "auth_token": "8dc19f14-01d4-4b20-8640-11dfef2e74d8",
    "username": "nicole_sebastian",
    "is_admin": true
}
```

#### ❌ Error

```json
{
    "success": false,
    "message": "An error happend!",
    "error_id": "An error_id"
}
```

<table style="border: 1px solid white; border-collapse: collapse; width: 100%">
<thead>
    <th>error_id</th>
    <th>Description</th>
    <th>Status</th>
<thead>
    <tr>
        <td><i>user_identity_error</i></td>
        <td>No username/email has been specified!</td>
        <td>401</td>
    </tr>
    <tr>
        <td><i>password_error</i></td>
        <td>No password has been specified!</td>
        <td>401</td>
    </tr>
    <tr>
        <td><i>credentials_error</i></td>
        <td>The credentials for the login are wrong!</td>
        <td>401</td>
    </tr>
    <tr>
        <td><i>fatal_error</i></td>
        <td>An unhandled error. This should never happen. Please notify the backend team!</td>
        <td>500</td>
    </tr>
</table>

## ▶️POST **/user/log-out**

[Back to top](#api-specification)

Allows an logged in user to log out.

### Request header

```
auth_token = 8dc19f14-01d4-4b20-8640-11dfef2e74d8
```

### Responses

#### ✅ Success _200_

```json
{
    "success": true
}
```

#### ❌ Error

```json
{
    "success": false,
    "message": "An error happend!",
    "error_id": "An error_id"
}
```

<table style="border: 1px solid white; border-collapse: collapse; width: 100%">
<thead>
    <th>error_id</th>
    <th>Description</th>
    <th>Status</th>
<thead>
    <tr>
        <td><i>auth_error</i></td>
        <td>	The authentification token is invalid or outdated.</td>
        <td>400</td>
    </tr>
    <tr>
        <td><i>fatal_error</i></td>
        <td>An unhandled error. This should never happen. Please notify the backend team!</td>
        <td>500</td>
    </tr>
</table>

## DELETE **/user/**

[Back to top](#api-specification)

Deletes a logged in user.

### Request header

```
auth_token = 8dc19f14-01d4-4b20-8640-11dfef2e74d8
```

### Responses

#### ✅ Success _200_

```json
{
    "success": true
}
```

#### ❌ Error

```json
{
    "success": false,
    "message": "An error happend!",
    "error_id": "An error_id"
}
```

<table style="border: 1px solid white; border-collapse: collapse; width: 100%">
<thead>
    <th>error_id</th>
    <th>Description</th>
    <th>Status</th>
<thead>
    <tr>
        <td><i>auth_error</i></td>
        <td>The authentification token is invalid or outdated.</td>
        <td>401</td>
    </tr>
</table>

## ▶️POST **/user/security-questions**

[Back to top](#api-specification)

Sets the security questions of the logged in user.

### Request header

```
auth_token = 8dc19f14-01d4-4b20-8640-11dfef2e74d8
```

### Request body

```json
{
    "mother_name": "Nicole",
    "place_of_birth": "Havanna",
    "favourite_color": "red"
}
```

### Responses

#### ✅ Success _201_

```json
{
    "success": true
}
```

#### ❌ Error

```json
{
    "success": false,
    "message": "An error happend!",
    "error_id": "An error_id"
}
```

<table style="border: 1px solid white; border-collapse: collapse; width: 100%">
<thead>
    <th>error_id</th>
    <th>Description</th>
    <th>Status</th>
<thead>
    <tr>
        <td><i>place_of_birth_error</i></td>
        <td>Missing place_of_birth field.</td>
        <td>400</td>
    </tr>
    <tr>
        <td><i>mother_name_error</i></td>
        <td>Missing mother_name field.</td>
        <td>400</td>
    </tr>
    <tr>
        <td><i>favourite_color_error</i></td>
        <td>Missing favourite_color_error field.</td>
        <td>400</td>
    </tr>
    <tr>
        <td><i>fatal_error</i></td>
        <td>An unhandled error. This should never happen. Please notify the backend team!</td>
        <td>500</td>
    </tr>
</table>

## ▶️PATCH **/user/security-questions**

[Back to top](#api-specification)

Validates the security questions for a given user. Returns a `reset_password_token` to
reset the password.

### Request body

```json
{
    "user_identity": "ben_mulya", // email or username
    "favourite_color": "yellow",
    "place_of_birth": "Aachen",
    "mother_name": "Maria"
}
```

### Responses

#### ✅ Success _200_

```json
{
    "success": true,
    "reset_password_token": "8dc19f14-01d4-4b20-8640-11dfef2e74d8"
}
```

#### ❌ Error

```json
{
    "success": false,
    "message": "An error happend!",
    "error_id": "An error_id"
}
```

<table style="border: 1px solid white; border-collapse: collapse; width: 100%">
<thead>
    <th>error_id</th>
    <th>Description</th>
    <th>Status</th>
<thead>
    <tr>
        <td><i>auth_error</i></td>
        <td>The authentification token is invalid or outdated.</td>
        <td>401</td>
    </tr>
    <tr>
        <td><i>incorrect_answer_error</i></td>
        <td>At least one of the security questions was answered incorrectly.</td>
        <td>405</td>
    </tr>
        <tr>
        <td><i>answer_error</i></td>
        <td>At least one answer is missing. (Username/Email, Color, Birthplace, Mothersname)</td>
        <td>400</td>
    </tr>
    <tr>
        <td><i>fatal_error</i></td>
        <td>An unhandled error. This should never happen. Please notify the backend team!</td>
        <td>500</td>
    </tr>
</table>

## ▶️POST **/user/reset-password**

[Back to top](#api-specification)

Resets the password of an existing user. On success the user is logged in.

### Request header

```
reset_password_token = 8dc19f14-01d4-4b20-8640-11dfef2e74d8
```

### Request body

```json
{
    "password": "Fhaachen2021"
}
```

### Responses

#### ✅ Success _200_

```json
{
    "success": true,
    "auth_token": "8dc19f14-01d4-4b20-8640-11dfef2e74d8",
    "is_admin": false,
    "username": "jim_knopf"
}
```

#### ❌ Error

```json
{
    "success": false,
    "message": "An error happend!",
    "error_id": "An error_id"
}
```

<table style="border: 1px solid white; border-collapse: collapse; width: 100%">
<thead>
    <th>error_id</th>
    <th>Description</th>
    <th>Status</th>
<thead>
    <tr>
        <td>reset_password_error</td>
        <td>The password reset token is invalid</td>
        <td>401</td>
    </tr>
    <tr>
        <td><i>fatal_error</i></td>
        <td>An unhandled error. This should never happen. Please notify the backend team!</td>
        <td>500</td>
    </tr>
</table>

## ▶️POST **/highscores**

[Back to top](#api-specification)

Upload the result of a finished game for the logged in player.

### Request header

```
auth_token = 8dc19f14-01d4-4b20-8640-11dfef2e74d8
```

### Request body

```json
{
    "score": 500
}
```

### Responses

#### ✅ Success _201_

```json
{
    "success": true
}
```

#### ❌ Error

```json
{
    "success": false,
    "message": "An error happend!",
    "error_id": "An error_id"
}
```

<table style="border: 1px solid white; border-collapse: collapse; width: 100%">
<thead>
    <th>error_id</th>
    <th>Description</th>
    <th>Status</th>
<thead>
    <tr>
        <td><i>auth_error</i></td>
        <td>The authentification token is invalid or outdated.</td>
        <td>401</td>
    </tr>
    <tr>
        <td><i>fatal_error</i></td>
        <td>An unhandled error. This should never happen. Please notify the backend team!</td>
        <td>500</td>
    </tr>
</table>

## ▶️GET **/highscores/today**

[Back to top](#api-specification)

Get the highscores of the top 100 players of the day.

### Request header

```
auth_token = 8dc19f14-01d4-4b20-8640-11dfef2e74d8
```

### Responses

#### ✅ Success _200_

```json
{
    "success": true,
    "highscores": [
        {
            "username": "player1",
            "score": 2500
        },
        {
            "username": "player2",
            "score": 1400
        }
    ],
    "playerHighscore": 500,
    "playerRank": 101
}
```

#### ❌ Error

```json
{
    "success": false,
    "message": "An error happend!",
    "error_id": "An error_id"
}
```

<table style="border: 1px solid white; border-collapse: collapse; width: 100%">
<thead>
    <th>error_id</th>
    <th>Description</th>
    <th>Status</th>
<thead>
    <tr>
        <td><i>auth_error</i></td>
        <td>The authentification token is invalid or outdated.</td>
        <td>401</td>
    </tr>
    <tr>
        <td><i>fatal_error</i></td>
        <td>An unhandled error. This should never happen. Please notify the backend team!</td>
        <td>500</td>
    </tr>
</table>

## ▶️GET **/highscores/week**

[Back to top](#api-specification)

Get the highscores of the top 100 players of the week.

### Request header

```
auth_token = 8dc19f14-01d4-4b20-8640-11dfef2e74d8
```

### Responses

#### ✅ Success _200_

```json
{
    "success": true,
    "highscores": [
        {
            "username": "player1",
            "score": 2500
        },
        {
            "username": "player2",
            "score": 1400
        }
    ],
    "playerHighscore": 500,
    "playerRank": 101
}
```

#### ❌ Error

```json
{
    "success": false,
    "message": "An error happend!",
    "error_id": "An error_id"
}
```

<table style="border: 1px solid white; border-collapse: collapse; width: 100%">
<thead>
    <th>error_id</th>
    <th>Description</th>
    <th>Status</th>
<thead>
    <tr>
        <td><i>auth_error</i></td>
        <td>The authentification token is invalid or outdated.</td>
        <td>401</td>
    </tr>
    <tr>
        <td><i>fatal_error</i></td>
        <td>An unhandled error. This should never happen. Please notify the backend team!</td>
        <td>500</td>
    </tr>
</table>

## ▶️GET **/highscores/month**

[Back to top](#api-specification)

Get the highscores of the top 100 players of the month.

### Request header

```
auth_token = 8dc19f14-01d4-4b20-8640-11dfef2e74d8
```

### Responses

#### ✅ Success _200_

```json
{
    "success": true,
    "highscores": [
        {
            "username": "player1",
            "score": 2500
        },
        {
            "username": "player2",
            "score": 1400
        }
    ],
    "playerHighscore": 500,
    "playerRank": 101
}
```

#### ❌ Error

```json
{
    "success": false,
    "message": "An error happend!",
    "error_id": "An error_id"
}
```

<table style="border: 1px solid white; border-collapse: collapse; width: 100%">
<thead>
    <th>error_id</th>
    <th>Description</th>
    <th>Status</th>
<thead>
    <tr>
        <td><i>auth_error</i></td>
        <td>The authentification token is invalid or outdated.</td>
        <td>401</td>
    </tr>
    <tr>
        <td><i>fatal_error</i></td>
        <td>An unhandled error. This should never happen. Please notify the backend team!</td>
        <td>500</td>
    </tr>
</table>

## ▶️GET **/player/trophy-count**

[Back to top](#api-specification)

Get the tophy count (monthly wins) of the logged in player.

### Request header

```
auth_token = 8dc19f14-01d4-4b20-8640-11dfef2e74d8
```

### Responses

#### ✅ Success _200_

```json
{
    "success": true,
    "count": 12
}
```

#### ❌ Error

```json
{
    "success": false,
    "message": "An error happend!",
    "error_id": "An error_id"
}
```

<table style="border: 1px solid white; border-collapse: collapse; width: 100%">
<thead>
    <th>error_id</th>
    <th>Description</th>
    <th>Status</th>
<thead>
    <tr>
        <td><i>auth_error</i></td>
        <td>The authentification token is invalid or outdated.</td>
        <td>401</td>
    </tr>
    <tr>
        <td><i>fatal_error</i></td>
        <td>An unhandled error. This should never happen. Please notify the backend team!</td>
        <td>500</td>
    </tr>
</table>

## ▶️GET **/questions/game-of-the-day**

[Back to top](#api-specification)

Get the questions of the game of the day.

### Request header

```
auth_token = 8dc19f14-01d4-4b20-8640-11dfef2e74d8
```

### Responses

#### ✅ Success _200_

```json
{
    "success": true,
    "questions": [
        {
            "id": 3,
            "question": {
                "en": "What percentage of the world is allergic to cats?",
                "de": "Wieviel Prozent der Menschheit hat eine Katzenallergie?",
            },
            "answers": [
                {
                    "en": "10%",
                    "de": "10%",
                },
                {
                    "en": "30%",
                    "de": "30%",
                },
                {
                    "en": "5%",
                    "de": "5%",
                },
                {
                    "en": "40%",
                    "de": "40%",
                }
            ],
            "category": "animals",
            "difficulty": 1000,
        },
        ...
    ]
}
```

#### ❌ Error

```json
{
    "success": false,
    "message": "An error happend!",
    "error_id": "An error_id"
}
```

<table style="border: 1px solid white; border-collapse: collapse; width: 100%">
<thead>
    <th>error_id</th>
    <th>Description</th>
    <th>Status</th>
<thead>
    <tr>
        <td><i>auth_error</i></td>
        <td>The authentification token is invalid or outdated.</td>
        <td>401</td>
    </tr>
    <tr>
        <td><i>already_played_game_of_the_day_error</i></td>
        <td>The player already played the game of the day!</td>
        <td>400</td>
    </tr>
    <tr>
        <td><i>fatal_error</i></td>
        <td>An unhandled error. This should never happen. Please notify the backend team!</td>
        <td>500</td>
    </tr>
</table>

## ▶️GET **/questions/quick-game**

[Back to top](#api-specification)

Get the questions of the quick game.

### Request header

```
auth_token = 8dc19f14-01d4-4b20-8640-11dfef2e74d8
```

### Responses

#### ✅ Success _200_

```json
{
    "success": true,
    "questions": [
        {
            "id": 3,
            "question": {
                "en": "What percentage of the world is allergic to cats?",
                "de": "Wieviel Prozent der Menschheit hat eine Katzenallergie?",
            },
            "answers": [
                {
                    "en": "10%",
                    "de": "10%",
                },
                {
                    "en": "30%",
                    "de": "30%",
                },
                {
                    "en": "5%",
                    "de": "5%",
                },
                {
                    "en": "40%",
                    "de": "40%",
                }
            ],
            "category": "animals",
            "difficulty": 1000,
        },
        ...
    ]
}
```

#### ❌ Error

```json
{
    "success": false,
    "message": "An error happend!",
    "error_id": "An error_id"
}
```

<table style="border: 1px solid white; border-collapse: collapse; width: 100%">
<thead>
    <th>error_id</th>
    <th>Description</th>
    <th>Status</th>
<thead>
    <tr>
        <td><i>auth_error</i></td>
        <td>The authentification token is invalid or outdated.</td>
        <td>401</td>
    </tr>
    <tr>
        <td><i>fatal_error</i></td>
        <td>An unhandled error. This should never happen. Please notify the backend team!</td>
        <td>500</td>
    </tr>
</table>

## ▶️GET **/questions/latest-show**

[Back to top](#api-specification)

Get the questions of the latest show.

### Request header

```
auth_token = 8dc19f14-01d4-4b20-8640-11dfef2e74d8
```

### Responses

#### ✅ Success _200_

```json
{
    "success": true,
    "questions": [
        {
            "id": 3,
            "question": {
                "en": "What percentage of the world is allergic to cats?",
                "de": "Wieviel Prozent der Menschheit hat eine Katzenallergie?",
            },
            "answers": [
                {
                    "en": "10%",
                    "de": "10%",
                },
                {
                    "en": "30%",
                    "de": "30%",
                },
                {
                    "en": "5%",
                    "de": "5%",
                },
                {
                    "en": "40%",
                    "de": "40%",
                }
            ],
            "category": "animals",
            "difficulty": 1000,
        },
        ...
    ]
}
```

#### ❌ Error

```json
{
    "success": false,
    "message": "An error happend!",
    "error_id": "An error_id"
}
```

<table style="border: 1px solid white; border-collapse: collapse; width: 100%">
<thead>
    <th>error_id</th>
    <th>Description</th>
    <th>Status</th>
<thead>
    <tr>
        <td><i>auth_error</i></td>
        <td>The authentification token is invalid or outdated.</td>
        <td>401</td>
    </tr>
    <tr>
        <td><i>fatal_error</i></td>
        <td>An unhandled error. This should never happen. Please notify the backend team!</td>
        <td>500</td>
    </tr>
</table>

## ▶️GET **/questions/train?category1&category2&...**

[Back to top](#api-specification)

Get random questions for training. Categories are selected via query parameters.

### Request header

```
auth_token = 8dc19f14-01d4-4b20-8640-11dfef2e74d8
```

### Responses

#### ✅ Success _200_

```json
{
    "success": true,
    "questions": [
        {
            "id": 3,
            "question": {
                "en": "What percentage of the world is allergic to cats?",
                "de": "Wieviel Prozent der Menschheit hat eine Katzenallergie?",
            },
            "answers": [
                {
                    "en": "10%",
                    "de": "10%",
                },
                {
                    "en": "30%",
                    "de": "30%",
                },
                {
                    "en": "5%",
                    "de": "5%",
                },
                {
                    "en": "40%",
                    "de": "40%",
                }
            ],
            "category": "animals",
            "difficulty": 1000,
        },
        ...
    ]
}
```

#### ❌ Error

```json
{
    "success": false,
    "message": "An error happend!",
    "error_id": "An error_id"
}
```

<table style="border: 1px solid white; border-collapse: collapse; width: 100%">
<thead>
    <th>error_id</th>
    <th>Description</th>
    <th>Status</th>
<thead>
    <tr>
        <td><i>auth_error</i></td>
        <td>The authentification token is invalid or outdated.</td>
        <td>401</td>
    </tr>
    <tr>
        <td><i>fatal_error</i></td>
        <td>An unhandled error. This should never happen. Please notify the backend team!</td>
        <td>500</td>
    </tr>
</table>

# Tokens

[Back to top](#api-specification)

When a user logs in or signs up successfully, the backend responds with an `auth_token`. This is a unique id (e.g. `5182f2ae-ccec-44e6-852b-648e7f803b2d`) that identifies the current session. Many routes require this token. It has to be sent via the `auth_token` header property.

The same principle is applied on resetting a user's password. If the user answers the security questions correctly, the backend responds with an `reset_password_token`. The `/user/reset-password` route requires this token.
