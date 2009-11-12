var jQT= $.jQTouch({
    icon: 'kilo.png',
    statusBar: 'black'
});
var galleryApp = {	currentGallery:'',
					currentImage:'',
					nextImage:''
				};

$(document).ready( function(){
	//create gallery list from database
	
	//collect all thumbnails and put them in our list for display
	var thumbs='';
	var i=1;
	for(i; i<18; i++)
	{
		thumbs += "<li><img src='images/t/" + i + ".jpg' alt='thumbnail'/></li>\n";
	}
	
	$('#thumbs').html(thumbs);
});