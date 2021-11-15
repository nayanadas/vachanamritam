const mysql = require("mysql");

const getConn = () => {
  const con = mysql.createConnection({
    host:"localhost",
    user:"root",
    password: "amma123"
  });  
  return con;
} 

const sqlCall = (con, sql, endConnFlag=true) => {
  const pro = new Promise((resolv, reject) => {
      con.query(sql, (err, result) => {
        if (err) {
          console.log("error is " + err);
          //if(endConnFlag) {
          con.end();
          //}
          reject(err);
        } else {
          //console.log("Result: " + JSON.stringify(result));
          console.log("Result is ");
          //if(endConnFlag) {
          con.end();
          //}
          resolv(JSON.stringify(result));
        }
      });
      //con.end();  
    });
  return pro;
}


module.exports = {
	getConn: getConn,
  sqlCall: sqlCall
}

