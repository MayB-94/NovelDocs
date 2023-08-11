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
		} else {
			observe[prop] = value;
		}
	}
});

$(document).on('mousedown', 'main', e => {
	$('dialog.context-menu').remove();
});

$(document).on('click', 'div.docs-explorer > div.content', e => {
	let elem = $('div.docs-explorer > div.content');
	$(elem).find('div.explorer-item').attr('data-selected', 'false');
	proxy.lastSelected = null;
});


$(document).on('click', 'button.explorer-manipulate', e => {
	
});


$(document).on('click', 'button.explorer-file-download-all', e => {
	let elem = $(e.target).closest('button.explorer-file-download-all');
	$.ajax({
		url: getContext() + '/ajax/downloadDirectory',
		type: 'post',
		data: JSON.stringify({ path: '/' }),
		contentType: 'application/json',
		dataType: 'json',
		success: data => {
			if (data.result != 1) {
				Poplet.pop('다운로드에 실패했습니다', Poplet.PopType.INVALID);
				return;
			}
			Poplet.pop('다운로드를 시작합니다');
			const link = document.createElement('a');
			link.href = 'data:text/plain;base64,' + data.data;
			link.download = data.filename;
			link.click();
		}
	})
});


$(document).on('click', 'button.explorer-file-download', e => {
	let elem = $(e.target).closest('button.explorer-file-download');
	$.ajax({
		url: getContext() + '/ajax/downloadDirectory',
		type: 'post',
		data: JSON.stringify({ path: proxy.explorePath }),
		contentType: 'application/json',
		dataType: 'json',
		success: data => {
			if (data.result != 1) {
				Poplet.pop('다운로드에 실패했습니다', Poplet.PopType.INVALID);
				return;
			}
			Poplet.pop('다운로드를 시작합니다');
			const link = document.createElement('a');
			link.href = 'data:text/plain;base64,' + data.data;
			link.download = data.filename;
			link.click();
		}
	})
});


$(document).on('click', 'button.explorer-file-download-only-docs', e => {
	let elem = $(e.target).closest('button.explorer-file-download-only-docs');
	$.ajax({
		url: getContext() + '/ajax/downloadDocs',
		type: 'post',
		data: JSON.stringify({ path: proxy.explorePath }),
		contentType: 'application/json',
		dataType: 'json',
		success: data => {
			if (data.result != 1) {
				Poplet.pop('다운로드에 실패했습니다', Poplet.PopType.INVALID);
				return;
			}
			Poplet.pop('다운로드를 시작합니다');
			const link = document.createElement('a');
			link.href = 'data:text/plain;base64,' + data.data;
			link.download = data.filename;
			link.click();
		}
	})
});

$(document).on('click', 'span.explorer-path-item', e => {
	let elem = $(e.target).closest('span.explorer-path-item');
	proxy.explorePath = $(elem).attr('data-path');
});


