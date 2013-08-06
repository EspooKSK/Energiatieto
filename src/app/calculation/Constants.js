function Constants() {
	this.waterThermalCapacity = 4.186; // kJ/(Kelvin kg)
	this.energyContentOfOil = 10.02; // kWh/liter
	this.waterDensity = 1.0; // 1.0 kg/liter
	this.kWhInkJ = 3600; // 1 kWh is 3600 kJ

	this.heatingDemandProfileHelsinkiKaisaniemiReferenceYear = heatingDemandProfileHelsinkiKaisaniemiReferenceYear;
	this.simulatedSpaceHeatingDemandOfResidentialReferenceBuildingFrom2013To2014 = simulatedSpaceHeatingDemandOfResidentialReferenceBuildingFrom2013To2014;
	this.simulatedSpaceHeatingDemandOfResidentialReferenceBuildingFrom2015To2017 = simulatedSpaceHeatingDemandOfResidentialReferenceBuildingFrom2015To2017;
	this.referenceYearCalendar = new ReferenceYearCalendar();
	this.daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	this.domesticElectricityConsumptionWeekValues = domesticElectricityConsumptionWeekValues;
	this.domesticElectricityConsumptionHourValues = domesticElectricityConsumptionHourValues;
	this.vantaaReferenceYearTotalIrradiationOnHorizontalSurface = vantaaReferenceYearTotalIrradiationOnHorizontalSurface;
	this.vantaaReferenceYearOutsideTemperature =  vantaaReferenceYearOutsideTemperature;
	this.ctokelvin = 273.15;

	// bedrock properties
	this.bedrockThermalConductivity = bedrockThermalConductivity;
	this.bedrockUndisturbedTemp = 5.6; // degrees celsius
}