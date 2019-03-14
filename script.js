//global arrays
var polygons = []; //stores complete & incomplete polygons
var coordinateSets = []; //stores coordinate sets for each polygon
var previousMarker; //stores map marker to remove & add when addresses change
var total; //sq. ftg. total
var lawnCuttingTotalEstimate = 0.00; //used in fall & spring clean up functions
var fertilizationTotalEstimate = 0.00;
var grubControlTotalEstimate = 0.00;
var pestControlTotalEstimate = 0.00;
var mosquitoSprayTotalEstimate = 0.00;
var aerationTotalEstimate = 0.00;
var detachingTotalEstimate = 0.00;
var sprinklerStartUpTotalEstimate = 0.00;
var sprinklerShutDownTotalEstimate = 0.00;
var sprinklerTotal = 0.00;
var sprinklerShutDownTotal = 0.00;
var weedingTotalEstimate = 0.00;
var place;

function initialize(total) {

/* ------------ MAP SET UP ------------*/
    // Options for initial loaded map
    var options = {
        zoom: 17,
        center: {lat: 42.751253, lng: -83.021366}, //Victory Lawn coordinates
        mapTypeId: google.maps.MapTypeId.HYBRID,
        streetViewControl: true,
        tilt: 0,
        rotateControl: false
      };

    var map = new google.maps.Map(document.getElementById("geomap"), options);

    previousMarker = new google.maps.Marker({
        position: {lat: 42.751253, lng: -83.021366}, //Victory Lawn coordinates
    });

    // To add the marker to the map, call setMap();
    previousMarker.setMap(map);

/*--------- AUTOCOMPLETE INPUT FIELD ------------*/
    //Autocomplete search field centers near Victory location
    var autocomplete = new google.maps.places.Autocomplete(document.getElementById("autocomplete"));
    autocomplete.bindTo('bounds', map);

    //Autocomplete zooms to searched address
    autocomplete.addListener('place_changed', function(){
      place = autocomplete.getPlace();
      if (!place.geometry) {
        window.alert("Please select a formatted address from the dropdown list.");
        return;
      } else{
        map.setCenter(place.geometry.location);
        map.setZoom(19);
        if (previousMarker) {
          previousMarker.setMap(null);
        }
        previousMarker = new google.maps.Marker({
          position: place.geometry.location,
        });
        previousMarker.setMap(map);
        }
      });

/*----------- DRAWING POLYGONS ON MAP -----------------*/
    var drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: ['polygon'],
      },
      polygonOptions: {
            strokeColor:"#880303",
            strokeWeight:2,
            editable: true,
      }
    });


    drawingManager.setMap(map);

    //Must be in place for editable polygons
    google.maps.event.addListener(drawingManager, 'polygoncomplete', function(polygon) {
            drawingManager.setDrawingMode(null);
            polygons.push(polygon);
            //This variable gets all bounds of polygon.
            var polygonBounds = polygon.getPath();
            var coordinates = [];
            for(var i = 0 ; i < polygonBounds.length ; i++){
                coordinates.push(polygonBounds.getAt(i).lat(), polygonBounds.getAt(i).lng());
              }
            coordinateSets.push([coordinates]);
            totalSqArea();
            updateVariables();
          });




    //after a polygon is finished, if user clicks outside of polygon, new polygon is made
    google.maps.event.addDomListener(map, 'click', function() {
        drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
        totalSqArea();
        updateVariables();
    });

    //button to remove last polygon)
    var removePolygon = document.getElementById('erasePolygon');
    if(removePolygon.addEventListener){
      removePolygon.addEventListener('click', removeShape, false);
    } else if (removePolygon.attachEvent){
      removePolygon.attachEvent('onclick', removeShape);
    }

    function removeShape(){
      drawingManager.setDrawingMode(null);
      var pLength = polygons.length-1;
      polygons[pLength].setMap(null);
      polygons.pop();
      coordinateSets.pop();
      totalSqArea();
    }

    function updateVariables(){
      if(!lawnCuttingSelected.checked){
        lawnCuttingEstimateDiv.value = "$0.00";
      } else {
        lawnCuttingCalculation();
      }
      if(!fertilizationSelected.checked){
        fertilizationEstimateDiv.value = "$0.00";
        fertilization4.checked = false;
        fertilization6.checked = false;
      } else {
        fertilizationCalculation();
      }
      if(!grubControlSelected.checked){
        grubControlEstimateDiv.value = "$0.00";
      } else {
        grubControlCalculation();
      }
      if(!pestControlSelected.checked){
        pestControlEstimateDiv.value = "$0.00";
        pest3.checked = false;
        pest5.checked = false;
      } else {
        pestControlCalculation();
      }
      if(!mosquitoSpraySelected.checked){
        mosquitoSprayEstimateDiv.value = "$0.00";
        mosquito3.checked = false;
        mosquito5.checked = false;
      } else {
        mosquitoSprayCalculation();
      }
      if(!aerationSelected.checked){
        aerationFall.checked = false;
        aerationSpring.checked = false;
        aerationEstimateDiv.value = "$0.00";
      } else {
        aerationCalculation();
      }
      if(!detachingSelected.checked){
        detachingEstimateDiv.value = "$0.00";
        detachingFall.checked = false;
        detachingSpring.checked = false;
      } else {
        detachingCalculation();
      }
      if(!sprinklerStartUpSelected.checked){
        customSprinklerStartUp.disabled = true;
        sprinklerStartUpEstimateDiv.value = "$0.00  or ";
        sprinklerStartUpTotalEstimateDiv.value = "$0.00";
        sprinklerStartUp.value = "";
        sprinklerStartUp.placeholder = "custom quote";
      } else {
        sprinklerStartUpCalculation();
      }
      if(!sprinklerShutDownSelected.checked){
        customSprinklerShutDown.disabled = true;
        sprinklerShutDownEstimateDiv.value = "$0.00  or ";
        sprinklerShutDownTotalEstimateDiv.value = "$0.00";
        sprinklerShutDown.value = "";
        sprinklerShutDown.placeholder = "custom quote";
      } else {
        sprinklerShutDownCalculation();
      }

      if(!weedingSelected.checked){
        weedingEstimateDiv.value = "$0.00";
      } else {
        weedingCalculation();
      }
      totalAllServices();
    }


