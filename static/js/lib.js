window.ready = function (fn) {
	if (document.addEventListener)
		document.addEventListener("DOMContentLoaded", fn, false);
	else IEContentLoaded(fn);

	function IEContentLoaded(fn) {
		let d = window.document;
		let done = false;

		let init = function () {
			if (!done) {
				done = true;
				fn();
			}
		};

		(function () {
			try {
				d.documentElement.doScroll("left");
			} catch (e) {
				setTimeout(arguments.callee, 50);
				return;
			}
			init();
		})();

		d.onreadystatechange = function () {
			if (d.readyState == "complete") {
				d.onreadystatechange = null;
				init();
			}
		};
	}
};

/**
 * 查询元素是否含某类
 *
 * @param {object} element 元素
 * @param {string} classname 查询类名
 * @returns {boolean}
 */
let hasClass = (element, classname) => {
	return element.classList.contains(classname);
};

/**
 * 为元素添加类
 * 
 * @param {object} element 元素
 * @param {string} classname 类名
 */
let addClass = (element, classname) => {
	element.classList.add(classname);
};

/**
 * 为元素移除类
 * 
 * @param {object} element 元素
 * @param {string} classname 类名
 */
let removeClass = (element, classname)=>{
	element.classList.remove(classname);
}

/**
 * 收合动画
 * modified from https://css-tricks.com/using-css-transitions-auto-dimensions/
 * 
 * @param {object} element 元素
 */
function collapseSection(element) {
	let sectionHeight = element.scrollHeight;
	let elementTransition = element.style.transition;
	element.style.transition = '';
	
	requestAnimationFrame(function() {
	  element.style.height = sectionHeight + 'px';
	  element.style.transition = elementTransition;
	  
	  requestAnimationFrame(function() {
		element.style.height = 0 + 'px';
	  });
	});
}

/**
 * 扩张动画
 * 
 * @param {object} element 元素
 */
 function expandSection(element) {
	let sectionHeight = element.scrollHeight;
	element.style.height = sectionHeight + 'px';
	element.addEventListener('transitionend', function(e) {
	  element.removeEventListener('transitionend', arguments.callee);
	});
  }

let Ajax = {
    get: function(url,resolve,reject){
		new Promise((rs, rj)=> {
			let xhr=new XMLHttpRequest();
			xhr.open('GET',url,true);
			xhr.onreadystatechange=function(){
				if(xhr.readyState==4){
					if(xhr.status==200 || xhr.status==304)
						rs(xhr.responseText);
					else
						rj(xhr.responseText);
				}
			}
			xhr.send();
		}).then(success => {
			resolve(success);
		}).catch(error => {
			reject(error);
		});
    },
    post: function(url,data,resolve,reject){
		new Promise((rs,rj)=>{
			let xhr=new XMLHttpRequest();
			xhr.open('POST',url,true);
			xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
			xhr.onreadystatechange = function(){
				if (xhr.readyState == 4){
					if (xhr.status == 200 || xhr.status == 304)
						rs(xhr.responseText);
					else
						rj(xhr.responseText);
				}
			}
			xhr.send(data);
		}).then(success => {
			resolve(success);
		}).catch(error=>{
			reject(error);
		});
    }
}

/**
 * 显示一个toast
 * @param {string} text 提示语
 */
let showToast = (text) => {
	Toastify({
		text: text,
		duration: 3000,
		gravity: "top",
		position: "center",
		className: "g-toast",
	}).showToast();
};

/**
 * 表单序列化
 * @returns {string}
 */
Object.prototype.serialize = function() {
	let res = [],
	current = null,
	i,
	len,
	k,
	optionLen,
	option,
	optionValue,
	form = this;
	for (i = 0, len = form.elements.length; i < len; i++) {
		current = form.elements[i];
		if (current.disabled) continue;
		switch (current.type) {
		case "file":
		case "submit":
		case "button":
		case "image":
		case "reset":
		case undefined:
			break;
		case "select-one":
		case "select-multiple":
			if (current.name && current.name.length) {
				 	for (k = 0, optionLen = current.options.length; k < optionLen; k++) {
					option = current.options[k];
					optionValue = "";
					if (option.selected) {
						if (option.hasAttribute)
							optionValue = option.hasAttribute('value') ? option.value: option.text
						else 
							optionValue = option.attributes('value').specified ? option.value: option.text;
						res.push(encodeURIComponent(current.name) + "=" + encodeURIComponent(optionValue));
					}
				}
			}
			break;
		case "radio":
		case "checkbox":
			if (!current.checked) break;
		default:
			if (current.name && current.name.length) 
				res.push(encodeURIComponent(current.name) + "=" + encodeURIComponent(current.value));
		}
	}
	return res.join("&");
}