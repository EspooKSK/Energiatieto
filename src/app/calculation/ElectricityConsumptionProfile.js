function ElectricityConsumptionProfile( building, constants ) {
	var profile = new Profile();
	var distributionProfile = new Profile();
	var hour;
	var yearlyConsumption;
	for(hour=0;hour<8760;hour++) {
		profile.profile[hour] = 0.0;
	}
	if((building.buildingType == "1" && building.electricityConsumptionEstimated == true) || building.buildingType == "2") {
		distributionProfile = ElectricityConsumptionDistributionProfile(building,constants);
		yearlyConsumption = building.nominalElectricityConsumption * building.floorArea;
		for(hour=0;hour<8760;hour++) {
			profile.profile[hour] = yearlyConsumption * distributionProfile.profile[hour];
		}
	}
	return profile;
}

function ElectricityConsumptionDistributionProfile( building, constants ) {
	var weekValue;
	var season;
	var dayType;
	var day;
	var hourOfDay;
	var hourOfYear;
	var sum;
	var profile = new Profile();
	hourOfYear=0;
	sum=0.0;
	for (day=0;day<365;day++) {	
		weekValue = constants.domesticElectricityConsumptionWeekValues [ constants.referenceYearCalendar.week[day] - 1 ];
		dayType = constants.referenceYearCalendar.dayType[day] - 1;
		if( constants.referenceYearCalendar.month[day] == 12 || constants.referenceYearCalendar.month[day] == 1 || constants.referenceYearCalendar.month[day] == 2 ) {
			season = 1;
		} else {
			season = 0;
		}
		for (hourOfDay=0;hourOfDay<24;hourOfDay++) {
			profile.profile[hourOfYear] = weekValue * domesticElectricityConsumptionHourValues[season][dayType][hourOfDay]
			sum+=profile.profile[hourOfYear];
			hourOfYear++;
		}
	}
	for(hourOfYear=0;hourOfYear<8760;hourOfYear++) {
		profile.profile[hourOfYear]/=sum;
	}
	return profile;
}