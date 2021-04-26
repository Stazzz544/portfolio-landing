
//функция для подключения webp
function testWebP(callback) {

	var webP = new Image();
	webP.onload = webP.onerror = function () {
		callback(webP.height == 2);
	};
	webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}

testWebP(function (support) {

	if (support == true) {
		document.querySelector('body').classList.add('webp');
	} else {
		document.querySelector('body').classList.add('no-webp');
	}
});

//==================================


//menu
const burger = document.querySelector('.burger'),
	menu = document.querySelector('.menu'),
	close = document.querySelector('.menu__close');

burger.addEventListener('click', () => {
	menu.classList.toggle('menu_active');
});

close.addEventListener('click', () => {
	menu.classList.remove('menu_active');
});

// const percent = document.querySelectorAll('.skills__grid-container-bar-percent'),
// 	lines = document.querySelector('.skills__grid-container-bar span');

// percent.forEach( (item, i) => {
// 	lines[i].style.width = item.innerHTML;
// });


// console.log(lines);
// console.log(percent);


const percent = document.querySelectorAll('.skills__grid-container-bar-percent'),
      lines = document.querySelectorAll('.skills__grid-container-bar span');

percent.forEach((item, i) => {
  lines[i].style.width = item.innerHTML;
});
