/**
 * 
 */

var svgNS = "http://www.w3.org/2000/svg";

const createItem = (type, data) => {
	let container = $('<div class="explorer-item"></div>');
	$(container).attr({
		'data-type' : type,
		'data-name' : type == 'file' ? data.title : (type == 'folder' ? data.name : '..'),
		'data-selected' : 'false'
	});
	let leftPart = $('<div class="explorer-item-left"></div>');
	let svg = document.createElementNS(svgNS, 'svg');
	svg.setAttribute('viewBox', '0 0 512 512');
	let svgPath = document.createElementNS(svgNS, 'text');
	svgPath.textContent = type == 'file' ? 'txt' : (type == 'folder' ? '📁' : '⮬');
	svgPath.setAttribute('text-anchor', 'middle');
	svgPath.setAttribute('x', 256);
	svgPath.setAttribute('y', 320);
	svg.appendChild(svgPath);
	$(leftPart).append($(svg));
	let titlePart = $('<span class="explorer-item-title"></span>');
	$(titlePart).text(type == 'file' ? data.title : (type == 'folder' ? data.name : '..'));
	$(leftPart).append($(titlePart));
	$(container).prepend($(leftPart));
	let rightPart = $('<div class="explorer-item-right"></div>');
	if (type == 'file') {
		let lastdate = $('<span class="explorer-item-lastdate"></span>');
		let formatted = new Date(Date.parse(data.lastdate));
		let dt = dateToObject(formatted);
		let dateText = "{0}-{1}-{2} {3}:{4}".format(dt.year, dt.month, dt.day, dt.hour, dt.minute);
		$(lastdate).text(dateText);
		$(rightPart).prepend($(lastdate));
	}
	$(container).append($(rightPart));
	return $(container);
};

const loadingExplorer = () => {
	let loading = $('<div class="loading-container"></div>');
	let loadingContent = $('<div class="loading-content"></div>');
	let svg1 = document.createElementNS(svgNS, 'svg');
	svg1.setAttribute('viewBox', '0 0 512 512');
	svg1.setAttribute('role', 'fast');
	let svg1Path = document.createElementNS(svgNS, 'path');
	$(svg1).append($(svg1Path));
	let svg2 = document.createElementNS(svgNS, 'svg');
	svg2.setAttribute('viewBox', '0 0 512 512');
	svg2.setAttribute('role', 'slow');
	let svg2Path = document.createElementNS(svgNS, 'path');
	$(svg2).append($(svg2Path));
	$(loadingContent).append($(svg1));
	$(loadingContent).append($(svg2));
	$(loading).append($(loadingContent));
	$('div.docs-explorer').find('div.content').append($(loading));
};

const observe = {
	explorePath : '/',
	lastSelected : null
};
const proxy = new Proxy(observe, {
	set(target, prop, value, receiver) {
		if (prop == 'explorePath') {
			loadingExplorer();
			let target = $('div.explorer-path');
			$(target).empty();
			let separate = value.split('/');
			separate[0] = 'root';
			separate = separate.filter(dir => dir != '');
			let isFirst = true;
			let fullPath = "";
			for (let dir of separate) {
				if (isFirst) {
					isFirst = false;
					fullPath = '/';
				}
				else {
					let svg = document.createElementNS(svgNS, 'svg');
					let svgPath = document.createElementNS(svgNS, 'path');
					svg.classList.add('separator');
					svg.setAttribute('viewBox', '0 0 512 512');
					svg.appendChild(svgPath);
					$(target)[0].appendChild(svg);
					fullPath += dir;
				}
				let item = $('<span class="explorer-path-item"></span>');
				$(item).text(dir);
				$(item).attr('data-path', fullPath);
				$(target).append($(item));
			}
			observe.explorePath = value;
			$.ajax({
				url: getContext() + '/ajax/getDirectoryInfo',
				type: 'post',
				data: JSON.stringify({ path: value }),
				dataType: 'json',
				contentType: 'application/json',
				success: data => {
					let explorer = $('div.docs-explorer').find('div.content');
					$(explorer).empty();
					if (value != '/') $(explorer).append(createItem('super'));
					if (data.subdirectories != null) {
						let subdirs = data.subdirectories.filter(item => item != null);
						for (let subdirectory of subdirs) {
							$(explorer).append(createItem('folder', subdirectory));
						}
					}
					if (data.docs != null) {
						let docs = data.docs.filter(item => item != null);
						for (let doc of docs) {
							$(explorer).append(createItem('file', doc));
						}
					}
				}
			});
		}
	}
});


$(document).on('click', 'main', e => {
	let elem = $('main');
	$(elem).find('div.docs-explorer > div.content > div.explorer-item').attr('data-selected', 'false');
	proxy.lastSelected = null;
});


