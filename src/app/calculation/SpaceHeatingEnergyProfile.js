function SpaceHeatingEnergyProfile( building, constants ) {
	var profile = new Profile();
	var hour;
	var consumedSpaceHeatingEnergy;
	var normalizedSpaceHeatingEnergyDemand;
	for(hour=0;hour<8760;hour++) {
		profile.profile[hour] = 0.0;
	}
	// "Asuinrakennus"
	if ( building.buildingType == "1" ) {
		normalizedSpaceHeatingDemand = 0.0;
		if ( building.spaceHeatingEnergyEstimated != true ) {
			// District heating
			if ( building.heatingSystem == "1" ) {
				if ( building.energyConsumptionIncludesWaterHeating == true ) {
					consumedSpaceHeatingEnergy = HeatingEnergyFromDistrictHeating ( building, constants );
					consumedSpaceHeatingEnergy -= HotWaterHeatingEnergyProfile( building, constants ).period( building.energyConsumptionPeriodStartYear, building.energyConsumptionPeriodStartMonth, building.energyConsumptionPeriodEndYear, building.energyConsumptionPeriodEndMonth );					
				} else {
					consumedSpaceHeatingEnergy = HeatingEnergyFromDistrictHeating ( building, constants );
				}
				var periodActual = ActualHeatingDemandHelsinkiKaisaniemi( building.energyConsumptionPeriodStartYear, building.energyConsumptionPeriodStartMonth, building.energyConsumptionPeriodEndYear, building.energyConsumptionPeriodEndMonth );
				var periodReference = ReferenceHeatingDemandHelsinkiKaisaniemi( building.energyConsumptionPeriodStartYear, building.energyConsumptionPeriodStartMonth, building.energyConsumptionPeriodEndYear, building.energyConsumptionPeriodEndMonth );
				var periodRatio = periodReference / periodActual;
				var fullYearReference = ReferenceHeatingDemandHelsinkiKaisaniemi( 2011,1,2011,12 );
				normalizedSpaceHeatingDemand = (periodRatio * consumedSpaceHeatingEnergy) / periodReference * fullYearReference;
			}
			// Oil heating
			if ( building.heatingSystem == "2" ) {
				if ( building.energyConsumptionIncludesWaterHeating == true ) {
					consumedSpaceHeatingEnergy = HeatingEnergyFromOil ( building, constants );
					consumedSpaceHeatingEnergy -= HotWaterHeatingEnergyProfile( building, constants ).period( building.energyConsumptionPeriodStartYear, building.energyConsumptionPeriodStartMonth, building.energyConsumptionPeriodEndYear, building.energyConsumptionPeriodEndMonth );				
				} else {
					consumedSpaceHeatingEnergy = HeatingEnergyFromOil ( building, constants );
				}
				var periodActual = ActualHeatingDemandHelsinkiKaisaniemi( building.energyConsumptionPeriodStartYear, building.energyConsumptionPeriodStartMonth, building.energyConsumptionPeriodEndYear, building.energyConsumptionPeriodEndMonth );
				var periodReference = ReferenceHeatingDemandHelsinkiKaisaniemi( building.energyConsumptionPeriodStartYear, building.energyConsumptionPeriodStartMonth, building.energyConsumptionPeriodEndYear, building.energyConsumptionPeriodEndMonth );
				var periodRatio = periodReference / periodActual;
				var fullYearReference = ReferenceHeatingDemandHelsinkiKaisaniemi( 2011,1,2011,12 );
				normalizedSpaceHeatingDemand = (periodRatio * consumedSpaceHeatingEnergy) / periodReference * fullYearReference;				
			}
			// Electric heating
			if ( building.heatingSystem == "3" ) {
				if ( building.energyConsumptionIncludesWaterHeating == true ) {
					consumedSpaceHeatingEnergy = building.electricityConsumption;
					consumedSpaceHeatingEnergy -= HotWaterHeatingEnergyProfile( building, constants ).period( building.electricityConsumptionPeriodStartYear, building.electricityConsumptionPeriodStartMonth, building.electricityConsumptionPeriodEndYear, building.electricityConsumptionPeriodEndMonth );				
					consumedSpaceHeatingEnergy -= ElectricityConsumptionProfile( building, constants ).period( building.electricityConsumptionPeriodStartYear, building.electricityConsumptionPeriodStartMonth, building.electricityConsumptionPeriodEndYear, building.electricityConsumptionPeriodEndMonth );				
				} else {
					consumedSpaceHeatingEnergy = building.electricityConsumption	
					consumedSpaceHeatingEnergy -= ElectricityConsumptionProfile( building, constants ).period( building.electricityConsumptionPeriodStartYear, building.electricityConsumptionPeriodStartMonth, building.electricityConsumptionPeriodEndYear, building.electricityConsumptionPeriodEndMonth );				
				}
				var periodActual = ActualHeatingDemandHelsinkiKaisaniemi( building.electricityConsumptionPeriodStartYear, building.electricityConsumptionPeriodStartMonth, building.electricityConsumptionPeriodEndYear, building.electricityConsumptionPeriodEndMonth );
				var periodReference = ReferenceHeatingDemandHelsinkiKaisaniemi( building.electricityConsumptionPeriodStartYear, building.electricityConsumptionPeriodStartMonth, building.electricityConsumptionPeriodEndYear, building.electricityConsumptionPeriodEndMonth );
				var periodRatio = periodReference / periodActual;
				var fullYearReference = ReferenceHeatingDemandHelsinkiKaisaniemi( 2011,1,2011,12 );
				normalizedSpaceHeatingDemand = (periodRatio * consumedSpaceHeatingEnergy) / periodReference * fullYearReference;
			}			
		}
		// Other heating system or heating energy is estimated
		if ( building.spaceHeatingEnergyEstimated == true || building.heatingSystem == "4") {
			normalizedSpaceHeatingDemand = NominalSpaceHeatingDemandEstimate( building, constants );
		}
		if(normalizedSpaceHeatingDemand < 0) {
			normalizedSpaceHeatingDemand = 0;
		}
		for(hour=0;hour<8760;hour++) {
			profile.profile[hour] = normalizedSpaceHeatingDemand * constants.heatingDemandProfileHelsinkiKaisaniemiReferenceYear[hour];
		}
	}
	// Asuinrakennus - uudisrakennus
	if ( building.buildingType == "2" ) {
		if (building.buildingYear == 2013 || building.buildingYear == 2014) {
			for(hour=0;hour<8760;hour++) {
				profile.profile[hour] = constants.simulatedSpaceHeatingDemandOfResidentialReferenceBuildingFrom2013To2014[hour] * building.floorArea;
			}
		}	
		if (building.buildingYear >= 2015 && building.buildingYear <= 2017) {
			for(hour=0;hour<8760;hour++) {
				profile.profile[hour] = constants.simulatedSpaceHeatingDemandOfResidentialReferenceBuildingFrom2015To2017[hour] * building.floorArea;
			}
		}	
	}
	return profile;
}


