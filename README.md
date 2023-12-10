
![Logo](https://raw.githubusercontent.com/ananduremanan/Demo/main/New%20Proposed%20Design%20Track.png)


# Expenso API

Expenso is a mobile app aim to track daily expenses and produce an insight on someone’s expense behavior. Expenso provides a rich graphic representation of user’s expense behavior using graphs and charts.


## Run Locally

Clone the project

```bash
  git clone git@github.com:Nada-Inc/EXPENSO-API.git
```

Go to the project directory

```bash
  cd EXPENSO_API
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```


## API Reference

#### Get all items

```http
  GET /api/items
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `api_key` | `string` | **Required**. Your API key |

#### Get item

```http
  GET /api/items/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of item to fetch |



## Authors

- [@vishnu-a-b](https://github.com/vishnu-a-b)
- [@anandhuremanan](https://github.com/ananduremanan)

