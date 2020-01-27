jQuery.getJSON('/admin/api/2020-01/metafields.json', function(metafields) {
    const metafieldsRes = response.metafields;
    const metafields =  metafieldsRes.filter(function(metafield) {
        return metafield.key == 'points';
    });
    const metafieldsObj = metafields[0];
    const metafieldVal = JSON.parse(metafieldsObj.value);
    console.log(metafieldVal);
    // alert('The title of this product is ' + product.title);
});