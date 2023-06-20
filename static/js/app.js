//Use the D3 library to read in samples: URL https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Console log JSON data
d3.json(url).then(function(data) {
  console.log(data);
});


// Initialize dashboard 
function init() {

  //Create dropdown
    var dropDown = d3.select("#selDataset");
  
    d3.json(url).then((data) => {
      var sampleNames = data.names;
  
      sampleNames.forEach((sample) => {
        dropDown.append("option").text(sample).property("value", sample);
      });
  
      var firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
  };
  
  
  
  init();
  
  function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
    
  }
  
  // populate metadata 
  function buildMetadata(sample) {
    d3.json(url).then((data) => {
      var metadata = data.metadata;
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      var PANEL = d3.select("#sample-metadata");
  
      PANEL.html("");
  
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
  
    });
  }
  
  //barchart  
  function buildCharts(sample) {
    d3.json(url).then((data) => {
      console.log(data);
      var samplesArray = data.samples;
      var resultArray = samplesArray.filter(sampleObj => sampleObj.id == sample);
  
      var metadataArray = data.metadata;
      var resultMetadata = metadataArray.filter(sampleObj => sampleObj.id == sample);
  
      var firstSample = resultArray[0];
      console.log(firstSample);
  
      var firstMetadata = resultMetadata[0];
      console.log(firstMetadata);
  
      var otuIds = firstSample.otu_ids;
      var otuLabels = firstSample.otu_labels;
      var sampleValues = firstSample.sample_values;
  
      var wFreq = parseFloat(firstMetadata.wfreq);
  
      var yticks = otuIds.slice(0, 10).map(id => "OTU " + id + " ").reverse();
  
      var barData = [{
        x: sampleValues.slice(0, 10).reverse(),
        y: yticks,
        text: otuLabels.slice(0, 10).reverse(),
        type: "bar",
        orientation:"h",
        marker: {
          color: sampleValues.slice(0, 10).reverse(),
          colorscale: "Viridis"
        }
        }];
      var barLayout = {
        title: "TOP 10 Bacteria Cultures Found"
      }
      Plotly.newPlot("bar", barData, barLayout);
    
  //Bubble Chart 
      var bubbleData = [{
        x: otuIds,
        y: sampleValues,
        text: otuLabels,
        type: "scatter",
        mode: "markers",
        marker: {
          size: sampleValues,
          color: otuIds,
          colorscale: "Viridis"
        }
      }];
  
      var bubbleLayout = {
        title: "Bacteria Cultures Per Sample",
        xaxis: {title: "OTU ID"},
        margins: {
          l: 0,
          r: 0,
          b: 0,
          t: 0     
        },
        hovermode: "closest"
      };
  
      Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

  // Gauge Chart 
      var gaugeData = [{
        domain: { x: [0, 1], y: [0, 1] },
        value: wFreq,
        title: {text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week", font: {size: 24}},
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: {
            range: [0, 10], 
            tickwidth: 1, 
            tickcolor: "black"},
          bar: {color: "purple"},
          shape: "angular",
          steps: [
            {range: [0, 2], color: "magenta"},
            {range: [2, 4], color: "orange"},
            {range: [4, 6], color: "yellow"},
            {range: [6, 8], color: "limegreen"},
            {range: [8, 10], color: "cyan"},
          ]}
      }];
      
      var gaugeLayout = { 
        width: 555, 
        height: 450,
        margin: {t: 0, r: 0, l: 0, b: 0}
      };
  
      Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  
  
    });
  }