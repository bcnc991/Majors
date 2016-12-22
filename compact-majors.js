/*global $, jQuery, alert, Highcharts */
function hexToRGB(hex, alpha) {
  'use strict';
  var r = parseInt(hex.slice(1, 3), 16),
    g = parseInt(hex.slice(3, 5), 16),
    b = parseInt(hex.slice(5, 7), 16),
    a = "";

  if (alpha) {
    a  = ", 0.5";
  }
  return "rgba(" + r + ", " + g + ", " + b + a + ")";
}

function pushData(dobj, things) {
  'use strict';
  dobj.push({'schl': things[0],
          'dmajor': String(things[1]).replace(/['"]+/g, ''),
          'type': parseFloat(things[2]),
          'freq': parseFloat(things[3]),
          'p50': parseFloat(things[4]),
          'p25': parseFloat(things[5]),
          'p75': parseFloat(things[6]),
          'gradegftfy': parseFloat(things[7]),
          'gradegall': parseFloat(things[8]),
          'emprate': parseFloat(things[9]),
          'pct_ts': parseFloat(things[10]),
          'pct_tsg': parseFloat(things[11]),
          'pct_ts_all': parseFloat(things[12]),
          'pct_tsg_all': parseFloat(things[13]),
          'pct_gths': parseFloat(things[14]),
          'pct_gthsftfy': parseFloat(things[15]),
          'gmajor': String(things[16]).replace(/['"]+/g, '')
          });
}

function pushStateData(dobj, things) {
  'use strict';
  dobj.push({'schl': things[0],
          'dmajor': String(things[1]).replace(/['"]+/g, ''),
          'type': parseFloat(things[2]),
          'freq': parseFloat(things[3]),
          'p50': parseFloat(things[4]),
          'p25': parseFloat(things[5]),
          'p75': parseFloat(things[6]),
          'gradegftfy': parseFloat(things[7]),
          'gradegall': parseFloat(things[8]),
          'emprate': parseFloat(things[9]),
          'pct_ts': parseFloat(things[10]),
          'stabbr': things[11],
          'pct_tsg': parseFloat(things[12]),
          'pct_ts_all': parseFloat(things[13]),
          'pct_tsg_all': parseFloat(things[14]),
          'pct_gths': parseFloat(things[15]),
          'pct_gthsftfy': parseFloat(things[16]),
          'gmajor': String(things[17]).replace(/['"]+/g, '')
          });
}

function noStateSelectedMsg() {
  'use strict';
  $('#selected-state').html("No state has been selected. Please select a state").addClass("text-danger");
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
  "Industrial arts, consumer <br> services, and recreation",
  "Law and public policy",
  "Physical sciences",
  "Psychology and social work",
  "Social sciences"];
var color_list = ['#BD226B', '#D92423', '#D96637', '#F38C3B', '#FBAF31', '#A6BE43', '#53B64E', '#0D723D',
  '#169882', '#55C4D5', '#25A0D8', '#147FE0', '#0B5D92', '#7D7BA4', '#8C65A9'];
var color_listGrad = [],
  i;
for (i in color_list) {
  color_listGrad.push(hexToRGB(color_list[i], 1));
}
function displayTooltip(text, left) {
  $('#tooltiptext').text(text);
  $('#tooltip').show();
  $('#tooltip').css('left', parseInt(left, 10) + 'px');
}
function hideTooltip(e) {
  $('#tooltip').hide();
}

function display_all_majors(pxcat, pgba, pggrad, balines, gradlines, pstate) {
  'use strict';
  // Fill arrays for charts
  var xcat_gmajor = [],
    arr_rngbagmajor = [],
    arr_p50bagmajor = [],
    arr_rnggradgmajor = [],
    i,
    arr_p50gradgmajor = [],
    dboost,
    boost,
    arr_pctbagmajor = [],
    arr_pctgradgmajor = [];
  
  $.each(pxcat, function (items, item) {
    xcat_gmajor.push(item.gmajor);
  });
  i = -1;
  $.each(pgba, function (items, item) {
    i = i + 1;
    arr_rngbagmajor.push({low: item.p25, high: item.p75});
    arr_p50bagmajor.push({x: i - 0.2, y: item.p50});
  });
  i = -1;
  $.each(pggrad, function (items, item) {
    i = i + 1;
    dboost = Math.round((pggrad[i].p50 - pgba[i].p50) / 10000) * 10000;
    boost = Math.round(((pggrad[i].p50 / pgba[i].p50) - 1) * 100) + "%";
    arr_rnggradgmajor.push({low: item.p25, high: item.p75});
    arr_p50gradgmajor.push({x: i + 0.15, y: item.p50, boost: boost, dboost: dboost});
  });
  arr_pctbagmajor = [];
  $.each(pgba, function (items, item) {
    arr_pctbagmajor.push(item.pct_ts_all);
  });
  arr_pctgradgmajor = [];
  $.each(pggrad, function (items, item) {
    arr_pctgradgmajor.push(item.pct_ts_all);
  });

  // console.log(xcat_gmajor);
  // console.log(arr_pctbagmajor);
  $('#earn-chart').height(650);
  $('#pop-chart').height(650);

  $('#earn-chart').highcharts({
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
      useHTML: true,
      labels: {
        style: {
          fontSize: '12px',
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
//            events: {
//              mouseover: function (){
//                alert('mose');
//              }
//            },
        value: balines,
        dashStyle: 'shortDash',
        width: 2,
/*
        events: {
          mouseover: function (e) {
            displayTooltip("All Bachelor's degrees", $(window).width() / 3 * 2);
          },
          mouseout: hideTooltip
        },
*/
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
          value: gradlines,
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
            if (this.series.name === "Bachelor's degree") {
              return "Median earnings: " + Highcharts.numberFormat(Math.round(this.y / 10000) * 10000, 0) + '<br>';
            } else {
              return "Median earnings: " + Highcharts.numberFormat(Math.round(this.y / 10000) * 10000, 0) + '<br>' +
                'Graduate boost: ' + Highcharts.numberFormat(this.dboost, 0) + " (" + this.boost + ")";
            }
          }
        }
      },
      columnrange : {
        dataLabels: {
          enabled: false
        },
        tooltip: {
          hideDelay: 100,
          headerFormat: '<span style="font-size: 10px">{point.key}</span><br/>',
          pointFormatter: function () {
            var diff = Math.round(this.high / 10000) * 10000 - Math.round(this.low / 10000) * 10000;
            return this.series.name + ': <br>' +
              "P25:" + Highcharts.numberFormat(Math.round(this.low / 10000) * 10000, 0) + '<br>' +
              "P75:" + Highcharts.numberFormat(Math.round(this.high / 10000) * 10000, 0) + '<br>' +
              "Earnings difference: " + Highcharts.numberFormat(diff, 0);
          }
        }
      }
    },
    legend: {
      enabled: false
    },
    tooltip: {
      useHTML: true
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

  $('#pop-chart').highcharts({
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
/*
      labels: {
        enabled: true
      },
*/
      title: {
        text: 'Undergraduate major'
          //align: 'top',
          //rotation: 0
      },
      useHTML: true,
      labels: {
        style: {
          fontSize: '12px',
          fontWeight: '500'
        }
      },
      categories: xcat_gmajor
    },

    yAxis: {
      title: {
        text: ''
      },
      labels: {
        formatter: function () {
          return Math.round(this.value * 100);
        }
      }
    },
    plotOptions: {
      bar: {
        dataLabels: {
          enabled: false
        },
        tooltip: {
          hideDelay: 100,
          useHTML: true,
          pointFormatter: function () {
            return this.series.name + ": " + Math.round(this.y * 100) + "%";
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
  $('.well h5').text('All major groups: National');
}

function change_major(pmajorname, pbadata, pgraddata, balines, gradlines, pstate) {
  'use strict';
  var str_gmajor = pmajorname,
    color_to_use = major_groups.indexOf(str_gmajor),
    modal_badata,
    modal_graddata,
    xcat_dmajor = [],
    arr_rngbadmajor = [],
    arr_p50badmajor = [],
    arr_rnggraddmajor = [],
    arr_p50graddmajor = [],
    dboost,
    boost,
    arr_pctbadmajor = [],
    arr_pctgraddmajor = [],
    i,
    numXcat,
    chHeight,
    modal,
    span,
    evt;
  
  modal_badata = $.grep(pbadata, function (n, i) {
    // replace blank space to make comparison: Problem cropped up after replacing files with breaks in major names?
    return n.gmajor.replace(/\s/g, '') === str_gmajor.replace(/\s/g, '');
  });
  modal_graddata = $.grep(pgraddata, function (n, i) {
    return n.gmajor.replace(/\s/g, '') === str_gmajor.replace(/\s/g, '');
  });
  
  // TODO: Trap chart display when there is no data to show 
  
  // Fill arrays for charts
  $.each(modal_badata, function (items, item) {
    xcat_dmajor.push(item.dmajor);
  });
  i = -1;
  $.each(modal_badata, function (items, item) {
    i = i + 1;
    arr_rngbadmajor.push({low: item.p25, high: item.p75});
    arr_p50badmajor.push({x: i - 0.2, y: item.p50, smpSz: item.freq});
  });
  i = -1;
  $.each(modal_graddata, function (items, item) {
    i = i + 1;
    // Compute boost in graduate degree earnings if majors match 
    if (modal_badata[i].dmajor === modal_graddata[i].dmajor) {
      dboost = Math.round((modal_graddata[i].p50 - modal_badata[i].p50) / 10000) * 10000;
      boost = Math.round(((modal_graddata[i].p50 / modal_badata[i].p50) - 1) * 100) + "%";
      arr_rnggraddmajor.push({low: item.p25, high: item.p75});
      arr_p50graddmajor.push({x: i + 0.15, y: item.p50, boost: boost, dboost: dboost, smpSz: item.freq});
    }
  });
  $.each(modal_badata, function (items, item) {
    arr_pctbadmajor.push(item.pct_tsg);
  });
  $.each(modal_graddata, function (items, item) {
    arr_pctgraddmajor.push(item.pct_tsg);
  });
  
  numXcat = xcat_dmajor.length;
  chHeight = 0;
  if (numXcat > 0 && numXcat < 6) {
    chHeight = 400;
  } else if (numXcat >= 5 && numXcat < 15) {
    chHeight = 600;
  } else if (numXcat >= 15) {
    chHeight = 800;
  }
  $('#earn-chart').height(chHeight);
  $('#pop-chart').height(chHeight);

  $('#earn-chart').highcharts({
    chart: {
      inverted: true
    },
    title: {
      text: 'Earnings'
    },
    tooltip: {
      useHTML: true
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
            var warnmsg = '';
            if (this.series.name === "Bachelor's degree") {
              if (this.smpSz < 100) {
                warnmsg = 'Sample size (' + this.smpSz + ') may be unreliable. <br>';
              }
              return "Median earnings: " + Highcharts.numberFormat(Math.round(this.y / 10000) * 10000, 0) + '<br>' + warnmsg;
            } else {
              if (this.smpSz < 100) {
                warnmsg = 'Sample size (' + this.smpSz + ') may be unreliable. <br>';
              }
              return "Median earnings: " + Highcharts.numberFormat(Math.round(this.y / 10000) * 10000, 0) + '<br>' +
                'Graduate boost: ' + Highcharts.numberFormat(this.dboost, 0) + " (" + this.boost + ")" + '<br>' + warnmsg;
            }
          }
        }
      },
      columnrange: {
        dataLabels: {
          enabled: false
        },
        tooltip: {
          hideDelay: 100,
          pointFormatter: function () {
            var diff = Math.round(this.high / 10000) * 10000 - Math.round(this.low / 10000) * 10000;
            return this.series.name + ': <br>' +
              "P25:" + Highcharts.numberFormat(Math.round(this.low / 10000) * 10000, 0) + '<br>' +
              "P75:" + Highcharts.numberFormat(Math.round(this.high / 10000) * 10000, 0) + '<br>' +
              "Earnings difference: " + Highcharts.numberFormat(diff, 0);
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
  $('#pop-chart').highcharts({
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
/*
      labels: {
        enabled: false
      },
*/
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
      labels: {
        formatter: function () {
          return Math.round(this.value * 100);
        }
      }
    },
    plotOptions: {
      bar: {
        dataLabels: {
          enabled: false
        },
        tooltip: {
          hideDelay: 100,
          pointFormatter: function () {
            return this.series.name + ": " + Math.round(this.y * 100) + "%";
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
  
  if (pstate) {
    $('.well h5').text(str_gmajor.replace('<br> ', '') + ': ' + pstate);
  } else {
    $('.well h5').text(str_gmajor.replace('<br> ', '') + ': National');
  }
  // Need this to force resize so that charts show correctly
  evt = document.createEvent("HTMLEvents");
  evt.initEvent("resize", false, true);
  window.dispatchEvent(evt);
}

$(document).ready(function () {
  'use strict';

  $('#tooltip').hide();
  
  var arr_majors = [],
    SelectedState = null,
    FullState = null,
    stateDataRead = false,
    viewState = false,
    arr_pggmajor,
    arr_pgdmajor,
    arr_schl,
    arr_bagmajor,
    arr_gradgmajor,
    arr_badmajor,
    arr_graddmajor,
    overall_ba,
    overall_grad,
    arr_stmajors = [],
    arr_stpggmajor = [],
    arr_stpgdmajor = [],
    arr_stschl = [],
    arr_stbagmajor = [],
    arr_stgradgmajor = [],
    arr_stbadmajor = [],
    arr_stgraddmajor = [],
    varr_pggmajor,
    varr_bagmajor,
    varr_gradgmajor,
    varr_badmajor,
    varr_graddmajor;
  
  $.get('webbaplus_ftfy_25_59.txt', function (majorsdata, status) {
    var lines = majorsdata.split('\n');
    $.each(lines, function (lineNo, line) {
      var items = line.split('\t');
      if (lineNo > 0) {
        pushData(arr_majors, items);
      }
    });

    // Percent grad degree of majors is type = 2 and 3
    arr_pggmajor = $.grep(arr_majors, function (n, i) {
      return n.type === 2;
    });
    arr_pgdmajor = $.grep(arr_majors, function (n, i) {
      return n.type === 3;
    });
    // Bachelor's and graduate degree overall
    arr_schl = $.grep(arr_majors, function (n, i) {
      return n.type === 4;
    });
    // Terminal BA and Grad by grouped major
    arr_bagmajor = $.grep(arr_majors, function (n, i) {
      return n.type === 6 && n.schl === 'Bachelors';
    });
    arr_gradgmajor = $.grep(arr_majors, function (n, i) {
      return n.type === 6 && n.schl === 'Graduate degree';
    });
    // Terminal BA and Grad by detailed major
    arr_badmajor = $.grep(arr_majors, function (n, i) {
      return n.type === 7 && n.schl === 'Bachelors';
    });
    arr_graddmajor = $.grep(arr_majors, function (n, i) {
      return n.type === 7 && n.schl === 'Graduate degree';
    });
    overall_ba = arr_schl[0].p50;
    overall_grad = arr_schl[1].p50;
    
    $('#all-major-groups-icon').click(function () {
      if (viewState) {
        if (FullState === null) {
          noStateSelectedMsg();
        } else {
          varr_pggmajor = $.grep(arr_stpggmajor, function (n, i) {
            return n.stabbr.replace(/\s/g, '') === SelectedState.replace(/\s/g, '');
          });
          varr_bagmajor = $.grep(arr_stbagmajor, function (n, i) {
            return n.stabbr.replace(/\s/g, '') === SelectedState.replace(/\s/g, '');
          });
          varr_gradgmajor = $.grep(arr_stgradgmajor, function (n, i) {
            return n.stabbr.replace(/\s/g, '') === SelectedState.replace(/\s/g, '');
          });
          display_all_majors(varr_pggmajor, varr_bagmajor, varr_gradgmajor, overall_ba, overall_grad, FullState);
        }
      } else {
        display_all_majors(arr_pggmajor, arr_bagmajor, arr_gradgmajor, overall_ba, overall_grad);
      }
    });
    $('#agriculture-and-natural-resources-icon').click(function () {
      if (viewState) {
        if (FullState === null) {
          noStateSelectedMsg();
        } else {
          varr_badmajor = $.grep(arr_stbadmajor, function (n, i) {
            return n.stabbr.replace(/\s/g, '') === SelectedState.replace(/\s/g, '');
          });
          varr_graddmajor = $.grep(arr_stgraddmajor, function (n, i) {
            return n.stabbr.replace(/\s/g, '') === SelectedState.replace(/\s/g, '');
          });
          change_major('Agriculture and natural resources', varr_badmajor, varr_graddmajor, overall_ba, overall_grad, FullState);
        }
      } else {
        change_major('Agriculture and natural resources', arr_badmajor, arr_graddmajor, overall_ba, overall_grad);
      }
    });
    $('#architecture-and-engineering-icon').click(function () {
      if (viewState) {
        if (FullState === null) {
          noStateSelectedMsg();
        } else {
          varr_badmajor = $.grep(arr_stbadmajor, function (n, i) {
            return n.stabbr.replace(/\s/g, '') === SelectedState.replace(/\s/g, '');
          });
          varr_graddmajor = $.grep(arr_stgraddmajor, function (n, i) {
            return n.stabbr.replace(/\s/g, '') === SelectedState.replace(/\s/g, '');
          });
          change_major('Architecture and engineering', varr_badmajor, varr_graddmajor, overall_ba, overall_grad, FullState);
        }
      } else {
        change_major('Architecture and engineering', arr_badmajor, arr_graddmajor, overall_ba, overall_grad);
      }
    });
    $('#arts-icon').click(function () {
      if (viewState) {
        if (FullState === null) {
          noStateSelectedMsg();
        } else {
          varr_badmajor = $.grep(arr_stbadmajor, function (n, i) {
            return n.stabbr.replace(/\s/g, '') === SelectedState.replace(/\s/g, '');
          });
          varr_graddmajor = $.grep(arr_stgraddmajor, function (n, i) {
            return n.stabbr.replace(/\s/g, '') === SelectedState.replace(/\s/g, '');
          });
          change_major('Arts', varr_badmajor, varr_graddmajor, overall_ba, overall_grad, FullState);
        }
      } else {
        change_major("Arts", arr_badmajor, arr_graddmajor, overall_ba, overall_grad);
      }
    });
    $('#biology-and-life-sciences-icon').click(function () {
      if (viewState) {
        if (FullState === null) {
          noStateSelectedMsg();
        } else {
          varr_badmajor = $.grep(arr_stbadmajor, function (n, i) {
            return n.stabbr.replace(/\s/g, '') === SelectedState.replace(/\s/g, '');
          });
          varr_graddmajor = $.grep(arr_stgraddmajor, function (n, i) {
            return n.stabbr.replace(/\s/g, '') === SelectedState.replace(/\s/g, '');
          });
          change_major('Biology and life sciences', varr_badmajor, varr_graddmajor, overall_ba, overall_grad, FullState);
        }
      } else {
        change_major('Biology and life sciences', arr_badmajor, arr_graddmajor, overall_ba, overall_grad);
      }
    });
    $('#business-icon').click(function () {
      if (viewState) {
        if (FullState === null) {
          noStateSelectedMsg();
        } else {
          varr_badmajor = $.grep(arr_stbadmajor, function (n, i) {
            return n.stabbr.replace(/\s/g, '') === SelectedState.replace(/\s/g, '');
          });
          varr_graddmajor = $.grep(arr_stgraddmajor, function (n, i) {
            return n.stabbr.replace(/\s/g, '') === SelectedState.replace(/\s/g, '');
          });
          change_major('Business', varr_badmajor, varr_graddmajor, overall_ba, overall_grad, FullState);
        }
      } else {
        change_major("Business", arr_badmajor, arr_graddmajor, overall_ba, overall_grad);
      }
    });
    $('#communications-and-journalism-icon').click(function () {
      if (viewState) {
        if (FullState === null) {
          noStateSelectedMsg();
        } else {
          varr_badmajor = $.grep(arr_stbadmajor, function (n, i) {
            return n.stabbr.replace(/\s/g, '') === SelectedState.replace(/\s/g, '');
          });
          varr_graddmajor = $.grep(arr_stgraddmajor, function (n, i) {
            return n.stabbr.replace(/\s/g, '') === SelectedState.replace(/\s/g, '');
          });
          change_major('Communications and journalism', varr_badmajor, varr_graddmajor, overall_ba, overall_grad, FullState);
        }
      } else {
        change_major('Communications and journalism', arr_badmajor, arr_graddmajor, overall_ba, overall_grad);
      }
    });
    $('#computers-statistics-and-mathematics-icon').click(function () {
      if (viewState) {
        if (FullState === null) {
          noStateSelectedMsg();
        } else {
          varr_badmajor = $.grep(arr_stbadmajor, function (n, i) {
            return n.stabbr.replace(/\s/g, '') === SelectedState.replace(/\s/g, '');
          });
          varr_graddmajor = $.grep(arr_stgraddmajor, function (n, i) {
            return n.stabbr.replace(/\s/g, '') === SelectedState.replace(/\s/g, '');
          });
          change_major('Computers, statistics, and mathematics', varr_badmajor, varr_graddmajor, overall_ba, overall_grad, FullState);
        }
      } else {
        change_major("Computers, statistics, and mathematics", arr_badmajor, arr_graddmajor, overall_ba, overall_grad);
      }
    });
    $('#education-icon').click(function () {
      if (viewState) {
        if (FullState === null) {
          noStateSelectedMsg();
        } else {
          varr_badmajor = $.grep(arr_stbadmajor, function (n, i) {
            return n.stabbr.replace(/\s/g, '') === SelectedState.replace(/\s/g, '');
          });
          varr_graddmajor = $.grep(arr_stgraddmajor, function (n, i) {
            return n.stabbr.replace(/\s/g, '') === SelectedState.replace(/\s/g, '');
          });
          change_major('Education', varr_badmajor, varr_graddmajor, overall_ba, overall_grad, FullState);
        }
      } else {
        change_major('Education', arr_badmajor, arr_graddmajor, overall_ba, overall_grad);
      }
    });
    $('#health-icon').click(function () {
      if (viewState) {
        if (FullState === null) {
          noStateSelectedMsg();
        } else {
          varr_badmajor = $.grep(arr_stbadmajor, function (n, i) {
            return n.stabbr.replace(/\s/g, '') === SelectedState.replace(/\s/g, '');
          });
          varr_graddmajor = $.grep(arr_stgraddmajor, function (n, i) {
            return n.stabbr.replace(/\s/g, '') === SelectedState.replace(/\s/g, '');
          });
          change_major('Health', varr_badmajor, varr_graddmajor, overall_ba, overall_grad, FullState);
        }
      } else {
        change_major("Health", arr_badmajor, arr_graddmajor, overall_ba, overall_grad);
      }
    });
    $('#humanities-and-liberal-arts-icon').click(function () {
      if (viewState) {
        if (FullState === null) {
          noStateSelectedMsg();
        } else {
          varr_badmajor = $.grep(arr_stbadmajor, function (n, i) {
            return n.stabbr.replace(/\s/g, '') === SelectedState.replace(/\s/g, '');
          });
          varr_graddmajor = $.grep(arr_stgraddmajor, function (n, i) {
            return n.stabbr.replace(/\s/g, '') === SelectedState.replace(/\s/g, '');
          });
          change_major('Humanities and liberal arts', varr_badmajor, varr_graddmajor, overall_ba, overall_grad, FullState);
        }
      } else {
        change_major('Humanities and liberal arts', arr_badmajor, arr_graddmajor, overall_ba, overall_grad);
      }
    });
    $('#industrial-arts-consumer-services-and-recreation-icon').click(function () {
      if (viewState) {
        if (FullState === null) {
          noStateSelectedMsg();
        } else {
          varr_badmajor = $.grep(arr_stbadmajor, function (n, i) {
            return n.stabbr.replace(/\s/g, '') === SelectedState.replace(/\s/g, '');
          });
          varr_graddmajor = $.grep(arr_stgraddmajor, function (n, i) {
            return n.stabbr.replace(/\s/g, '') === SelectedState.replace(/\s/g, '');
          });
          change_major('Industrial arts, consumer <br> services, and recreation', varr_badmajor, varr_graddmajor, overall_ba, overall_grad, FullState);
        }
      } else {
        change_major('Industrial arts, consumer <br> services, and recreation', arr_badmajor, arr_graddmajor, overall_ba, overall_grad);
      }
    });
    $('#law-and-public-policy-icon').click(function () {
      if (viewState) {
        if (FullState === null) {
          noStateSelectedMsg();
        } else {
          varr_badmajor = $.grep(arr_stbadmajor, function (n, i) {
            return n.stabbr.replace(/\s/g, '') === SelectedState.replace(/\s/g, '');
          });
          varr_graddmajor = $.grep(arr_stgraddmajor, function (n, i) {
            return n.stabbr.replace(/\s/g, '') === SelectedState.replace(/\s/g, '');
          });
          change_major('Law and public policy', varr_badmajor, varr_graddmajor, overall_ba, overall_grad, FullState);
        }
      } else {
        change_major("Law and public policy", arr_badmajor, arr_graddmajor, overall_ba, overall_grad);
      }
    });
    $('#physical-sciences-icon').click(function () {
      if (viewState) {
        if (FullState === null) {
          noStateSelectedMsg();
        } else {
          varr_badmajor = $.grep(arr_stbadmajor, function (n, i) {
            return n.stabbr.replace(/\s/g, '') === SelectedState.replace(/\s/g, '');
          });
          varr_graddmajor = $.grep(arr_stgraddmajor, function (n, i) {
            return n.stabbr.replace(/\s/g, '') === SelectedState.replace(/\s/g, '');
          });
          change_major('Physical sciences', varr_badmajor, varr_graddmajor, overall_ba, overall_grad, FullState);
        }
      } else {
        change_major('Physical sciences', arr_badmajor, arr_graddmajor, overall_ba, overall_grad);
      }
    });
    $('#psychology-and-social-work-icon').click(function () {
      if (viewState) {
        if (FullState === null) {
          noStateSelectedMsg();
        } else {
          varr_badmajor = $.grep(arr_stbadmajor, function (n, i) {
            return n.stabbr.replace(/\s/g, '') === SelectedState.replace(/\s/g, '');
          });
          varr_graddmajor = $.grep(arr_stgraddmajor, function (n, i) {
            return n.stabbr.replace(/\s/g, '') === SelectedState.replace(/\s/g, '');
          });
          change_major('Psychology and social work', varr_badmajor, varr_graddmajor, overall_ba, overall_grad, FullState);
        }
      } else {
        change_major("Psychology and social work", arr_badmajor, arr_graddmajor, overall_ba, overall_grad);
      }
    });
    $('#social-sciences-icon').click(function () {
      if (viewState) {
        if (FullState === null) {
          noStateSelectedMsg();
        } else {
          varr_badmajor = $.grep(arr_stbadmajor, function (n, i) {
            return n.stabbr.replace(/\s/g, '') === SelectedState.replace(/\s/g, '');
          });
          varr_graddmajor = $.grep(arr_stgraddmajor, function (n, i) {
            return n.stabbr.replace(/\s/g, '') === SelectedState.replace(/\s/g, '');
          });
          change_major('Social sciences', varr_badmajor, varr_graddmajor, overall_ba, overall_grad, FullState);
        }
      } else {
        change_major('Social sciences', arr_badmajor, arr_graddmajor, overall_ba, overall_grad);
      }
    });
  
    $('#state').change(function () {
      SelectedState = $('#state').val();
      if (SelectedState !== 'National') {
        FullState = $('#state option:selected').text();
        $("#selState").text(FullState + " selected. Now select a major.");
        viewState = true;
        if (!stateDataRead) {
          $.get('webst_baplus_ftfy_25_59.txt', function (majorsdata, status) {
            var lines = majorsdata.split('\n');
            $.each(lines, function (lineNo, line) {
              var items = line.split('\t');
              if (lineNo > 0) {
                pushStateData(arr_stmajors, items);
              }
            });
          // console.log(arr_stmajors);        
          // Percent grad degree of majors 
            arr_stpggmajor = $.grep(arr_stmajors, function (n, i) {
              return n.type === 10;
            });
            arr_stpgdmajor = $.grep(arr_stmajors, function (n, i) {
              return n.type === 11;
            });
            // Bachelor's and graduate degree overall
            arr_stschl = $.grep(arr_stmajors, function (n, i) {
              return n.type === 12;
            });
            // Terminal BA and Grad by grouped major
            arr_stbagmajor = $.grep(arr_stmajors, function (n, i) {
              return n.type === 14 && n.schl === 'Bachelors';
            });
            arr_stgradgmajor = $.grep(arr_stmajors, function (n, i) {
              return n.type === 14 && n.schl === 'Graduate degree';
            });
            // Terminal BA and Grad by detailed major
            arr_stbadmajor = $.grep(arr_stmajors, function (n, i) {
              return n.type === 15 && n.schl === 'Bachelors';
            });
            arr_stgraddmajor = $.grep(arr_stmajors, function (n, i) {
              return n.type === 15 && n.schl === 'Graduate degree';
            });
            stateDataRead = true;
          });
        }
      } else {
        $("#selState").text("Currently viewing national data.");
      }
    });
  });
});