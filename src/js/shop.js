
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

		var cartproducts=[];

/*
functionality to list all prducts(books)
*/
		$.ajax({
            type:"GET",
            url:'/productlist',
            asyn:false,
            success:function(res){
                console.log("productlist: "+res);
                var products = JSON.parse(res);
                $(".product-lists").html("");
                for(var i in products){
                	var html = '';
                	html+='<div class="col-lg-3 col-md-6 text-center '+products[i]["category"]+'">';
					html+='<div class="single-product-item">';
					html+='<div class="product-image">';
					html+='<a href="javascript:void(0)"><img src="assets/img/products/'+products[i]["image_name"]+'" alt=""></a>';
					html+='</div>';
					html+='<h3>'+products[i]["pname"]+'</h3>';
					html+='<p class="product-price">&#8377;'+products[i]["price"]+'</p>';
					html+='<a href="javascript:void(0)" class="cart-btn addtocart" product-name="'+products[i]["pname"]+'" product-price="'+products[i]["price"]+'" product-image="'+products[i]["image_name"]+'" product-id="'+products[i]["pid"]+'"><i class="fas fa-shopping-cart"></i> Add to Cart</a>';
					html+='<a href="cart" class="cart-btn d-none book'+products[i]["pid"]+'" style="background-color: #94C973;" ><i class="fas fa-shopping-cart"></i> Go to Cart</a>';
					html+='</div>';
					html+='</div>';
					$(".product-lists").append(html);
                }

                // filter books according to category
		        $(".product-filters li").on('click', function () {
		            
		            $(".product-filters li").removeClass("active");
		            $(this).addClass("active");

		            var selector = $(this).attr('data-filter');

		            $(".product-lists").isotope({
		                filter: selector,
		            });
		            
		        });
		        
		        // isotop inner
		        $(".product-lists").isotope();

		        //add products to cart using session storage.
                $('.addtocart').click(function() {
                	
                	console.log(email)
                	if(email.length!=0){
                		var productname=$(this).attr("product-name");
						var productprice=$(this).attr("product-price");
						var productimage=$(this).attr("product-image");
						var productid=$(this).attr("product-id");
						var product ={
							"id":productid,
							"name":productname,
							"price":productprice,
							"image":productimage,
							"quantity":1
						}
						cartproducts.push(product);

						sessionStorage.setItem("cartproducts", JSON.stringify(cartproducts));
						console.log(JSON.stringify(JSON.parse(sessionStorage.cartproducts)))
						$(".book"+productid).removeClass("d-none");
						$(this).addClass("d-none");
                	}
					else{
						$('#loginModal').modal('show');
					}
				});
            }
        });