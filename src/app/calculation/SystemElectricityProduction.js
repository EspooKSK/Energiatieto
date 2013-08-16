function SystemElectricityProduction(system,constants) {
    var daysInYear = 365;
    var hoursInDay = 24;
    var hoursInYear = daysInYear * hoursInDay;
	var systemProfile = new Profile();
	var individualProfile = new Profile();
	for(var hour = 0; hour < hoursInYear; hour++) {
		systemProfile.profile[hour] = 0.0;
	}
	for(var index = 0; index < system.solarInstallation.length; index++) {
		individualProfile = SolarElectricityProductionProfile(system.solarInstallation[index], constants);
		for(hour=0; hour < hoursInYear; hour++) {
			if( !(isNaN(individualProfile.profile[hour])) ) {
				systemProfile.profile[hour] += individualProfile.profile[hour];
			}
		}
	}
	return systemProfile;
}
