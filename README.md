# Run app

    npm i - npm run start

# API Examples

## Create new user:

    curl -X POST 'http://localhost:7000/users' -d 'email=test@test.test&password=12345678'

##### Response:

    {"result":"created","jwt":"MY_TOKEN"}

##### Response:

    {"result":"updated"}

## Get token (sign in):

    curl 'http://localhost:7000/user_token' -X POST -d '{"auth":{"email":"test@test.test","password":"12345678"}}' -H 'Content-Type: application/json'

##### Response:

    {"jwt":"NEW_MY_TOKEN"}

## Call for recent candles (offset: 'h' for hours, 'd' for days, 'w' for weeks, for example, 2d = 2 days, 8h = 8 hours):

    curl 'http://localhost:7000/candles?symbol=btc&offset=2d' -H 'Authorization: Bearer TOKEN'

##### Result:

    {"result":[{"mts":1512643020000,"sell":14460.0,"purchase":14315.4},{"mts":1512642420000,"sell":14457.0,"purchase":14312.43},...]}

## User purchases btc:

    curl 'http://localhost:7000/stock/exchange?symbol=btc&operation=purchase&sum=1' -H 'Authorization: Bearer TOKEN'

##### Result:

    {"result":"changed","usd":1650.7340000000004,"btc":1.0,"eth":0.0}

## User sells btc:

    curl 'http://localhost:7000/stock/exchange?symbol=btc&operation=sell&sum=1' -H 'Authorization: Bearer TOKEN'

##### Result:

    {"result":"changed","usd":9834.668,"btc":0.0,"eth":0.0}

## Get user's info

    curl 'http://localhost:7000/users/me' -H 'Authorization: Bearer TOKEN'

##### Result:

    {"result":{"id":1,"email":"test@test.test","name":null,"surname":null}}

## Get user's wallet info

    curl 'http://localhost:7000/users/wallet' -H 'Authorization: Bearer TOKEN'

##### Result:

    {"result":{"usd":99794679.325,"btc":3.0,"eth":0.0}}
