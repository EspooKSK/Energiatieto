function SolarHeatingEnergyProductionProfile(solarInstallation, constants) {
	var profile = new Profile();
	var day;
	var month;
	var hourOfYear = 0;
	var hourOfDay;
	var irradianceProfile = SolarIrradianceProfile(solarInstallation, constants);
	var arrayOfMonths = SolarHeatEnergyProductionArrayOfMonths(solarInstallation,constants);
	var irradianceInMonth;
	for(month=1;month<=12;month++) {
		irradianceInMonth = irradianceProfile.month(month);
		for(day=0;day<constants.daysInMonth[month-1];day++) {
			for(hourOfDay=0;hourOfDay<24;hourOfDay++) {
				if(irradianceInMonth > 0) {
					profile.profile[hourOfYear] = (arrayOfMonths[month-1] * irradianceProfile.profile[hourOfYear]) / irradianceInMonth;
				} else {
					profile.profile[hourOfYear] = 0;
				}
				hourOfYear++;
			}
		}
	}
	return profile;
}

function SolarHeatEnergyProductionArrayOfMonths(solarInstallation, constants) {
	var month;
	var energyProduction = new Array();
	var reservoirVolume  = solarInstallation.reservoirVolumeDimensioning * solarInstallation.thermalArea;
	var hotWaterInMonth;
	var energyDemand;
	for(month=1;month<=12;month++) {
		hotWaterInMonth = constants.daysInMonth[month-1] * reservoirVolume / solarInstallation.reservoirCapacityDimensioning;
		energyDemand = (constants.waterThermalCapacity * solarInstallation.waterHeatingTemperatureDifference / constants.kWhInkJ) * (constants.waterDensity * hotWaterInMonth) / solarInstallation.waterHeatingLosses;
		energyProduction[month-1] = SolarHeatingEnergyProductionInMonth(solarInstallation, constants, month, energyDemand, reservoirVolume);	
	}
	return energyProduction;
}

function SolarHeatingEnergyProductionInMonth(solarInstallation, constants, month, energyDemand, reservoirVolume) {
	var A 			= Number(solarInstallation.thermalArea);
	var IAM 		= Number(solarInstallation.IAM);
	var a1 			= Number(solarInstallation.a1);
	var a2 			= Number(solarInstallation.a2);	
	var nkierto 	= Number(solarInstallation.nkierto);	
	var no 			= Number(solarInstallation.no);	
	var thw 		= Number(solarInstallation.thw);	
	var tcw 		= Number(solarInstallation.tcw);	
	var Vnim 		= reservoirVolume;	
	var Vll 		= Number(solarInstallation.Vll);	
	var xfactor 	= Number(solarInstallation.xfactor);	

	var a 			=  1.029;
	var b 			= -0.065;
	var c 			= -0.245;
	var d 			=  0.0018;
	var e 			=  0.0215;
	var f 			=  0;
	var ctyyppi 	=  1;
	var Vref 		=  75 * A;

	var th;
	var Uc;
	var Ul;
	var dT;
	var te;
	var tref;
	var ccap;
	var Vtod;
	var fapu;
	var X;
	var Y;

	var Qtarve = energyDemand;
	var Qkerain;
	var Qtuotto;

	// keräimen saama aurinkosäteily tarkastelukuukautena
	Qkerain = SolarIrradianceProfile(solarInstallation,constants).month(month);

	// tarkastelukuukauden pituus tunteina
	th = constants.daysInMonth[month-1]*24;

	// tarkastelukuukauden keskimääräinen ulkolämpötila
	var vantaaReferenceYearOutsideTemperature = new Profile();
	vantaaReferenceYearOutsideTemperature.profile = constants.vantaaReferenceYearOutsideTemperature;
	te = vantaaReferenceYearOutsideTemperature.month(month) / th;

	// keräinpiirin putkiston lämpöhäviökerroin
	Ul = 5 + 0.5*A;

	// keräinpiirin lämpöhäviökerroin
	Uc = a1 + 40*a2 + Ul/A;

	// sovelluksesta ja varastotyypistä riippuva vertailulämpötila
	tref = 11.6 + 1.180*thw + 3.86*tcw - 1.32*te

	// referenssilämpötilaero
	dT = tref - te;

	// varaajan tilavuuden korjaus
	fapu = xfactor * Vll/Vnim;
	Vtod = Vnim*(1-fapu);

	// varaajakapasiteetin korjauskerroin
	ccap = Math.pow(Vtod/Vref, -0.25);

	// häviöt-tarve -suhde
	X = (A*Uc*nkierto*dT*th*ccap)/(Qtarve*1000);

	// tuotto-tarve -suhde
	Y = (A*IAM*no*nkierto*Qkerain)/Qtarve;

	// järjestelmän energiantuotto
	Qtuotto = ctyyppi * ( a*Y + b*X + c*Math.pow(Y,2) + d*Math.pow(X,2) + e*Math.pow(Y,3) + f*Math.pow(X,3) ) * Qtarve;
	if(Qtuotto<0) {
		Qtuotto = 0.0;
	}

	var debugEl = document.getElementById("debug");
	if (debugEl) {
		debugEl.innerHTML += "<br>Qtarve: " + Qtarve;
		debugEl.innerHTML += "<br>kuukausi: " + month;	
		debugEl.innerHTML += "<br>Qkerain: " + Qkerain;
		debugEl.innerHTML += "<br>th: " + th;
		debugEl.innerHTML += "<br>te: " + te;
		debugEl.innerHTML += "<br>Ul: " + Ul;
		debugEl.innerHTML += "<br>Uc: " + Uc;
		debugEl.innerHTML += "<br>tref: " + tref;
		debugEl.innerHTML += "<br>dT: " + dT;
		debugEl.innerHTML += "<br>Vtod: " + Vtod;
		debugEl.innerHTML += "<br>ccap: " + ccap;
		debugEl.innerHTML += "<br>X: " + X;
		debugEl.innerHTML += "<br>Y: " + Y;
		debugEl.innerHTML += "<br>Qtuotto: " + Qtuotto;
	//	debugEl.innerHTML += "<br>" + Qtarve + ";" + Qtuotto;
		debugEl.innerHTML += "<br>";
	}

	return Qtuotto;
} 

function SolarIrradianceProfile(solarInstallation, constants) {
	var hour;
	var profile = new Profile();
	var avgIrradiance = InstallationAreaAvgIrradiance(solarInstallation,constants);
	for(hour=0;hour<8760;hour++) {
			profile.profile[hour] = avgIrradiance * constants.vantaaReferenceYearTotalIrradiationOnHorizontalSurface[hour];
		}
	return profile;		
}







