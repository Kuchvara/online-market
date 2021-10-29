$(document).ready(function () {
	$('.slider').slick({
		dots: true,
		autoplay: true,
		autoplaySpeed: 4000,
		arrows: false,
		fade: true,
		cssEase: 'linear',
		pauseOnDotsHover: true,
		zIndex: 0
  });
});

$(document).ready(function () {
	$('.similar-list').slick({
		infinite: true,
  	slidesToShow: 1,
		slidesToScroll: 1,
		speed: 600,
		dots: true,
  });
});