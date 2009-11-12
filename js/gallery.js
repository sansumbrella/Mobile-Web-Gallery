var gApp = {};
gApp.jqt = $.jQTouch({
    icon: 'kilo.png',
    statusBar: 'black'
});

$(document).ready( function(){	
	//Create collection of all photos
	gApp.allPhotos = {	title:'All Photos',
							photos:[]
						};
	var i=1;
	for(i; i<18; i++)
	{
		gApp.allPhotos.photos[i] = {	full:'images/'+i+'.jpg',
										thumb:'images/t/'+i+'.jpg',
										desc:i.toString()
										};
	}
	//get user gallery list from database
	
	//navigate to the mosaic view
	gApp.displayMosaic(gApp.allPhotos);
	// gApp.jqt.goTo('#mosaic', 'slide');
});

gApp.displayMosaic = function(m){
	var thumbs='<ul>\n';
	for(var p in m.photos){
		thumbs += "<li><a href='"+m.photos[p].full+"'><img src='"+m.photos[p].thumb+"' alt='"+m.photos[p].desc+"'/></a></li>\n";
	}
	thumbs+="</ul>\n";
	thumbs+="<h2 class='count'>"+m.photos.length+" Photos</h2>";
	$('#thumbs').html(thumbs);
	//change link behavior
	$('#thumbs a').each( function(){
		var im = $(this).attr('href');
		$(this).click(function(e){
			e.preventDefault();
			gApp.displayImage(im);
		});
	});
};

gApp.displayImage = function(im){
	$('#heroimage').attr('src',im);
	gApp.jqt.goTo('#singleImage', 'slide');
};