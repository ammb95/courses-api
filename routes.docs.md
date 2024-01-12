## APP Routes

### Users Routes

#### 1. Create User

- **Method:** `POST`
- **Path:** `/users`
- **Description:** Creates a new user.
- **Request Body:**
  - `username` (string, required): The username of the user.
  - `password` (string, required): The password of the user.
  - `roles` (array of strings, required): The roles assigned to the user. Should be one or more of the following: "administrator," "manager," "consultant."
  - `department` (string, required): The department of the user. Should be one of the following: "sales," "marketing," "accounting."
- **Request Example:**

  ```json
  "body": {
    "username": "newUser",
    "password": "newUserPassword",
    "roles": ["manager"],
    "department": "sales"
  }
  ```

- **Response:**

  - Status Code: `201 Created`
  - Response Body:

    ```json
    {
      "user": {
        "id": "generatedUserId",
        "username": "newUser",
        "password": "hashedPassword",
        "roles": ["manager"],
        "department": "sales"
      }
    }
    ```

- **Errors:**
  - `409 Conflict`: If the username is already taken.
  - `422 Unprocessable Entity`: If the request body is invalid.

---

### Auth Routes

#### 1. Login

- **Method:** `POST`
- **Path:** `/auth/login`
- **Description:** Allows a user to log in and obtain an authentication token.
- **Request Body:**
  - `username` (string, required): The username of the user.
  - `password` (string, required): The password of the user.
- **Request Example:**

  ```http
  POST /auth/login
  ```

  ```json
  "body": {
    "username": "exampleUser",
    "password": "examplePassword"
  }
  ```

- **Response:**

  - Status Code: `200 OK`
  - Response Body:

    ```json
    {
      "token": "exampleAuthToken"
    }
    ```

- **Errors:**
  - `401 Unauthorized`: If the provided credentials are incorrect.
  - `422 Unprocessable Entity`: If the request body is invalid.

#### 2. Logout

- **Method:** `DELETE`
- **Path:** `/auth/logout`
- **Description:** Allows a user to log out and invalidate the authentication token.
- **Authorization Header:**
  - `Authorization` (string, required): The authentication token obtained during login.
- **Request Example:**

  ```http
  DELETE /auth/logout
  ```

  ```json
  "headers": { "Authorization": "Bearer exampleAuthToken" }
  ```

- **Response:**
  - Status Code: `204 No Content`
- **Errors:**
  - `401 Unauthorized`: If no token is provided in the Authorization header.

---

### Courses Routes

#### 1. Get All Courses

- **Method:** `GET`
- **Path:** `/courses`
- **Description:** Retrieves a list of all courses.
- **Authorization:**
  - Requires a valid authentication token.
  - Requires the user to have the roles "administrator" or "manager."
  - Requires the user to be in the department "marketing."
- **Request Example:**

  ```http
  GET /courses
  ```

  ```json
  "headers": { "Authorization": "Bearer exampleAuthToken" }
  ```

- **Response:**

  - Status Code: `200 OK`
  - Response Body:

    ```json
    {
      "courses": [
        {
          "id": "courseId1",
          "title": "Course Title",
          "topic": "Course Topic",
          "learningFormats": ["blended", "virtual"],
          "bestseller": true,
          "startDate": "2024-01-15"
        }
        // ... other courses
      ]
    }
    ```

- **Errors:**
  - `401 Unauthorized`: If the user is not authenticated.
  - `403 Forbidden`: If the user lacks the required roles/permissions.

#### 2. Get Course by ID

- **Method:** `GET`
- **Path:** `/courses/:id`
- **Description:** Retrieves details of a specific course by its ID.
- **Authorization:**
  - Requires a valid authentication token.
  - Requires the user to have the roles "administrator" or "manager."
  - Requires the user to be in the department "marketing."
- **Path Params:**
  - `id` (string, required): The ID of the course.
- **Request Example:**

  ```http
  GET /courses/${courseId}
  ```

  ```json
  "headers": { "Authorization": "Bearer exampleAuthToken" }
  ```

- **Response:**

  - Status Code: `200 OK`
  - Response Body:

    ```json
    {
      "course": {
        "id": "courseId",
        "title": "Course Title",
        "topic": "Course Topic",
        "learningFormats": ["blended", "virtual"],
        "bestseller": true,
        "startDate": "2024-01-15"
      }
    }
    ```

