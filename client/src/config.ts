// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'z5lp5m42s8'
//export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`
export const apiEndpoint = `http://localhost:5000/dev`
export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-1exuf192.us.auth0.com',            // Auth0 domain
  clientId: 'cHzBwTh6l0qZsxFcWWuNm8W97w0EB7du',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
