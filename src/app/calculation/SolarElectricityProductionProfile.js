function SolarElectricityProductionProfile( solarInstallation, constants ) {
	var profile = new Profile();
	var hour;
	var electricityProductionTotal;
	electricityProductionTotal = InstallationAreaAvgIrradiance(solarInstallation,constants) * solarInstallation.photovoltaicArea * solarInstallation.photovoltaicPeakPowerFactor * solarInstallation.photovoltaicInstallationFactor;
		for(hour=0;hour<8760;hour++) {
			profile.profile[hour] = electricityProductionTotal * constants.vantaaReferenceYearTotalIrradiationOnHorizontalSurface[hour];
		}
	return profile;
}

function InstallationAreaAvgIrradiance(solarInstallation,constants) {
	var installationAreaAvgIrradiance;
	var installationAreaOnGoodRoof;
	var installationAreaOnRemainingRoof;
	var installationAreaTotal = solarInstallation.photovoltaicArea + solarInstallation.thermalArea;
	if(installationAreaTotal > solarInstallation.roofArea) {
		installationAreaTotal = solarInstallation.roofArea;
	}
	if(installationAreaTotal <= solarInstallation.roofGoodArea) {
		installationAreaOnGoodRoof = installationAreaTotal;
		installationAreaOnRemainingRoof = 0;
	} else {
		installationAreaOnGoodRoof = solarInstallation.roofGoodArea;
		installationAreaOnRemainingRoof = installationAreaTotal - installationAreaOnGoodRoof;
	}
	if (installationAreaTotal > 0 ) {
		installationAreaAvgIrradiance = ((installationAreaOnGoodRoof * solarInstallation.roofGoodAreaAvgIrradiance + installationAreaOnRemainingRoof * solarInstallation.roofRemainingAreaAvgIrradiance) / installationAreaTotal);
	} else {
		installationAreaAvgIrradiance = 0;
	}
	return installationAreaAvgIrradiance;
}