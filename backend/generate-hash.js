const bcrypt = require("bcrypt");

bcrypt.hash("Gateway297", 10).then((hash)=>{
  console.log(hash);
});
