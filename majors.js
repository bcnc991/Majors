function pushData(dobj, things) {
  dobj.push({'schl': things[0],
          'gmajor': String(things[1]).replace(/['"]+/g, ''),
          'dmajor': String(things[2]).replace(/['"]+/g, ''),
          'type': parseFloat(things[3]),
          'freq': parseFloat(things[4]),
          'p50': parseFloat(things[5]),
          'p25': parseFloat(things[6]),
          'p75': parseFloat(things[7]),
          'gradegftfy': parseFloat(things[10]),
          'gradegall': parseFloat(things[11]),
          'emprate': parseFloat(things[12]),
          'pct_ts': parseFloat(things[13]),
          'pct_tsg': parseFloat(things[14]),
          'p50r': parseFloat(things[15]),
          'p25r': parseFloat(things[16]),
          'p75r': parseFloat(things[17]),
          'pct_ts_all': parseFloat(things[18]),
          'pct_tsg_all': parseFloat(things[19])
          });
}
function hexToRGB(hex, alpha){
  var r = parseInt( hex.slice(1,3), 16 ),
      g = parseInt( hex.slice(3,5), 16 ),
      b = parseInt( hex.slice(5,7), 16 ),
      a = "";

  if( alpha ) a  = ", 0.5";
  return "rgba(" + r + ", " + g + ", " + b + a + ")";
}

$(function () {
  var color_list = ['#BD226B', '#D92423', '#D96637', '#F38C3B', '#FBAF31', '#A6BE43', '#53B64E', '#0D723D',
    '#169882', '#55C4D5', '#25A0D8', '#147FE0', '#0B5D92', '#7D7BA4', '#8C65A9'];
  var color_listGrad = [];  
  for (i in color_list) {
    color_listGrad.push(hexToRGB(color_list[i],1));  
  }
  var arr_majors = [];
  var xcat_gmajor = [];
  
  $.get('baplus_ftfy_25_59.txt', function (majorsdata, status) {
    var lines = majorsdata.split('\n');
      $.each(lines, function(lineNo, line) {
        var items = line.split('\t');
        if (lineNo > 0) {
          pushData(arr_majors, items);
        }
      });
    // Percent grad degree of majors is type = 2 and 3 
    var arr_pggmajor = $.grep(arr_majors, function (n, i) {
      return n.type == 2;
    });
    var arr_pgdmajor = $.grep(arr_majors, function (n, i) {
      return n.type == 3;
    });
    // Bachelor's and graduate degree overall
    var arr_schl = $.grep(arr_majors, function (n, i) {
      return n.type == 4;
    });
    // Terminal BA and Grad by grouped major
    var arr_bagmajor = $.grep(arr_majors, function (n, i) {
      return n.type == 6 & n.schl == 'Bachelors';
    });
    var arr_gradgmajor = $.grep(arr_majors, function (n, i) {
      return n.type == 6 & n.schl == 'Graduate degree';
    });
    // Terminal BA and Grad by detailed major
    var arr_badmajor = $.grep(arr_majors, function (n, i) {
      return n.type == 7 & n.schl == 'Bachelors';
    });
    var arr_graddmajor = $.grep(arr_majors, function (n, i) {
      return n.type == 7 & n.schl == 'Graduate degree';
    });
    // Fill arrays for charts
    $.each(arr_pggmajor, function(items, item) {
       xcat_gmajor.push(item.gmajor);
    });
    var arr_rngbagmajor = [];
    var arr_p50bagmajor = [];
    var i = -1;
    $.each(arr_bagmajor, function(items, item) {
       i = i + 1;
       arr_rngbagmajor.push({low:item.p25, high:item.p75});
       arr_p50bagmajor.push({x:i - 0.2, y:item.p50});
    });
    var arr_rnggradgmajor = [];
    var arr_p50gradgmajor = [];
    var i = -1;
    $.each(arr_gradgmajor, function(items, item) {
       i = i + 1;
       var dboost = Math.round((arr_gradgmajor[i].p50 - arr_bagmajor[i].p50) / 10000) * 10000;
       var boost = Math.round(((arr_gradgmajor[i].p50/arr_bagmajor[i].p50) - 1) * 100) + "%";
       arr_rnggradgmajor.push({low:item.p25, high:item.p75});
       arr_p50gradgmajor.push({x:i + 0.15, y:item.p50, boost: boost, dboost: dboost});
    });
    var arr_pctbagmajor = [];
    $.each(arr_bagmajor, function(items, item) {
      arr_pctbagmajor.push(item.pct_ts_all);
    });
    var arr_pctgradgmajor = [];
    $.each(arr_gradgmajor, function(items, item) {
      arr_pctgradgmajor.push(item.pct_ts_all);
    });
    var overall_ba = arr_schl[0].p50;
    var overall_grad = arr_schl[1].p50;
     
    console.log(xcat_gmajor);
    
    $('#main_chart').highcharts({
        chart: {
            inverted: true
        },
        title: {
            text: 'Earnings'
        },

        subtitle: {
            text: ''
        },
        credits: {
            enabled: false
        },
        xAxis: {
            title: {
              text: 'Undergraduate major' 
              //align: 'top',
              //rotation: 0
            },
            labels: {
              style: {
                fontSize: '14px',
                fontWeight: '500'
              }
            },
            categories: xcat_gmajor
        },

        yAxis: {
            title: {
                text: ''
            },
            plotLines: [{
              color: '#000000',
//              events: {
//                mouseover: function (){
//                  alert('mose');
//                }
//              },
              value: overall_ba,
              dashStyle: 'shortDash',
              width: 2,
              label: {
                text: "All Bachelor's<br> degrees",
                rotation: 0,
                textAlign: 'center',
                verticalAlign: 'top',
                y: -12
              }
            },
            {
              color: '#bfbfbf',
              value: overall_grad,
              dashStyle: 'shortDash',
              width: 2,  
              label: {
                text: "All graduate<br> degrees",
                rotation: 0,
                textAlign: 'center',
                verticalAlign: 'top',
                y: -12
              }
            }]
        },
        plotOptions: {
            scatter: {
                tooltip: {
                    hideDelay: 100,
                    pointFormatter: function () {
                      if (this.series.name == "Bachelor's degree") {
                        return "Median earnings: " + Highcharts.numberFormat(Math.round(this.y/10000)*10000,0) + '<br>';
                        }
                       else {
                         return "Median earnings: " + Highcharts.numberFormat(Math.round(this.y/10000)*10000,0) + '<br>' +
                      'Graduate boost: ' + Highcharts.numberFormat(this.dboost,0) + " (" + this.boost + ")";
                       }
                    }
                }
            },
            columnrange :{
                dataLabels: {
                  enabled: false
                },
                tooltip: {
                    hideDelay: 100,
                    pointFormatter: function () {
                        var diff = Math.round(this.high/10000)*10000 - Math.round(this.low/10000)*10000;
                        return this.series.name + ': <br>' +  
                          "P25:" + Highcharts.numberFormat(Math.round(this.low/10000)*10000,0) + '<br>' +
                          "P75:" + Highcharts.numberFormat(Math.round(this.high/10000)*10000,0) + '<br>' +  
                          "Earnings difference: " + Highcharts.numberFormat(diff,0);
                      }
                    }                  
            }
        },
        legend: {
            enabled: false
        },
        series: [{
            name: "Bachelor's degree",
            colors: color_list,
            colorByPoint: true,
            type: 'columnrange',
            data: arr_rngbagmajor
            },
          {
            name: 'Graduate degree',
            type: 'columnrange',
            colors: color_listGrad,
            colorByPoint: true,
            data: arr_rnggradgmajor
          },
          {
            name: "Bachelor's degree",
            type: 'scatter',
            marker: {
              radius: 6,
              symbol: 'circle',
              fillColor: '#f0ffff',
              lineWidth: 2,
              lineColor: '#000000'
            },
            data: arr_p50bagmajor
            },
          {
            name: 'Graduate degree',
            type: 'scatter',
            marker: {
              radius: 6,
              symbol: 'circle',
              fillColor: '#f0ffff',
              lineWidth: 2,
              lineColor: '#000000'
            },
            data: arr_p50gradgmajor
            }
      ] 
    });

    $('#main_popchart').highcharts({

        title: {
            text: 'Share'
        },

        subtitle: {
            text: ''
        },
        credits: {
            enabled: false
        },

        xAxis: {
            labels: {
              enabled: false
            },
            categories: xcat_gmajor
        },

        yAxis: {
            title: {
                text: ''
            },
            labels: {
              formatter: function () {
                return Math.round(this.value*100);
              }
            }
        },
        plotOptions: {
            bar :{
                dataLabels: {
                  enabled: false
                },
                tooltip: {
                    hideDelay: 100,
                    pointFormatter: function () {
                        return this.series.name +": " + Math.round(this.y*100) + "%";
                      }
                    }                  
            }
        },
        legend: {
            enabled: false
        },

        series: [{
            name: "Bachelor's degree",
            colors: color_list,
            colorByPoint: true,
            type: 'bar',
            data: arr_pctbagmajor
            },
          {
            name: 'Graduate degree',
            type: 'bar',
            colors: color_listGrad,
            colorByPoint: true,
            data: arr_pctgradgmajor
          }
      ] 
    });

    // Get the modal
    var modal = document.getElementById('myModal');      
    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];
    
    var modal_data = [];
    //btn.onclick = function() {
      $("#sel_group_majors").change(function() {
        var str_gmajor = "";
        $("#sel_group_majors option:selected").each(function() {
          str_gmajor = $( this ).val();
        });
        $('.modal-header h2').text(str_gmajor);
        /* This should not be necessary, index is zero based - possibly because of disabled option? */
        var color_to_use = $("#sel_group_majors option:selected").index() - 1; 
        
        modal.style.display = "block";
        modal_badata = $.grep(arr_badmajor, function (n, i) {
          return n.gmajor == str_gmajor;
        });
        modal_graddata = $.grep(arr_graddmajor, function (n, i) {
          return n.gmajor == str_gmajor;
        });
       
        var xcat_dmajor = [];
        // Fill arrays for charts
        $.each(modal_badata, function(items, item) {
           xcat_dmajor.push(item.dmajor);
        });
        
        var arr_rngbadmajor = [];
        var arr_p50badmajor = [];
        var i = -1;
        $.each(modal_badata, function(items, item) {
           i = i + 1;
           arr_rngbadmajor.push({low:item.p25, high:item.p75});
           arr_p50badmajor.push({x:i - 0.2, y:item.p50});
        });
        var arr_rnggraddmajor = [];
        var arr_p50graddmajor = [];
        var i = -1;
        $.each(modal_graddata, function(items, item) {
           i = i + 1;
           var dboost = Math.round((modal_graddata[i].p50 - arr_badmajor[i].p50) / 10000) * 10000;
           var boost = Math.round(((modal_graddata[i].p50/arr_badmajor[i].p50) - 1) * 100) + "%";
           arr_rnggraddmajor.push({low:item.p25, high:item.p75});
           arr_p50graddmajor.push({x:i + 0.15, y:item.p50, boost: boost, dboost: dboost});
        });
        
        var arr_pctbadmajor = [];
        $.each(modal_badata, function(items, item) {
          arr_pctbadmajor.push(item.pct_tsg);
        });
        var arr_pctgraddmajor = [];
        $.each(modal_graddata, function(items, item) {
          arr_pctgraddmajor.push(item.pct_tsg);
        });
        
        $('#modal_chart').highcharts({
            chart: {
                inverted: true
            },
            title: {
                text: 'Earnings'
            },
    
            subtitle: {
                text: ''
            },
            credits: {
                enabled: false
            },
    
            xAxis: {
                title: {
                  text: 'Undergraduate major' 
                  //align: 'top',
                  //rotation: 0
                },
                labels: {
                  style: {
                    fontSize: '12px',
                    fontWeight: '500'
                  }
                },
                categories: xcat_dmajor
            },
    
            yAxis: {
                title: {
                    text: ''
                },
                plotLines: [{
                  color: '#000000',
                  value: overall_ba,
                  dashStyle: 'shortDash',
                  width: 2,
                  label: {
                    text: "All Bachelor's<br> degrees",
                    rotation: 0,
                    textAlign: 'right',
                    verticalAlign: 'top',
                    y: -12
                  }
                },
                {
                  color: '#bfbfbf',
                  value: overall_grad,
                  dashStyle: 'shortDash',
                  width: 2,  
                  label: {
                    text: "All graduate<br> degrees",
                    rotation: 0,
                    textAlign: 'left',
                    verticalAlign: 'top',
                    y: -12
                  }
                }]
            },
            plotOptions: {
                scatter: {
                    tooltip: {
                        hideDelay: 100,
                        pointFormatter: function () {
                          if (this.series.name == "Bachelor's degree") {
                            return "Median earnings: " + Highcharts.numberFormat(Math.round(this.y/10000)*10000,0) + '<br>';
                            }
                           else {
                             return "Median earnings: " + Highcharts.numberFormat(Math.round(this.y/10000)*10000,0) + '<br>' +
                          'Graduate boost: ' + Highcharts.numberFormat(this.dboost,0) + " (" + this.boost + ")";
                           }
                        }
                    }
                },
                columnrange :{
                    dataLabels: {
                      enabled: false
                    },
                    tooltip: {
                        hideDelay: 100,
                        pointFormatter: function () {
                            var diff = Math.round(this.high/10000)*10000 - Math.round(this.low/10000)*10000;
                            return this.series.name + ': <br>' +  
                              "P25:" + Highcharts.numberFormat(Math.round(this.low/10000)*10000,0) + '<br>' +
                              "P75:" + Highcharts.numberFormat(Math.round(this.high/10000)*10000,0) + '<br>' +  
                              "Earnings difference: " + Highcharts.numberFormat(diff,0);
                          }
                        }                  
                }
            },
            legend: {
                enabled: false
            },
            series: [{
                name: "Bachelor's degree",
                color: color_list[color_to_use],
                colorByPoint: false,
                type: 'columnrange',
                data: arr_rngbadmajor
                },
              {
                name: 'Graduate degree',
                type: 'columnrange',
                color: color_listGrad[color_to_use],
                colorByPoint: false,
                data: arr_rnggraddmajor
              },
              {
                name: "Bachelor's degree",
                type: 'scatter',
                marker: {
                  radius: 4,
                  symbol: 'circle',
                  fillColor: '#f0ffff',
                  lineWidth: 2,
                  lineColor: '#000000'
                },
                data: arr_p50badmajor
                },
              {
                name: 'Graduate degree',
                type: 'scatter',
                marker: {
                  radius: 4,
                  symbol: 'circle',
                  fillColor: '#f0ffff',
                  lineWidth: 2,
                  lineColor: '#000000'
                },
                data: arr_p50graddmajor
                }
          ] 
        });
        $('#modal_popchart').highcharts({
    
            title: {
                text: 'Share'
            },
    
            subtitle: {
                text: ''
            },
            credits: {
                enabled: false
            },
    
            xAxis: {
                labels: {
                  enabled: false
                },
                categories: xcat_dmajor
            },
    
            yAxis: {
                title: {
                    text: ''
                },
                labels: {
                  formatter: function () {
                    return Math.round(this.value*100);
                  }
                }
            },
            plotOptions: {
                bar :{
                    dataLabels: {
                      enabled: false
                    },
                    tooltip: {
                        hideDelay: 100,
                        pointFormatter: function () {
                            return this.series.name +": " + Math.round(this.y*100) + "%";
                          }
                        }                  
                }
            },
            legend: {
                enabled: false
            },
    
            series: [{
                name: "Bachelor's degree",
                color: color_list[color_to_use],
                colorByPoint: false,
                type: 'bar',
                data: arr_pctbadmajor
                },
              {
                name: 'Graduate degree',
                type: 'bar',
                color: color_listGrad[color_to_use],
                colorByPoint: false,
                data: arr_pctgraddmajor
              }
          ] 
        });
        // console.log(xcat_dmajor);        
    });
    
    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    };
    
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
  });
  $('#agriculture-and-natural-resources-icon').click(function(){
    $("#sel_group_majors option")[1].selected = true;
    $("#sel_group_majors option:selected").val("Agriculture and natural resources").change();
  });
  $('#architecture-and-engineering-icon').click(function(){
    $("#sel_group_majors option")[2].selected = true;
    $("#sel_group_majors option:selected").val('Architecture and engineering').change();
  });
  $('#arts-icon').click(function(){
    $("#sel_group_majors option")[3].selected = true;
    $("#sel_group_majors option:selected").val("Arts").change();
  });
  $('#biology-and-life-sciences-icon').click(function(){
    $("#sel_group_majors option")[4].selected = true;
    $("#sel_group_majors option:selected").val('Biology and life sciences').change();
  });
  $('#business-icon').click(function(){
    $("#sel_group_majors option")[5].selected = true;
    $("#sel_group_majors option:selected").val("Business").change();
  });
  $('#communications-and-journalism-icon').click(function(){
    $("#sel_group_majors option")[6].selected = true;
    $("#sel_group_majors option:selected").val('Communications and journalism').change();
  });
  $('#computers-statistics-and-mathematics-icon').click(function(){
    $("#sel_group_majors option")[7].selected = true;
    $("#sel_group_majors option:selected").val("Computers, statistics, and mathematics").change();
  });
  $('#education-icon').click(function(){
    $("#sel_group_majors option")[8].selected = true;
    $("#sel_group_majors option:selected").val('Education').change();
  });
  $('#health-icon').click(function(){
    $("#sel_group_majors option")[9].selected = true;
    $("#sel_group_majors option:selected").val("Health").change();
  });
  $('#humanities-and-liberal-arts-icon').click(function(){
    $("#sel_group_majors option")[10].selected = true;
    $("#sel_group_majors option:selected").val('Humanities and liberal arts').change();
  });
  $('#industrial-arts-consumer-services-and-recreation-icon').click(function(){
    $("#sel_group_majors option")[11].selected = true;
    $("#sel_group_majors option:selected").val('Industrial arts, consumer services, and recreation').change();
  });
  $('#law-and-public-policy-icon').click(function(){
    $("#sel_group_majors option")[12].selected = true;
    $("#sel_group_majors option:selected").val("Law and public policy").change();
  });
  $('#physical-sciences-icon').click(function(){
    $("#sel_group_majors option")[13].selected = true;
    $("#sel_group_majors option:selected").val('Physical sciences').change();
  });
  $('#psychology-and-social-work-icon').click(function(){
    $("#sel_group_majors option")[14].selected = true;
    $("#sel_group_majors option:selected").val("Psychology and social work").change();
  });
  $('#social-sciences-icon').click(function(){
    $("#sel_group_majors option")[15].selected = true;
    $("#sel_group_majors option:selected").val('Social sciences').change();
  });
  
});