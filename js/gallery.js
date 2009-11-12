var gApp = {currentGallery:''};
gApp.jqt = $.jQTouch({
    icon: 'kilo.png',
    statusBar: 'black',
	useAnimations: true
});

gApp.Gallery = {
	title:'Gallery',
	current:0,
	photos:[],
	getNext: function() {
		this.current = this.current+1;
		if(this.current>=this.photos.length){
			this.current=0;
		}
		console.log("getNext attempting to return " + this.current + ", " + this.photos[this.current]);
		return this.photos[this.current];
	},
	getPrevious: function() {
		this.current = this.current-1;
		if(this.current<0){
			this.current=this.photos.length-1 || 0;
		}
		console.log("getPrevious attempting to return " + this.current + ", " + this.photos[this.current]);
		return this.photos[this.current];
	},
	getCurrent: function(){
		return this.photos[this.current];
	},
	setCurrentFromURL: function(url){
		for(i in this.photos)
		{
			if(this.photos[i].full.match(url)){
				this.current = Number(i);
				console.log("Current set to " + i + ", " + url);
				return;
			}
		}
	}
};

$(document).ready( function(){	
	gApp.buildInitialGallery();
	gApp.getUserGalleries();
	//get user gallery list from database
	$('#mosaic').bind('pageAnimationStart', gApp.displayMosaic);
	$('#previous').bind('click', function(e){e.preventDefault(); gApp.previous(); } );
	$('#next').bind('click', function(e){e.preventDefault(); gApp.next(); });
});

gApp.displayMosaic = function(m){
	if(m.photos === undefined){
		m = gApp.allPhotos;
	}
	gApp.currentGallery = m;
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
	$('#heroimage').attr('src',im);
	gApp.currentGallery.setCurrentFromURL(im);
	console.log("Sliding to image " + im);
	gApp.jqt.goTo('#singleImage', 'slide');
};

gApp.buildInitialGallery = function(){
	gApp.allPhotos = Object.create(gApp.Gallery);
	gApp.allPhotos.title = "All Photos";
	var i=1;
	for(i; i<18; i++)
	{
		gApp.allPhotos.photos[i] = {full:'images/'+i+'.jpg',
									thumb:'images/t/'+i+'.jpg',
									desc:i.toString()
									};
	}
};

gApp.previous = function(){
	this.displayImage(this.currentGallery.getPrevious().full);
};

gApp.next = function(){
	this.displayImage(this.currentGallery.getNext().full);
};

gApp.getUserGalleries = function(){
	gApp.userGallery = Object.create(gApp.Gallery);
	gApp.userGallery.title = "User Gallery";
};

gApp.updateGallery = function(){
	
};