var aHexColorsOrdered = ["bluehex", "bluehex", "bluehex", "bluehex", "redhex", "redhex", "redhex", "yellowhex", "yellowhex", "yellowhex", "yellowhex", "silverhex", "silverhex", "silverhex", "greenhex", "greenhex", "greenhex", "greenhex", "brownhex"];
var aHexColors = aHexColorsOrdered.sort(function() {return 0.5 - Math.random()});
var nHexQuantity = aHexColors.length;
	
var aHexOrder = ["hex0", "hex4", "hex5", "hex10", "hex15", "hex18", "hex17", "hex16", "hex11", "hex6", "hex1", "hex2", "hex3", "hex9", "hex14", "hex13", "hex12", "hex7", "hex8"];
var aHexNumbers = [5,8,4,11,12,9,10,8,3,6,2,10,3,6,5,4,9,11];

var aNearestHexes = [];
var aNearestSettlement1 = [];
var aNearestSettlement2 = [];
var aSettlements = [];
var aHexBoard = [];

var state = "off";
var s1_flag = false;
var s2_flag = false;
var odds_once = false;

var aNumberOdds = [
	{ dice: 2, odds: 2.78},
	{ dice: 3, odds: 5.56},
	{ dice: 4, odds: 8.33},
	{ dice: 5, odds: 11.11},
	{ dice: 6, odds: 13.89},
	{ dice: 7, odds: 16.67},
	{ dice: 8, odds: 13.89},
	{ dice: 9, odds: 11.11},
	{ dice: 10, odds: 8.33},
	{ dice: 11, odds: 5.56},
	{ dice: 12, odds: 2.78},
	];


$(function() {
	InitializeBoard();
	RandomizeBoard();

	// Randomize Colors On Click
	$(".randomizeboard").click(function() {
		// Remove the Colors
		for (i=0;i<=nHexQuantity;i++) {
			var sHexColor = aHexColors[i];
			$("."+sHexColor).removeClass(sHexColor);				
		}

		// Re-Randomize the Colors
		InitializeBoard();
		RandomizeBoard();
	});

	// Place Settlements
	$('.Settlement1').click(function(){
		state = "Settlement1";
		s1_flag = true;
		odds_once = true;
		var msg_html='<h4 class="last">Now Click On the Gameboard</h4>'
		$('#message').html(msg_html);
		$('#message').fadeIn();

	});
	$('.Settlement2').click(function(){
		state = "Settlement2";
		s2_flag = true;
		odds_once = true;
		var msg_html='<h4 class="last">Now Click On the Gameboard</h4>'
		$('#message').html(msg_html);
		$('#message').fadeIn();
	});

	$('#gameboard').click(function(e){
		if (!s1_flag && !s2_flag && state=="off") {
			state = "Settlement1";
			s1_flag = true;
			odds_once = true;
		} else if (s1_flag && !s2_flag && state=="off") {
			state = "Settlement2";
			s2_flag = true;
			odds_once = true;
		};

		if (state != "off") {
			// Calculate Coordinates
	    	$('.box-'+state).css("left", (e.pageX-12.5) + "px");
	    	$('.box-'+state).css("top", (e.pageY-10) + "px");
	    	var xcoord = (e.pageX-12.5);
	    	var ycoord = (e.pageY-10);

	    	// Find Nearest Hexes
	    	NearestHexes(state,xcoord,ycoord);

	    	//Change Button to Display Nearby Hexes
	    	$('.'+state).text('Hexes '+aNearestHexes[0].hexNumber+','+aNearestHexes[1].hexNumber+','+aNearestHexes[2].hexNumber);

	    	// Update Settlement Arrays
	    	if (aNearestHexes[0].hexState == 'Settlement1'){
	    		aNearestSettlement1 = [];
	    		aNearestSettlement1.push(aNearestHexes[0]);
	    		aNearestSettlement1.push(aNearestHexes[1]);
	    		aNearestSettlement1.push(aNearestHexes[2]);
	    	} else {
	    		aNearestSettlement2 = [];
	    		aNearestSettlement2.push(aNearestHexes[0]);
	    		aNearestSettlement2.push(aNearestHexes[1]);
	    		aNearestSettlement2.push(aNearestHexes[2]);
	    	};
			aSettlements = [].concat(aNearestSettlement1, aNearestSettlement2);	

	    	// Calculate and View Odds if Both Settlements Placed
	    	if (s1_flag && s2_flag && odds_once) { 
	    		var aOdds =[];
	  	
				for (i in aSettlements) {
					aOdds.push(CreateOdds(aSettlements[i]));
				}
				//console.log(aOdds);
				ViewOdds(aOdds);
				odds_once = false;		
			};
			if (s1_flag && s2_flag) { 
				$('#message').hide();
				var msg_html='<h4 class="last">Click Buttons to Edit Settlements</h4>'
				$('#message').html(msg_html);
				$('#message').fadeIn();
			} else if (s1_flag || s2_flag ) { 
				$('#message').hide();
				var msg_html='<h4 class="last">Now Place the Other Settlement</h4>'
				$('#message').html(msg_html);
				$('#message').fadeIn();
			};


	    	state = "off";
    	};
	});

});

