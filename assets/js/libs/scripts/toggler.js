var _temp = {};
_temp.initialized = false;
var qrcode;

$(document).ready(function(){
	$('li[data-section]').click(function(e) {		
		e.preventDefault();
		var el = "#panel" + $(this).attr('data-section');
		if($(el).hasClass('fadeInLeftBig'))
		{
			checkOut();
		}
		else {
			checkIn(el);
		}
	});
	//add close event to x button.
	$('.close').click(function(e){
        if(e.target.parentElement.parentElement.parentElement.parentElement.id == 'panelPreview'){
            $("#panelPreview").removeClass().addClass("animated fadeOutUpBig");
        }
        else if(e.target.parentElement.parentElement.parentElement.parentElement.id == 'cliparts'){
             $("#cliparts").removeClass().addClass("animated fadeOutUpBig");
        }
        else {
            checkOut();            
        }
        
	});
    $('#list').change(function(e){		
        loadItems($(this).val());
	}); 
    loadItems($('#list').val());
    $("#updateTShirt").click(function(e){
        updateShirtOnCanvas();
    });
    //add tooltip
    $(".editorControls .btn-group a").tooltip();
    //color picker
    $("#fontBGColorPicker").popover({'html':true});
    $("#fontColorPicker").popover({'html':true});
    $("#fontBorderColor").popover({'html':true});
    $("#clipartColorPicker").popover({'html':true});
    $("#qrcodeColorPicker").popover({'html':true});
    $("#textBorderWidth").slider({value:0})
        .on('slide', function(ev){
            
        });
    $("#textBorderWidth").parent().css({"width":"160px"});
    $("#textCurve").slider({value:10})
        .on('slide', function(ev){
            
        });
    $("#textCurve").parent().css({"width":"320px"});
    
    //demo
    canvas = new fabric.Canvas('c');
        
    Example = new CurvedText( canvas, {angle:50} );
    Example.center();
    
    
    $('.radius, .spacing, .align, .fontSize').change(function(){
    Example.set( $(this).attr('class'), $(this).val() ) ;    
    });
    $('.reverse').change(function(){
    Example.set( 'reverse', ( $(this).val() == 'true' ) ) ;    
    });
    $('.text').keyup(function(){
    Example.setText( $(this).val() ) ;
    });
      
    //file upload
    initFileUpload();
    
    //clipart window
    $("#showClipart").click(function(){
        $("#cliparts").show();
        $("#cliparts").removeClass().addClass("animated fadeInDownBig");
    });
    $("#closeClipart").click(function(){
        $("#cliparts").removeClass().addClass("animated fadeOutUpBig");
    });
    
    $("#clipartCategory").change(function(){
        loadCliparts(this.value);
    });
    loadCliparts('animal');
    
    qrcode = new QRCode(document.getElementById("previewQRCode"), {
        width : 100,
    	height : 100
    });
    
    $("#qrText").
        on("blur", function () {
		    makeCode();
	    }).
	    on("keydown", function (e) {
		    if (e.keyCode == 13) {
			    makeCode();
		    }
	});
    makeCode();
    $("#qrcodeColorPicker").click(function(e) {
       $(".popover-content .qrcode.color-preview").click(function(e) {
           var color = $(this).css("background-color");
           $("#qrcodeColor").val(color);
           $("#qrcodeColorPicker").css("background-color",color);
            qrcode._htOption.colorDark = color;
            makeCode();
        });
    });
    $("#pricingRange").slider({value:25})
        .on('slide', function(ev){
            
        });
    $("#pricingRange").parent().css({"width":"320px"});
});

function checkIn(el){
	checkOut();
	$(el).show();
	$(el).removeClass().addClass("animated fadeInLeftBig");		
}

function checkOut(){
	$(".fadeInLeftBig").removeClass().addClass("animated bounceOutLeft");
    //panel1 is closed then close every that is opened from it.        
    //if(e.target.parentElement.parentElement.parentElement.parentElement.id == 'panel1'){
       $("#panelPreview").removeClass().addClass("animated fadeOutUpBig");
    //}
    $("#cliparts").removeClass().addClass("animated fadeOutUpBig");
}