/*--------- CALCULATE AREA -------*/

    function totalSqArea(){
      var areas = [];
      var area = 0;
      total = 0;
      for(var i=0; i<polygons.length; i++){
        area = google.maps.geometry.spherical.computeArea(polygons[i].getPath());
        area = area*10.764; //1 sq. yard = 9 sq. feet
        areas.push(area);
      }
      for(i=0; i < areas.length; i++){
         total = total + areas[i];
       }

       var areaTotal = document.getElementById('areaTotal');
       areaTotal.value = "Area total: " + total;
       updateVariables();
     }
       //variables for each service, stored as an array
       var lawnCuttingPrice = [30,31,32,33,34,35,36,37,39,41,
                               44,48,53,57,61,65,69,74,78,82,
                               86,90,95,99,103,107,111,116,120];
       var fertilizationPrice = [38,40,42,44,46,48,50,52,54,56,
                                 58,61,64,67,70,73,78,83,89,95,
                                 101,108,115,124,133,142,150,158,166,175,
                                 184,193];
       var grubControlPrice = [70,71,72,80,89,97,105,113,121,128,
                               136,144,152,160,167,175,183,191,199,205,
                               210,215,221,228,235,242,249,257,265];
       var pestControlPrice = [40,54,64];
       var mosquitoSprayPrice = [70,71,72,80,89,97,105,113,121,128,
                               136,144,152,160,167,175,183,191,199,205,
                               210,215,221,228,235,242,249,257,265];
       var aerationPrice = [70,72,74,76,78,80,82,85,88,91,
                            95,99,107,115,123,131,139,148,158,168,
                            178,188,198,208,218,228,238,248,258,268];
       var detachingPrice = [135,140,145,150,155,163,172,180,189,197,
                             205,214,222,231,240,254,268,274,290,309,
                             328,347,367,387,407,427,447,467,487,507,
                             527,547];

       var sprinklerStartUpPrice = [87,103];

       var sprinklerShutDownPrice = [67,86];

       var weedingPrice = [40];

       //variables for each selected estimate option
       var lawnCuttingSelected = document.getElementById('lawnCutting');
       var fertilizationSelected = document.getElementById('fertilization');
       var grubControlSelected = document.getElementById('grubControl');
       var pestControlSelected = document.getElementById('pestControl');
       var mosquitoSpraySelected = document.getElementById('mosquitoSpray');
       var aerationSelected = document.getElementById('aeration');
       var detachingSelected = document.getElementById('detaching');
       var sprinklerStartUpSelected = document.getElementById('sprinklerStartUp');
       var sprinklerShutDownSelected = document.getElementById('sprinklerShutDown');
       var weedingSelected = document.getElementById('weeding');
            var weedingHourEstimate = document.getElementById('weedingHourEstimate');
      var screenshot = document.getElementById('screenshot');

       //variables for displaying calculated services
       var addressInput = document.getElementById('address');
       var lawnCuttingEstimateDiv = document.getElementById('lawnCuttingEstimate');
       var fertilizationEstimateDiv = document.getElementById('fertilizationEstimate');
       var grubControlEstimateDiv = document.getElementById('grubControlEstimate');
       var pestControlEstimateDiv = document.getElementById('pestControlEstimate');
       var mosquitoSprayEstimateDiv = document.getElementById('mosquitoSprayEstimate');
       var aerationEstimateDiv = document.getElementById('aerationEstimate');
       var detachingEstimateDiv = document.getElementById('detachingEstimate');
       var sprinklerStartUpEstimateDiv = document.getElementById('sprinklerStartUpEstimate');
       var sprinklerStartUpTotalEstimateDiv = document.getElementById('sprinklerStartUpEstimateTotal');
       var sprinklerShutDownEstimateDiv = document.getElementById('sprinklerShutDownEstimate');
       var sprinklerShutDownTotalEstimateDiv = document.getElementById('sprinklerShutDownEstimateTotal');
       var weedingEstimateDiv = document.getElementById('weedingEstimate');
       var totalAllServicesDiv = document.getElementById('totalOfAllServices');
       var customSprinklerShutDownPrice;

       //variables for custom amounts
       var customSprinklerStartUp = document.getElementById('customSprinklerStartUp');
       var customSprinklerStartUpPrice = 0.00;

       var customSprinklerShutDown = document.getElementById('customSprinklerShutDown');
       var customSprinklerShutDownPrice = 0.00;

       //set initial amounts
       lawnCuttingEstimateDiv.value = '$0.00';
       fertilizationEstimateDiv.value = '$0.00';
       grubControlEstimateDiv.value = '$0.00';
       pestControlEstimateDiv.value = '$0.00';
       mosquitoSprayEstimateDiv.value = '$0.00';
       aerationEstimateDiv.value = '$0.00';
       detachingEstimateDiv.value = '$0.00';
       sprinklerStartUpEstimateDiv.value = '$0.00';
       sprinklerStartUpTotalEstimateDiv.value = '$0.00';
       sprinklerShutDownEstimateDiv.value = '$0.00';
       sprinklerShutDownTotalEstimateDiv.value = '$0.00';
       totalAllServicesDiv.value = '$0.00';

       //disabling custom areas until selected
       customSprinklerStartUp.disabled = true;
       customSprinklerShutDown.disabled = true;
       weedingHourEstimate.disabled = true;

       //listeners for each element
       if(lawnCuttingSelected.addEventListener){
         lawnCuttingSelected.addEventListener('click', lawnCuttingCalculation, false);
       } else if (lawnCuttingSelected.attachEvent){
         lawnCuttingSelected.attachEvent('onclick', lawnCuttingCalculation);
       }

       if(fertilizationSelected.addEventListener){
          fertilizationSelected.addEventListener('click', fertilizationCalculation, false);
        } else if (fertilizationSelected.attachEvent){
          fertilizationSelected.attachEvent('onclick', fertilizationCalculation);
        }

        if(grubControlSelected.addEventListener){
           grubControlSelected.addEventListener('click', grubControlCalculation, false);
         } else if (grubControlSelected.attachEvent){
           grubControlSelected.attachEvent('onclick', grubControlCalculation);
         }

        if(pestControlSelected.addEventListener){
          pestControlSelected.addEventListener('click', pestControlCalculation, false);
          } else if (pestControlSelected.attachEvent){
            pestControlSelected.attachEvent('onclick', pestControlCalculation);
          }

        if(mosquitoSpraySelected.addEventListener){
             mosquitoSpraySelected.addEventListener('click', mosquitoSprayCalculation, false);
          } else if (mosquitoSpraySelected.attachEvent){
             mosquitoSpraySelected.attachEvent('onclick', mosquitoSprayCalculation);
          }

        if(aerationSelected.addEventListener){
            aerationSelected.addEventListener('click', aerationCalculation, false);
          } else if (aerationSelected.attachEvent){
            aerationSelected.attachEvent('onclick', aerationCalculation);
          }

        if(detachingSelected.addEventListener){
            detachingSelected.addEventListener('click', detachingCalculation, false);
          } else if (detachingSelected.attachEvent){
            detachingSelected.attachEvent('onclick', detachingCalculation);
          }

        if(sprinklerStartUpSelected.addEventListener){
            sprinklerStartUpSelected.addEventListener('click', sprinklerStartUpCalculation, false);
          } else if (sprinklerStartUpSelected.attachEvent){
            sprinklerStartUpSelected.attachEvent('onclick', sprinklerStartUpCalculation);
          }

        if(customSprinklerStartUp.addEventListener){
          customSprinklerStartUp.addEventListener('keyup', sprinklerStartUpCalculation, false);
        } else if (customSprinklerStartUp.attachEvent){
          customSprinklerStartUp.attachEvent('onkeyup', sprinklerStartUpCalculation);
        }

        if(sprinklerShutDownSelected.addEventListener){
          sprinklerShutDownSelected.addEventListener('click', sprinklerShutDownCalculation, false);
        } else if(sprinklerShutDownSelected.attachEvent){
          sprinklerShutDownSelected.attachEvent('onclick', sprinklerShutDownCalculation);
        }

        if(customSprinklerShutDown.addEventListener){
          customSprinklerShutDown.addEventListener('keyup', sprinklerShutDownCalculation, false);
        } else if (customSprinklerShutDown.attachEvent){
          customSprinklerShutDown.attachEvent('onkeyup', sprinklerShutDownCalculation);
        }

        if(weedingSelected.addEventListener){
          weedingSelected.addEventListener('change', function(){
            if(!weedingSelected.checked){
              weedingCalculation();
              weedingHourEstimate.disabled = true;
            } else {
              weedingCalculation();
            }
          }, false);
        } else if(weedingSelected.attachEvent){
          weedingSelected.attachEvent('onchange', function(){
            if(!weedingSelected.checked){
              weedingCalculation();
              weedingHourEstimate.disabled = true;
            } else {
              weedingCalculation();
            }

          });
        }

        if(weedingHourEstimate.addEventListener){
          weedingHourEstimate.addEventListener('keyup', weedingCalculation, false);
        } else if(weedingHourEstimate.attachEvent){
          weedingHourEstimate.attachEvent('onkeyup', weedingCalculation);
        }

        if(screenshot.addEventListener){
          screenshot.addEventListener('click', takeScreenShot, false);
        } else if(screenshot.attachEvent){
          screenshot.attachEvent('onclick', takeScreenShot);
        }

       //functions to calculate each total
       function lawnCuttingCalculation(){
         if (!lawnCuttingSelected.checked){
           lawnCuttingTotalEstimate = 0.00;
         } else {
           if (isNaN(total)){
            total = 0;
          }
           if(total <= 0){
             lawnCuttingTotalEstimate = 0;
           } else if (total > 1 && total <= 6300){
             lawnCuttingTotalEstimate = lawnCuttingPrice[0];
           } else if (total <= 8100){
             lawnCuttingTotalEstimate = lawnCuttingPrice[1];
           } else if (total <= 9000){
             lawnCuttingTotalEstimate = lawnCuttingPrice[2];
           } else if (total <= 9900){
             lawnCuttingTotalEstimate = lawnCuttingPrice[3];
           } else if (total <= 10000){
             lawnCuttingTotalEstimate = lawnCuttingPrice[4];
           } else if (total <= 11700){
             lawnCuttingTotalEstimate = lawnCuttingPrice[5];
           } else if (total <= 12600){
             lawnCuttingTotalEstimate = lawnCuttingPrice[6];
           } else if (total <= 13500){
             lawnCuttingTotalEstimate = lawnCuttingPrice[7];
           } else if (total <= 14400){
             lawnCuttingTotalEstimate = lawnCuttingPrice[8];
           } else if (total <= 15300){
             lawnCuttingTotalEstimate = lawnCuttingPrice[9];
           } else if (total <= 16200){
             lawnCuttingTotalEstimate = lawnCuttingPrice[10];
           } else if (total <= 17100){
             lawnCuttingTotalEstimate = lawnCuttingPrice[11];
           } else if (total <= 18000){
             lawnCuttingTotalEstimate = lawnCuttingPrice[12];
           } else if (total <= 19800){
             lawnCuttingTotalEstimate = lawnCuttingPrice[13];
           } else if (total <= 21600){
             lawnCuttingTotalEstimate = lawnCuttingPrice[14];
           } else if (total <= 23400){
             lawnCuttingTotalEstimate = lawnCuttingPrice[15];
           } else if (total <= 25200){
             lawnCuttingTotalEstimate = lawnCuttingPrice[16];
           } else if (total <= 27000){
             lawnCuttingTotalEstimate = lawnCuttingPrice[17];
           } else if (total <= 29000){
             lawnCuttingTotalEstimate = lawnCuttingPrice[18];
           } else if (total <= 32400){
             lawnCuttingTotalEstimate = lawnCuttingPrice[19];
           } else if (total <= 35100){
             lawnCuttingTotalEstimate = lawnCuttingPrice[20];
           } else if (total <= 38700){
             lawnCuttingTotalEstimate = lawnCuttingPrice[21];
           } else if (total <= 42300){
             lawnCuttingTotalEstimate = lawnCuttingPrice[22];
           } else if (total <= 45900){
             lawnCuttingTotalEstimate = lawnCuttingPrice[23];
           } else if (total <= 49400){
             lawnCuttingTotalEstimate = lawnCuttingPrice[24];
           } else if (total <= 52900){
             lawnCuttingTotalEstimate = lawnCuttingPrice[25];
           } else if (total <= 56400){
             lawnCuttingTotalEstimate = lawnCuttingPrice[26];
           } else if (total <= 59900){
             lawnCuttingTotalEstimate = lawnCuttingPrice[27];
           } else {
             lawnCuttingTotalEstimate = lawnCuttingPrice[28];
           }
         }
          totalAllServices();
          lawnCuttingEstimateDiv.value = "$"+lawnCuttingTotalEstimate.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        }


      function fertilizationCalculation(){
        if (!fertilizationSelected.checked){
          fertilizationTotalEstimate = 0.00;
          fertilization6.checked = false;
          fertilization4.checked = false;
        } else {
          if (isNaN(total)){
           total = 0;
          }
          if(total <= 0){
            fertilizationTotalEstimate = 0;
          } else if (total > 1 && total <= 4500){
            fertilizationTotalEstimate = fertilizationPrice[0];
          } else if (total <= 5400){
            fertilizationTotalEstimate = fertilizationPrice[1];
          } else if (total <= 6300){
            fertilizationTotalEstimate = fertilizationPrice[2];
          } else if (total <= 7200){
            fertilizationTotalEstimate = fertilizationPrice[3];
          } else if (total <= 8100){
            fertilizationTotalEstimate = fertilizationPrice[4];
          } else if (total <= 9000){
            fertilizationTotalEstimate = fertilizationPrice[5];
          } else if (total <= 9900){
            fertilizationTotalEstimate = fertilizationPrice[6];
          } else if (total <= 10800){
            fertilizationTotalEstimate = fertilizationPrice[7];
          } else if (total <= 11700){
            fertilizationTotalEstimate = fertilizationPrice[8];
          } else if (total <= 12600){
            fertilizationTotalEstimate = fertilizationPrice[9];
          } else if (total <= 13500){
            fertilizationTotalEstimate = fertilizationPrice[10];
          } else if (total <= 14400){
            fertilizationTotalEstimate = fertilizationPrice[11];
          } else if (total <= 15300){
            fertilizationTotalEstimate = fertilizationPrice[12];
          } else if (total <= 16200){
            fertilizationTotalEstimate = fertilizationPrice[13];
          } else if (total <= 17100){
            fertilizationTotalEstimate = fertilizationPrice[14];
          } else if (total <= 18000){
            fertilizationTotalEstimate = fertilizationPrice[15];
          } else if (total <= 19800){
            fertilizationTotalEstimate = fertilizationPrice[16];
          } else if (total <= 21600){
            fertilizationTotalEstimate = fertilizationPrice[17];
          } else if (total <= 23400){
            fertilizationTotalEstimate = fertilizationPrice[18];
          } else if (total <= 25200){
            fertilizationTotalEstimate = fertilizationPrice[19];
          } else if (total <= 27000){
            fertilizationTotalEstimate = fertilizationPrice[20];
          } else if (total <= 29700){
            fertilizationTotalEstimate = fertilizationPrice[21];
          } else if (total <= 32400){
            fertilizationTotalEstimate = fertilizationPrice[22];
          } else if (total <= 35100){
            fertilizationTotalEstimate = fertilizationPrice[23];
          } else if (total <= 38700){
            fertilizationTotalEstimate = fertilizationPrice[24];
          } else if (total <= 42300){
            fertilizationTotalEstimate = fertilizationPrice[25];
          } else if (total <= 45900){
            fertilizationTotalEstimate = fertilizationPrice[26];
          } else if (total <= 49400){
            fertilizationTotalEstimate = fertilizationPrice[27];
          } else if (total <=52900){
            fertilizationTotalEstimate = fertilizationPrice[28];
          } else if (total <=56400){
            fertilizationTotalEstimate = fertilizationPrice[29];
          } else if (total <=59900){
            fertilizationTotalEstimate = fertilizationPrice[30];
          } else {
            fertilizationTotalEstimate = fertilizationPrice[31];
          }
        }
        totalAllServices();
         fertilizationEstimateDiv.value = "$"+fertilizationTotalEstimate.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
       }

       function grubControlCalculation(){
         if (!grubControlSelected.checked){
           grubControlTotalEstimate = 0.00;
         } else {
           if (isNaN(total)){
            total = 0;
          }
           if(total <= 0){
             grubControlTotalEstimate = 0;
           } else if (total > 1 && total <= 6300){
             grubControlTotalEstimate = grubControlPrice[0];
           } else if (total <= 7200){
             grubControlTotalEstimate = grubControlPrice[1];
           } else if (total <= 8100){
             grubControlTotalEstimate = grubControlPrice[2];
           } else if (total <= 9900){
             grubControlTotalEstimate = grubControlPrice[3];
           } else if (total <= 10800){
             grubControlTotalEstimate = grubControlPrice[4];
           } else if (total <= 11700){
             grubControlTotalEstimate = grubControlPrice[5];
           } else if (total <= 12600){
             grubControlTotalEstimate = grubControlPrice[6];
           } else if (total <= 13500){
             grubControlTotalEstimate = grubControlPrice[7];
           } else if (total <= 14400){
             grubControlTotalEstimate = grubControlPrice[8];
           } else if (total <= 15300){
             grubControlTotalEstimate = grubControlPrice[9];
           } else if (total <= 16200){
             grubControlTotalEstimate = grubControlPrice[10];
           } else if (total <= 17100){
             grubControlTotalEstimate = grubControlPrice[11];
           } else if (total <= 18000){
             grubControlTotalEstimate = grubControlPrice[12];
           } else if (total <= 19800){
             grubControlTotalEstimate = grubControlPrice[13];
           } else if (total <= 21600){
             grubControlTotalEstimate = grubControlPrice[14];
           } else if (total <= 23400){
             grubControlTotalEstimate = grubControlPrice[15];
           } else if (total <= 25200){
             grubControlTotalEstimate = grubControlPrice[16];
           } else if (total <= 27000){
             grubControlTotalEstimate = grubControlPrice[17];
           } else if (total <= 29700){
             grubControlTotalEstimate = grubControlPrice[18];
           } else if (total <= 32400){
             grubControlTotalEstimate = grubControlPrice[19];
           } else if (total <= 35100){
             grubControlTotalEstimate = grubControlPrice[20];
           } else if (total <= 38700){
             grubControlTotalEstimate = grubControlPrice[21];
           } else if (total <= 42300){
             grubControlTotalEstimate = grubControlPrice[22];
           } else if (total <= 45900){
             grubControlTotalEstimate = grubControlPrice[23];
           } else if (total <= 49400){
             grubControlTotalEstimate = grubControlPrice[24];
           } else if (total <= 52900){
             grubControlTotalEstimate = grubControlPrice[25];
           } else if (total <= 56400){
             grubControlTotalEstimate = grubControlPrice[26];
           } else if (total <= 59900){
             grubControlTotalEstimate = grubControlPrice[27];
           } else {
             grubControlTotalEstimate = grubControlPrice[28];
           }
         }
         totalAllServices();
          grubControlEstimateDiv.value = "$"+grubControlTotalEstimate.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
         }

         function pestControlCalculation(){
           var pest4 = document.getElementById('pest4');
           var pest5 = document.getElementById('pest5');
           var pest6 = document.getElementById('pest6');

           if (!pestControlSelected.checked){
             pestControlTotalEstimate = 0.00;
             pest4.checked = false;
             pest5.checked = false;
             pest6.checked = false;

           } else {
             if (isNaN(total)){
              total = 0;
            }
             if(total <= 0){
               pestControlTotalEstimate = 0;
             } else if (total > 1 && total <= 19800){
               pestControlTotalEstimate = pestControlPrice[0];
             } else if (total <= 49400){
               pestControlTotalEstimate = pestControlPrice[1];
             } else {
               pestControlTotalEstimate = pestControlPrice[2];
             }
           }
           totalAllServices();
            pestControlEstimateDiv.value = "$"+pestControlTotalEstimate.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
          }

          function mosquitoSprayCalculation(){
              var mosquito3 = document.getElementById('mosquito3');
              var mosquito5 = document.getElementById('mosquito5');
              if (!mosquitoSpraySelected.checked){
              mosquitoSprayTotalEstimate = 0.00;
              mosquito3.checked = false;
              mosquito5.checked = false;
            } else {
              if (isNaN(total)){
               total = 0;
             }
              if(total <= 0){
                mosquitoSprayTotalEstimate = 0;
              } else if (total > 1 && total <= 6300){
                mosquitoSprayTotalEstimate = mosquitoSprayPrice[0];
              } else if (total <= 7200){
                mosquitoSprayTotalEstimate = mosquitoSprayPrice[1];
              } else if (total <= 8100){
                mosquitoSprayTotalEstimate = mosquitoSprayPrice[2];
              } else if (total <= 9900){
                mosquitoSprayTotalEstimate = mosquitoSprayPrice[3];
              } else if (total <= 10800){
                mosquitoSprayTotalEstimate = mosquitoSprayPrice[4];
              } else if (total <= 11700){
                mosquitoSprayTotalEstimate = mosquitoSprayPrice[5];
              } else if (total <= 12600){
                mosquitoSprayTotalEstimate = mosquitoSprayPrice[6];
              } else if (total <= 13500){
                mosquitoSprayTotalEstimate = mosquitoSprayPrice[7];
              } else if (total <= 14400){
                mosquitoSprayTotalEstimate = mosquitoSprayPrice[8];
              } else if (total <= 15300){
                mosquitoSprayTotalEstimate = mosquitoSprayPrice[9];
              } else if (total <= 16200){
                mosquitoSprayTotalEstimate = mosquitoSprayPrice[10];
              } else if (total <= 17100){
                mosquitoSprayTotalEstimate = mosquitoSprayPrice[11];
              } else if (total <= 18000){
                mosquitoSprayTotalEstimate = mosquitoSprayPrice[12];
              } else if (total <= 19800){
                mosquitoSprayTotalEstimate = mosquitoSprayPrice[13];
              } else if (total <= 21600){
                mosquitoSprayTotalEstimate = mosquitoSprayPrice[14];
              } else if (total <= 23400){
                mosquitoSprayTotalEstimate = mosquitoSprayPrice[15];
              } else if (total <= 25200){
                mosquitoSprayTotalEstimate = mosquitoSprayPrice[16];
              } else if (total <= 27000){
                mosquitoSprayTotalEstimate = mosquitoSprayPrice[17];
              } else if (total <= 29700){
                mosquitoSprayTotalEstimate = mosquitoSprayPrice[18];
              } else if (total <= 32400){
                mosquitoSprayTotalEstimate = mosquitoSprayPrice[19];
              } else if (total <= 35100){
                mosquitoSprayTotalEstimate = mosquitoSprayPrice[20];
              } else if (total <= 38700){
                mosquitoSprayTotalEstimate = mosquitoSprayPrice[21];
              } else if (total <= 42300){
                mosquitoSprayTotalEstimate = mosquitoSprayPrice[22];
              } else if (total <= 45900){
                mosquitoSprayTotalEstimate = mosquitoSprayPrice[23];
              } else if (total <= 49400){
                mosquitoSprayTotalEstimate = mosquitoSprayPrice[24];
              } else if (total <= 52900){
                mosquitoSprayTotalEstimate = mosquitoSprayPrice[25];
              } else if (total <= 56400){
                mosquitoSprayTotalEstimate = mosquitoSprayPrice[26];
              } else if (total <= 59900){
                mosquitoSprayTotalEstimate = mosquitoSprayPrice[27];
              } else {
                mosquitoSprayTotalEstimate = mosquitoSprayPrice[28];
              }
            }
            totalAllServices();
             mosquitoSprayEstimateDiv.value = "$"+mosquitoSprayTotalEstimate.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
            }

            function aerationCalculation(){
              var aerationFall = document.getElementById('aerationFall');
              var areationSpring = document.getElementById('aerationSpring');

              if (!aerationSelected.checked){
                aerationFall.checked = false;
                aerationSpring.checked = false;
                aerationTotalEstimate = 0.00;
              } else {
                if (isNaN(total)){
                 total = 0;
               }
                if(total <= 0){
                  aerationTotalEstimate = 0;
                } else if (total > 1 && total <= 6300){
                  aerationTotalEstimate = aerationPrice[0];
                } else if (total <= 7200){
                  aerationTotalEstimate = aerationPrice[1];
                } else if (total <= 8100){
                  aerationTotalEstimate = aerationPrice[2];
                } else if (total <= 9000){
                  aerationTotalEstimate = aerationPrice[3];
                } else if (total <= 9900){
                  aerationTotalEstimate = aerationPrice[4];
                } else if (total <= 10800){
                  aerationTotalEstimate = aerationPrice[5];
                } else if (total <= 11700){
                  aerationTotalEstimate = aerationPrice[6];
                } else if (total <= 12600){
                  aerationTotalEstimate = aerationPrice[7];
                } else if (total <= 13500){
                  aerationTotalEstimate = aerationPrice[8];
                } else if (total <= 14400){
                  aerationTotalEstimate = aerationPrice[9];
                } else if (total <= 15300){
                  aerationTotalEstimate = aerationPrice[10];
                } else if (total <= 16200){
                  aerationTotalEstimate = aerationPrice[11];
                } else if (total <= 17100){
                  aerationTotalEstimate = aerationPrice[12];
                } else if (total <= 18000){
                  aerationTotalEstimate = aerationPrice[13];
                } else if (total <= 19800){
                  aerationTotalEstimate = aerationPrice[14];
                } else if (total <= 21600){
                  aerationTotalEstimate = aerationPrice[15];
                } else if (total <= 23400){
                  aerationTotalEstimate = aerationPrice[16];
                } else if (total <= 25200){
                  aerationTotalEstimate = aerationPrice[17];
                } else if (total <= 27000){
                  aerationTotalEstimate = aerationPrice[18];
                } else if (total <= 29700){
                  aerationTotalEstimate = aerationPrice[19];
                } else if (total <= 32400){
                  aerationTotalEstimate = aerationPrice[20];
                } else if (total <= 35100){
                  aerationTotalEstimate = aerationPrice[21];
                } else if (total <= 38700){
                  aerationTotalEstimate = aerationPrice[22];
                } else if (total <= 42300){
                  aerationTotalEstimate = aerationPrice[23];
                } else if (total <= 45900){
                  aerationTotalEstimate = aerationPrice[24];
                } else if (total <= 49400){
                  aerationTotalEstimate = aerationPrice[25];
                } else if (total <= 52900){
                  aerationTotalEstimate = aerationPrice[26];
                } else if (total <= 56400){
                  aerationTotalEstimate = aerationPrice[27];
                } else if(total <=59900){
                  aerationTotalEstimate = aerationPrice[28];
                } else {
                  aerationTotalEstimate = aerationPrice[29];
                }
              }
              totalAllServices();
               aerationEstimateDiv.value = "$"+aerationTotalEstimate.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');;
             }

        function detachingCalculation(){
          var detachingFall = document.getElementById('detachingFall');
          var detachingSpring = document.getElementById('detachingSpring');

          if (!detachingSelected.checked){
            detachingFall.checked = false;
            detachingSpring.checked = false;
            detachingTotalEstimate = 0.00;
          } else {
                 if (isNaN(total)){
                  total = 0;
                 }
                 if(total <= 0){
                   detachingTotalEstimate = 0;
                 } else if (total > 1 && total <= 4500){
                   detachingTotalEstimate = detachingPrice[0];
                 } else if (total <= 5400){
                   detachingTotalEstimate = detachingPrice[1];
                 } else if (total <= 6300){
                   detachingTotalEstimate = detachingPrice[2];
                 } else if (total <= 7200){
                   detachingTotalEstimate = detachingPrice[3];
                 } else if (total <= 8100){
                   detachingTotalEstimate = detachingPrice[4];
                 } else if (total <= 9000){
                   detachingTotalEstimate = detachingPrice[5];
                 } else if (total <= 9900){
                   detachingTotalEstimate = detachingPrice[6];
                 } else if (total <= 10800){
                   detachingTotalEstimate = detachingPrice[7];
                 } else if (total <= 11700){
                   detachingTotalEstimate = detachingPrice[8];
                 } else if (total <= 12600){
                   detachingTotalEstimate = detachingPrice[9];
                 } else if (total <= 13500){
                   detachingTotalEstimate = detachingPrice[10];
                 } else if (total <= 14400){
                   detachingTotalEstimate = detachingPrice[11];
                 } else if (total <= 15300){
                   detachingTotalEstimate = detachingPrice[12];
                 } else if (total <= 16200){
                   detachingTotalEstimate = detachingPrice[13];
                 } else if (total <= 17100){
                   detachingTotalEstimate = detachingPrice[14];
                 } else if (total <= 18000){
                   detachingTotalEstimate = detachingPrice[15];
                 } else if (total <= 19800){
                   detachingTotalEstimate = detachingPrice[16];
                 } else if (total <= 21600){
                   detachingTotalEstimate = detachingPrice[17];
                 } else if (total <= 23400){
                   detachingTotalEstimate = detachingPrice[18];
                 } else if (total <= 25200){
                   detachingTotalEstimate = detachingPrice[19];
                 } else if (total <= 27000){
                   detachingTotalEstimate = detachingPrice[20];
                 } else if (total <= 29700){
                   detachingTotalEstimate = detachingPrice[21];
                 } else if (total <= 32400){
                   detachingTotalEstimate = detachingPrice[22];
                 } else if (total <= 35100){
                   detachingTotalEstimate = detachingPrice[23];
                 } else if (total <= 38700){
                   detachingTotalEstimate = detachingPrice[24];
                 } else if (total <= 42300){
                   detachingTotalEstimate = detachingPrice[25];
                 } else if (total <= 45900){
                   detachingTotalEstimate = detachingPrice[26];
                 } else if (total <= 49400){
                   detachingTotalEstimate = detachingPrice[27];
                 } else if (total <=52900){
                   detachingTotalEstimate = detachingPrice[28];
                 } else if (total <=56400){
                   detachingTotalEstimate = detachingPrice[29];
                 } else if (total <=59900){
                   detachingTotalEstimate = detachingPrice[30];
                 } else {
                   detachingTotalEstimate = detachingPrice[31];
                 }
               }
               totalAllServices();
                detachingEstimateDiv.value = "$"+detachingTotalEstimate.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
              }

        function sprinklerStartUpCalculation(){
              if (!sprinklerStartUpSelected.checked){
                  sprinklerStartUpTotalEstimate = 0.00;
                  customSprinklerStartUpPrice = 0.00;
                  sprinklerTotal = 0.00;
                  customSprinklerStartUp.disabled = true;
                  customSprinklerStartUp.value = "";
                  customSprinklerStartUp.placeholder = "custom quote";
                  sprinklerStartUpEstimateDiv.value = "$0.00";
                  sprinklerStartUpTotalEstimateDiv.value = "$0.00";
              } else {
                  customSprinklerStartUp.disabled = false;
                  if (isNaN(total)){
                   total = 0;
                 }
                  customSprinklerStartUpPrice = Number(customSprinklerStartUp.value);
                  if(!customSprinklerStartUpPrice){
                    customSprinklerStartUpPrice = 0.00;
                  }
                 if(total <= 0){
                   sprinklerStartUpTotalEstimate = 0;
                   sprinklerTotal = customSprinklerStartUpPrice;
                 } else if (total > 1 && total <= 20000){
                   sprinklerStartUpTotalEstimate = sprinklerStartUpPrice[0];
                   sprinklerTotal = customSprinklerStartUpPrice + sprinklerStartUpTotalEstimate;
                   sprinklerStartUpEstimateDiv.value = "$"+sprinklerStartUpTotalEstimate.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                 } else if(total < 40000){
                   sprinklerStartUpTotalEstimate = sprinklerStartUpPrice[1];
                   sprinklerTotal = customSprinklerStartUpPrice + sprinklerStartUpTotalEstimate;
                   sprinklerStartUpEstimateDiv.value = "$"+sprinklerStartUpTotalEstimate.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                 } else if(total > 40001){
                    sprinklerStartUpEstimateDiv.value = "";
                    sprinklerTotal = customSprinklerStartUpPrice;
                 }
               }
                sprinklerStartUpTotalEstimateDiv.value = "$"+sprinklerTotal.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                totalAllServices();

               }

               function sprinklerShutDownCalculation(){
                 if (!sprinklerShutDownSelected.checked){
                     sprinklerShutDownTotalEstimate = 0.00;
                     customSprinklerShutDownPrice = 0.00;
                     sprinklerShutDownTotal = 0.00;
                     customSprinklerShutDown.disabled = true;
                     customSprinklerShutDown.value = "";
                     customSprinklerShutDown.placeholder = "custom quote";
                     sprinklerShutDownEstimateDiv.value = "$0.00";
                     sprinklerShutDownTotalEstimateDiv.value = "$0.00";
                 } else {
                     customSprinklerShutDown.disabled = false;
                     if (isNaN(total)){
                      total = 0;
                    }
                     customSprinklerShutDownPrice = Number(customSprinklerShutDown.value);
                     if(!customSprinklerShutDownPrice){
                       customSprinklerShutDownPrice = 0.00;
                     }
                    if(total <= 0){
                      sprinklerShutDownTotalEstimate = 0;
                      sprinklerShutDownTotal = customSprinklerShutDownPrice;
                    } else if (total > 1 && total <= 20000){
                      sprinklerShutDownTotalEstimate = sprinklerShutDownPrice[0];
                      sprinklerShutDownTotal = customSprinklerShutDownPrice + sprinklerShutDownTotalEstimate;
                      sprinklerShutDownEstimateDiv.value = "$"+sprinklerShutDownTotalEstimate.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                    } else if(total < 40000){
                      sprinklerShutDownTotalEstimate = sprinklerShutDownPrice[1];
                      sprinklerShutDownTotal = customSprinklerShutDownPrice + sprinklerShutDownTotalEstimate;
                      sprinklerShutDownEstimateDiv.value = "$"+sprinklerShutDownTotalEstimate.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                    } else if(total > 40001){
                       sprinklerShutDownEstimateDiv.value = "";
                       sprinklerShutDownTotal = customSprinklerShutDownPrice;
                    }
                  }
                   sprinklerShutDownTotalEstimateDiv.value = "$"+sprinklerShutDownTotal.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                   totalAllServices();


                }

                function weedingCalculation(){
                 weedingTotalEstimate = 0.00;
                  var value = weedingHourEstimate.value;
                  if(!value){
                    value = 0;
                  }
                  var hours = Number(value);

                  if (!weedingSelected.checked){
                    weedingTotalEstimate = 0.00;
                    weedingHourEstimate.value = "";
                    weedingHourEstimate.placeholder = "estimated";
                    weedingHourEstimate.disabled = true;
                  } else {
                    weedingHourEstimate.disabled = false;
                 }
                    if(value>0){
                      weedingTotalEstimate = (hours * weedingPrice[0]);
                    } else {
                      weedingTotalEstimate = 0;
                    }
                    totalAllServices();
                  weedingEstimateDiv.value = "$"+weedingTotalEstimate.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
              }

              function totalAllServices(){
                var servicesTotal = 0;

                servicesTotal = lawnCuttingTotalEstimate + fertilizationTotalEstimate + grubControlTotalEstimate +
                                pestControlTotalEstimate + mosquitoSprayTotalEstimate + aerationTotalEstimate +
                                detachingTotalEstimate + sprinklerTotal + sprinklerShutDownTotal +
                                weedingTotalEstimate;

               totalAllServicesDiv.value = "$"+servicesTotal.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
              }

