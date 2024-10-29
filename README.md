# IRCTC Railway Management API
IRCTC Railway Management API built using Node.js, Express.js, and MySQL. This API allows users to register, login, check train seat availability, and book seats

Provide Postman Collection of APIs

## Technologies Used
- **Node.js**: JavaScript runtime for building the server.
- **Express.js**: Web framework for Node.js.
- **MySQL**: Relational database for storing data.
- **JWT (JSON Web Tokens)**: For authentication.
- **dotenv**: For managing environment variables.

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/railway-management-system.git
   cd railway-management-system
   ```

2. **Install Dependencies**
   Make sure you have Node.js installed, then run:
   ```bash
   npm install
   ```

3. **Set Up MySQL Database**
   - Create a new database in MySQL (e.g., `railway_management`).
   - Run the SQL scripts in the `database/` folder (if provided) to create tables.

4. **Create a `.env` File**
   Copy the `.env.example` file to `.env` and fill in the required variables:
   ```plaintext
   PORT=5000
   DB_HOST=localhost
   DB_USER=your_db_user
   DB_PASS=your_db_password
   DB_NAME=railway_management
   JWT_SECRET=your_jwt_secret
   ADMIN_API_KEY=your_admin_api_key
   ```

5. **Run the Server**
   ```bash
   npm start
   ```

6. **Access the API**
   The API will be running at `http://localhost:5000`.


## Database Structure

The database consists of the following tables:

### 1. `users`
| Column        | Type         | Description                     |
|---------------|--------------|---------------------------------|
| id            | INT          | Primary Key, Auto Increment    |
| username      | VARCHAR(50)  | Unique username for the user   |
| password      | VARCHAR(255) | Hashed password                 |
| role          | ENUM         | User role (`admin`, `user`)    |

### 2. `trains`
| Column          | Type         | Description                       |
|-----------------|--------------|-----------------------------------|
| id              | INT          | Primary Key, Auto Increment      |
| train_name      | VARCHAR(100) | Name of the train                |
| available_seats | INT          | Number of available seats        |
| source          | VARCHAR(100) | Source station                   |
| destination     | VARCHAR(100) | Destination station              |

### 3. `bookings`
| Column          | Type         | Description                          |
|-----------------|--------------|--------------------------------------|
| id              | INT          | Primary Key, Auto Increment         |
| user_id         | INT          | Foreign Key referencing `users`    |
| train_id        | INT          | Foreign Key referencing `trains`   |
| booking_date    | DATE         | Date of booking                     |
| seats_booked    | INT          | Number of seats booked              |
| status          | ENUM         | Booking status (`confirmed`, `cancelled`) |


## Routes

### User Authentication
- **Register a User**
  - **POST** `/api/register`
  - Request Body: `{ "username": "user", "password": "password" }`

- **Login User**
  - **POST** `/api/login`
  - Request Body: `{ "username": "user", "password": "password" }`
  - Response: `{ "token": "your_jwt_token" }`

### Train Management
- **Add a New Train**
  - **POST** `/api/admin/add-train`
  - Request Body: `{ "train_name": "Train Name", "available_seats": 100, "source": "Source", "destination": "Destination" }`
  - **Authorization**: Requires Admin API Key and JWT Token.

- **Get All Trains Details**
  - **GET** `/api/trains/details`
  - **Authorization**: Requires JWT Token.

- **Get Seat Availability**
  - **GET** `/api/trains`
  - Query Parameters: `source`, `destination`

### Booking Management
- **Book a Seat**
  - **POST** `/api/bookings`
  - Request Body: `{ "train_id": 1, "seats_booked": 2 }`
  - **Authorization**: Requires JWT Token.

- **Get Specific Booking Details**
  - **GET** `/api/bookings/:id`
  - **Authorization**: Requires JWT Token.


## Usage Examples

### Get All Trains
```bash
curl -X GET http://localhost:5000/api/trains/details   -H "Authorization: your_actual_jwt_token"
```

### Book a Seat
```bash
curl -X POST http://localhost:5000/api/bookings   -H "Authorization: your_actual_jwt_token"   -H "Content-Type: application/json"   -d '{"train_id": 1, "seats_booked": 2}'
```

### Get Specific Booking Details
```bash
curl -X GET http://localhost:5000/api/bookings/1   -H "Authorization: your_actual_jwt_token"
```


## Environment Variables
- `PORT`: Port for the server to run.
- `DB_HOST`: Hostname of your MySQL database.
- `DB_USER`: MySQL username.
- `DB_PASS`: MySQL password.
- `DB_NAME`: Name of your database.
- `JWT_SECRET`: Secret key for JWT signing.
- `ADMIN_API_KEY`: API key for admin access.

