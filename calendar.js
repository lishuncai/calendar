var jsonData = []

var MonthDays = 42;
		var month_olypic = [31,29,31,30,31,30,31,31,30,31,30,31];//闰年
		var month_normal = [31,28,31,30,31,30,31,31,30,31,30,31];
    var calendar = document.querySelector('.calendar');
    var calendarDate = null;
		// 当月第一天是周几
		function dayStart(month, year) {
			return new Date(year, month, 1).getDay();
		}
		// 月份有多少天
		function daysMonth(month, year) {
			var tmp1 = year % 4;
			if (tmp1 == 0) {
				return month_olypic[month];
			} else {
				return month_normal[month];
			}
		}
		function getRenderDate(myDate) {
			var theMonth = myDate.getMonth();
			var theYear = myDate.getFullYear();
			var totalDay = daysMonth(theMonth, theYear); //月总天数
			var firstDay = dayStart(theMonth, theYear); //星期
      var contentStr = '';
      var addDays = getRemainderDays(theMonth, theYear, firstDay, -1);
			for (var i = 0; i < addDays.length; i++) {
				contentStr += `<div><span class='remainder'>${addDays[i]}</span></div>`;
			}
			for (var i = 0; i < MonthDays - firstDay;i++) {
        var class_today = '';
        var dateObj = new Date(theYear +'/' + (theMonth + 1) + '/' +(i+1));
				if (i < totalDay) {
          if (compareT(new Date(), dateObj)) {
            class_today = 'today';
          } else {
            class_today = '';
          }
          contentStr += `<div data-time=${dateObj.getTime()} class= "day_${dateObj.getDay()} ${class_today}">
            <span>${dateObj.getDate()}</span>
          </div>`;
				}
      }
      var addDaysEnd = getRemainderDays(theMonth, theYear, MonthDays - firstDay - totalDay, 1);
      for (var j = 0; j < addDaysEnd.length; j++) {
        contentStr += `<div><span class='remainder'>${addDaysEnd[j]}</span></div>`;
      }

			//返回当月数据
			return {
				allDaysHtml: contentStr,
				theMonth: theMonth,
				theYear: theYear
			}
    }

    /**
     * 
     * @param {Number} num  数量
     * @param {Number} direction -1 || 1;
     * return 返回数组
     */
    function getRemainderDays(month, year, num, direction) {
      var arr = [];
      var totalDay  = daysMonth(month, year);
      if (num > totalDay) num = totalDay;
        for (var i = 0; i < num; i++) {
          if (direction > 0) {
            arr.push(i+1);
          } else {
            arr.unshift(totalDay - i);
          }
        }
      return arr;
    }

    // 各位补零
    function numFormat(num) {
      if (num < 10) {
        num = '0' + String(num);
      }
      return num;
    }

    render();
		function render(myDate) {
			var myDate = myDate || new Date();
			var myMonthDetail = getRenderDate(myDate);
			var day_contain = calendar.querySelector('.day_contain');
			var theMonthEl = calendar.querySelector('.center');
			day_contain.innerHTML = myMonthDetail.allDaysHtml;
			theMonthEl.innerHTML = myMonthDetail.theYear + '-' + numFormat(myMonthDetail.theMonth+1);
      calendarDate = myDate;
      setActive(jsonData);
		}
		

   calendar.addEventListener('click', handEvent);
   function handEvent(e) {
     var target_class = e.target.className;
     if (target_class.match(/\bleft\b/)) {
      var prevDate = moveDate(calendarDate, -1, 'month');
      render(prevDate);
     } else if (target_class.match(/\bright\b/)) {
      var nextDate = moveDate(calendarDate, 1, 'month');
      render(nextDate);
     }
   }
   /**
   * 切换日期
   */
   function moveDate(now, move, type) {
    var year = now.getFullYear();
    var month = now.getMonth();
    if (type == 'month') {
      month += (move % 12);
      year = year + parseInt(move / 12);
      if (month < 0 ) {
        month = 12 + month;
        year--;
      } else if (month > 11){
        month = month - 12;
        year++;
      }
    } else if (type == 'year') {
      year += move;
    }
    return (new Date(year + '/' + (month + 1) + '/' +1))
   }

   // 插入报名数据
  function setData(node, data) {
    var htmlStr =  `<span class='tip'>可报名</span>`;
    htmlStr += `<span class='price'>¥${data.t2}<span>`;

    var alertBox = `<h3 class="tip">可报名</h3><p>`;
    if (!!data.t2) {
      alertBox += `成人价:<span class="price">￥${data.t2} </span>`;
    }
    if (!!data.t3) {
      alertBox += `儿童价:<span class="price">￥${data.t3}</span>`
    }
    alertBox += '</p>';
    var alertBox_el = document.createElement('div');
    alertBox_el.className = 'alert-box';
    alertBox_el.innerHTML = alertBox;

    var container = document.createElement('div');
    container.className = 'container';
    container.innerHTML = htmlStr;
    container.appendChild(alertBox_el);
    node.insertBefore(container,node.querySelector('span'));
  }

  
  function setActive (jsonData) {
    if (!Array.isArray(jsonData)) return;
    var allDateBox = calendar.querySelector('.day_contain').children;
    for (var i = 0; i < allDateBox.length; i++) {
      var node = allDateBox[i];
      var time = Number(node.dataset.time);
      if (time) {
        for (var j = 0; j < jsonData.length; j++) {
          var itemData = jsonData[j];
          // 如果是同一天
          if (compareT(time, itemData.t1)) {
            setData(node, itemData);
          }
        }
      }
    }
  }
  // 比较是否是同一天
  function compareT(t1, t2) {
    if (t1 && t2) {
      var d1 = new Date(t1);
      var d2 = new Date(t2);
      var d1_year = d1.getFullYear();
      var d1_month = d1.getMonth();
      var d1_day = d1.getDate();
      var d2_year = d2.getFullYear();
      var d2_month = d2.getMonth();
      var d2_day = d2.getDate();
      return ((d1_year == d2_year) && (d1_month == d2_month) && (d1_day == d2_day));
    }
  }