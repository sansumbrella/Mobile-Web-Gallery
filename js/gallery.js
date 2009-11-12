var gApp = {};
gApp.jqt = $.jQTouch({
    icon: 'kilo.png',
    statusBar: 'black'
});

$(document).ready( function(){	
	gApp.buildInitialCollection();
	//get user gallery list from database
	$('#mosaic').bind('pageAnimationStart', gApp.displayMosaic);
});

gApp.displayMosaic = function(m){
	if(m.photos === undefined){
		m = gApp.allPhotos;
	}
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
			gApp.displayImage(im);
		});
	});
};

gApp.displayImage = function(im){
	$('#heroimage').attr('src',im);
	gApp.jqt.goTo('#singleImage', 'slide');
};

gApp.buildInitialCollection = function(){
	gApp.allPhotos = {	title:'All Photos',
						photos:[]
						};
	var i=1;
	for(i; i<18; i++)
	{
		gApp.allPhotos.photos[i] = {full:'images/'+i+'.jpg',
									thumb:'images/t/'+i+'.jpg',
									desc:i.toString()
									};
	}
	gApp.currentGallery = gApp.allPhotos;
}