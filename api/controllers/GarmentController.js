/*---------------------
	:: ShirtIO 
	-> controller
---------------------*/
var request = require('request');
var apiURL = "https://www.shirts.io/api/v1/";
var apiKey = "?api_key=3b985de8d4e0fa6ff809c6dc5557ca048f63d900";

var GarmentController = {		
	categories: function (req, res) {							
		var reqURL  = apiURL + "products/category/" + apiKey;		
		request(reqURL, function (error, response, body) {
		if (error) return res.send(error,500);
		  if (!error && response.statusCode == 200) {		    
		    return res.json(body);
		  }
		});        
    },
    category: function(req, res){
    	var categoryId = req.param('id');
    	var reqURL  = apiURL + "products/category/" + categoryId + "/" + apiKey;
    	request(reqURL, function (error, response, body) {
		if (error) return res.send(error,500);
		  if (!error && response.statusCode == 200) {		    
		    res.json(body);
		  }
		});
    },
    product: function(req, res){
    	var productId = req.param('id');
    	var reqURL  = apiURL + "products/" + productId + "/" + apiKey;
    	request(reqURL, function (error, response, body) {
		if (error) return res.send(error,500);
		  if (!error && response.statusCode == 200) {		    
		    res.json(body);
		  }
		});
    },
    quote: function(req, res){    	
    	/*need: productId, tee color name, qty, number of colors in front, back, left and right*/
    	//https://www.shirts.io/api/v1/quote/?api_key=3b985de8d4e0fa6ff809c6dc5557ca048f63d900&garment[0][product_id]=1&garment[0][color]=Antique%20Cherry%20Red&garment[0][sizes][xxxl]=10&print[front][color_count]=2&print_type=Screenprint&address_count=10&ship_type=Superrush&personalization=both
    	//{"result": {"garment_breakdown": [{"subtotal": 165.1, "num_shirts": 10, "price_per_shirt": 16.51}], "print_type": "Screenprint", "subtotal": 165.1, "warnings": [], "discount": 3.55, "sales_tax": 0, "total": 244.1, "shipping_price": 82.55}}

    	//http://localhost:1337/garment/quote/?product_id=1&color=Azalea&qty=10&colorQtyFront=2
    	var productId = "&garment[0][product_id]=" + req.param('id');  
    	var color = "&garment[0][color]=" + req.param('color');
    	var size = "&garment[0][sizes][xxxl]=" + req.param('qty');
    	var colorQtyFront = "&print[front][color_count]=" + req.param('colorQtyFront');
    	var colorQtyBack = "&print[back][color_count]=" + req.param('colorQtyBack');    	
    	var colorQtyLeft = "&print[left][color_count]=" + req.param('colorQtyLeft');
    	var colorQtyRight = "&print[right][color_count]=" + req.param('colorQtyRight');
    	var colorsFront = "&print[front][colors]=" + req.param('colorsFront');////[front][colors][0]=PMS101,[front][colors][1]=PMS201...
		var colorsBack = "&print[back][colors]=" + req.param('colorsBack');
		var colorsLeft = "&print[left][colors]=" + req.param('colorsLeft');
		var colorsRight = "&print[right][colors]=" + req.param('colorsRight');
 		var printType = "&print_type=Screenprint";
 		var addressCount = "&address_count=" + req.param('qty');
 		var shippingType = "&ship_type=Superrush";
 		var text = "&personalization=both";
		var reqURL  = apiURL + "quote/" + apiKey + productId + color + size + colorsFront + colorsBack + colorsLeft + colorsRight + printType + addressCount + shippingType;

		request(reqURL, function (error, response, body) {
		if (error) return res.send(err,500);
		  if (!error && response.statusCode == 200) {		    
		    res.json(body);
		  }
		});
    }
};
module.exports = GarmentController;