/* ---------------- Screenshot map with overlay ---------------------*/
function takeScreenShot() {
    if(!place){
      var latitude = 42.751253;
      var longitude = -83.021366;
    } else {
      var latitude = place.geometry.location.lat();
      var longitude = place.geometry.location.lng();
    }
    //URL of Google Static Maps.
    var staticMapUrl = "https://maps.googleapis.com/maps/api/staticmap";

    //set the zoom
    staticMapUrl += "?zoom=15";

    //Set the Google Map Center.
    staticMapUrl += "&center=" + latitude + "," + longitude;

    //Set the Google Map Size.
    staticMapUrl += "&size=400x300";

    //Set the Google Map Type
    staticMapUrl += "&maptype=" + options.mapTypeId;

    //Set the marker
    staticMapUrl += "&markers=red|" + latitude + ","+longitude;

    if(coordinateSets.length > 0){
      staticMapUrl += "&path=";
    }

   //set polygon paths
    for(var i=0; i<coordinateSets.length; i++){
      var innerArray = coordinateSets[i];
      var innerInnerArray = innerArray[0];
      var thisNewLength = innerInnerArray.length;
      for(var j=0; j<thisNewLength; j++){
        staticMapUrl += innerInnerArray[j] + "," + innerInnerArray[j+1] + "|";
        j = j+1;
      }
      staticMapUrl += innerInnerArray[0] + "," + innerInnerArray[1];
      if(coordinateSets.length > 0){
        if(i < coordinateSets.length-1){
          staticMapUrl += "&path=";
        }
      }
    }

    staticMapUrl += "&key=AIzaSyD9cv6AnpkeUTAlAz68Y8Ie5v3MIccMdws";

    //Display the Image of Google Map.
    var imgMap = document.getElementById("imgMap");
    var screenShotUrl = document.getElementById("screenShotUrl");
    imgMap.innerHTML = "<img src="+staticMapUrl+" width='245' />"
    screenShotUrl.value = staticMapUrl;
}

