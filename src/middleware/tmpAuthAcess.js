const { User } = require("../models");
const { sequelize } = require("../models/index");

module.exports = (word) => { 
  
  
  return async function (req, res, next) {

    console.log('aq??')

    const { id } = req.user;
    const text = req.originalUrl
    const index = text.indexOf(word);   
    const length = word.length;	
    const result = text.slice(index + length + 1).split('/')[0];
    
    if (id.toString() !== result) return res.status(401).json({error: "You don't have access to that file"})

    next()

  }
}

