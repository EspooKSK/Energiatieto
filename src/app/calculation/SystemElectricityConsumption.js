function SystemElectricityConsumption(system,constants) {
	var hour;
	var index;
	var systemProfile = new Profile();
	var individualProfile = new Profile();
	for(hour=0;hour<8760;hour++) {
		systemProfile.profile[hour] = 0.0;
	}
	for(index=0;index<system.building.length;index++) {
		individualProfile = ElectricityConsumptionProfile(system.building[index],constants);
		for(hour=0;hour<8760;hour++) {
			if( !(isNaN(individualProfile.profile[hour])) ) {
				systemProfile.profile[hour] += individualProfile.profile[hour];
			}
		}
	}
	SystemBoreholeLoadSharing(system,constants);
	for(index=0;index<system.borehole.length;index++) {
		individualProfile = BoreholeElectricityConsumptionProfile(system,system.borehole[index],constants);
		for(hour=0;hour<8760;hour++) {
			if( !(isNaN(individualProfile.profile[hour])) ) {
				systemProfile.profile[hour] += individualProfile.profile[hour];
			}
		}
	}
	return systemProfile;
}