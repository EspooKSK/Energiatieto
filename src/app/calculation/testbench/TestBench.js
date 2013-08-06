function ProfilePrinter(profile, outputTarget) {
			
	var hour;
	var output = "<br>";

	for(hour=0;hour<profile.profile.length;hour++) {
		output += profile.profile[hour] + "<br>";
	}

	document.getElementById(outputTarget).innerHTML = output;
}

function BuildingDataPrinter(building, outputTarget) {
	var key;
	var outputHTML = "";
	var element;
	outputHTML += "<form>";
	for ( key in building ) {
		if ( building.hasOwnProperty(key) ) {
			outputHTML += "<input class='alignRight' type='text' id='" + key + "' onchange='Update()'> : " + key + "<br>";
		}
	}
	outputHTML += "</form>";
	document.getElementById(outputTarget).innerHTML = outputHTML;
	for ( key in building ) {
		if ( building.hasOwnProperty(key) ) {
			element = document.getElementById(key);
			element.value = building[key];
		}
	}
}

function PropertyScraper(building) {
	var key;
	var element;
	var elementValue;
	for ( key in building ) {
		if ( building.hasOwnProperty(key) && document.getElementById(key)) {
			element = document.getElementById(key);
			switch ( element.value ) {
				case "true":
					building[key] = true; 
					break;
				case "false":
					building[key] = false; 
					break;
				default:
                    if (isNaN(Number(element.value))) {
					   building[key] = element.value;
                    } else {
                        building[key] = Number(element.value);
                    }
			}			
		}
	}
}

function Initialize() {
	building = new Building(); 						// global
    constants = new Constants();					// global
    solarInstallation = new SolarInstallation(); 	// global
    borehole = new Borehole();                      // global
    system = new System(); 							// global
    system.building[0] = building;
    system.solarInstallation[0] = solarInstallation;
    system.borehole[0] = borehole;
    BuildingDataPrinter(building, "buildingData");
    document.getElementById("objectProperties").innerHTML = "Building";
}


function Update() {
	PropertyScraper(building);
	PropertyScraper(solarInstallation);
    PropertyScraper(borehole);
	document.getElementById("debug").innerHTML = "";
	Run();
}


