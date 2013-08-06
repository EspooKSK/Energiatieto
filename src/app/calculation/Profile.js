function Profile() {
	
	this.profile = new Array();


	this.year = year;
	function year() {
		var hour;
		var sum = 0.0;
		for (hour=0; hour<8760; hour++) {
			sum += this.profile[hour];
		}
		return sum;
	}


	this.day = day;
	function day(day) {
		var hour;
		var sum = 0.0;
		for(hour=24*(day-1);hour<(24*day);hour++) {
			sum += this.profile[hour];
		}
		return sum;
	}


	this.month = month;
	function month(month) {
		var hour = 0;
		var sum = 0.0;
		var dayFrom = 1;
		var dayTo;
		var monthIndex;
		var dayIndex;
		var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
		for(monthIndex=0;monthIndex<(month-1);monthIndex++) {
			dayFrom += daysInMonth[monthIndex]
		}
		dayTo = dayFrom + daysInMonth[month-1];
		for(dayIndex=dayFrom;dayIndex<dayTo;dayIndex++) {
			sum += this.day(dayIndex);
		}
		return sum;
	}


	this.hour = hour;
	function hour(hour) {
		return this.profile[hour];		
	}


	this.period = period;
	function period(periodStartYear, periodStartMonth, periodEndYear, periodEndMonth) {
		var year = periodStartYear;
		var month = periodStartMonth;
		var sum = 0.0;
		while( +year <= +periodEndYear && ( (+year < +periodEndYear) || (+month <= +periodEndMonth) ) ) {
			sum += this.month(month);
			month++;
			if( month > 12 ) {
				month = 1;
				year++;
			}
		}
		return sum;
	}

	this.hourOfDayAvgValueInMonth = hourOfDayAvgValueInMonth;
	function hourOfDayAvgValueInMonth(hourOfDay,month,constants) {
		var monthIndex;
		var dayFrom = 0;
		var dayTo;
		var dayIndex;
		var hourOfYear = 0;
		var sum = 0.0;
		var n = 0;
		for(monthIndex=0;monthIndex<(month-1);monthIndex++) {
			dayFrom += constants.daysInMonth[monthIndex]
		}
		dayTo = dayFrom + constants.daysInMonth[month-1];
		hourOfYear = dayFrom * 24;
		for(dayIndex=dayFrom;dayIndex<dayTo;dayIndex++) {
			sum += this.profile[hourOfYear+hourOfDay-1];
			n++;
			hourOfYear+=24;
		}
		return sum/n;
	}

	this.hourOfDayMaxValueInMonth = hourOfDayMaxValueInMonth;
	function hourOfDayMaxValueInMonth(hourOfDay,month,constants) {
		var monthIndex;
		var dayFrom = 0;
		var dayTo;
		var dayIndex;
		var hourOfYear = 0;
		var max;
		var n = 0;
		for(monthIndex=0;monthIndex<(month-1);monthIndex++) {
			dayFrom += constants.daysInMonth[monthIndex]
		}
		dayTo = dayFrom + constants.daysInMonth[month-1];
		hourOfYear = dayFrom * 24;
		max = this.profile[hourOfYear+hourOfDay-1];
		for(dayIndex=dayFrom;dayIndex<dayTo;dayIndex++) {
			if(this.profile[hourOfYear+hourOfDay-1] > max) {
				max = this.profile[hourOfYear+hourOfDay-1];
			}
			hourOfYear+=24;
		}
		return max;
	}

	this.hourOfDayMinValueInMonth = hourOfDayMinValueInMonth;
	function hourOfDayMinValueInMonth(hourOfDay,month,constants) {
		var monthIndex;
		var dayFrom = 0;
		var dayTo;
		var dayIndex;
		var hourOfYear = 0;
		var min;
		var n = 0;
		for(monthIndex=0;monthIndex<(month-1);monthIndex++) {
			dayFrom += constants.daysInMonth[monthIndex]
		}
		dayTo = dayFrom + constants.daysInMonth[month-1];
		hourOfYear = dayFrom * 24;
		min = this.profile[hourOfYear+hourOfDay-1];
		for(dayIndex=dayFrom;dayIndex<dayTo;dayIndex++) {
			if(this.profile[hourOfYear+hourOfDay-1] < min) {
				min = this.profile[hourOfYear+hourOfDay-1];
			}
			hourOfYear+=24;
		}
		return min;
	}

	this.yearPositive = yearPositive;
	function yearPositive() {
		var hour;
		var sum = 0.0;
		for (hour=0; hour<8760; hour++) {
			if(this.profile[hour] > 0) {
				sum += this.profile[hour];
			}
		}
		return sum;
	}

	this.yearNegative = yearNegative;
	function yearNegative() {
		var hour;
		var sum = 0.0;
		for (hour=0; hour<8760; hour++) {
			if(this.profile[hour] < 0) {
				sum += this.profile[hour];
			}
		}
		return Math.abs(sum);
	}

	this.yearMin = yearMin;
	function yearMin() {
		var hour;
		var min =this.profile[0];
		for (hour=1; hour<8760; hour++) {
			if(this.profile[hour] < min) {
				min = this.profile[hour];
			}
		}
		return min;
	}

	this.yearMax = yearMax;
	function yearMax() {
		var hour;
		var max =this.profile[0];
		for (hour=1; hour<8760; hour++) {
			if(this.profile[hour] > max) {
				max = this.profile[hour];
			}
		}
		return max;
	}
}
