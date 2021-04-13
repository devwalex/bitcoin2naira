let dropdown = $("#assets");

// Get all assets
$.getJSON("https://api.coincap.io/v2/assets", function (data) {
  // Append each assets to a select option and set attribute of value and price
  $.each(data.data, function (key, entry) {
    dropdown.append($("<option></option>").attr("value", entry.symbol).attr("price", parseFloat(entry.priceUsd).toFixed(2)).text(entry.name));
  });

  $("#naira-equivalent").attr("usd-ngn-price", 381);
  // Trigger the first option onload
  $("#assets").val("BTC").trigger("change");
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
  let assetAmount = $(this).val();
  if (!Number(assetAmount)) {
    if (assetAmount != 0) {
      $("#asset-symbol-error").text("Please enter numeric values only");
    }
    assetAmount = 0;
  } else {
    $("#asset-symbol-error").text("");
  }

  var option = $("option:selected", dropdown).attr("price");

  $("#naira-equivalent").val((option * assetAmount * $("#naira-equivalent").attr("usd-ngn-price")).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,"));
});

$("#naira-equivalent").on("input", function () {
  var option = $("option:selected", dropdown).attr("price");
  let nairaEquivalentAmount = $(this).val();
  if (!Number(nairaEquivalentAmount)) {
    if (nairaEquivalentAmount != 0) {
      $("#naira-equivalent-error").text("Please enter numeric values only");
    }
    nairaEquivalentAmount = 0;
  } else {
    $("#naira-equivalent-error").text("");
  }

  $("#asset-amount").val((nairaEquivalentAmount / (option * $("#naira-equivalent").attr("usd-ngn-price"))).toFixed(8).replace(/\d(?=(\d{3})+\.)/g, "$&,"));
});

// function onlyNumberKey(evt) {
//   // Only ASCII charactar in that range allowed
//   var ASCIICode = evt.which ? evt.which : evt.keyCode;
//   if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57)) return false;
//   return true;
// }

// Get all popular assets
const items = $(".conversion-item");

// Loop through the items and onclick of each item change the value of the select option to the selected items
$.each(items, function () {
  $(this).on("click", function () {
    $("#assets").val($(this).data("asset-type").toUpperCase()).trigger("change");
  });
});