function Run() {

    var profile;

    var selectorProfile = document.getElementById("selectorProfile");
    var selectorView = document.getElementById("selectorView");

    switch ( selectorProfile.value ) {
    	case "1":
    		profile = HotWaterHeatingEnergyProfile( building, constants);
    		BuildingDataPrinter(building, "buildingData");
    		document.getElementById("objectProperties").innerHTML = "Building";
    		break;
    	case "2":
    		profile = SpaceHeatingEnergyProfile( building, constants);
    		BuildingDataPrinter(building, "buildingData");
    		document.getElementById("objectProperties").innerHTML = "Building";
    		break;
    	case "3":
    		profile = ElectricityConsumptionProfile( building, constants);
    		BuildingDataPrinter(building, "buildingData");
    		document.getElementById("objectProperties").innerHTML = "Building";
    		break;
		case "4":
    		profile = SolarElectricityProductionProfile( solarInstallation, constants);
    		BuildingDataPrinter(solarInstallation, "buildingData");
    		document.getElementById("objectProperties").innerHTML = "Solar installation";
    		break;
        case "5":
            profile = SystemSpaceHeatingEnergyConsumption( system, constants);
            BuildingDataPrinter(system, "buildingData");
            document.getElementById("objectProperties").innerHTML = "System";
            break;
        case "6":
            profile = SystemSpaceHeatingEnergyProduction( system, constants);
            BuildingDataPrinter(system, "buildingData");
            document.getElementById("objectProperties").innerHTML = "System";
            break;
        case "7":
            profile = SystemSpaceHeatingEnergyBalance( system, constants);
            BuildingDataPrinter(system, "buildingData");
            document.getElementById("objectProperties").innerHTML = "System";
            break;
        case "8":
            profile = SystemHotWaterHeatingEnergyConsumption( system, constants);
            BuildingDataPrinter(system, "buildingData");
            document.getElementById("objectProperties").innerHTML = "System";
            break;
        case "9":
            profile = SystemHotWaterHeatingEnergyProduction( system, constants);
            BuildingDataPrinter(system, "buildingData");
            document.getElementById("objectProperties").innerHTML = "System";
            break;
        case "10":
            profile = SystemHotWaterHeatingEnergyBalance( system, constants);
            BuildingDataPrinter(system, "buildingData");
            document.getElementById("objectProperties").innerHTML = "System";
            break;
    	case "11":
    		profile = SystemElectricityConsumption( system, constants);
    		BuildingDataPrinter(system, "buildingData");
    		document.getElementById("objectProperties").innerHTML = "System";
    		break;
        case "12":
            profile = SystemElectricityProduction( system, constants);
            BuildingDataPrinter(system, "buildingData");
            document.getElementById("objectProperties").innerHTML = "System";
            break;
        case "13":
            profile = SystemElectricityBalance( system, constants);
            BuildingDataPrinter(system, "buildingData");
            document.getElementById("objectProperties").innerHTML = "System";
            break;
        case "14":
            profile = new Profile();
            profile.profile = vantaaReferenceYearOutsideTemperature;
            BuildingDataPrinter(system, "buildingData");
            document.getElementById("objectProperties").innerHTML = "Outside temperature data";
            break;
        case "15":
            profile = SolarHeatingEnergyProductionProfile(solarInstallation, constants);
            BuildingDataPrinter(solarInstallation, "buildingData");
            document.getElementById("objectProperties").innerHTML = "Solar installation";
            break;
        case "16":
            profile = BoreholeSpaceHeatingEnergyProductionProfile(system,borehole,constants);
            BuildingDataPrinter(borehole, "buildingData");
            document.getElementById("objectProperties").innerHTML = "Borehole";
            break;
        case "17":
            profile = BoreholeHotWaterHeatingEnergyProductionProfile(system,borehole,constants);
            BuildingDataPrinter(borehole, "buildingData");
            document.getElementById("objectProperties").innerHTML = "Borehole";
            break;
        case "18":
            profile = BoreholeElectricityConsumptionProfile(system,borehole,constants);
            BuildingDataPrinter(borehole, "buildingData");
            document.getElementById("objectProperties").innerHTML = "Borehole";
            break;
        case "19":
            profile = BoreholeTemperatureOutProfile(system,borehole,constants);
            BuildingDataPrinter(borehole, "buildingData");
            document.getElementById("objectProperties").innerHTML = "Borehole";
            break;
        case "20":
            profile = BoreholeSpaceHeatingCopProfile(system,borehole,constants);
            BuildingDataPrinter(borehole, "buildingData");
            document.getElementById("objectProperties").innerHTML = "Borehole";
            break; 
        case "21":
            profile = BoreholeWaterHeatingCopProfile(system,borehole,constants);
            BuildingDataPrinter(borehole, "buildingData");
            document.getElementById("objectProperties").innerHTML = "Borehole";
            break;
    }


    if ( selectorView.value == "Hours" ) {
        ProfilePrinter( profile, "output");
    }
    if ( selectorView.value == "Days" ) {
        var day;
        var outputHTML = "<br>";
        for(day=1;day<=365;day++) {
            outputHTML += profile.day(day) + "<br>";
        }
        document.getElementById("output").innerHTML = outputHTML;
    }
    if ( selectorView.value == "Months" ) {
        var month;
        var outputHTML = "<br>";
        for(month=1;month<=12;month++) {
            outputHTML += profile.month(month) + "<br>";
        }
        document.getElementById("output").innerHTML = outputHTML;
    }
    if ( selectorView.value == "Year" ) {
    	var outputHTML = "<br>" + profile.year();
        document.getElementById("output").innerHTML = outputHTML;
    }
    if ( selectorView.value == "hourOfDayAvgValueInMonth" ) {
        var outputHTML = "<br>";
        for(var hour=1;hour<=24;hour++){
            outputHTML += profile.hourOfDayAvgValueInMonth(hour,1,constants) + "<br>";
        }
        document.getElementById("output").innerHTML = outputHTML;
    }
    if ( selectorView.value == "hourOfDayMaxValueInMonth" ) {
        var outputHTML = "<br>";
        for(var hour=1;hour<=24;hour++){
            outputHTML += profile.hourOfDayMaxValueInMonth(hour,1,constants) + "<br>";
        }
        document.getElementById("output").innerHTML = outputHTML;
    }
    if ( selectorView.value == "hourOfDayMinValueInMonth" ) {
        var outputHTML = "<br>";
        for(var hour=1;hour<=24;hour++){
            outputHTML += profile.hourOfDayMinValueInMonth(hour,1,constants) + "<br>";
        }
        document.getElementById("output").innerHTML = outputHTML;
    } 
    if ( selectorView.value == "yearPositive" ) {
        var outputHTML = "<br>" + profile.yearPositive();
        document.getElementById("output").innerHTML = outputHTML;
    }
    if ( selectorView.value == "yearNegative" ) {
        var outputHTML = "<br>" + profile.yearNegative();
        document.getElementById("output").innerHTML = outputHTML;
    }
    if ( selectorView.value == "yearMax" ) {
        var outputHTML = "<br>" + profile.yearMax();
        document.getElementById("output").innerHTML = outputHTML;
    }
    if ( selectorView.value == "yearMin" ) {
        var outputHTML = "<br>" + profile.yearMin();
        document.getElementById("output").innerHTML = outputHTML;
    }

}