const $ = window.$;
const amenityDict = {};
$(document).ready(function () {
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
});
