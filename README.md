# Getting Started
To get the Node server running locally:
  - Clone this repo
  - ```npm install``` to install all required dependencies
  -  MySQL : AWS RDS, MongoDB : AWS DynamoDB
  -  ```node web.js``` or ```pm2 start web.js``` 
# Code Overview
## Project Structure
```
app
 |  web.js               # App entry point
 |
 |- config (.gitignore)  # Set Environment variables
 |   |- caIdx.js          # Environment variables for Calling Public API
 |   |- mongodb.js        # Environment variables for Calling MongoDB (AWS DynamoDB)
 |   └─ index.js          # Environment variables for Calling MySQL (AWS RDS)
 |  
 |- api                  # Custom Functions
 |   |- caIdx.js          # Custom Functions for Public API
 |   |- mongodb.js        # Custom Functions for MongoDB (AWS DynamoDB)
 |   └─ mysql.js          # Custom Functions for MySQL (AWS RDS)
 |
 |- controllers          # All the Business logic
 |   |- api.js            # Get Cold and Asthma Index
 |   └─ user.js           # Sign up/Sign in, Store/Update/Send User Information
 |
 |- cron                 # Define tasks to be Repeated at Specific times
 |   └─ caIdx.js          # Update Cold and Asthma Index Every day
 |
 |- ml_disease           # Calculate the Incidence of Diseases
 |   └─ user.js           
 |
 └─ routes               # Express route controllers for all the endpoints of the app
    |- story.js           
    |- tutorial.js        
    └─ user.js           

```
## Dependencies
- [body-parser](https://github.com/expressjs/body-parser) - Middleware for Parsing incoming request bodies
- [date-utils](https://www.npmjs.com/package/date-utils) - To Represent Date usefully
- [dotenv](https://github.com/motdotla/dotenv) - For Loading environment variables from a .env
- [express](https://github.com/expressjs/express) - The server for handling and routing HTTP requests
- [mongoose](https://github.com/Automattic/mongoose) - For modeling and mapping MongoDB data to javascript
- [mysql2](https://www.npmjs.com/package/mysql2) - For modeling and mapping MySQL data to javascript
- [node-schedule](https://www.npmjs.com/package/node-schedule) - To schedule tasks to be executed at a specific time
- [python-shell](https://github.com/extrabacon/python-shell) - For Running Python scripts
