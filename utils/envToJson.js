require('dotenv').config();

const requiredEnvsByFrontend = ['PORTFOLIO_BACKEND_BASE_URL']
let allEnvs = process.env

let onlyRequiredEnvs = Object.keys(allEnvs)
  .filter(key => requiredEnvsByFrontend.includes(key))
  .reduce((obj, key) => {
    obj[key] = allEnvs[key];
    return obj;
  }, {});

onlyRequiredEnvs = JSON.stringify(onlyRequiredEnvs);

console.log(onlyRequiredEnvs);