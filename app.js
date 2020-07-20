// Read in the samples.json file
var SampleData = "samples.json";
var dropdown = d3.select("#selDataset");
var demoInfo = d3.select("#sample-metadata");

// Get the data for the dropdown
// Read in the data from the json file
// Append the id located in "names" from the Sample.json data
function populateDropDown() {
  d3.json(SampleData).then(function (SampleData) {
    SampleData.names.forEach(function (idValue) {
      dropdown.append("option")
        .text(idValue)
        .property("value");
    });
  });
}

populateDropDown();

// Retrieve information from SampleData, and populate the Demographic Info section of page
// Read in the data from the json file
// and retrieve the metadata from within the SampleData
// Filter through the metadata by ID
// Clear data within the "Demographic Info" section if there is anything inside
// Grab the necessary demographic data data for the id and append the info to the panel
function demographicData(id) {
  d3.json(SampleData).then(function (SampleData) {
    var SampleMetadata = SampleData.metadata;

    var idInfo = SampleMetadata.filter(function (metadata) {
      return metadata.id == id
    })[0];

    demoInfo.html("");

    Object.entries(idInfo).forEach(function ([key, value]) {
      demoInfo
        .append("h5")
        .text(key + ": " + value + "\n");
    });
  });
}


// Retrieving information for plots, and creating plots
// Grab all the variables needed for each plot -- All data points for bubble chart
// and only top10 for the bar chart
function plotCreation(id) {
  d3.json(SampleData).then(function (data) {
    // Variables for Bubble Chart
    var filteredObject = data.samples.filter(subject => subject.id == id)[0]
    var sampleValue = filteredObject.sample_values;
    var otuID = filteredObject.otu_ids;
    var otuLabel = filteredObject.otu_labels;
    // console.log(filteredObject[0].sample_values)
    // console.log(sampleValue)
    // console.log(filteredObject)
    
    // Variables for Bar Chart
    var sampleValueTop = sampleValue.slice(0, 10).reverse();
    var otuIDTop = (otuID.slice(0, 10)).reverse();
    var otuLabelTop = otuLabel.slice(0, 10).reverse();
    // console.log(sampleValueTop)


    // Building the Bar Chart
    var idTopMap = otuIDTop.map(function (element) {
      return "OTU " + element
    });

    var barTrace = [{
      x: sampleValueTop,
      y: idTopMap,
      type: "bar",
      text: otuLabelTop,
      marker: {
        color: 'blue'
      },
      orientation: "h",
    }];

    var barLayout = {
      title: "Top 10 OTU for ID",
      yaxis: {
        tickmode: "linear",
      },
    };

    Plotly.newPlot("bar", barTrace, barLayout);


    // Building the Bubble Chart
    var bubbleTrace = [{
      x: otuID,
      y: sampleValue,
      mode: "markers",
      marker: {
        color: otuID,
        size: sampleValue
      },
      text: otuLabel
    }];

    var bubbleLayout = {
      xaxis: { title: "OTU ID" },
      height: 500,
      width: 1080
    };

    Plotly.newPlot("bubble", bubbleTrace, bubbleLayout); 

  });
};

// Run functions when an option changes
function optionChanged(id) {
  demographicData(id);
  plotCreation(id);
};
