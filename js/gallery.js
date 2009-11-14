var currentGallery='';
var db;
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
	$('#toggle_membership').bind('click', function(e){e.preventDefault(); toggleMembership(currentGallery.getCurrent()); }); //push in the image that we're looking at
});

setGallery = function(g){
	if(g.photos === undefined){
		g = allPhotos;
	}
	currentGallery = g;
}

displayMosaic = function(){
	//change the add/remove text
	var cta_txt = (currentGallery===allPhotos) ? "Add to collection" : "Remove";
	$('#toggle_membership').text(cta_txt);
	var thumbs='<ul>\n';
	for(var p in currentGallery.photos){
		thumbs += "<li><a href='"+currentGallery.photos[p].full+"'><img src='"+currentGallery.photos[p].thumb+"' alt='"+currentGallery.photos[p].desc+"'/></a></li>\n";
	}
	thumbs+="</ul>\n";
	thumbs+="<h2 class='count'>"+currentGallery.photos.length+" Photos</h2>";
	
	$('#mosaic .toolbar h1').text(currentGallery.title);
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
	userGallery.photos = [];
	
	var shortName = 'gallery';
	var version = '1.0';
	var displayName = 'Mobile photo gallery';
	var maxSize = 65536;
	db = openDatabase(shortName, version, displayName, maxSize);
    db.transaction(
        function(transaction) {
            transaction.executeSql(
                'CREATE TABLE IF NOT EXISTS photos (' +
                ' id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
                ' full_url TEXT NOT NULL, thumb_url TEXT NOT NULL, ' +
                ' desc TEXT NOT NULL );'
            );
        }
    );

	var currentDate = sessionStorage.currentDate;
	    $('#date h1').text(currentDate);
	    $('#date ul li:gt(0)').remove();
	    db.transaction(
	        function(transaction) {
	            transaction.executeSql(
	                'SELECT * FROM photos;',
	                [], 
	                function (transaction, result) {
	                    for (var i=0; i < result.rows.length; i++) {
							var row = result.rows.item(i);
							userGallery.photos.push({full:row.full_url, thumb:row.thumb_url, desc:row.desc, id:row.id});
							console.log("returned from db: " + row.full_url);
	                    }
	                }, 
	                errorHandler
	            );
	        }
	    );
};

toggleMembership = function(p){
	if(currentGallery === allPhotos)
	{
		addToGallery(p);
	} else
	{
		removeFromGallery(p);
		jqt.goBack();
	}
}

addToGallery = function(p){
	db.transaction(
		function(transaction) {
			transaction.executeSql(
				'INSERT INTO photos (full_url, thumb_url, desc) VALUES (?, ?, ?);', 
				[p.full,p.thumb,p.desc], 
				function(){
					// jQT.goBack();
				}, 
				errorHandler
			);}
	    );
	userGallery.photos.push(p);
	return false;
}

removeFromGallery = function(p){
	db.transaction(
	        function(transaction) {
	            transaction.executeSql('DELETE FROM photos WHERE id=?;', 
	              [p.id], null, errorHandler);
	        }
	    );
	for(var i=0; i<userGallery.photos.length; i++){
		if(userGallery.photos[i]===p){
			userGallery.photos.splice(i,1);
		}
	}
	return false;
}

updateGallery = function(){
	
};

errorHandler = function(transaction,err){
	console.log("encountered a database error: " + err.message );
	return true;
};