$(document).on('click', 'div.explorer-item', e => {
	e.stopPropagation();
	$('main').mousedown();
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

const pathAnimation = target => {
	$(target).css('display', '');
	$(target).css('left', '0');
	$(target).stop();
	let elem = $(target);
	let parent = $(elem).closest('div.recent-item-path');
	let framerate = 12;
	
	let duration = 0;
	let getWidth = element => parseFloat($(element).css('width').replace('px', ''));
	
	if (getWidth(elem) > getWidth(parent)) {
		let diff = getWidth(elem) - getWidth(parent);
		duration = diff / 0.02;
		$(elem).css({
			'width': $(elem).css('width'),
			'display': 'block',
			'left': '0'
		});
		const slide = (element, diff) => {
			$(element).animate({ 'left': `-${diff}px` }, duration, 'linear', () => {
				setTimeout(() => pathAnimation(target), 2000);
			});
		};
		setTimeout(() => slide(elem, diff), 1000);
	}
};

$(document).on('resize', 'div.recent-item', e => {
	$('div.recent-docs > div.content > div.recent-item > div.recent-item-path > span').each((index, item) => {
		pathAnimation($(item));
	});
});

$(document).on('dblclick', 'div.recent-item', e => {
	let elem = $(e.target).closest('div.recent-item');
	$.ajax({
		url: getContext() + '/ajax/getDocInfo',
		type: 'post',
		data: JSON.stringify({ directory: $(elem).attr('data-path'), filename: $(elem).attr('data-name') }),
		dataType: 'json',
		contentType: 'application/json',
		success: data => {
			location.href = getContext() + `/docs/${data.writer}/${data.docs_id}`;
		}
	});
});

$(document).on('contextmenu', 'div.docs-explorer > div.content', e => {
	e.preventDefault();
	let contextMenu = $('<dialog class="context-menu" data-header="explorer-content"></dialog>');
	const contexts = [
		{
			role: 'superDir',
			text: '상위 디렉토리',
			d: 'M 448 384 H 128 V 128 L 64 192 L 128 128 L 192 192',
			condition: proxy.explorePath != '/',
			action: () => {
				let path = proxy.explorePath.split('/');
				let expPath = path.slice(0, path.length - 1);
				proxy.explorePath = expPath.join('/') == '' ? '/' : expPath.join('/');
			}
		},
		{
			role: 'newDoc',
			text: '새 문서',
			d: 'M 181 32 V 181 H 32 V 331 H 181 V 480 H 331 V 331 H 480 V 181 H 331 V 32 Z',
			action: () => {
				Modalet.show({
					title: '<h3 class="margin-0">새 문서 생성</h3>',
					content: '<div class="display-flex flex-direction-column justify-content-flex-start align-items-stretch">' +
							   '<div class="font-weight-bolder modalet-item-group">' +
							   '<label class="margin-right-5px" for="doc-title">제목</label>' +
							   '<input id="doc-title" class="flex-grow-1" name="doc-title" placeholder="문서 제목" size="0">' +
							   '</div>' +
							   '<div class="font-weight-bolder modalet-item-group">' +
							   '<button type="button" class="toggle template-toggle" role="exposetype" data-toggle="false"></button>' +
							   '</div>' +
							   '</div>',
					type: Modalet.ModalType.OKCANCEL,
					OK: () => {
						if (!$('div.modalet-modal').find('input#doc-title').val()) return null;
						else {
							let title = $('div.modalet-modal').find('input#doc-title').val();
							let modalResponse = true;
							$.ajax({
								url: getContext() + '/ajax/createDoc',
								type: 'post',
								data: JSON.stringify({
									'doc-title': $('div.modalet-modal').find('input#doc-title').val(),
									'doc-dir': proxy.explorePath,
									'exposetype': $('button.template-toggle[role="exposetype"]').attr('data-toggle') == 'false' ? 'private' : 'public'
								}),
								dataType: 'json',
								contentType: 'application/json',
								async: false,
								success: data => {
									if (data.result == 0) {
										Poplet.pop('파일을 생성하지 못했습니다', Poplet.PopType.INVALID);
										modalResponse = null;
									}
									else {
										Poplet.pop('파일을 생성했습니다', Poplet.PopType.VALID);
										proxy.explorePath = proxy.explorePath;
										$.ajax({
											url: getContext() + '/ajax/getDocInfo',
											type: 'post',
											data: JSON.stringify({ directory: proxy.explorePath, filename: title }),
											dataType: 'json',
											contentType: 'application/json',
											success: data => {
												location.href = getContext() + `/docs/${data.writer}/${data.docs_id}`;
											}
										});
										modalResponse = true;
									}
								}
							});
							return modalResponse;
						}
					}
				});
			}
		},
		{
			role: 'newDir',
			text: '새 디렉토리',
			d: 'M 181 32 V 181 H 32 V 331 H 181 V 480 H 331 V 331 H 480 V 181 H 331 V 32 Z',
			svgClasses: [ 'fill-subtheme' ],
			action: () => {
				Modalet.show({
					title: '<h3 class="margin-0">디렉토리 생성</h3>',
					content: '<div class="display-flex flex-direction-column justify-content-flex-start align-items-stretch">' +
							   '<div class="font-weight-bolder modalet-item-group">' +
							   '<label class="margin-right-5px" for="directory-name">이름</label>' +
							   '<input id="directory-name" name="directory-name" placeholder="디렉토리 이름">' +
							   '</div>' +
							   '</div>',
					type: Modalet.ModalType.OKCANCEL,
					OK: () => {
						if (!$('div.modalet-modal').find('input#directory-name').val()) return null;
						else {
							let modalResponse = true;
							$.ajax({
								url: getContext() + '/ajax/createSubdirectory',
								type: 'post',
								data: JSON.stringify({
									'directory-name': $('div.modalet-modal').find('input#directory-name').val(),
									'directory-parent': proxy.explorePath
								}),
								dataType: 'json',
								contentType: 'application/json',
								async: false,
								success: data => {
									if (data.result == 0) {
										Poplet.pop('폴더를 생성하지 못했습니다', Poplet.PopType.INVALID);
										modalResponse = null;
									}
									else {
										Poplet.pop('폴더를 생성했습니다', Poplet.PopType.VALID);
										proxy.explorePath = proxy.explorePath;
										modalResponse = true;
									}
								}
							});
							return modalResponse;
						}
					}
				});
			}
		},
		//'separator'
	];
	if ($(e.target).attr('class') == 'explorer-item') {
		if ($(e.target).attr('data-selected') == 'false') {
			$('div.explorer-item').not(e.target).attr('data-selected', 'false');
			$(e.target).attr('data-selected', 'true');
		}
		let itemContexts = [
			'separator',
			{
				role: 'download',
				text: '다운로드',
				d: 'M 256 480 L 64 304 H 192 V 128 H 352 V 304 H 448 Z M 192 32 H 352',
				svgClasses: [ 'stroke-confirm', 'fill-confirm' ],
				action: () => {
					let items = $('div.explorer-item[data-selected="true"]').toArray().map(item => { return { 'type': $(item).attr('data-type'), 'name': $(item).attr('data-name') }; });
					let path = proxy.explorePath;
					let sendData = { path: path, items: items };
					$.ajax({
						url: getContext() + '/ajax/downloadSelection',
						type: 'post',
						data: JSON.stringify(sendData),
						dataType: 'json',
						contentType: 'application/json',
						success: data => {
							if (data.result != 1) {
								Poplet.pop('다운로드에 실패했습니다', Poplet.PopType.INVALID);
								return;
							}
							Poplet.pop('다운로드를 시작합니다');
							const link = document.createElement('a');
							link.href = 'data:text/plain;base64,' + data.data;
							link.download = data.filename;
							link.click();
						}
					});
				}
			},
			'separator',
			{
				role: 'rename',
				text: '이름 바꾸기',
				d: 'M 32 288 L 224 480 480 224 V 32 H 288 Z M 352 128 A 32 32 0 0 0 352 192 A 32 32 0 0 0 352 128 Z',
				svgClasses: [ 'stroke-theme-font' ],
				condition: () => $('div.explorer-item[data-selected="true"]').length == 1,
				action: () => {
					Modalet.show({
						title: '<h3 class="margin-0">이름 바꾸기</h3>',
						content: '<div class="display-flex flex-direction-column justify-content-flex-start align-items-stretch">' +
									'<div class="font-weight-bolder modalet-item-group">' +
									'<label class="margin-right-5px" for="name-for-change">이름</label>' +
							   		'<input id="name-for-change" name="name-for-change" value="' + $('div.explorer-item[data-selected="true"]').attr('data-name') + '" placeholder="변경할 이름">' +
									'</div>' + 
									'</div>',
						type: Modalet.ModalType.OKCANCEL,
						OK: () => {
							let modalResponse = true;
							let changingName = $('div.modalet-modal').find('input#name-for-change').val();
							let dataObj = {
								title: changingName,
								currentTitle: $('div.explorer-item[data-selected="true"]').attr('data-name'),
								directory: proxy.explorePath,
								type: $('div.explorer-item[data-selected="true"]').attr('data-type')
							};
							$.ajax({
								url: getContext() + '/ajax/changeTitle',
								type: 'post',
								data: JSON.stringify(dataObj),
								dataType: 'json',
								contentType: 'application/json',
								async: false,
								success: data => {
									if (data.result != 1) {
										modalResponse = null;
										Poplet.pop(data.result == 0 ? '중복된 이름입니다' : '오류가 발생했습니다', Poplet.PopType.INVALID);
									} else {
										proxy.explorePath = proxy.explorePath;
										Poplet.pop('성공적으로 변경되었습니다', Poplet.PopType.VALID);
									} 
								}
							});
							return modalResponse;
						}
					});
				}
			},
			{
				role: 'delete',
				text: '삭제',
				d: 'M 256 192 L 96 32 32 96 192 256 32 416 96 480 256 320 416 480 480 416 320 256 480 96 416 32 Z',
				svgClasses: [ 'stroke-warning', 'fill-warning' ],
				action: () => {
					
				}
			},
		];
		//contexts = contexts.concat(...itemContexts);
		for (let ct of itemContexts) contexts.push(ct);
	}
	for (let ct of contexts) {
		if (ct === 'separator') {
			let hr = $('<hr style="width: 90%; background-color: var(--subtheme); margin: 2.5px auto;"/>');
			$(contextMenu).append($(hr));
			continue;
		}
		if (typeof ct.condition == 'boolean' && !ct.condition) continue;
		else if (typeof ct.condition == 'function' && !ct.condition()) continue;
		let contextItem = $('<div class="context-menu-item"></div>');
		let contextLeft = $('<div class="context-menu-item-left"></div>');
		let contextRight = $('<div class="context-menu-item-right"></div>');
		$(contextItem).attr('role', ct.role);
		$(contextItem).prepend($(contextLeft));
		$(contextItem).append($(contextRight));
		let svg = document.createElementNS(svgNS, 'svg');
		svg.classList.add('context-menu-item-logo');
		if (typeof ct.svgClasses !== 'undefined') {
			for (let cls of ct.svgClasses) svg.classList.add(cls);
		}
		svg.setAttribute('viewBox', '0 0 512 512');
		let svgPath = document.createElementNS(svgNS, 'path');
		if (ct.d != '') svgPath.setAttribute('d', ct.d);
		$(svg).append($(svgPath));
		$(contextLeft).append($(svg));
		let span = $('<span class="context-menu-item-text"></span>');
		$(span).text(ct.text);
		$(contextLeft).append($(span));
		$(contextItem).click(e => {
			$(contextMenu).remove();
			ct.action();
		});
		$(contextMenu).append($(contextItem));
	}
	$('body').append($(contextMenu));
	$(contextMenu).css({
		top: e.clientY - ($(window).height() < ($(contextMenu).height() + e.clientY) ? $(contextMenu).height() : 0),
		left: e.clientX - ($(window).width() < ($(contextMenu).width() + e.clientX) ? $(contextMenu).width() : 0)
	});
});

$(() => {
	$('div.recent-docs > div.content > div.recent-item > div.recent-item-path > span').each((index, item) => {
		pathAnimation($(item));
	});
});