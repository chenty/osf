$(document).ready(function(){
	var page_num = 1;
	var no_more = false;
	var isLogin = $('meta[name=isLogin]').attr('content');
	$('.explore .tags .tagbox a').live('click', function(){
		if(isLogin == 'false'){
			$('.ui.small.modal').modal('show');
			return false;
		}

		var tag_id = $(this).attr('id');
		var that = $(this);
		var url=basePath+'/tag/'+tag_id;
		var action=$(this).attr('action');

		$.ajax({
			url: basePath + '/tag/'+tag_id+'/'+action,
			type: 'GET',
			dataType: 'json'
		})
		.success(function(data){
			if(data.status == SUCCESS_INTEREST){
				$(that).text('已关注');
				$(that).attr('action', 'undointerest');
				$(that).parent('.hidden').removeClass();
				$(that).parent().addClass('interested');
				//css('opacity', '0.7');
			} else if(data.status=SUCCESS_INTEREST_UNDO){
				$(that).text('加关注');
				$(that).attr('action', 'interest');
				$(that).parent('.interested').removeClass()
				$(that).parent().addClass('hidden');
			}

		})

	});
	
    //无限加载
	$(window).scroll(function() {
		 if(no_more) {
			 return false;
		 }
		 
	     if($(window).scrollTop() + $(window).height() == $(document).height()) {
	    	$('.gallery .footer').show();
	    	page_num++;	//next page
	 		$.ajax({
				url: basePath + '/explore/page/'+page_num,
				type: 'GET',
				dataType: 'json'
			})
			.success(function(data){
				if(data.status == SUCCESS_FEED_LOAD){
					$(data.events).each(function(){
						$('.gallery').append(toBox(this));
					});

					minigrid('.gallery', '.gallery .box');
					
				} else {
					no_more = true;
				}
				$('.gallery .footer').hide();
			})
	     }
	});
    

    function toBox(event){
		var box = $('<div class="box"></div>');
		//post
		if(event.object_type == '0'){
			var post_url = basePath + '/post/' + event.object_id;
			var post_cover_url = img_base_url + event.content + '?imageView2/2/w/300';
			var post = $('<a href="'+post_url+'"><img src="'+post_cover_url+'" /></a>');
			box.append(post);
		} 
		//album
		else if(event.object_type == '2') {
			var album_url = basePath + '/album/'+event.object_id + '/photos';
			var album_cover_url = img_base_url + event.title + '?imageView2/2/w/300';
			var album = $('<a href="'+album_url+'"><img src="'+album_cover_url+'" /></a>');
			box.append(album);
		}

		//append meta
		var meta = $('<div class="meta"></div>');
		var content = $('<a href="'+basePath+'/user/'+event.user_id+'">'+
							'<img class="ui avatar image" src="'+img_base_url+event.user_avatar+'?imageView2/1/w/48/h/48">'+
							'<span>'+event.user_name+'</span>'+
						'</a>');
		meta.append(content);

		box.append(meta);
		return box; 	
    }
    	

	$(".topbar .header>div").click(function(){
		var index=$(this).index();
		var explore=$('.gallery:first');
		var tags=$('.tags:first');
		var users = $('.users:first');
		var active_tip=$('.topbar .active');
		if(index == 0){	
			$(explore).fadeIn(300);
			$(tags).fadeOut(200);
			$(users).fadeOut(200);
			$(active_tip).css('left', '19.5%');
		} else if(index == 1 ){							
			$(tags).fadeIn(300);
			$(explore).fadeOut(200);
			$(users).fadeOut(200);
			$(active_tip).css('left', '44%');
		} else{
			$(explore).fadeOut(300);
			$(tags).fadeOut(200);
			$(users).fadeIn(200);
			$(active_tip).css('left', '69%');
		}
	});	
	
	
})
