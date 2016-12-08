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

function change_major(pmajorname, pbadata, pgraddata, balines, gradlines) {
    // Get the modal
    var str_gmajor = pmajorname;
    var color_to_use = major_groups.indexOf(str_gmajor);
   
    modal_badata = $.grep(pbadata, function (n, i) {
      return n.gmajor == str_gmajor;
    });
    modal_graddata = $.grep(pgraddata, function (n, i) {
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
       var dboost = Math.round((modal_graddata[i].p50 - pbadata[i].p50) / 10000) * 10000;
       var boost = Math.round(((modal_graddata[i].p50/pbadata[i].p50) - 1) * 100) + "%";
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
              value: balines,
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
              value: gradlines,
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
    

    var modal = document.getElementById('myModal');
    $('.modal-header h2').text(str_gmajor);
    modal.style.display = "block";
    
    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    };

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        };
    };
}

var major_groups = ["Agriculture and natural resources",
  "Architecture and engineering",
  "Arts",
  "Biology and life sciences",
  "Business",
  "Communications and journalism",
  "Computers, statistics, and mathematics",
  "Education",
  "Health",
  "Humanities and liberal arts",
  "Industrial arts, consumer services, and recreation",
  "Law and public policy",
  "Physical sciences",
  "Psychology and social work",
  "Social sciences"];
var color_list = ['#BD226B', '#D92423', '#D96637', '#F38C3B', '#FBAF31', '#A6BE43', '#53B64E', '#0D723D',
  '#169882', '#55C4D5', '#25A0D8', '#147FE0', '#0B5D92', '#7D7BA4', '#8C65A9'];
var color_listGrad = [];
for (i in color_list) {
  color_listGrad.push(hexToRGB(color_list[i],1));
}
  
$(function () {
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

    //console.log(xcat_gmajor);

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
    $('#agriculture-and-natural-resources-icon').click(function(){
      change_major('Agriculture and natural resources', arr_badmajor, arr_graddmajor, overall_ba, overall_grad);
    });
    $('#architecture-and-engineering-icon').click(function(){
      change_major('Architecture and engineering', arr_badmajor, arr_graddmajor, overall_ba, overall_grad);
    });
    $('#arts-icon').click(function(){
      change_major("Arts", arr_badmajor, arr_graddmajor, overall_ba, overall_grad);
    });
    $('#biology-and-life-sciences-icon').click(function(){
      change_major('Biology and life sciences', arr_badmajor, arr_graddmajor, overall_ba, overall_grad);
    });
    $('#business-icon').click(function(){
      change_major("Business", arr_badmajor, arr_graddmajor, overall_ba, overall_grad);
    });
    $('#communications-and-journalism-icon').click(function(){
      change_major('Communications and journalism', arr_badmajor, arr_graddmajor, overall_ba, overall_grad);
    });
    $('#computers-statistics-and-mathematics-icon').click(function(){
      change_major("Computers, statistics, and mathematics", arr_badmajor, arr_graddmajor, overall_ba, overall_grad);
    });
    $('#education-icon').click(function(){
      change_major('Education', arr_badmajor, arr_graddmajor, overall_ba, overall_grad);
    });
    $('#health-icon').click(function(){
      change_major("Health", arr_badmajor, arr_graddmajor, overall_ba, overall_grad);
    });
    $('#humanities-and-liberal-arts-icon').click(function(){
      change_major('Humanities and liberal arts');
    });
    $('#industrial-arts-consumer-services-and-recreation-icon').click(function(){
      change_major('Industrial arts, consumer services, and recreation', arr_badmajor, arr_graddmajor, overall_ba, overall_grad);
    });
    $('#law-and-public-policy-icon').click(function(){
      change_major("Law and public policy", arr_badmajor, arr_graddmajor, overall_ba, overall_grad);
    });
    $('#physical-sciences-icon').click(function(){
      change_major('Physical sciences', arr_badmajor, arr_graddmajor, overall_ba, overall_grad);
    });
    $('#psychology-and-social-work-icon').click(function(){
      change_major("Psychology and social work", arr_badmajor, arr_graddmajor, overall_ba, overall_grad);
    });
    $('#social-sciences-icon').click(function(){
      change_major('Social sciences', arr_badmajor, arr_graddmajor, overall_ba, overall_grad);
    });
    
  });
 
});
