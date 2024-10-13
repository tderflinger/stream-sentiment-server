# Stream-sentiment-server

Tutorial:

# Pre-requisites
- Make sure you have Node.js (version 18 or later) installed on your machine.

## Build instructions
- Clone this repository and `cd` into it.
- Run `npm i` or `yarn` to install the dependencies for the server.
- See tutorial for notes on how to get the required credentials from Stream and
    Amazon AWS.
- Rename the `.env.example` file to `.env` and update it with your Stream and AWS credentials.
- Run `node server.mjs` from within the project root to start the Node server on port 5500.

## Built With
- [Amazon Comprehend](https://aws.amazon.com/comprehend/) - Sentiment detection
    features
- [Stream Chat](https://getstream.io/chat/) - Chat features

## Licence
- [MIT](https://opensource.org/licenses/MIT)
