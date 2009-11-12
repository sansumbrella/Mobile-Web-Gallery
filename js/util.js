if(typeof Object.create !== 'function'){
	Object.create = function(o){
		var F = function(){};
		F.prototype = o;
		return new F();
	};
};

Gallery = {
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