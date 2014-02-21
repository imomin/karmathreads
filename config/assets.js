// Asset rack configuration
module.exports.assets = {

	// A list of directories, in order, which will be recursively parsed for css, javascript, and templates
	// and then can be automatically injected in your layout/views via the view partials:
	// ( assets.css(), assets.js() and assets.templateLibrary() )
    //fileExtensions: [ '.ejs', '.css', '.js', '.eot','.svg','.ttf','.woff','.otf' ],
	sequence: [
		'assets/mixins',
		'assets/styles/bootstrap',
		//'assets/styles/font-awesome',
		'assets/styles/animate',        
		'assets/js/libs/jquery',		
		'assets/js/libs/bootstrap',
        'assets/js/libs/underscore',
        'assets/js/libs/fabric',
        'assets/js/libs/qrcode',
		'assets/js/libs/scripts',
		'assets/templates'
	]
};