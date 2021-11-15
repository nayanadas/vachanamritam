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
To list the products in the cart added by customer
*/		
		var cartproducts = "";
		if(sessionStorage.cartproducts!=null){
			cartproducts = JSON.parse(sessionStorage.cartproducts)
			console.log(JSON.stringify(cartproducts))
			var subtotal=0, total=0;
			if(cartproducts.length!=0){
				for(var i in cartproducts){
					$("#producttbody").append('<tr class="table-body-row"><td class="product-remove"><a href="javascript:void(0)" class="removeproduct" product-id="'+i+'"><i class="far fa-window-close"></i></a></td><td class="product-image"><img src="assets/img/products/'+cartproducts[i]["image"]+'" alt=""></td><td class="product-name">'+cartproducts[i]["name"]+'</td><td class="product-price">'+cartproducts[i]["price"]+'</td><td class="product-quantity"><input type="number" min="1" value="'+cartproducts[i]["quantity"]+'" class="prodquantity" product-id="'+i+'"></td><td class="product-total" id="prodtotal'+i+'">'+cartproducts[i]["quantity"]+'</td></tr>');
					var prodtotal = Number(cartproducts[i]["price"])*Number(cartproducts[i]["quantity"])
					subtotal+=prodtotal;
				}
				$("#subtotal").html("&#8377;"+subtotal);
				$("#total").html("&#8377;"+Number(subtotal+50));
			}
		}

		
/*
functionality to remove products from cart
*/		

		$('.removeproduct').click(function() {
			var productid=$(this).attr("product-id");
			cartproducts.splice(productid,1);
			sessionStorage.setItem("cartproducts", JSON.stringify(cartproducts));
			console.log(JSON.stringify(JSON.parse(sessionStorage.cartproducts)))
			location.reload();
		});

/*
functionality to increase & decrease the quantity of a product in cart
*/
		$(".prodquantity").bind('mouseup', function () { 
			var productid=$(this).attr("product-id");
		    if($(this).val() == undefined || $(this).val() == "")
		            return; /* Exit dont bother with handling this later, if its not needed leave. */

		    $(this).data('old-value', $(this).val());
		    $("#prodtotal"+productid).html($(this).data('old-value'));
		    cartproducts[productid]["quantity"]=$(this).data('old-value');
			sessionStorage.setItem("cartproducts", JSON.stringify(cartproducts));
			console.log(JSON.stringify(JSON.parse(sessionStorage.cartproducts)))

		});

/*
functionality to update cart with total amount
*/
		$('.updatecart').click(function() {
			var cartproducts = JSON.parse(sessionStorage.cartproducts)
			var subtotal=0, total=0;
			for(var i in cartproducts){
				var prodtotal = Number(cartproducts[i]["price"])*Number(cartproducts[i]["quantity"])
				subtotal+=prodtotal;
			}
			$("#subtotal").html(subtotal);
			$("#total").html(subtotal+50);
		});