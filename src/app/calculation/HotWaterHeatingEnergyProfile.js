function HotWaterHeatingEnergyProfile(building,constants) {	
	var profile = new Profile();
	var hour;
	for(hour=0;hour<8760;hour++) {
		profile.profile[hour] = 0.0;
	}
	if(building.buildingType == "1" || building.buildingType == "2") {
		for(hour=0;hour<8760;hour++) {
			profile.profile[hour] = (constants.waterThermalCapacity * building.waterHeatingTemperatureDifference / constants.kWhInkJ) * (constants.waterDensity * building.waterConsumptionPerPersonPerDay / 24) * building.numberOfInhabitants / building.waterHeatingLosses;
		}
	}
	return profile;
}