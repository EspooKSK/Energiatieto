function SystemElectricityProduction(system,constants) {
	var hour;
	var index;
	var systemProfile = new Profile();
	var individualProfile = new Profile();
	for(hour=0;hour<8760;hour++) {
		systemProfile.profile[hour] = 0.0;
	}
	for(index=0;index<system.solarInstallation.length;index++) {
		individualProfile = SolarElectricityProductionProfile(system.solarInstallation[index],constants);
		for(hour=0;hour<8760;hour++) {
			if( !(isNaN(individualProfile.profile[hour])) ) {
				systemProfile.profile[hour] += individualProfile.profile[hour];
			}
		}
	}
	return systemProfile;
}