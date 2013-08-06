function SolarInstallation() {
	this.photovoltaicArea 					= 0; 		// m2
	this.thermalArea 						= 0;		// m2
	this.solarInstallationName				= "";

	// PV panel specific default values. User can view and change if necessary.
	this.photovoltaicPeakPowerFactor 		= 0.15;
	this.photovoltaicInstallationFactor 	= 0.75;		// Depends on the installation. Value 0.75 is applicable when the panel is moderately ventilated

	// Roof specific values from database
	this.roofId 							= 422;
	this.roofArea 							= 151.163; 	// m2
	this.roofAreaAvgIrradiance 				= 789.471; 	// kWh/(m2 year)
	this.roofGoodArea						= 80.3742;	// m2
	this.roofGoodAreaAvgIrradiance			= 916.824;	// kWh/(m2 year)
	this.roofRemainingArea					= 70.7888;	// m2
	this.roofRemainingAreaAvgIrradiance		= 644.8727;	// kWh/(m2 year)

	// Thermal collector specific values
	this.IAM 		= 0.94;
	this.a1 		= 2; // W/m2K
	this.a2 		= 0;
	this.nkierto 	= 0.8;
	this.no 		= 0.83;
	this.thw 		= 40; // degrees celsius
	this.tcw 		= 5; // degrees celsius
//	this.Vnim 		= 400; // dm3
	this.Vll 		= 0; // dm3
	this.xfactor 	= 0.7;

	this.waterHeatingTemperatureDifference			= 50; // Kelvin or Celsius
	this.waterHeatingLosses 						= 0.89;

	this.reservoirVolumeDimensioning = 75;
	this.reservoirCapacityDimensioning = 2.5;

}