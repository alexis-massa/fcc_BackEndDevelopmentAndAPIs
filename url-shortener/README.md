# 💻 Project : URL Shortener Microservice

Build a full stack JavaScript app that is functionally similar to this: https://url-shortener-microservice.freecodecamp.rocks. 

## Task List
- [x] You can POST a URL to `/api/shorturl` and get a JSON response with `original_url` and `short_url` properties. Here's an example: `{ original_url : 'https://freeCodeCamp.org', short_url : 1}`
- [x] When you visit `/api/shorturl/<short_url>`, you will be redirected to the original URL.
- [x] If you pass an invalid URL that doesn't follow the valid `http://www.example.com` format, the JSON response will contain `{ error: 'invalid url' }`