function loadItems(id){
    $.get('/garment/category/'+id, function(data) {
        var items = JSON.parse(data);
        var element ='<div class="" style="float:left">';
        _.each(items.result,function(value, key, list){
            if(!_temp.initialized && key == 0){
                defaultView(value.product_id);
            }
            element += '<div onclick="getDetails('+ value.product_id +');" style="width: 96px;float: left;"><img class="img-thumbnail" style="height: 100px; width: 86px;" src="'+ value.image +'" alt="" /><small>'+ value.name +'</small></div>';
            });
            element += '</div>';
        $("#items").html(element);        
	});
}
function defaultView(id){
    $.get('/garment/product/'+id, function(data) {
        var item = JSON.parse(data);        
        _temp.product_Id = id;
        _temp.showSleeves = (item.result.has_sleeves == 1);
         _temp.colors = item.result.colors;
         _temp.colorIndex = 0;
         updateShirtOnCanvas();
         _temp.initialized = true;
         $("#showFront").parent().show();
         $("#showBack").parent().show();
         if(_temp.showSleeves){
            $("#showLeft").parent().show();
            $("#showRight").parent().show();
         }
         else {
            $("#showLeft").parent().hide();
            $("#showRight").parent().hide();
         }
    });
}
function getDetails(id){        
    $.get('/garment/product/'+id, function(data) {
        var item = JSON.parse(data);        
        _temp.product_Id = id;
        _temp.showSleeves = (item.result.has_sleeves == 1);        
        $("#tname").html(item.result.name);
        //$("#tmaterials").html(item.result.materials);
        $(".colorOptions").empty();
        _temp.colors = item.result.colors;
        _.each(_temp.colors,function(value, index, list){            
            $(".colorOptions").append('<li id="'+ index +'" class="color-preview" title="'+ value.name +'" style="background-color:#'+ value.hex +';"></li>');    
        });
        
        if(!$("#panelPreview").hasClass('fadeInDownBig')) {			
            $("#panelPreview").show();
            $("#panelPreview").removeClass().addClass("animated fadeInDownBig");
		}		       
        if(item.result.colors.length > 0){
            $("#preview").html('<img width="200px;" height="231px;" id="previewPic" src="'+ _temp.colors[0].front_image  +'">');
        }
        $(".colorOptions .color-preview").click(function(e) {
            _temp.colorIndex = e.target.id;
            _temp.color = _temp.colors[_temp.colorIndex].name;
            $("#previewPic").attr({"src":_temp.colors[_temp.colorIndex].front_image});
        });
    });
}

function updateShirtOnCanvas(){
    //update main object with new product id and color.
    ;
    $("#tshirtFacing").attr({'src':_temp.colors[_temp.colorIndex].front_image});
    
    //set event to show image of different dimentions.
    $("#showFront").click(function(e){
        $("#tshirtFacing").attr({'src':_temp.colors[_temp.colorIndex].front_image});
    });
    $("#showLeft").click(function(e){
        $("#tshirtFacing").attr({'src':_temp.colors[_temp.colorIndex].left_image});
    });
    $("#showBack").click(function(e){
        $("#tshirtFacing").attr({'src':_temp.colors[_temp.colorIndex].back_image});
    });
    $("#showRight").click(function(e){
        $("#tshirtFacing").attr({'src':_temp.colors[_temp.colorIndex].right_image});
    });
    
    $("#showFront").parent().show();
    $("#showBack").parent().show();
    if(_temp.showSleeves){
        $("#showLeft").parent().show();
        $("#showRight").parent().show();
    }
    else {
        $("#showLeft").parent().hide();
        $("#showRight").parent().hide();
    }
}

function calculate(){
	//productId, tee color name, qty, number of colors in front, back, left and right
	var productId = "";
	var color = "white";
	var qty = "1";
	var colorsFront = [];//[front][colors][0]=PMS101,[front][colors][1]=PMS201...
	var colorsBack = [];
	var colorsLeft = [];
	var colorsRight = [];
	var colorQtyFront = 1;
	var colorQtyBack = 1;
	var colorQtyLeft = 1;
	var colorQtyRight = 1;

	//
}

function initFileUpload(){
    // Change this to the location of your server-side upload handler:   
    $("#fileupload").click(function(e){
        $("#progress").children().removeClass();
        $("#progress").children().css('width','0%');
        if(!$('#toggleUploadButton').is(':checked')){
            e.preventDefault();
            return false;
        }
    });

    $('#fileupload').fileupload({
        url: 'editor/upload/',
        dataType: 'json',
        acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
        maxFileSize: 5000000, // 5 MB
        done: function (e, data) {        
            $("#files").append('<div style="float:left;"><a href="#" onclick=""><img class="img-thumbnail" src="'+ data.result.path +'" style="height:100px;width:90px;" /></a></div>');
        },
        progressall: function (e, data) {            
            $("#progress").children().removeClass().addClass("progress-bar");
            var progress = parseInt(data.loaded / data.total * 100, 10);            
            $('#progress .progress-bar').css(
                'width',
                progress + '%'
            );
        }
    }).prop('disabled', (!$.support.fileInput && $('#toggleUploadButton').is(':checked')))
        .parent().addClass($.support.fileInput ? undefined : 'disabled');    
}

function loadCliparts(category){
    //alert("seleted new " + category);    
    $.get('/editor/clipart/'+category, function(result) {
        var element ='<div class="" style="float:left">';
        _.each(result.data,function(value, key, list){            
            element += '<div onclick="addImage(\''+ value.name +'\');" style="width: 96px;float: left;"><img class="img-thumbnail" style="height: 100px; width: 86px;" src="'+ value.url +'" alt="" /><small>'+ value.name +'</small></div>';
            });
            element += '</div>';
        $("#clipartitems").html(element);
    });
}

function addImage(id){
    alert(id);
}
function makeCode() {    	
	var elText = document.getElementById("qrText");
	if (!elText.value) {		
		elText.focus();
		return;
	}
	qrcode.makeCode(elText.value);
}