function InitializeBoard() {
		state = "off";
		s1_flag = false;
		s2_flag = false;
		odds_once = false;

		$('#oddspane').hide();
		$('#message').hide();

		$('.box-Settlement1').css("left", "70px");
    	$('.box-Settlement1').css("top", "100px");
    	$('.box-Settlement1').css("width", "15px");
    	$('.box-Settlement1').css("height", "20px");
		$('.Settlement1').text("Settlement #1");

	    $('.box-Settlement2').css("left", "100px");
    	$('.box-Settlement2').css("top", "100px");
    	$('.box-Settlement2').css("width", "15px");
    	$('.box-Settlement2').css("height", "20px");
		$('.Settlement2').text("Settlement #2");
}


function RandomizeBoard() {
	var j=0;
	aHexBoard = [];
	aHexColors = aHexColorsOrdered.sort(function() {return 0.5 - Math.random()});

	for (i in aHexOrder) {
		// Set Colors
		var sHexColor = aHexColors[i];
		$("."+aHexOrder[i]).addClass(sHexColor);

		// Set Numbers and Create Hex Board Array
		if ($("."+aHexOrder[i]).hasClass("brownhex")) {
			// For Desert Hex, Use "X" instead of a number
			$("."+aHexOrder[i]).html("<span>X</span><div></div><div></div>")
			j--;

			var oHex = CreateHex(aHexOrder[i],aHexColors[i],"X",$("."+aHexOrder[i]).offset().left,$("."+aHexOrder[i]).offset().top+42);
			aHexBoard.push(oHex);
		} else {
			$("."+aHexOrder[i]).html("<span>"+aHexNumbers[j]+"</span><div></div><div></div>")
			var oHex = CreateHex(aHexOrder[i],aHexColors[i],aHexNumbers[j],$("."+aHexOrder[i]).offset().left,$("."+aHexOrder[i]).offset().top+42);
			aHexBoard.push(oHex);
		}
		j++;
	}
	//console.log(aHexBoard);
}

function CreateHex(name, color, hexNumber, left, top) {
	var oHex = { 
		hexName: name,
		hexColor: color,
		hexNumber: hexNumber,
		hexLeft: left,
		hexTop: top
	};
	return oHex;
}

