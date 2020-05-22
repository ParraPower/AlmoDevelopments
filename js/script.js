$(function () {
	"use strict";
	
	var sect = $(window.location.hash);
	
	if(sect.length == 1){
		$('.section.active').removeClass('active');
		sect.addClass('active');
		if( sect.hasClass('border-d') ){
			$('body').addClass('border-dark');
		}
	}


	function generatePortfolio(data) {

		var template =
			`<li data-groups='{0}'>
			<div class='inner' >
				<img src='img/portfolio/{1}' alt>

				<div class='overlay'>
					<a href='#popup-{2}' class='view-project'>
						View Project
					</a>

					<!--project popup-->
					<div id='popup-{3}' class='popup-box zoom-anim-dialog mfp-hide'>
						<figure>

							<!--project popup image-->
							<img src='img/portfolio/{4}' alt>
												
						</figure>
						<div class='content' >

							<!--project popup title-->
							<h4>{5}</h4>

							<!--project popup description-->
							<p>{6}</p>

						</div>
												
					</div>

				</div>

			</div>
		</li>`;

		var groupsText = '["' + data.Type.toString().toLowerCase() + '"]';
		
		var str =
			template
				.replace('{0}', groupsText)
				.replace('{1}', data.Thumbnail)
				.replace('{2}', data.Id)
				.replace('{3}', data.Id)
				.replace('{4}', data.Images[0])
				.replace('{5}', data.Name)
				.replace('{6}', data.Description);

		return str;
    }


	$(window).on('load', function(){
		$('body').addClass('loaded');
		
		/*=========================================================================
			Portfolio Grid
		=========================================================================*/
		$.ajax({
			url: './data/portfolio.json',
			type: 'GET',
			success: function (data) {
				var portfolio = $('.portfolio-items');

				for (var i in data) {
					var d = data[i];
					portfolio.append(
						generatePortfolio(d)
					);
				}

				/*=========================================================================
					Magnific Popup (Project Popup initialization)
				=========================================================================*/
				$('.view-project').magnificPopup({
					type: 'inline',
					fixedContentPos: false,
					fixedBgPos: true,
					overflowY: 'auto',
					closeBtnInside: true,
					preloader: false,
					midClick: true,
					removalDelay: 300,
					mainClass: 'my-mfp-zoom-in'
				});

				portfolio.shuffle();
				$('.portfolio-filters > li > a').on('click', function (e) {
					e.preventDefault();
					var groupName = $(this).attr('data-group');
					$('.portfolio-filters > li > a').removeClass('active');
					$(this).addClass('active');
					portfolio.shuffle('shuffle', groupName);
				});
			}
		});
	});
	
	/*=========================================================================
		Navigation Functions
	=========================================================================*/
	$('.section-toggle').on('click', function(){
		var $this = $(this),
			sect = $( '#' + $this.data('section') ),
			current_sect = $('.section.active');
		if(sect.length == 1){
			if( sect.hasClass('active') == false && $('body').hasClass('section-switching') == false ){
				$('body').addClass('section-switching');
				if( sect.index() < current_sect.index() ){
					$('body').addClass('up');
				}else{
					$('body').addClass('down');
				}
				setTimeout(function(){
					$('body').removeClass('section-switching up down');			
				}, 2500);
				setTimeout(function(){
					current_sect.removeClass('active');
					sect.addClass('active');
				}, 1250);
				if( sect.hasClass('border-d') ){
					$('body').addClass('border-dark');
				}else{
					$('body').removeClass('border-dark');
				}
			}
		}
	});
	
	
	/*=========================================================================
		Testimonials Slider
	=========================================================================*/
	$('.testimonials-slider').owlCarousel({
		items: 2,
		responsive:{
			992: {
				items: 2
			},
			0: {
				items: 1
			}
		}
	});
	
	
	
	
	
	/*=========================================================================
		Contact Form
	=========================================================================*/
	function isJSON(val){
		var str = val.replace(/\\./g, '@').replace(/"[^"\\\n\r]*"/g, '');
		return (/^[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]*$/).test(str);
	}
	$('#contact-form').validator().on('submit', function (e) {
		
		if (!e.isDefaultPrevented()) {
			// If there is no any error in validation then send the message
			
			e.preventDefault();
			var $this = $(this),
				
				//You can edit alerts here
				alerts = {
				
					success: 
					"<div class='form-group' >\
						<div class='alert alert-success' role='alert'> \
							<strong>Message Sent!</strong> We'll be in touch as soon as possible\
						</div>\
					</div>",
					
					
					error: 
					"<div class='form-group' >\
						<div class='alert alert-danger' role='alert'> \
							<strong>Oops!</strong> Sorry, an error occurred. Try again.\
						</div>\
					</div>"
					
				};
			
			$.ajax({
			
				url: 'mail.php',
				type: 'post',
				data: $this.serialize(),
				success: function(data){
					
					if( isJSON(data) ){
						
						data = $.parseJSON(data);
						
						if(data['error'] == false){
							
							$('#contact-form-result').html(alerts.success);
							
							$('#contact-form').trigger('reset');
							
						}else{
							
							$('#contact-form-result').html(
							"<div class='form-group' >\
								<div class='alert alert-danger alert-dismissible' role='alert'> \
									<button type='button' class='close' data-dismiss='alert' aria-label='Close' > \
										<i class='ion-ios-close-empty' ></i> \
									</button> \
									"+ data['error'] +"\
								</div>\
							</div>"
							);
							
						}
						
						
					}else{
						$('#contact-form-result').html(alerts.error);
					}
					
				},
				error: function(){
					$('#contact-form-result').html(alerts.error);
				}
			});
		}
	});
	
	
	
});