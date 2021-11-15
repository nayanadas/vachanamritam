
const sqlCall = require("../config/mysql_common").sqlCall;
const getConn = require("../config/mysql_common").getConn;

//listing all products(books)
const listAllProducts = (res) => {
	const query = `SELECT * FROM vachnamritam.product;`
  	console.log(`listAllProducts:query: ${query}`);

  	const pro = sqlCall(getConn(), query);

	pro.then((rows)=>{
		console.log(rows);
		res.send(rows);
	}, (error)=>{
		console.log(error);
		res.send(error);
	})
	
}

module.exports = {
	listAllProducts
};