/*-------------EVENTS FOR RADIO BUTTON ENFORCEMENT -----------------*/

var fertilization4 = document.getElementById('fertilization4');
var fertilization6 = document.getElementById('fertilization6');
var pest3 = document.getElementById('pest3');
var pest5 = document.getElementById('pest5');
var mosq3 = document.getElementById('mosquito3');
var mosq5 = document.getElementById('mosquito5');
var aerSpring = document.getElementById('aerationSpring');
var aerFall = document.getElementById('aerationFall');
var detSpring = document.getElementById('detachingSpring');
var detFall = document.getElementById('detachingFall');

if(fertilization4.addEventListener){
  fertilization4.addEventListener('click', radioEnforceFert4, false);
} else if(fertilization4.attachEvent){
  fertilization4.attachEvent('onclick', radioEnforceFert4);
}
if(fertilization6.addEventListener){
  fertilization6.addEventListener('click', radioEnforceFert6, false);
} else if(fertilization6.attachEvent){
  fertilization6.attachEvent('onclick', radioEnforceFert6);
}
if(pest3.addEventListener){
  pest3.addEventListener('click', radioEnforcePest3, false);
} else if(pest3.attachEvent){
  pest3.attachEvent('onclick', radioEnforcePest3);
}
if(pest5.addEventListener){
  pest5.addEventListener('click', radioEnforcePest5, false);
} else if(pest5.attachEvent){
  pest5.attachEvent('onclick', radioEnforcePest5);
}

