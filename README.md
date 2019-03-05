## Fundamentals

This Javascript implementation uses Mocha, Chai, and supports ES6.

```
npm install
npm test 

npm run test:watch
```


Creating a run config in IDEA:

Under Run/Debug Configurations, add a Mocha test. Name it.

User interface: BDD

Extra Mocha options: --require @babel/register --require @babel/polyfill --watch --reporter min

Test directory: point to the src directory and include subdirectories.
