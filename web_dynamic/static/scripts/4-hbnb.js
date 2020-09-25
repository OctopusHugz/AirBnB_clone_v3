const $ = window.$;
const amenityDict = {};
$(document).ready(function () {
    $.getJSON('http://0.0.0.0:5001/api/v1/status/', function (data) {
	if (data.status === 'OK') {
	    $('#api_status').addClass('available');
	} else {
	    $('#api_status').removeClass('available');
	}
    });
    $('li input').click(function () {
	if (this.checked) {
	    amenityDict[$(this).attr('data-id')] = $(this).attr('data-name');
	} else {
	    delete amenityDict[$(this).attr('data-id')];
	}
	$('.amenities h4').empty();
	const amenityDictKeys = Object.keys(amenityDict);
	const amenityDictLength = amenityDictKeys.length;
	amenityDictKeys.forEach(function (key, index) {
	    $('.amenities h4').append(amenityDict[key]);
	    if (index !== amenityDictLength - 1) {
		$('.amenities h4').append(', ');
	    }
	});
	if (amenityDictLength === 0) {
	    $('.amenities h4').append('&nbsp;');
	}
    });

    $('button').click(function () {
	// HERE WILL BE A COPY OF WORK FROM PREVIOUS TASK
	// BUT WITH amenityDict AS A FILTER
    });
});
