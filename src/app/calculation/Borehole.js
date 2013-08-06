function Borehole() {
	
	// User given parameters
	this.boreholeName 								= "Borehole for testing";
	this.activeDepth								= 160;				// meters
	this.usedForHotWaterHeating						= true;
	this.electricityAssisted						= false;
	this.powerDimensioning							= 100;				// %		

	// Bedrock data at borehole location
	this.bedrockType								= "Ei tiedossa";
	this.bedrockTypeId								= 0;
	this.bedrockDepth								= 0;
	this.bedrockDepthAccuracy						= "Heikko";

	// Boreholespecific default values.
	// User can view and change if necessary.
	this.diameter							= 0.13;				// meters
	this.wallTemp							= 0.5;				// degrees celsius
	this.tGroundLoop						= -5;				// degrees celsius
	this.tOutSpaceMax						= 45;				// degrees celsius
	this.tOutSpaceMaxAt						= -30;				// degrees celsius
	this.tOutSpaceMin						= 20;				// degrees celsius
	this.tOutSpaceMinAt						= 20;				// degrees celsius
	this.tOutHotWater						= 55;				// degrees celsius
	this.tDiffCondenser						= 10;				// degrees celsius
	this.tDiffEvaporator					= 5;				// degrees celsius
	this.efficiencyFactor					= 0.5;				// Adjusting theoretical Carno't process to reality

	// Dimensioning values based on system energy demand
	this.loadShare;
	this.maxOutPower;
}