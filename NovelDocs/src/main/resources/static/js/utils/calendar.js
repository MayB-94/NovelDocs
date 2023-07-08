/**
 * 
 */

class Calendar {
	#container;
	#date;
	#viewYear;
	#viewMonth;
	#headerStatus = 'date';
	#selectedYear;
	#selectedMonth;
	getDate = () => this.#date;
	setDate = date => this.#date = date;
	
	#prevMonthAction = e => {};
	#nextMonthAction = e => {};
	#selectDateAction = e => {};
	
	constructor(selector, actions = null) {
		if ($(selector).toArray().length == 0) throw new ReferenceError('\'' + selector + '\'' + ' is invalid query selector');
		this.#date = new Date(Date.now());
		this.#container = $(selector)[0];
		this.#viewYear = this.#date.getFullYear();
		this.#viewMonth = this.#date.getMonth() + 1;
		this.#createCalendar(actions);
	}
	#createCalendar(actions = null) {
		let [ year, month, day ] = [ this.#date.getFullYear(), this.#date.getMonth() + 1, this.#date.getDate() ];
		this.#prevMonthAction = !actions?.prevMonth ? null : actions?.prevMonth;
		this.#nextMonthAction = !actions?.nextMonth ? null : actions?.nextMonth;
		this.#selectDateAction = !actions?.selectDate ? null : actions?.selectDate;
		
		// Create Elements
		let section = $('<div class="calendar-section"></div>');
		// header
		let header = $('<div class="calendar-month"></div>');
		let prevButton = $('<button type="button" class="calendar-month-button" role="prev-month"></div>');
		$(prevButton).html('<svg viewBox="0 0 512 512"><path d="M 368 32 L 144 256 368 480"/></svg>');
		$(prevButton).click(e => {
			if (this.#headerStatus == 'date') {
				this.#navigate(true);
				if (typeof this.#prevMonthAction === 'function') this.#prevMonthAction(e);
			} else if (this.#headerStatus == 'month') {
				this.#viewYear -= 1;
				this.#changeMonth();
			} else if (this.#headerStatus == 'year') {
				if (this.#viewYear >= 1990) {
					this.#viewYear -= 20;
					this.#changeYear();
				}
			}
		});
		let indicator = $('<span class="calendar-month-label"></span>');
		$(indicator).text(year + '. ' + month + '.');
		$(indicator).click(e => {
			switch(this.#headerStatus) {
				case 'date':
					this.#headerStatus = 'month';
					this.#selectedYear = this.#viewYear;
					this.#selectedMonth = this.#viewMonth;
					this.#changeMonth();
					break;
				case 'month':
					this.#headerStatus = 'year';
					this.#changeYear();
					break;
				default:
					break;
			}
		});
		let nextButton = $('<button type="button" class="calendar-month-button" role="next-month"></div>');
		$(nextButton).html('<svg viewBox="0 0 512 512"><path d="M 144 32 L 368 256 144 480"/></svg>');
		$(nextButton).click(e => {
			if (this.#headerStatus == 'date') {
				this.#navigate(false);
				if (typeof this.#nextMonthAction === 'function') this.#nextMonthAction(e);
			} else if (this.#headerStatus == 'month') {
				this.#viewYear += 1;
				this.#changeMonth();
			} else if (this.#headerStatus == 'year') {
				this.#viewYear += 20;
				this.#changeYear();
			}
		});
		$(header).append([ $(prevButton), $(indicator), $(nextButton) ]);
		// content
		let target = $('<div class="calendar-container"></div>');
		
		let lastDate = new Date(year, month, 0);
		let indent = new Date(year, month - 1, 1).getDay();
		$(target).empty();
		for (let day of [ '일', '월', '화', '수', '목', '금', '토' ]) {
			let headerCell = $('<div></div>');
			if (day == '일') $(headerCell).css('-webkit-text-stroke', '1px red');
			else if (day == '토') $(headerCell).css('-webkit-text-stroke', '1px blue');
			$(headerCell).attr('class', 'calendar-cell');
			$(headerCell).text(day);
			$(target).append($(headerCell));
		}
		if (indent != 0) {
			let prefix = $('<div></div>');
			$(prefix).css('width', 'calc(' + (100 * indent / 7) + '% - 5px)');
			$(prefix).css('margin', '2.5px');
			$(target).append($(prefix));
		}
		for (let i = 1; i <= lastDate.getDate(); i++) {
			let dateCell = $('<div></div>');
			$(dateCell).attr('class', 'calendar-cell calendar-selectable');
			if (i == this.#date.getDate()) $(dateCell).attr('data-selected', 'true');
			else $(dateCell).attr('data-selected', 'false');
			$(dateCell).attr('data-date', i);
			$(dateCell).text(i);
			if ((indent + i - 1) % 7 == 0) $(dateCell).css('-webkit-text-stroke', '1px red');
			else if ((indent + i - 1) % 7 == 6) $(dateCell).css('-webkit-text-stroke', '1px blue');
			$(dateCell).click(e => {
				let elem = $(e.target).closest('.calendar-selectable');
				let ct = $(elem).closest('div.calendar-container');
				let cld = $(elem).closest('div.calendar');
				$(ct).find('.calendar-selectable').not(elem).attr('data-selected', 'false');
				$(elem).attr('data-selected', 'true');
				this.#date = new Date(this.#viewYear, this.#viewMonth - 1, i);
				if (typeof this.#selectDateAction === 'function') this.#selectDateAction(e);
			});
			$(target).append($(dateCell));
		}
		
		// append children
		$(section).append([ $(header), $(target) ]);
		
		$(this.#container).append($(section));
	}
	#changeDate(date) {
		this.#date = new Date(date);
		let [ year, month, day ] = [ this.#date.getFullYear(), this.#date.getMonth() + 1, this.#date.getDate() ];
		this.#viewYear = year;
		this.#viewMonth = month;
		
		// Create Elements
		let header = $(this.#container).find('div.calendar-month');
		$(header).find('span.calendar-month-label').text(year + '. ' + month + '.');
		// content
		let target = $(this.#container).find('div.calendar-container');
		
		let lastDate = new Date(year, month, 0);
		let indent = new Date(year, month - 1, 1).getDay();
		$(target).empty();
		for (let day of [ '일', '월', '화', '수', '목', '금', '토' ]) {
			let headerCell = $('<div></div>');
			if (day == '일') $(headerCell).css('-webkit-text-stroke', '1px red');
			else if (day == '토') $(headerCell).css('-webkit-text-stroke', '1px blue');
			$(headerCell).attr('class', 'calendar-cell');
			$(headerCell).text(day);
			$(target).append($(headerCell));
		}
		if (indent != 0) {
			let prefix = $('<div></div>');
			$(prefix).css('width', 'calc(' + (100 * indent / 7) + '% - 5px)');
			$(prefix).css('margin', '2.5px');
			$(target).append($(prefix));
		}
		for (let i = 1; i <= lastDate.getDate(); i++) {
			let dateCell = $('<div></div>');
			$(dateCell).attr('class', 'calendar-cell calendar-selectable');
			if (i == this.#date.getDate()) $(dateCell).attr('data-selected', 'true');
			else $(dateCell).attr('data-selected', 'false');
			$(dateCell).attr('data-date', i);
			$(dateCell).text(i);
			if ((indent + i - 1) % 7 == 0) $(dateCell).css('-webkit-text-stroke', '1px red');
			else if ((indent + i - 1) % 7 == 6) $(dateCell).css('-webkit-text-stroke', '1px blue');
			$(dateCell).click(e => {
				let elem = $(e.target).closest('.calendar-selectable');
				let ct = $(elem).closest('div.calendar-container');
				let cld = $(elem).closest('div.calendar');
				$(ct).find('.calendar-selectable').not(elem).attr('data-selected', 'false');
				$(elem).attr('data-selected', 'true');
				this.#date = new Date(this.#viewYear, this.#viewMonth - 1, i);
				if (typeof this.#selectDateAction === 'function') this.#selectDateAction(e);
			});
			$(target).append($(dateCell));
		}
	}
	#navigate(isPrev = true) {
		if (isPrev) this.#viewMonth -= 1;
		else if (isPrev == false) this.#viewMonth += 1;
		if (this.#viewMonth < 1) {
			this.#viewMonth += 12;
			this.#viewYear -= 1;
		} else if (this.#viewMonth > 12) {
			this.#viewMonth -= 12;
			this.#viewYear += 1;
		}
		
		let [ year, month, day ] = [ this.#viewYear, this.#viewMonth, this.#date.getDate() ];
		
		// Create Elements
		let header = $(this.#container).find('div.calendar-month');
		$(header).find('span.calendar-month-label').text(year + '. ' + month + '.');
		// content
		let target = $(this.#container).find('div.calendar-container');
		
		let lastDate = new Date(year, month, 0);
		let indent = new Date(year, month - 1, 1).getDay();
		$(target).empty();
		for (let day of [ '일', '월', '화', '수', '목', '금', '토' ]) {
			let headerCell = $('<div></div>');
			if (day == '일') $(headerCell).css('-webkit-text-stroke', '1px red');
			else if (day == '토') $(headerCell).css('-webkit-text-stroke', '1px blue');
			$(headerCell).attr('class', 'calendar-cell');
			$(headerCell).text(day);
			$(target).append($(headerCell));
		}
		if (indent != 0) {
			let prefix = $('<div></div>');
			$(prefix).css('width', 'calc(' + (100 * indent / 7) + '% - 5px)');
			$(prefix).css('margin', '2.5px');
			$(target).append($(prefix));
		}
		for (let i = 1; i <= lastDate.getDate(); i++) {
			let dateCell = $('<div></div>');
			$(dateCell).attr('class', 'calendar-cell calendar-selectable');
			$(dateCell).attr('data-selected', 'false');
			$(dateCell).attr('data-date', i);
			$(dateCell).text(i);
			if ((indent + i - 1) % 7 == 0) $(dateCell).css('-webkit-text-stroke', '1px red');
			else if ((indent + i - 1) % 7 == 6) $(dateCell).css('-webkit-text-stroke', '1px blue');
			$(dateCell).click(e => {
				let elem = $(e.target).closest('.calendar-selectable');
				let ct = $(elem).closest('div.calendar-container');
				let cld = $(elem).closest('div.calendar');
				$(ct).find('.calendar-selectable').not(elem).attr('data-selected', 'false');
				$(elem).attr('data-selected', 'true');
				this.#date = new Date(this.#viewYear, this.#viewMonth - 1, i);
				if (typeof this.#selectDateAction === 'function') this.#selectDateAction(e);
			});
			$(target).append($(dateCell));
		}
		if (this.#date.getFullYear() == year && this.#date.getMonth() + 1 == month && this.#date.getDate() == day) {
			$(target).find('div.calendar-selectable[data-date="' + day + '"]').click();
		}
	}
	#changeMonth() {
		$('span.calendar-month-label').text(`${this.#viewYear}.`);
		$('span.calendar-month-label').css('pointer-events', '');
		$('div.calendar-container').empty();
		for (let month = 1; month <= 12; month++) {
			let monthCell = $('<div class="calendar-month-cell calendar-selectable"></div>');
			$(monthCell).text(month);
			$(monthCell).attr({
				'data-month' : month,
				'data-selected' : 'false'
			});
			$(monthCell).click(e => {
				this.#viewMonth = month;
				this.#headerStatus = 'date';
				this.#navigate(null);
			});
			$('div.calendar-container').append($(monthCell));
		}
		let buttons = $('<div class="calendar-container-buttons"></div>');
		let rollback = $('<button type="button" class="rollback-button"></button>');
		let rollbackSpan = $('<span></span>');
		$(rollbackSpan).text('취소');
		$(rollback).append($(rollbackSpan));
		$(rollback).click(e => {
			this.#viewYear = this.#selectedYear;
			this.#viewMonth = this.#selectedMonth;
			this.#headerStatus = 'date';
			$('span.calendar-month-label').css('pointer-events', '');
			this.#navigate(null);
		});
		let today = $('<button type="button" class="today-button"></button>');
		let todaySpan = $('<span></span>');
		$(todaySpan).text('오늘');
		$(today).append($(todaySpan));
		$(today).click(e => {
			this.#viewYear = new Date().getFullYear();
			this.#viewMonth = new Date().getMonth() + 1;
			this.#headerStatus = 'date';
			$('span.calendar-month-label').css('pointer-events', '');
			this.#navigate(null);
		});
		$(buttons).append([ $(rollback), $(today) ]);
		$('div.calendar-container').append($(buttons));
	}
	#changeYear() {
		$('span.calendar-month-label').text('연도 선택');
		$('span.calendar-month-label').css('pointer-events', 'none');
		$('div.calendar-container').empty();
		let mod = (this.#viewYear - 1970) % 20;
		let startYear = this.#viewYear - mod;
		let lastYear = startYear + 19;
		for (let year = startYear; year <= lastYear; year++) {
			let yearCell = $('<div class="calendar-year-cell calendar-selectable"></div>');
			$(yearCell).text(year);
			$(yearCell).attr({
				'data-year' : year,
				'data-selected' : 'false'
			});
			$(yearCell).click(e => {
				this.#viewYear = year;
				this.#headerStatus = 'month';
				this.#changeMonth();
			});
			$('div.calendar-container').append($(yearCell));
		}
		let buttons = $('<div class="calendar-container-buttons"></div>');
		let rollback = $('<button type="button" class="rollback-button"></button>');
		let rollbackSpan = $('<span></span>');
		$(rollbackSpan).text('취소');
		$(rollback).append($(rollbackSpan));
		$(rollback).click(e => {
			this.#viewYear = this.#selectedYear;
			this.#viewMonth = this.#selectedMonth;
			this.#headerStatus = 'date';
			$('span.calendar-month-label').css('pointer-events', '');
			this.#navigate(null);
		});
		let today = $('<button type="button" class="today-button"></button>');
		let todaySpan = $('<span></span>');
		$(todaySpan).text('오늘');
		$(today).append($(todaySpan));
		$(today).click(e => {
			this.#viewYear = new Date().getFullYear();
			this.#viewMonth = new Date().getMonth() + 1;
			this.#headerStatus = 'date';
			$('span.calendar-month-label').css('pointer-events', '');
			this.#navigate(null);
		});
		$(buttons).append([ $(rollback), $(today) ]);
		$('div.calendar-container').append($(buttons));
	}
}