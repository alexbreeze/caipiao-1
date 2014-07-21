(function($) {

	$(document).ready(function () {
		initNumber();
		initNav();
		toggleHistory();
		bindEvent();
		$('nav ul li:nth-child(2)').trigger('tap');//默认第二种玩法
	})

	var bonusArr = [13,6,19,78,540,90,26,9];//玩法和奖金的对应
	function noteText(mode) {//根据玩法，对应文字提示，mode从1开始
		var html = '';
		var bonus = bonusArr[mode-1];
		if (mode==1) {
			html = '猜中开奖号码第1位';
		} else if (mode<=4) {
			html = '猜中任意'+mode+'个开奖号码';
		} else {
			html = '猜中全部5个开奖号码';
		}
		html += '，单注奖<span>'+bonus+'元</span>';
		return html;
	}

	/**
	 * 奖金预测函数，待补充。
	 */
	function forecastBonus() {

	}

	function initNumber() {
		$(window).on('resize', function(e) {
			var numWidth = $('#select-num .numbers span').width();
			$('#select-num .numbers span').height(numWidth);
			$('#select-num .numbers span').css('line-height', numWidth+'px');
		}).resize();
		$('#select-num .numbers span').on('tap', function(e) {
			$(this).toggleClass('selected');
			var mode = $('nav ul li.active').index()+1;//当前处于什么玩法
			var selectedAmount = $('#select-num .numbers span.selected').length;//有几个球处于选择状态
			if (selectedAmount >= mode) {
				var amount = combination(selectedAmount, mode);//有多少注，组合计算公式
				$('footer .submit').text('共'+amount+'注，下一步');
				$('footer p').html('投入'+2*amount+'元，预测奖金<span>'+bonusArr[mode-1]+'元</span>');
			} else {
				$('footer .submit').text('至少选择'+mode+'个号码');
				$('footer p').html(noteText(mode));
			}
		});
	}

	/*
	点击玩法菜单，重置状态
	 */
	function resetStatus(mode) {
		$('#select-num .numbers span.selected').removeClass('selected');
		$('footer .submit').text('至少选择'+mode+'个号码');
		$('footer p').html(noteText(mode));
	}

	/**
	 * 导航菜单
	 */
	function initNav() {
		$('nav ul').on('tap', function(e) {
			var $target;
			if (e.target.nodeName == 'LI') {
				$target = $(e.target);
			} else {
				$target = $(e.target).parent('li');
			}
			if (!$target.hasClass('active')) {
				$('nav ul li.active').removeClass('active');
				$target.addClass('active');
				resetStatus($target.index()+1);
			}
		});
	}

	/**
	 * 绑定一些事件处理
	 */
	function bindEvent() {
		$('footer .rand').on('tap', function(e) {
			e.preventDefault();
		})
	}



	/**
	 * 下拉历史
	 */
	function toggleHistory() {
		var selectArea = document.getElementById('select-num');
		var topPos = 0;
		var startY = 0;
		var dist = 0;
		var maxPos = $('#main').height()*0.6;
		var criticalPos = $('#main').height()*0.25//临界值
		selectArea.addEventListener('touchstart', function(e) {
			var touchobj = e.changedTouches[0];
			topPos = parseInt(selectArea.style.top);
			startY = parseInt(touchobj.clientY);
			e.preventDefault();
		}, false);
		selectArea.addEventListener('touchmove', function(e) {
			var touchobj = e.changedTouches[0];
			dist = parseInt(touchobj.clientY) - startY;
			var pos = topPos + dist;
			if (pos<0) {
				pos = -1;
			} else if (pos>maxPos) {
				pos = maxPos;
			}
			selectArea.style.top = pos + 'px';
			e.preventDefault();
		}, false);
		selectArea.addEventListener('touchend', function(e) {
			topPos = parseInt(selectArea.style.top);
			if (dist < 0) {
				$('#select-num').animate({top: '-1px'}, 100);
				$('#select-num .top-bar span.opened').hide();
				$('#select-num .top-bar span.closed').show();
			} else {
				if (topPos >= criticalPos) {
					$('#select-num').animate({top: maxPos+'px'}, 100);
					$('#select-num .top-bar span.closed').hide();
					$('#select-num .top-bar span.opened').show();
				} else {
					$('#select-num').animate({top: '-1px'}, 100);
					$('#select-num .top-bar span.opened').hide();
					$('#select-num .top-bar span.closed').show();
				}
			}
			e.preventDefault();
		});
		$('#select-num .top-bar').on('tap', function(e) {
			var topPos = parseInt(selectArea.style.top);
			if (topPos <= 0) {
				$('#select-num').animate({top: maxPos+'px'}, 100);
				$('#select-num .top-bar span.closed').hide();
				$('#select-num .top-bar span.opened').show();
			} else {
				$('#select-num').animate({top: '-1px'}, 100);
				$('#select-num .top-bar span.opened').hide();
				$('#select-num .top-bar span.closed').show();
			}
			e.stopPropagation();
		})
	}

	/**
	 * 从n个不同元素中取出m个元素的组合数，n!/((n-m)!*m!)
	 * @param n
	 * @param m
	 * @constructor
	 */
	function combination(n, m) {
		return fab(n)/(fab(n-m)*fab(m));
	}

	/**
	 * 计算n的阶乘
	 * @param n
	 */
	function fab(n) {
		if (n==1 || n==0) {
			return 1;
		}
		return n*fab(--n);
	}

})(Zepto)


