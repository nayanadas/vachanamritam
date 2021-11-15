
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