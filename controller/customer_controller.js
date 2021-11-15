
const sqlCall = require("../config/mysql_common").sqlCall;
const getConn = require("../config/mysql_common").getConn;

//insert new customer details to customer table
const insertNewCustomerDetails = (password, name, email, address, phno) => {
	const query = `INSERT INTO vachnamritam.customer (password, name, email, address, phno) ` +
          `VALUES ('${password}', '${name}', '${email}', '${address}', '${phno}');`;
  console.log(`insertNewCustomerDetails:query: ${query}`);
  const pro = sqlCall(getConn(), query);
    return pro;
}

//checking customer login using email & password
const getCustomerByEmailPassword = (email, password) => {
	const query = `SELECT * FROM vachnamritam.customer  where email='${email}' and password = '${password}';`
  	console.log(`getCustomerByEmailPassword:query: ${query}`);
	const pro = sqlCall(getConn(), query);
	return pro;
}

//checking customer data using id
const getCustomerById = (id) => {
  	const query = `SELECT * FROM vachnamritam.customer  where uid='${id}';`
  	console.log(`getCustomerById:query: ${query}`);
  	const pro = sqlCall(getConn(), query);
	return pro;
}

module.exports = {
	insertNewCustomerDetails
	, getCustomerByEmailPassword
	, getCustomerById
};