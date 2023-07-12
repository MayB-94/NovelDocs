/**
 * 
 */

// Sidebar toggle actions
$(document).on('click', 'button.side-toggle', e => {
	let elem = $(e.target).closest('button.side-toggle');
	if ($(elem).attr('data-toggle') == 'true')
		$('aside').show('slide', { width: 250, easing: 'easeOutQuint' }, 250, () => {
			
		});
	else
		$('aside').hide('slide', { width: 0, easing: 'easeOutQuint' }, 250, () => {
			
		});
});

$(document).on('click', 'button.logout-button', e => {
	location.href = getContext() + '/logout';
});

$(() => {
	if (location.pathname == '/') {
		$('span.doc-title').text('DashBoard');
		$('span.doc-title').css('margin-left', '10px');
		$('button.side-toggle').remove();
		$('aside').remove();
	}
});