let dropdown = $("#assets");

// Get all assets
$.getJSON("https://api.coincap.io/v2/assets", function (data) {
  // Append each assets to a select option and set attribute of value and price
  $.each(data.data, function (key, entry) {
    dropdown.append($("<option></option>").attr("value", entry.symbol).attr("price", parseFloat(entry.priceUsd).toFixed(2)).text(entry.name));
  });
  // Trigger the first option onload
  $("#assets").val("BTC").trigger("change");
});

// Get the price of USD to NGN
$.getJSON("https://currencyapi.net/api/v1/rates?key=LBVkKQUAzg0GmMX8Y0HIUoUuXl0Ufk1iucxV", function (data) {
  $("#naira-equivalent").attr("usd-ngn-price", data.rates.NGN);
});

// Allow the select options to show image
function formatState(asset) {
  if (!asset.id) {
    return asset.name;
  }

  var baseUrl = "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@9ab8d6934b83a4aa8ae5e8711609a70ca0ab1b2b/32/color";
  var $asset = $('<span><img style="width:20px" alt="" /> <span></span></span>');

  $asset.find("span").text(asset.text);
  $asset.find("img").attr("src", baseUrl + "/" + asset.element.value.toLowerCase() + ".png");

  return $asset;
}

var options = {
  templateSelection: formatState,
  templateResult: formatState,
};
$("#assets").select2(options);

// Change the price of the asset if a new options is selected
dropdown.change(function () {
  $("#asset-symbol").text(this.value);
  var option = $("option:selected", this).attr("price");

  $("#naira-equivalent").val((option * $("#asset-amount").val() * $("#naira-equivalent").attr("usd-ngn-price")).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,"));
});

// Change the price of the asset if the asset amount increases
$("#asset-amount").on("input", function () {
  var option = $("option:selected", dropdown).attr("price");

  $("#naira-equivalent").val((option * $(this).val() * $("#naira-equivalent").attr("usd-ngn-price")).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,"));
});

$("#naira-equivalent").on("input", function () {
  var option = $("option:selected", dropdown).attr("price");

  $("#asset-amount").val(($(this).val() / (option * $("#naira-equivalent").attr("usd-ngn-price"))).toFixed(8).replace(/\d(?=(\d{3})+\.)/g, "$&,"));
});

// function onlyNumberKey(evt) {
//   // Only ASCII charactar in that range allowed
//   var ASCIICode = evt.which ? evt.which : evt.keyCode;
//   if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57)) return false;
//   return true;
// }
