# @log-rush/client

A log-rush client for javascript (browser + nodejs).

## Installation

`yarn add @log-rush/client`
or
`npm i  @log-rush/client`

## Usage

### Using the LogRushClient
```ts
// 1. create a client
const client = new LogRushClient({
  dataSourceUrl: 'http://<my-domain>/', //! Note: a trailing slash is needed
  batchSize: MAX_BUFFER_SIZE
});

// 2. create a stream
const stream = await client.createStream('zwoo-frontend');
// or const stream = await client.resumeStream('zwoo-frontend', 'id', 'key'); for resuming streams

// 3. log!
stream.log('my awesome log')

// x. clean up
await client.disconnect()
```

### Using the LogRushStream direct
```ts

// 1. instantiate the stream
const stream = createLogStream(
  {
    dataSourceUrl: 'http://<my-domain>/', //! Note: a trailing slash is needed
    batchSize: MAX_BUFFER_SIZE
  },
  'my-log-stream',
  'my-id', // optional
  'my-key', // optional
)
// or const stream = new LogRushStream({...}, 'name', 'id', 'key')

// 2. register the log stream on the data source
await stream.register()

// 3. log!
stream.log('my awesome log')

// 4. clean up
await stream.destroy(true) // passing true as argument will force send all remaining logs
```
