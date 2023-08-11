/**
 * 
 */

var currentText = '';
const state = {
	status: '준비',
	textChanged: false
};
const stateProxy = new Proxy(state, {
	set(target, prop, value, receiver) {
		if (prop == 'status') {
			$('footer').find('div.footer-left').find('span.state-indicator').text(value);
		} else if (prop == 'textChanged') {
			if (!state[prop] && value) {
				$('header > div.header-left').append($('<span class="textchange-indicator">*</span>'));
				$(window).on('beforeunload', e => {
					if (stateProxy.textChanged == true) {
						return '변경사항이 저장되지 않았습니다.\n종료하시겠습니까?';
					} else {
						return true;
					}
				});
			}
			else if (state[prop] && !value) {
				$('header > div.header-left > span.textchange-indicator').remove();
				$(window).off('beforeunload');
			}
		}
		state[prop] = value;
	}
});

const getCaretPosition = textarea => {
	let start = textarea.selectionStart;
	let end = textarea.selectionEnd;
	
	const createCopy = el => {
		let copy = document.createElement('div');
		copy.textContent = el.value;
		const style = getComputedStyle(el);
		[
			'fontFamily',
			'fontSize',
			'fontWeight',
			'wordWrap', 
			'whiteSpace',
			'borderLeftWidth',
			'borderTopWidth',
			'borderRightWidth',
			'borderBottomWidth',
			'padding',
		].forEach(key => copy.style[key] = style[key]);
		copy.style.overflow = 'auto';
		copy.style.width = el.offsetWidth + 'px';
		copy.style.height = el.offsetHeight + 'px';
		copy.style.position = 'absolute';
		copy.style.left = el.offsetLeft + 'px';
		copy.style.top = el.offsetTop + 'px';
		document.body.appendChild(copy);
		return copy;
	};
	let copy = createCopy(textarea);
	let range = document.createRange();
	if (copy.firstChild != null) {
		range.setStart(copy.firstChild, start);
		range.setEnd(copy.firstChild, end);
	}
	let rect = range.getBoundingClientRect();
	$(copy).remove();
	return {
		x: rect.left - textarea.scrollLeft,
		y: rect.top - textarea.scrollTop,
		width: rect.width,
		height: rect.height
	};
};

const save = () => {
	if (currentText == $('textarea.content').val()) return;
	stateProxy.status = '저장 중 입니다';
	let paths = decodeURI(location.pathname).split(/\//);
	let id = paths[paths.length - 2];
	let docs_id = parseInt(paths[paths.length - 1]);
	let dataObj = {
		id: id,
		docs_id: docs_id,
		content: $('textarea.content').val()
	};
	$.ajax({
		url: getContext() + '/ajax/saveDocument',
		data: JSON.stringify(dataObj),
		type: 'post',
		dataType: 'json',
		contentType: 'application/json',
		success: data => {
			if (data.result == 1) {
				let dt = dateToObject(new Date(data.updateDate));
				stateProxy.status = '저장했습니다 ({0}-{1}-{2} {3}:{4})'.format(dt.year % 100, dt.month, dt.day, dt.hour, dt.minute);
				currentText = $('textarea.content').val();
				stateProxy.textChanged = false;
			} else {
				stateProxy.status = '';
				Poplet.pop('저장에 실패했습니다', Poplet.PopType.INVALID);
			}
		}
	});
};

$(document).on('keydown', 'textarea.content', e => {
	let elem = $(e.target).closest('textarea.content');
	let position = getCaretPosition($(elem)[0]);
	$('div.word-suggestion').css({
		left: position.x,
		top: position.y + position.height
	});
	/*
	let selection = window.getSelection();
	selection?.modify('move', 'forward', 'word');
	selection?.modify('extend', 'backward', 'word');
	const text = selection.toString();
	console.log(text);
	// 현재 커서의 단어를 추출...
	// 문제는 커서 이동이 안됨
	*/
	let start = $(elem)[0].selectionStart;
	let end = $(elem)[0].selectionEnd;
	if (start == end) {
		let fullText = $(elem).val();
		let stopCharacters = [ ' ', '\n', '\r', '\t' ];
		while (start > 0) {
			if (stopCharacters.indexOf(fullText[start]) == -1) --start;
			else break;
		}
		while (end < fullText.length) {
			if (stopCharacters.indexOf(fullText[end]) == -1) ++end;
			else break;
		}
		let word = fullText.substr(start, end - start);
		console.log(word);
	}
});

$(document).on('mousedown', 'div.word-suggestion', e => {
	e.preventDefault();
});


$(document).on('change', 'select.editor-header-select', e => {
	let elem = $(e.target).closest('select.editor-header-select');
	let prop = $(elem).attr('role');
	let value = $(elem).val();
	$('textarea.content').css(prop, value);
});

$(document).on('click', 'button.editor-header-toggle', e => {
	let elem = $(e.target).closest('button.editor-header-toggle');
	let prop = $(elem).attr('role');
	let value = $(elem).attr('role-value');
	if ($(elem).attr('data-toggle') == 'true') $('textarea.content').css(prop, value);
	else $('textarea.content').css(prop, '');
});

$(document).on('input', 'textarea.content', e => {
	let elem = $(e.target).closest('textarea.content');
	if (!stateProxy.textChanged && currentText != $('textarea.content').val()) stateProxy.textChanged = true;
	$('span.text-count-indicator-with-whitespace').text(`공백 포함: ${$(elem).val().length} 자`);
	$('span.text-count-indicator-no-whitespace').text(`공백 제외: ${$('textarea.content').val().replace(/\s+/g, '').length} 자`);
});

$(() => {
	currentText = $('textarea.content').val();
	// state indicator
	$('footer').find('div.footer-left').append($('<span class="state-indicator"></span>'));
	// text count
	$('footer').find('div.footer-right').append($('<span class="text-count-indicator-with-whitespace"></span>'));
	$('footer').find('div.footer-right').append($('<div style="width: 1px; margin-top: 2.5px; margin-bottom: 2.5px; border: 1px solid rgba(var(--subtheme-font-rgb), 0.5); align-self: stretch;"></div>'));
	$('footer').find('div.footer-right').append($('<span class="text-count-indicator-no-whitespace"></span>'));
	
	let { fonts } = document;
	const it = fonts.entries();
	let ffs = [];
	let done = false;
	while (!done) {
		const font = it.next();
		if (!font.done) {
			if (ffs.includes(font.value[0].family)) continue;
			let option = $(`<option value="${font.value[0].family}">${font.value[0].family}</option>`);
			$(option).css('font-family', font.value[0].family);
			$('select[role="font-family"]').append($(option));
			ffs.push(font.value[0].family);
		}
		else done = font.done;
	}
	$('select.editor-header-select').each((index, item) => {
		let elem = $(item);
		let prop = $(elem).attr('role');
		let value;
		switch (prop) {
			case 'font-family':
				value = $('textarea.content').css(prop).match(/"([^"]+)"/)[1];
				break;
			default: value = $('textarea.content').css(prop); break;
		}
		$(elem).val(value);
		//console.log(value);
	});
	$('span.text-count-indicator-with-whitespace').text(`공백 포함: ${$('textarea.content').val().length} 자`);
	$('span.text-count-indicator-no-whitespace').text(`공백 제외: ${$('textarea.content').val().replace(/\s+/g, '').length} 자`);
	if (location.pathname != '/docs/guest') {
		setInterval(save, 60000);
	}
});