/** Poplet Class Script
 * Created by Hyeongyu Yu
 */

class Poplet {
	static PopType = {
		ALERT : 'ALERT',
		INFO : 'INFO',
		VALID : 'VALID',
		INVALID : 'INVALID'
	};
	
	static {
		Object.freeze(Poplet.PopType);
	}

	static pop(text, popType = Poplet.PopType.ALERT) {
		let className;
		switch (popType) {
			case Poplet.PopType.ALERT:
				className = 'poplet-alert';
				break;
			case Poplet.PopType.INFO:
				className = 'poplet-info';
				break;
			case Poplet.PopType.VALID:
				className = 'poplet-valid';
				break;
			case Poplet.PopType.INVALID:
				className = 'poplet-invalid';
				break;
			default: return;
		}
		className += ' poplet-box';
		
		let container = $('<div></div>');
		$(container).attr('id', 'poplet-container');
		
		let poplet = $('<div></div>');
		$(poplet).attr('class', className);
		
		let poplet_span = $('<span></span>');
		$(poplet_span).attr('class', 'poplet-span');
		$(poplet_span).text(text);
		
		let poplet_close = $('<button type="button"></button>');
		$(poplet_close).attr('class', 'poplet-close');
		$(poplet).append($(poplet_span));
		$(poplet).append($(poplet_close));
		let poplet_close_svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		poplet_close_svg.setAttribute('viewBox', '0 0 512 512');
		let poplet_close_svg_path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		poplet_close_svg.appendChild(poplet_close_svg_path);
		$(poplet_close)[0].appendChild(poplet_close_svg);
		$(poplet_close).click(e => {
			$(poplet).remove();
			if ($(container).html() == '') $(container).remove();
		});
		
		let remains = $(document).find('div#poplet-container');
		if (remains.toArray().length == 0) $(document).find('body').append($(container));
		else container = remains;
		
		$(container).append($(poplet));
		$(poplet).animate({ opacity: 0.75 }, 5000, () => {
			$(poplet).animate({ opacity: 0.0 }, 1000, () => {
				$(poplet).remove();
				if ($(container).html() == '') $(container).remove();
			});
		});
	}
}