function HeatingEnergyFromOil( building, constants ) {
	return building.oilConsumption * constants.energyContentOfOil * building.oilEfficiency;
}


function HeatingEnergyFromDistrictHeating( building, constants ) {
	return building.districtHeatingConsumption * building.districtHeatingEfficiency;
}


function ActualHeatingDemandHelsinkiKaisaniemi( periodStartYear, periodStartMonth, periodEndYear, periodEndMonth ) {
	var actualHeatingDemandHelsinkiKaisaniemi = [
		[509, 462, 520, 319, 102,  0, 0, 19, 188, 240, 399, 486], // 2008
		[613, 576, 556, 357, 104, 37, 5,  0,  52, 396, 402, 639], // 2009
		[850, 702, 584, 372, 127,  0, 0, 15,  99, 340, 526, 760], // 2010
		[662, 753, 558, 325, 139,  0, 0,  0,  26, 258, 350, 422], // 2011
		[633, 692, 502, 387, 120,  8, 0,  0,  75, 302, 468, 594]  // 2012 ( two last months unknown at the time of writing, values from reference year )
		];
	var year = periodStartYear;
	var month = periodStartMonth;
	var sum = 0.0;
	while( +year <= +periodEndYear && ( +year < +periodEndYear || +month <= +periodEndMonth) ) {
		sum += actualHeatingDemandHelsinkiKaisaniemi[year-2008][month-1];
		month++;
		if( month > 12 ) {
			month = 1;
			year++;
		}
	}
	return sum;
}


function ReferenceHeatingDemandHelsinkiKaisaniemi(periodStartYear, periodStartMonth, periodEndYear, periodEndMonth) {
	var referenceHeatingDemandHelsinkiKaisaniemi = [
		[657, 619, 574, 404, 169, 12, 2, 15, 144, 331, 468, 594], // reference year
		[657, 619, 574, 404, 169, 12, 2, 15, 144, 331, 468, 594], // reference year
		[657, 619, 574, 404, 169, 12, 2, 15, 144, 331, 468, 594], // reference year
		[657, 619, 574, 404, 169, 12, 2, 15, 144, 331, 468, 594], // reference year
		[657, 619, 574, 404, 169, 12, 2, 15, 144, 331, 468, 594]  // reference year
		];
	var year = periodStartYear;
	var month = periodStartMonth;
	var sum = 0.0;
	while( +year <= +periodEndYear && ( +year < +periodEndYear || +month <= +periodEndMonth) ) {
		sum += referenceHeatingDemandHelsinkiKaisaniemi[year-2008][month-1];
		month++;
		if( month > 12 ) {
			month = 1;
			year++;
		}
	}
	return sum;
}


function NominalSpaceHeatingDemandEstimate( building, constants ) {
	var nominalSpaceHeatingDemand;
	if ( building.buildingYear >= 2010) {
        nominalSpaceHeatingDemand = 64; 				// kWh/m2,a  
    } else if (building.buildingYear >= 2007) {
        nominalSpaceHeatingDemand = 91; 				// kWh/m2,a  
    } else if (building.buildingYear >= 2002) {
        nominalSpaceHeatingDemand = 93; 				// kWh/m2,a					
    } else {
        nominalSpaceHeatingDemand = 125; 				// kWh/m2,a
    }  
    return nominalSpaceHeatingDemand * building.floorArea;
}