if(mosq3.addEventListener){
  mosq3.addEventListener('click', radioEnforceMosq3, false);
} else if(mosq3.attachEvent){
  mosq3.attachEvent('onclick', radioEnforceMosq3);
}
if(mosq5.addEventListener){
  mosq5.addEventListener('click', radioEnforceMosq5, false);
} else if(mosq5.attachEvent){
  mosq5.attachEvent('onclick', radioEnforceMosq5);
}

if(aerSpring.addEventListener){
  aerSpring.addEventListener('click', radioEnforceAerSpring, false);
} else if(aerSpring.attachEvent){
  aerSpring.attachEvent('onclick', radioEnforceAerSpring);
}
if(aerFall.addEventListener){
  aerFall.addEventListener('click', radioEnforceAerFall, false);
} else if(aerFall.attachEvent){
  aerFall.attachEvent('onclick', radioEnforceAerFall);
}

if(detSpring.addEventListener){
  detSpring.addEventListener('click', radioEnforceDetSpring, false);
} else if(detSpring.attachEvent){
  detSpring.attachEvent('onclick', radioEnforceDetSpring);
}
if(detFall.addEventListener){
  detFall.addEventListener('click', radioEnforceDetFall, false);
} else if(detFall.attachEvent){
  detFall.attachEvent('onclick', radioEnforceDetFall);
}