- **Errors:**
  - `401 Unauthorized`: If the user is not authenticated.
  - `403 Forbidden`: If the user lacks the required roles/permissions.
  - `404 Not Found`: If the course with the specified ID is not found.

#### 3. Create Course

- **Method:** `POST`
- **Path:** `/courses`
- **Description:** Creates a new course.
- **Authorization:**
  - Requires a valid authentication token.
  - Requires the user to have the roles "administrator" or "manager."
  - Requires the user to be in the department "marketing."
- **Request Body:**
  - `title` (string, required): The title of the course.
  - `topic` (string, required): The topic of the course.
  - `learningFormats` (array of strings, required): The learning formats of the course. Should be one or more of the following: "blended," "residential," "virtual," "self-study," "online."
  - `bestseller` (boolean, required): Indicates if the course is a bestseller.
  - `startDate` (string, required): The start date of the course in ISO date format.
- **Request Example:**

  ```http
  POST /courses
  ```

  ```json
  "headers": { "Authorization": "Bearer exampleAuthToken" }
  "body": {
    "title": "New Course",
    "topic": "Exciting Topic",
    "learningFormats": ["blended", "virtual"],
    "bestseller": true,
    "startDate": "2024-02-01"
  }
  ```

- **Response:**

  - Status Code: `201 Created`
  - Response Body:

    ```json
    {
      "course": {
        "id": "generatedCourseId",
        "title": "New Course",
        "topic": "Exciting Topic",
        "learningFormats": ["blended", "virtual"],
        "bestseller": true,
        "startDate": "2024-02-01"
      }
    }
    ```

- **Errors:**
  - `401 Unauthorized`: If the user is not authenticated.
  - `403 Forbidden`: If the user lacks the required roles/permissions.
  - `422 Unprocessable Entity`: If the request body is invalid.

#### 4. Edit Course

- **Method:** `PATCH`
- **Path:** `/courses/:id`
- **Description:** Edits an existing course by its ID.
- **Authorization:**
  - Requires a valid authentication token.
  - Requires the user to have the roles "administrator" or "manager."
  - Requires the user to be in the department "marketing."
- **Path Params:**
  - `id` (string, required): The ID of the course to be edited.
- **Request Body:**
  - `title` (string, optional): The updated title of the course.
  - `topic` (string, optional): The updated topic of the course.
  - `learningFormats` (array of strings, optional): The updated learning formats of the course. Should be one or more of the following: "blended," "residential," "virtual," "self-study," "online."
  - `bestseller` (boolean, optional): Indicates if the course is a bestseller.
  - `startDate` (string, optional): The updated start date of the course in ISO date format.
- **Request Example:**

  ```http
  PATCH /courses/${courseId}
  ```

  ```json
  "headers": { "Authorization": "Bearer exampleAuthToken" }
  "body": {
    "title": "Updated Course Title",
    "learningFormats": ["residential", "online"],
    "bestseller": false
  }
  ```

- **Response:**

  - Status Code: `200 OK`
  - Response Body:

    ```json
    {
      "course": {
        "id": "courseId",
        "title": "Updated Course Title",
        "topic": "Course Topic",
        "learningFormats": ["residential", "online"],
        "bestseller": false,
        "startDate": "2024-01-15"
      }
    }
    ```

- **Errors:**
  - `401 Unauthorized`: If the user is not authenticated.
  - `403 Forbidden`: If the user lacks the required roles/permissions.
  - `404 Not Found`: If the course with the specified ID is not found.
  - `422 Unprocessable Entity`: If the request body is invalid.

#### 5. Delete Course

- **Method:** `DELETE`
- **Path:** `/courses/:id`
- **Description:** Deletes an existing course by its ID.
- **Authorization:**
  - Requires a valid authentication token.
  - Requires the user to have the roles "administrator" or "manager."
  - Requires the user to be in the department "marketing."
- **Path Params:**
  - `id` (string, required): The ID of the course to be deleted.
- **Request Example:**

  ```http
  DELETE /courses/${courseId}
  ```

  ```json
  "headers": { "Authorization": "Bearer exampleAuthToken" }
  ```

- **Response:**
  - Status Code: `204 No Content`
- **Errors:**
  - `401 Unauthorized`: If the user is not authenticated.
  - `403 Forbidden`: If the user lacks the required roles/permissions.
  - `404 Not Found`: If the course with the specified ID is not found.
