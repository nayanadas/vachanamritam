
const sqlCall = require("../config/mysql_common").sqlCall;
const getConn = require("../config/mysql_common").getConn;
const moment = require("moment");

//insert new order details to orders table
const insertNewOrderDetails = (email, products, response) => {
	  const connection = getConn();
      
      const sql = "INSERT INTO vachnamritam.orders (email, orderdatetime, quantity, price, pid) VALUES ?";
      var values = [];
      for(var i in products){
      	var val=[];
      	val.push(email);
      	val.push(new Date());//moment(Date.now()).format('DD-MM-YYYY HH:mm:ss')
      	val.push(products[i]["quantity"]);
      	val.push(products[i]["price"]);
      	val.push(products[i]["id"]);
      	values.push(val)
      }

      console.log(values);

      connection.query(sql, [values], function(err, rows){
      	//var resjson = JSON.parse(result);
      	if(rows.affectedRows>0){
      		response.send("success");
      	}
      	else{
      		response.send(rows);
      	}
        connection.end();
      });
}

//listing all existing orders of a particular customer using customer email
const listAllOrders = (email,res) => {
	const query = `SELECT orders.oid, orders.email, orders.quantity, orders.price, orders.orderdatetime, product.pname, product.pid, product.image_name FROM vachnamritam.orders, vachnamritam.product WHERE orders.pid=product.pid AND orders.email='${email}';`
  	console.log(`listAllOrders:query: ${query}`);

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
	insertNewOrderDetails
	,listAllOrders
};