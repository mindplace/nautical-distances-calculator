// $(document).ready(function() {
//     var airportEntries;
//
//     $.ajax({
//         type: "GET",
//         url: "airport_list.txt",
//         dataType: "text",
//         success: function(data) { processData(data); }
//      });
//
//      $( "#pac-input-from" ).autocomplete({
//         source: airportEntries;
//      });
//
//      $( "#pac-input-to" ).autocomplete({
//         source: airportEntries;
//      });
// });
//
// function processData(allText) {
//     var allTextLines = allText.split(/\r\n|\n/);
//     debugger;
//
//     for (var i=1; i<allTextLines.length; i++) {
//         var data = allTextLines[i].split(',');
//         if (data.length == headers.length) {
//
//             var tarr = [];
//             for (var j=0; j<headers.length; j++) {
//                 tarr.push(headers[j]+":"+data[j]);
//             }
//             lines.push(tarr);
//         }
//     }
//     // alert(lines);
// }
