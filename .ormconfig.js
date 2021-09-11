const SnakeNamingStrategy = require('typeorm-naming-strategies')
.SnakeNamingStrategy;  
module.exports = {     
	"type": "postgres",     
    "host": "localhost",     
    "port": 5432,     
    "username": "test",     
    "password": "test",      
    namingStrategy: new SnakeNamingStrategy(), 
}
