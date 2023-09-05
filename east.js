//==================================================
function changeEastCss()
//==================================================
{
		const images = $(".Image");
		for (let i=0;i<images.length;i++) {
			$(".fa-pencil-alt",images[i]).removeClass('fas');
			$(".fa-pencil-alt",images[i]).addClass('fa-solid');
			$(".fa-pencil-alt",images[i]).addClass('fa-camera');
			$(".fa-pencil-alt",images[i]).removeClass('fa-pencil-alt');
		}
		const audios = $(".Audio");
		for (let i=0;i<audios.length;i++) {
			$(".fa-pencil-alt",audios[i]).removeClass('fas');
			$(".fa-pencil-alt",audios[i]).addClass('fa-solid');
			$(".fa-pencil-alt",audios[i]).addClass('fa-microphone');
			$(".fa-pencil-alt",audios[i]).removeClass('fa-pencil-alt');
		}
}

//# sourceURL=east.js