function NearestHexes(fstate, xcoord, ycoord) {
	var aHex = [];
	var aHexDistance = [];
	var oHexDistance;

	for (i in aHexBoard) {

		// Sort Distances
		nHexDistance = Math.abs(aHexBoard[i].hexLeft-xcoord)+Math.abs(aHexBoard[i].hexTop-ycoord);
		aHexDistance.push(nHexDistance);
		aHexDistance.sort(function (a,b){ return a-b});

		// Calculate Odds

		var nOddsPercentage = 0;
		for (k in aNumberOdds) {
			if ( aHexBoard[i].hexNumber == aNumberOdds[k].dice ) {
				nOddsPercentage = aNumberOdds[k].odds;
				break;
			}
		}

		// Create Array of Hexes With Distances
		var oHex = {
			hexState: fstate,
			hexName: aHexBoard[i].hexName,
			hexColor: aHexBoard[i].hexColor,
			hexNumber: aHexBoard[i].hexNumber,
			hexLeft: aHexBoard[i].hexLeft,
			hexTop: aHexBoard[i].hexTop,
			hexOdds: nOddsPercentage,
			hexLeftDiff: Math.abs(aHexBoard[i].hexLeft-xcoord), 
			hexTopDiff: Math.abs(aHexBoard[i].hexTop-ycoord),
			hexDistance: Math.abs(aHexBoard[i].hexLeft-xcoord)+Math.abs(aHexBoard[i].hexTop-ycoord)
		}
		aHex.push(oHex);
	}
	//console.log(aHexDistance);
	//console.log(aHex);

	// Find Hexes With Three Lowest Distances (Nearest Hexes)
	aNearestHexes = [];
	for (j in aHex) {
		if(aHex[j].hexDistance == aHexDistance[0]) {
			aNearestHexes.push(aHex[j]);
			aHexDistance[0]=-1;
		} else if(aHex[j].hexDistance == aHexDistance[1]) {
			aNearestHexes.push(aHex[j]);
			aHexDistance[1]=-1;
		} else if(aHex[j].hexDistance == aHexDistance[2]) {
			aNearestHexes.push(aHex[j]);
			aHexDistance[2]=-1;
		}
	}
	//console.log(aNearestHexes);

}

function CreateOdds (oSettlement) {
	for (k in aNumberOdds) {
		if ( oSettlement.hexNumber == aNumberOdds[k].dice ) {
			var sHexColor = oSettlement.hexColor;
			var sResource = HexToResource(sHexColor);

			var oOdds = {
				dice: aNumberOdds[k].dice, 
				odds: aNumberOdds[k].odds,
				hex: sHexColor,
				resource: sResource
			}			
		} else if ( oSettlement.hexNumber == "X" ) {
			var oOdds = {
				dice: 0, 
				odds: 0,
				hex: sHexColor,
				resource: "No Resource"
			}			
		}
	}
	//console.log(oSettlement);
	//console.log(oOdds);
	return oOdds;

}

function HexToResource(sHexColor) {
	var sResource;
	switch (sHexColor) {
		case "yellowhex":
			sResource = "Wheat";
			break;
		case "bluehex":
			sResource = "Wood";
			break;
		case "redhex":
			sResource = "Clay";
			break;
		case "greenhex":
			sResource = "Wool";
			break;
		case "silverhex":
			sResource = "Rock";
			break;
		case "brownhex":
			sResource = "No Resource";
			break;
	}
	//console.log(sHexColor);
	//console.log(sResource);

	return sResource;
}

function CalculateOdds (sResource, aOdds) {
	var nOdds = 0;
	var nTotalOdds = 0;

	for (i in aOdds) {
		if (aOdds[i].resource == sResource) {
			nOdds = nOdds + aOdds[i].odds;
		}
		nTotalOdds = nTotalOdds + aOdds[i].odds;
	}
	return nOdds.toFixed(2);
}

function CalculateTotalOdds(aOdds) {
	var nTotalOdds = 0;
	for (i in aOdds) {
		nTotalOdds = nTotalOdds + aOdds[i].odds;
	}
	return nTotalOdds.toFixed(2);
}

function ViewOdds (aOdds) {
	$('#legend').fadeOut();
	$('#oddspane').fadeOut();

	var odds_html=
		'<h4><img src="images/red.png" class="square-thumbnail" alt="Red Background Image"> Clay</h4><p>'+CalculateOdds("Clay", aOdds)+'%</p>'+
		'<h4><img src="images/yellow.jpg" class="square-thumbnail" alt="Yellow Background Image"> Wheat</h4><p>'+CalculateOdds("Wheat", aOdds)+'%</p>'+
		'<h4><img src="images/green.png" class="square-thumbnail" alt="Green Background Image"> Wool</h4><p>'+CalculateOdds("Wool", aOdds)+'%</p>'+
		'<h4><img src="images/silver.jpg" class="square-thumbnail" alt="Silver Background Image"> Rock</h4><p>'+CalculateOdds("Rock", aOdds)+'%</p>'+
		'<h4><img src="images/blue.png" class="square-thumbnail" alt="Blue Background Image"> Wood</h4><p>'+CalculateOdds("Wood", aOdds)+'%</p>';
	$('.p-lastodds').text(CalculateTotalOdds(aOdds)+'%');

	$('#oddsresults').html(odds_html);
	$('#oddspane').fadeIn();
}