function radioEnforceFert4(){
  if(fertilization4.checked){
    fertilization4.checked = false;
    fertilization6.checked = false;
    fertilization4.checked = true;
  }
}

function radioEnforceFert6(){
  if (fertilization6.checked){
    fertilization6.checked = false;
    fertilization4.checked = false;
    fertilization6.checked = true;
  }
}

function radioEnforceDOF(){
  if (dormantOilFall.checked){
    dormantOilFall.checked = false;
    dormantOilSpring.checked = false;
    dormantOilFall.checked = true;
  }
}
function radioEnforceDOS(){
  if (dormantOilSpring.checked){
    dormantOilSpring.checked = false;
    dormantOilFall.checked = false;
    dormantOilSpring.checked = true;
  }
}

function radioEnforcePest3(){
  if (pest3.checked){
    pest3.checked = false;
    pest5.checked = false;
    pest3.checked = true;
  }
}
function radioEnforcePest5(){
  if (pest5.checked){
    pest5.checked = false;
    pest3.checked = false;
    pest5.checked = true;
  }
}


function radioEnforceMosq3(){
  if (mosq3.checked){
    mosq3.checked = false;
    mosq5.checked = false;
    mosq3.checked = true;
  }
}
function radioEnforceMosq5(){
  if (mosq5.checked){
    mosq5.checked = false;
    mosq3.checked = false;
    mosq5.checked = true;
  }
}

