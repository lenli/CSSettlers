var aHexColorsOrdered = ["bluehex", "bluehex", "bluehex", "bluehex", "redhex", "redhex", "redhex", "yellowhex", "yellowhex", "yellowhex", "yellowhex", "silverhex", "silverhex", "silverhex", "greenhex", "greenhex", "greenhex", "greenhex", "brownhex"];
var aHexColors = aHexColorsOrdered.sort(function() {return 0.5 - Math.random()});
var nHexQuantity = aHexColors.length;
	
var aHexOrder = ["hex0", "hex4", "hex5", "hex10", "hex15", "hex18", "hex17", "hex16", "hex11", "hex6", "hex1", "hex2", "hex3", "hex9", "hex14", "hex13", "hex12", "hex7", "hex8"];
var aHexNumbers = [5,8,4,11,12,9,10,8,3,6,2,10,3,6,5,4,9,11];

var aNearestHexes = [];
var aNearestSettlement1 = [];
var aNearestSettlement2 = [];
var aHexBoard = [];

var state = "off";
var s1_flag = false;
var s2_flag = false;

var aNumberOdds = [
	{ dice: 2, odds: 2.78},
	{ dice: 3, odds: 5.56},
	{ dice: 4, odds: 8.33},
	{ dice: 5, odds: 11.11},
	{ dice: 8, odds: 13.89},
	{ dice: 9, odds: 11.11},
	{ dice: 10, odds: 8.33},
	{ dice: 11, odds: 5.56},
	{ dice: 12, odds: 2.78}
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
	});
	$('.Settlement2').click(function(){
		state = "Settlement2";
		s2_flag = true;
	});
	$('#gameboard').click(function(e){
    	$('.box-'+state).css("left", (e.pageX-12.5) + "px");
    	$('.box-'+state).css("top", (e.pageY-10) + "px");
    	
    	var xcoord = (e.pageX-12.5);
    	var ycoord = (e.pageY-10);
    	NearestHexes(state,xcoord,ycoord);
    	$('.'+state).text('Hexes '+aNearestHexes[0].hexNumber+','+aNearestHexes[1].hexNumber+','+aNearestHexes[2].hexNumber);

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
    	}
    	if (s1_flag && s2_flag) {   	
			$('.viewodds').show();
		};

    	state = "off";
	});
	$('.viewodds').click(function(){
		$('.viewodds').text("To Be Coded");
	})
});

function InitializeBoard() {
		$('.viewodds').hide();

		$('.box-Settlement1').css("left", "450px");
    	$('.box-Settlement1').css("top", "100px");
		$('.Settlement1').text("Place Settlement #1")

	    $('.box-Settlement2').css("left", "500px");
    	$('.box-Settlement2').css("top", "100px");
		$('.Settlement2').text("Place Settlement #2")

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

		// Create Array of Hexes With Distances
		var oHex = {
			hexState: fstate,
			hexName: aHexBoard[i].hexName,
			hexColor: aHexBoard[i].hexColor,
			hexNumber: aHexBoard[i].hexNumber,
			hexLeft: aHexBoard[i].hexLeft,
			hexTop: aHexBoard[i].hexTop,
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
		}
		if(aHex[j].hexDistance == aHexDistance[1]) {
			aNearestHexes.push(aHex[j]);
		}
		if(aHex[j].hexDistance == aHexDistance[2]) {
			aNearestHexes.push(aHex[j]);
		}
	}
	//console.log(aNearestHexes);

}
