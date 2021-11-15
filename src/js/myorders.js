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
		
//functionality to list all existing orders based on customer email
		
		if(useremail.length!=0){
			$.ajax({
	            type:"GET",
	            url:'/orderlist?email='+useremail,
	            asyn:false,
	            success:function(res){
	                console.log("orderlist: "+res);
	                var orders = JSON.parse(res);
	                $(".product-lists").html("");
	                if(orders.length!=0){
						for(var i in orders){
							var prodtotal = Number(orders[i]["price"])*Number(orders[i]["quantity"])
							$("#orderproductlist").append('<tr class="table-body-row"><td class="product-remove"><a href="javascript:void(0)" class="removeproduct" product-id="'+i+'">'+moment(orders[i]["orderdatetime"]).format('DD-MM-YYYY HH:mm:ss')+'</a></td><td class="product-image"><img src="assets/img/products/'+orders[i]["image_name"]+'" alt=""></td><td class="product-name">'+orders[i]["pname"]+'</td><td class="product-price">'+orders[i]["price"]+'</td><td class="product-quantity">'+orders[i]["quantity"]+'</td><td class="product-total" id="prodtotal'+i+'">'+prodtotal+'</td></tr>');
							
						}
						
					}
	            }
	        });
		}