function radioEnforceAerSpring(){
  if (aerSpring.checked){
    aerSpring.checked = false;
    aerFall.checked = false;
    aerSpring.checked = true;
  }
}
function radioEnforceAerFall(){
  if (aerFall.checked){
    aerFall.checked = false;
    aerSpring.checked = false;
    aerFall.checked = true;
  }
}

function radioEnforceDetSpring(){
  if (detSpring.checked){
    detSpring.checked = false;
    detFall.checked = false;
    detSpring.checked = true;
  }
}
function radioEnforceDetFall(){
  if (detFall.checked){
    detFall.checked = false;
    detSpring.checked = false;
    detFall.checked = true;
  }
}

/*------------- Clear all form options ---------------*/
var clearAll = document.getElementById('clearVariables');

if(clearAll.addEventListener){
  clearAll.addEventListener('click', clearAllSelected, false);
} else if (clearAll.attachEvent){
  clearAll.attachEvent('onclick', clearAllSelected);
}

var firstName = document.getElementById('firstName');
var lastName = document.getElementById('lastName');
var address = document.getElementById('address');
var city = document.getElementById('city');
var state = document.getElementById('state');
var zip = document.getElementById('zip');
var phone = document.getElementById('phone');
var email = document.getElementById('email');

function clearAllSelected(){
  firstName.value = "";
  lastName.value = "";
  address.value = "";
  city.value = "";
  state.value = "";
  zip.value = "";
  phone.value = "";
  email.value = "";
  lawnCuttingSelected.checked = false;
  weedingSelected.checked = false;
  fertilizationSelected.checked = false;
  grubControlSelected.checked = false;
  pestControlSelected.checked = false;
  mosquitoSpraySelected.checked = false;
  aerationSelected.checked = false;
  detachingSelected.checked = false;
  sprinklerStartUpSelected.checked = false;
  sprinklerShutDownSelected.checked = false;
  weedingHourEstimate.value = "";
  weedingHourEstimate.placeholder = "estimated";
  pest3.checked = false;
  pest5.checked = false;
  mosq3.checked = false;
  mosq5.checked = false;
  aerationFall.checked = false;
  aerationSpring.checked = false;
  detFall.checked = false;
  detSpring.checked = false;
  customSprinklerStartUp.value = "";
  customSprinklerShutDown.value = "";
  customSprinklerStartUp.placeholder = "custom quote";
  customSprinklerShutDown.placeholder = "custom quote";

   lawnCuttingTotalEstimate = 0.00; //used in fall & spring clean up functions
   fertilizationTotalEstimate = 0.00;
   grubControlTotalEstimate = 0.00;
   pestControlTotalEstimate = 0.00;
   mosquitoSprayTotalEstimate = 0.00;
   aerationTotalEstimate = 0.00;
   detachingTotalEstimate = 0.00;
   sprinklerStartUpTotalEstimate = 0.00;
   sprinklerShutDownTotalEstimate = 0.00;
   sprinklerTotal = 0.00;
   sprinklerShutDownTotal = 0.00;
   weedingTotalEstimate = 0.00;

  updateVariables();
  totalAllServices();
}


    //checks for polygon changes and updates totals accordingly
    window.setInterval(totalSqArea, 500);
}

//listener to trigger map load when page loads
google.maps.event.addDomListener(window, 'load', initialize);
