if(customer_name.length!=0){
			$("#profile_header").removeClass("d-none");
			$("#signin_header").addClass("d-none");
			$("#login_header").addClass("d-none");
			$("#customer_name_header").html("Hi, "+customer_name);
		}
		else{
			$("#profile_header").addClass("d-none");
			$("#signin_header").removeClass("d-none");
			$("#login_header").removeClass("d-none");
			$("#customer_name_header").html("");
		}

/*
To open up signup popup- sending registercustomer request to controller
*/
		$('.signup').click(function() {
			$('#signupform').parsley();
			console.log($('#signupform').parsley().validate());
			if($('#signupform').parsley().validate()){
				var json = {"name":$("#full_name").val(),"email":$("#email").val(),"address":$("#address").val(),"phno":$("#phno").val(), "password":$("#password").val()};
				$.ajax({
					url :'registercustomer',
					type:'POST',
					data:json,
					success:function(result){
						if(result=="success"){
							$('#signupModal').modal('hide');
							$('#regcustomermodal').modal('show');
						}
						else{
							$('#signupModal').modal('hide');
							$("#regmessage").html(result)
							$('#regcustomermodal').modal('show');
						}
					},
					error:function (xhr,status,error){
					 console.log('Error: ' + error.message);

					},
				});
			}

		});

/*
To list the products in the checkout added by customer with total amount
*/			
		var cartproducts = "";
		if(sessionStorage.cartproducts!=null){
			cartproducts = JSON.parse(sessionStorage.cartproducts)
			console.log(JSON.stringify(cartproducts))
			var subtotal=0, total=0;
			if(cartproducts.length!=0){
				for(var i in cartproducts){
					var prodtotal = Number(cartproducts[i]["price"])*Number(cartproducts[i]["quantity"])
					$("#producttbody").append('<tr><td>'+cartproducts[i]["name"]+'</td><td>'+prodtotal+'</td></tr>');
					
					subtotal+=prodtotal;
				}
				$("#subtotal").html("&#8377;"+subtotal);
				$("#total").html("&#8377;"+Number(subtotal+50));
			}
		}

		
/*
functionality to save new order details 
*/	
		$('.placeorder').click(function() {
			console.log(JSON.stringify(JSON.parse(sessionStorage.cartproducts)))

			var cartproducts = JSON.parse(sessionStorage.cartproducts)
			
				$.ajax({
					url :'placeorder?email='+email+"&products="+JSON.stringify(cartproducts),
					type:'POST',
					success:function(result){
						if(result=="success"){
							$("#producttbody").html("");
							$("#subtotal").html("");
							$("#total").html("");
							sessionStorage.clear();
							//sessionStorage.setItem("cartproducts", "");
							$('#placeordermodal').modal('show');
						}
						else{
							$('#placeordermodal').modal('show');
							$("#ordermessage").html(result)
						}
					},
					error:function (xhr,status,error){
					 console.log('Error: ' + error.message);

					},
				});
		});