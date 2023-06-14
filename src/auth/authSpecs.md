# Authentication Flow

## Old auth flow

1. Frontend:
   - `SignWallet.tsx`, when publicKey changes, a useEffect is called that calls `onClick()`
   - onClick() calls in BE /auth/connect with the following body:
     - `publicKey` (string)
     - signature (string)

2. Backend:
   - `/auth/connect` is called, which calls a service method
     - it receives a body with the following:
       - `wallet` (string), previously `publicKey`
       - `signature` (string)
   - that service:
     - first verifies the public key, decoded signature, and message, and returns a boolean
     - if falsy, return 401
     - if truthy
       - we fetch a user wallet with the payload.wallet(publicKey)
         - if we do not get a user back, we create one using that data from the payload and a generated name
         - if we do get a user back, we return an object that contains a JWT token with the signed payload.wallet

3. Frontend:
   - once the response is received, we dispatch a Redux action that sets the JWT token in the store
   - we call `processLogin()` with the JWT `token: string`
   - calls the backend with the token

4. Backend
   - `/users/session` is called with the JWT token as a bearer token header
   - calls the user service with the wallet of the currently logged in user if the guard passes
   - finds a user by the wallet
      - if no user is found, nothing happens because this is a terrible piece of software engineering
      - if user is found, return the user object with the wallet appended in the object

5. Frontend
   - fetches the user object from the backend
   - assigns a default clan
   - assigns a default user profile picture
   - dispatches a Redux action that sets the user object in the store, called wallet for some reason
   - emits an `auth` event with the JWT token as the payload

6. Backend


```mermaid
---
title: Old auth flow
---

sequenceDiagram
    Frontend->>AuthController: { publicKey: string, signature: string }
    Note over Frontend,AuthController: auth/connect
    activate AuthController
    AuthController->>AuthService: { wallet: string, signature: string }
    deactivate AuthController
    activate AuthService
    AuthService-->AuthService: throw 401 if body content checks fail
    AuthService-->UserRepository: find user by wallet (publicKey)
    deactivate AuthService
    activate UserRepository
    UserRepository-->UserRepository: create a new user if one is not found
    UserRepository->>AuthService: return user object
    deactivate UserRepository
    activate AuthService
    AuthService->>AuthController: return signed JWT token based on the wallet (publicKey)
    deactivate AuthService
    AuthController->>Frontend: return JWT token
    activate Frontend
    Frontend->>Frontend: dispatch Redux action to set JWT token in store
    Frontend->>UsersController: { token: string }
    Note over Frontend,UsersController: users/session
    deactivate Frontend
    activate UsersController
    UsersController->>UserService: { token: string }
    deactivate UsersController
    activate UserService
    UserService->>UserRepository: fetches a user by wallet (publicKey)
    deactivate UserService
    activate UserRepository
    UserRepository->>UserService: user object with a wallet property appended
    deactivate UserRepository
    UserService->>UsersController: user object with a wallet property appended
    activate UsersController
    UsersController->>Frontend: user object with a wallet property appended
    deactivate UsersController
    activate Frontend
    Frontend->>Frontend: dispatch LoggedIn action to set wallet in store
    Frontend-->Events: emit auth event with JWT token as payload
    deactivate Frontend
    activate Events
    Events-->Events: throw if JWT token is not not truthy
    Events-->Events: throw if decoded JWT token is not valid
    Events-->Frontend: dispatch multiwondow event
    deactivate Events
```