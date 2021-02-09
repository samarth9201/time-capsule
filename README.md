# time-capsule

### Developing the application locally :

0. Pre-requisites:

        a. node : v12.x.x (preferred)
    
        b. yarn : v 1.22.0 (preferred over npm)
    
        c. npm :  v 6.x.x

1. Clone the repository

  ```
  > git clone https://github.com/samarth9201/music-stream-decentralized.git cd music-stream-decentralized
  ```
2. Install the dependency. In client directory,

    a. Using yarn :
    ```
    > yarn install
    ```
    
    b. Using npm : 
    ```
    > npm install
    > cd src
    > npm install
    
3. Start Ganache GUI. It should run on http://127.0.0.1:7545.
4. Import Ganache Accounts in Metamask.
5. Compile and migrate the contracts.

  ```
  > truffle compile
  > truffle migrate --reset
  ```
7. To Start the Backend:
    a. Change Directory to Backend.
    ```
    cd backend
    ```
    b. Install dependencies.
    ```
    yarn install
    ```
    c. Start the server
    ```
    yarn start
    ```
6. Start the development server to run the application.
  ```
  > yarn start
  ```
  ```
  > npm start
  ```

To test the contracts, run
```
> truffle test
```