$(document).on('click', 'button.explorer-manipulate', e => {
	e.stopPropagation();
});


$(document).on('click', 'button.explorer-new', e => {
	let elem = $(e.target).closest('button.explorer-new');
	
});

$(document).on('click', 'span.explorer-path-item', e => {
	let elem = $(e.target).closest('span.explorer-path-item');
	proxy.explorePath = $(elem).attr('data-path');
});


$(document).on('click', 'div.explorer-item', e => {
	e.stopPropagation();
	let elem = $(e.target).closest('div.explorer-item');
	if (e.ctrlKey) {
		$(elem).attr('data-selected', $(elem).attr('data-selected') == 'true' ? 'false' : 'true');
		if ($(elem).attr('data-selected') == 'true') proxy.lastSelected = $(elem);
	} else if (e.shiftKey) {
		let ordered = $(proxy.lastSelected).index() < $(elem).index();
		$('div.explorer-item').attr('data-selected', 'false');
		if (proxy.lastSelected == null) {
			$(elem).attr('data-selected', 'true');
			proxy.lastSelected = $(elem);
		} else if ($(proxy.lastSelected).index() == $(elem).index()) {
			$(elem).attr('data-selected', 'true');
		} else {
			let range = ordered ? $(proxy.lastSelected).nextUntil($(elem)) : $(proxy.lastSelected).prevUntil($(elem));
			$(range).attr('data-selected', 'true');
			$(proxy.lastSelected).attr('data-selected', 'true');
			$(elem).attr('data-selected', 'true');
		}
	} else if ($(elem).attr('data-selected') == 'false') {
		$('div.explorer-item').not($(elem)).attr('data-selected', 'false');
		$(elem).attr('data-selected', 'true');
		proxy.lastSelected = $(elem);
	}
});
$(document).on('dblclick', 'div.explorer-item', e => {
	let elem = $(e.target).closest('div.explorer-item');
	let type = $(elem).attr('data-type');
	if (type == 'folder') {
		proxy.explorePath = (proxy.explorePath == '/' ? '' : proxy.explorePath) + '/' + $(elem).attr('data-name');
	} else if (type == 'super') {
		let pathArray = proxy.explorePath.split('/');
		pathArray = pathArray.slice(0, pathArray.length - 1);
		proxy.explorePath = pathArray.join('/') == '' ? '/' : pathArray.join('/');
	} else {
		let fullPath = (proxy.explorePath == '/' ? '' : proxy.explorePath) + '/' + $(elem).attr('data-name');
		$.ajax({
			url: getContext() + '/ajax/getDocInfo',
			type: 'post',
			data: JSON.stringify({ directory: proxy.explorePath, filename: $(elem).attr('data-name') }),
			dataType: 'json',
			contentType: 'application/json',
			success: data => {
				location.href = getContext() + `/docs/${data.writer}/${data.docs_id}`;
			}
		});
	}
});

const pathAnimation = element => {
	
};

$(window).resize(e => {
	$('div.recent-docs').find('div.recent-item-path > span').css('display', '');
	$('div.recent-docs').find('div.recent-item-path > span').css('transform', 'translateX(0)');
	$('div.recent-docs').find('div.recent-item-path > span').stop();
	let getWidth = element => parseFloat($(element).css('width').replace('px', ''));
	$('div.recent-docs').find('div.recent-item-path > span').each((index, item) => {
		let elem = $(item);
		let parent = $(elem).closest('div.recent-item-path');
		let getWidth = element => parseFloat($(element).css('width').replace('px', ''));
		$(elem).css({
			'width': $(elem).css('width'),
			'display': 'block'
		});
		if (getWidth(elem) > getWidth(parent)) {
			let diff = getWidth(elem) - getWidth(parent);
			const slide = (element, diff) => {
				$(element).animate({ 'transform': `translateX(-${diff}px)` }, 5000, () => {
					setInterval(slide(element, diff), 3000);
				});
			};
			slide(elem, diff);
		}
	});
});

$(() => {
	$('div.recent-docs').find('div.recent-item-path > span').each((index, item) => {
		let elem = $(item);
		let parent = $(elem).closest('div.recent-item-path');
		let getWidth = element => parseFloat($(element).css('width').replace('px', ''));
		$(elem).css({
			'width': $(elem).css('width'),
			'display': 'block'
		});
		if (getWidth(elem) > getWidth(parent)) {
			let diff = getWidth(elem) - getWidth(parent);
			const slide = (element, diff) => {
				$(element).animate({ 'transform': `translateX(-${diff}px)` }, 5000, () => {
					setInterval(slide(element, diff), 3000);
				});
			};
			slide(elem, diff);
		}
	});
});