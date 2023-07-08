/**
 * 
 */
const getContext = () => location.protocol + '//' + location.host;

const dateToObject = (date, fullFormat = true) => {
	if (!(date instanceof Date)) throw new IllegalArgumentException();
	let [year, month, day, hour, minute, second] = [ date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds() ];
	month = !fullFormat ? month : (month < 10 ? '0' + month : month);
	day = !fullFormat ? day : (day < 10 ? '0' + day : day);
	hour = !fullFormat ? hour : (hour < 10 ? '0' + hour : hour);
	minute = !fullFormat ? minute : (minute < 10 ? '0' + minute : minute);
	second = !fullFormat ? second : (second < 10 ? '0' + second : second);
	return {
		year: year,
		month: month,
		day: day,
		hour: hour,
		minute: minute,
		second: second
	};
};

String.prototype.format = function() {
    var formatted = this;
    for( var arg in arguments ) {
        formatted = formatted.replace("{" + arg + "}", arguments[arg]);
    }
    return formatted;
};

// Toggle Element Actions
$(document).on('click', '.toggle', e => {
	let elem = $(e.target).closest('.toggle');
	let toggled = $(elem).attr('data-toggle') == 'true';
	$(elem).attr('data-toggle', toggled ? 'false' : 'true');
});

$(() => {
	$('svg').not('[viewBox]').each((index, item) => $(item)[0].setAttribute('viewBox', '0 0 512 512'));
	$('.toggle').not('[data-toggle]').attr('data-toggle', 'false');
});