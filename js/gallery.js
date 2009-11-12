var currentGallery='';
var zoomed = false;
jqt = $.jQTouch({
    icon: 'kilo.png',
    statusBar: 'black',
	useAnimations: true
});

$(document).ready( function(){	
	buildInitialGallery();
	getUserGalleries();
	//get user gallery list from database
	$('#mosaic').bind('pageAnimationStart', displayMosaic);
	$('#showall').bind('click', function(e){e.preventDefault(); setGallery(allPhotos);});
	$('#showuser').bind('click', function(e){e.preventDefault(); setGallery(userGallery);});
	$('#previous').bind('click', function(e){e.preventDefault(); previous(); } );
	$('#next').bind('click', function(e){e.preventDefault(); next(); });
});

setGallery = function(g){
	if(g.photos === undefined){
		g = allPhotos;
	}
	currentGallery = g;
}

displayMosaic = function(){
	var m = currentGallery;
	var thumbs='<ul>\n';
	for(var p in m.photos){
		thumbs += "<li><a href='"+m.photos[p].full+"'><img src='"+m.photos[p].thumb+"' alt='"+m.photos[p].desc+"'/></a></li>\n";
	}
	thumbs+="</ul>\n";
	thumbs+="<h2 class='count'>"+m.photos.length+" Photos</h2>";
	
	$('#mosaic .toolbar h1').text(m.title);
	$('#thumbs').html(thumbs);
	//change link behavior
	$('#thumbs a').each( function(){
		var im = $(this).attr('href');
		$(this).click(function(e){
			e.preventDefault();
			displayImage(im);
		});
	});
};

displayImage = function(im){
	$('#heroimage').attr('src',im);
	$('#heroimage').attr('src',im);
	currentGallery.setCurrentFromURL(im);
	console.log("transitioning to image " + im);
	if(!zoomed){
		jqt.goTo('#singleImage', 'slide');
		$('#singleImage').bind('pageAnimationEnd', function(){
															zoomed=true;
															$('#singleImage').unbind();
															$('#singleImage').bind('pageAnimationEnd', function(){zoomed=false;});
															});
	}
};

buildInitialGallery = function(){
	allPhotos = Object.create(Gallery);
	allPhotos.title = "All Photos";
	var i=1;
	for(i; i<18; i++)
	{
		allPhotos.photos[i-1] = {full:'images/'+i+'.jpg',
									thumb:'images/t/'+i+'.jpg',
									desc:String(i)
									};
	}
};

previous = function(){
	this.displayImage(this.currentGallery.getPrevious().full);
};

next = function(){
	this.displayImage(this.currentGallery.getNext().full);
};

getUserGalleries = function(){
	userGallery = Object.create(Gallery);
	userGallery.title = "User Gallery";
	userGallery.photos = [
		{full:'images/1.jpg',
		thumb:'images/t/1.jpg',
		desc:'Photo 1'},
		{full:'images/4.jpg',
		thumb:'images/t/4.jpg',
		desc:'Photo 2'},
		{full:'images/2.jpg',
		thumb:'images/t/2.jpg',
		desc:'Photo 3'},
		{full:'images/5.jpg',
		thumb:'images/t/5.jpg',
		desc:'Photo 4'}
	]
};

updateGallery = function(){
	
};