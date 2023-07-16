/**
 * 
 */

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
	$('span.text-count-indicator-with-whitespace').text(`공백 포함: ${$(elem).val().length} 자`);
	$('span.text-count-indicator-no-whitespace').text(`공백 제외: ${$('textarea.content').val().replace(/\s+/g, '').length} 자`);
});

$(() => {
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
});