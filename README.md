# FALCON

Backend REST APIs build on NODE JS

## Getting Started

These instructions will get your project up and running on your local machine for development and testing purposes.

### Prerequisites

- NODE JS - 12.16 version
- NODEMON - 1.18 (For development only, not required for production)

To install NODEMON

```
sudo npm install nodemon -g
```

### Installing

A step by step series of examples that tell you how to get a development env running (run following commands within the project directory)

1. Install Dependencies

    ```
    npm install
    ```

2. Create a copy of **.env.example** with name **.env**

    ```
    cp .env.example ./.env
    ```

3. Open **.env** and change the config according to your system

4. To start the project - for development

    ```
    npm run start-dev
    ```

    To start the project - for production

    ```
    npm start
    ```