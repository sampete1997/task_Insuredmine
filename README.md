
# Policy Management API

## Note 
POSTMAN collection shared 
https://www.postman.com/red-satellite-980549/insuredmind/collection/irhy96v/task?action=share&creator=21127243

##  Setup Instructions

1. Install dependencies:

```
npm install
```

2. Start the server:
Using PM2 (recommended for production):
```
pm2 start server.js

```
OR 
directly with Node:
```
node server.js
```



##  API Endpoints

###  Upload File (Worker Thread Task)

**POST** `/api/upload`

Example cURL:
```
curl --location 'http://localhost:3000/api/upload' \
--form 'file=@"/C:/Users/aarta/Downloads/data_sheet_policy.csv"'
```



###  Search Policy by Username

**GET** `/api/policy/?username=<username>`

Example cURL:

```
curl --location 'http://localhost:3000/api/policy/?username=Sebastian%20Scarberry' \
--data ''
```



###  Aggregate Policy by User

**POST** `/api/aggregate_policy`

Payload (optional):

```json
{
    "user_id": "68c3b72cd32a5c8ec6f34604"
}
```

Example cURL:

```
curl --location 'http://localhost:3000/api/aggregate_policy' \
--header 'Content-Type: application/json' \
--data '{}'
```



###  Schedule Message Insertion

Triggered by cron when scheduled time matches.

**POST** `/api/schedule_message`

Payload example:

```json
{
    "user_id": "68c3b72cd32a5c8ec6f34604",
    "message": "test message",
    "day": "2025-09-12",
    "time": "23:58"
}
```

Example cURL:

```
curl --location 'http://localhost:3000/api/schedule_message' \
--header 'Content-Type: application/json' \
--data '{
    "user_id": "68c3b72cd32a5c8ec6f34604",
    "message": "test message",
    "day": "2025-09-12",
    "time": "23:58"
}'
```



## CPU Usage Monitoring

* Automatically tracks CPU usage when the server starts.
* If CPU usage exceeds **70%**, the server restarts automatically by below commnds:

```
  pm2 restart all
```



##  Added data in separate collection

* MongoDB is used to store:

  * Policy information
  * Scheduled messages
  * Metadata of uploaded files

### following tables

```
1) Agent - Agent Name

2) User - first name, DOB, address, phone number, state, zip code, email, gender, userType

3) User's Account - Account Name

4) Policy Category(LOB) - category_name

5) Policy Carrier - company_name

6) Policy Info -  policy number, policy start date, policy end date, policy category- collection id, company collection id, and user id.

```





