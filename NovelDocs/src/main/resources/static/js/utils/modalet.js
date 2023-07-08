/** Poplet Class Script
 * Created by Hyeongyu Yu
 */

const isHTML = text => {
	let regexForHTML = /<([A-Za-z][A-Za-z0-9]*)\b[^>]*>(.*?)<\/\1>/;
	let isValid = regexForHTML.test(text);
	return isValid;
};

class Modalet {
	static ModalType = {
		OK : 'OK',
		OKCANCEL : 'OKCANCEL',
		YESNO : 'YESNO',
		YESNOCANCEL : 'YESNOCANCEL'
	};
	static ModalResult = {
		OK : 'OK',
		CANCEL : 'CANCEL',
		YES : 'YES',
		NO : 'NO'
	};
	
	static {
		Object.freeze(Modalet.ModalType);
		Object.freeze(Modalet.ModalResult);
	}
	
	static show(data) {
		let content = data.content;
		let title = !data.title ? null : data.title;
		let modaletType = !data.type ? Modalet.ModalType.OK : data.type;
		let actions = {};
		if (!(!data.OK)) actions['OK'] = data.OK;
		if (!(!data.YES)) actions['YES'] = data.YES;
		if (!(!data.NO)) actions['NO'] = data.NO;
		
		let okAction = actions != null && !(!actions.OK) ? actions.OK : () => {};
		let yesAction = actions != null && !(!actions.YES) ? actions.YES : () => {};
		let noAction = actions != null && !(!actions.NO) ? actions.NO : () => {};
		let cancelAction = actions != null && !(!actions.CANCEL) ? actions.CANCEL : () => {};
		
		let backPanel = $('<div></div>');
		$(backPanel).attr('class', 'modalet-background');
		
		let modalPanel = $('<div></div>');
		$(modalPanel).attr('class', 'modalet-modal');
		
		let titleSection = null;
		if (title != null) {
			titleSection = $('<div></div>');
			$(titleSection).attr('class', 'modalet-modal-title');
			if (isHTML(title)) {
				$(titleSection).html(title);
			} else if (title != null) {
				let titleSpan = $('<span></span>');
				$(titleSpan).attr('class', 'modalet-modal-title-span');
				$(titleSpan).text(title);
				$(titleSection).append($(titleSpan));
			}
			$(modalPanel).append($(titleSection));
		}
		
		let modalClose = $('<button type="button"></button>');
		$(modalClose).attr('class', 'modalet-modal-close');
		let modalCloseSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		modalCloseSvg.setAttribute('viewBox', '0 0 512 512');
		let modalCloseSvgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		modalCloseSvg.appendChild(modalCloseSvgPath);
		$(modalClose)[0].appendChild(modalCloseSvg);
		$(modalClose).click(e => {
			$(backPanel).remove();
		});
		$(modalPanel).append($(modalClose));
		
		let contentContainer = $('<div></div>');
		$(contentContainer).attr('class', 'modalet-modal-container');
		let contentSection = $('<div></div>');
		$(contentSection).attr('class', 'modalet-modal-content');
		if (isHTML(content)) {
			$(contentSection).html(content);
		} else {
			let paragraph = $('<p></p>');
			$(paragraph).text(content);
			$(contentSection).append($(paragraph));
		}
		$(contentContainer).append($(contentSection));
		$(modalPanel).append($(contentContainer));
		
		let buttonSection = $('<div></div>');
		$(buttonSection).attr('class', 'modalet-modal-buttons');
		let buttons = [];
		for (let btnType of [ Modalet.ModalResult.OK, Modalet.ModalResult.YES, Modalet.ModalResult.NO, Modalet.ModalResult.CANCEL ]) {
			if (modaletType.includes(btnType)) buttons[buttons.length] = btnType;
		}
		for (let btn of buttons) {
			let className = 'modalet-modal-buttons-button modalet-modal-buttons-' + btn;
			let button = $('<button type="button"></button>');
			let buttonSpan = $('<span></span>');
			$(buttonSpan).text(btn);
			$(button).attr('class', className);
			$(button).append($(buttonSpan));
			$(button).click(e => {
				switch (btn) {
					case Modalet.ModalResult.OK: okAction(); break;
					case Modalet.ModalResult.YES: yesAction(); break;
					case Modalet.ModalResult.NO: noAction(); break;
					case Modalet.ModalResult.CANCEL: cancelAction(); break;
					default: break;
				}
				$(backPanel).remove();
			});
			$(buttonSection).append($(button));
		}
		$(modalPanel).append($(buttonSection));
		$(backPanel).append($(modalPanel));
		$(document).find('body').append($(backPanel));
		let desireHeight = (titleSection == null ? 0 : $(titleSection)?.height() + 10) + $(buttonSection).height() + 50;
		$(contentContainer).css('height', 'calc(100% - ' + desireHeight + 'px)');
		let basis = $(backPanel).height() * 3 / 4;
		if (basis > desireHeight + $(contentSection).height()) $(modalPanel).css('height', (desireHeight + $(contentSection).height()) + 'px');
	}
}