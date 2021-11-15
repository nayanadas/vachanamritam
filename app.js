const express = require("express");
const path = require("path");

var engines = require('consolidate');
var urlparser = require('url'); 

const app = express();
const SERVER_PORT = 3002;
var request = require('request')

const customerController = require("./controller/customer_controller.js");
const productController = require("./controller/product_controller.js");
const orderController = require("./controller/order_controller.js");
const getConn = require("./config/mysql_common").getConn;

app.use(express.static(path.join(__dirname+"/src")));

//setting view file type as HTML
app.engine('html', engines.mustache);
app.set('view engine', 'html');


//For passport for user authentication
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
var bodyParser = require('body-parser');
//For passport 1 - end

var sess  = require('express-session');

//memory session
var MemoryStore = require('memorystore')(sess)

  app.use(sess({ 
    key: 'user_sid',
    secret: 'keyboardcat', 
    store: new MemoryStore(),
    resave: true,
    rolling: true,
    saveUninitialized: false,
    cookie: {  expires: 600000 }
  }))
 var cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());
app.use(passport.session());

//login authentication
passport.use('local', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true //passback entire req to call back
} , (request, username, password, done) => {
      console.log(username+' = '+ password);
      if(!username || !password ) { return done(null, false, request.flash('message','All fields are required.')); }

      customerController.getCustomerByEmailPassword(username, password)
      .then((rows) => {
        console.log(`result: `+rows);
        rows = JSON.parse(rows);
        if(!rows.length){ return done(null, false);}
        request.session.user = rows[0];
        return done(null, rows[0]);
      })
      .catch((error) => {
        done(request.flash('message', error));
      })
    }
));

//to persist user data into session
passport.serializeUser((user, done) => {
    done(null, user.uid);
});

//to retrieve user data from session.
passport.deserializeUser((id, done) => {
  customerController.getCustomerById(id)
    .then((rows) => {
      console.log(`deserializeUser: `+rows);
      rows = JSON.parse(rows);
        if(rows && rows.length > 0) {
          // done(err, rows[0]);
          done(null, rows[0])
        }
    })
    .catch((error) => {
      console.log(error);
    })
});

//to check the request is authenticated
const isAuthenticated = (request, response, next) => {
  console.log("in authenticated");
  if(request.isAuthenticated()) {
    return next();
  } else {
    response.redirect("/");
  }
}

app.use(function(req, res, next) {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});

app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid');        
    }
    next();
});

app.get("/",(request, response, next) => {  //isAuthenticated
  console.log('inside get request...')
  response.redirect('/home');
})

//to view home page
app.get("/home", (request, response, next) => {
	if(request.session.user!= null){
		response.render("home.html", { name: request.session.user.name,  email:request.session.user.email, address:request.session.user.address, phno: request.session.user.phno});
	}
  	else{
  		response.render("home.html");
  	}
});

//Redirect view after login 
app.post('/login',
  passport.authenticate('local',{
                                  successRedirect: '/success',
                                  failureRedirect: '/home'}
                        )

);

//functionalities in logout 
app.get('/logout', (request, response) => {
	//Make last entry inactive
    request.session = null;
    response.clearCookie('user_sid');
   	response.redirect('back');
  	request.logout();
    response.redirect('/home');
});

//After sucessfull login
app.get("/success", isAuthenticated, (request, response, next) => {
  response.redirect("/home"); 
});

//to view shop page
app.get("/shop", (request, response, next) => {
	if(request.session.user!= null){
		response.render("shop.html", { name: request.session.user.name,  email:request.session.user.email, address:request.session.user.address, phno: request.session.user.phno});
	}
  	else{
  		response.render("shop.html", { name: "",  email:"", address:"", phno: ""});
  	}
});

//to view checkout page
app.get("/checkout", (request, response, next) => {
	if(request.session.user!= null){
		response.render("checkout.html", { name: request.session.user.name,  email:request.session.user.email, address:request.session.user.address, phno: request.session.user.phno});
	}
  	else{
  		response.render("checkout.html");
  	}
});

//to view cart page
app.get("/cart", (request, response, next) => {
	if(request.session.user!= null){
		response.render("cart.html", { name: request.session.user.name,  email:request.session.user.email, address:request.session.user.address, phno: request.session.user.phno});
	}
  	else{
  		response.render("cart.html");
  	}
});

//to view myorders page
app.get("/myorders", (request, response, next) => {
	if(request.session.user!= null){
		response.render("myorders.html", { name: request.session.user.name,  email:request.session.user.email, address:request.session.user.address, phno: request.session.user.phno});
	}
  	else{
  		response.render("myorders.html");
  	}
});

//Functionalities to save new cutomer details to DB
app.post("/registercustomer",function(request,response){
  
    const name = request.body.name;
    const password= request.body.password;
    const email= request.body.email;
    const address= request.body.address;
    const phno= request.body.phno;

	customerController.insertNewCustomerDetails(password, name, email, address, phno)
      .then((result) => {
      	console.log("=========")
      	console.log(result)
      	var resjson = JSON.parse(result);
      	if(resjson.affectedRows==1){
      		response.send("success");
      	}
      	else{
      		response.send(result);
      	}
    })
    .catch((error) => {
        done(request.flash('message', error));
    })
    
 });

//Functionalities to list all products(books) in shop page
app.get("/productlist", (req, res, next) => {
	console.log("inside productlist")
	productController.listAllProducts(res);
});

//Functionalities to save new order details to DB
app.post("/placeorder", function(request,response){
    const email= request.query.email;
    const products= JSON.parse(request.query.products);

    console.log(JSON.stringify(products))
	  orderController.insertNewOrderDetails(email, products, response)
});

//Functionalities to list all existing orders in myorders page
app.get("/orderlist", (req, res, next) => {
	console.log("inside orderlist")
	const email= req.query.email;
	orderController.listAllOrders(email,res);
    //console.log(list)  
});

app.listen(SERVER_PORT, () => {
    console.log(`server listening port ${SERVER_PORT}`);
});
