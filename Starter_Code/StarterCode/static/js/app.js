let sampleData; 
let metaField;

function modifyDashboard(selectedValue) {
    let ss = sampleData.find(sample => sample.id === selectedValue);
    

    let trace = {
        x: ss.sample_values.slice(0, 10).sort((function (a, b) {return a - b})),
        y: ss.otu_id.slice(0, 10).map(id => `OTU ${id}`).reverse(),
        text: ss.otu_labels.slice(0, 10),
        type: 'bar',
        orientation: 'h',
        marker: {
            color: '#E32754',
            opacity: 0.75
        }
    };
    let hBarChart = [trace];
    
    let layout = {
        margin: {
            l: 80,
            r: 55,
            t: 35,
            pad: 5
        },
        title: {
            text: `<b>Top 10 OTUs - Sample ${selectedValue} </b>`,
            font: {
                size: 22
            }
        }
    };

    Plotly.newPlot('bar', hBarChart, layout);


    let trace_1 = { 
        x: ss.otu_id,
        y: ss.sample_values,
        mode: 'markers',
        text:ss.otu_labels,
        marker: {
            color: ss.otu_id,
            size: ss.sample_values
        }

    };

    let bubbleChart = [trace_1];

    let bubbleLayout = {
        showlegend: false,
        height: 600,
        width: 1200,
        title: {
            text: `<b>Sample distribution of sample ${selectedValue}</b>`,
            font: {
                size: 22
            }
        },
        xaxis: {
            title: {
                text: "OTU IDs"
            }
        },
        yaxis: {
            title: {
                text: 'Sample Values'
            }
        }
      };
    

    Plotly.newPlot('bubble', bubbleChart, bubbleLayout);

    let selectedMetadata = metaField.find(field => field.id === selectedValue);
    let panelBody = d3.select('.panel-body');
    console.log(selectedMetadata)
    panelBody.html(`
        <p><strong>Id:</strong> ${selectedMetadata.id}</p>
        <p><strong>Ethnicity</strong>: ${selectedMetadata.ethnicity}</p>
        <p><strong>Gender:</strong> ${selectedMetadata.gender}</p>
        <p><strong>Age:</strong> ${selectedMetadata.age}</p>
        <p><strong>Location:</strong> ${selectedMetadata.location}</p>
        <p><strong>BBType:</strong> ${selectedMetadata.bbtype}</p>
        <p><strong>WFreq:</strong> ${selectedMetadata.wfreq}</p>
    `)

    let wfreqValue = selectedMetadata.wfreq;


    let gData = [
        {
            domain: { x: [0, 1], y: [0, 1] },
            title: {
                text: "<b>Belly Button Washing Frequency</b><br><span style='font-size: 20px;'>Scrubs per Week</span>",
                font: { size: 22 }
            },
            type: "indicator",
            mode: "gauge+number",
            value: wfreqValue,
            gauge: {
                axis: { range: [0, 9], tickwidth: 1, tickcolor: 'red'},
                bar: {color: '#430304' },
                bgcolor: "white",
                borderwidth: 2,
                bordercolor: "gray",
                steps: [
                    { range: [0, 1], color: "#f89091" },  // 0-1
                    { range: [1, 2], color: "#f66e6f" },  // 1-2
                    { range: [2, 3], color: "#f44c4e" },  // 2-3
                    { range: [3, 4], color: "#f22a2c" },  // 3-4
                    { range: [4, 5], color: "#ec0d0f" },  // 4-5
                    { range: [5, 6], color: "#ca0b0d" },  // 5-6
                    { range: [6, 7], color: "#a8090b" },  // 6-7
                    { range: [7, 8], color: "#860708" },  // 7-8
                    { range: [8, 9], color: "#650506" }   // 8-9
                ]
            }
        }
    ];

    let layout2 = {
        width: 520,
        height: 500,
        margin: { t: 0, b: 145, pad: 8 }
    };

    Plotly.newPlot('gauge', gData, layout2);

};  

function optionChanged(selectedValue) {
    modifyDashboard(selectedValue);
}

const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
d3.json(url).then(function(data) {
    console.log(data);

    let samples = data.samples;
    let names = data.names;
    let metadata = data.metadata;


    sampleData = samples.map(sample => ({
        'id': sample.id,
        'otu_id': sample.otu_ids,
        'otu_labels': sample.otu_labels,
        'sample_values': sample.sample_values
    }));

    console.log(sampleData);

    const selectElement = document.getElementById("selDataset");
    names.forEach(name => {
        const option = document.createElement('option');
        option.text = name;
        option.value = name;
        selectElement.appendChild(option);
    });
    
    console.log(names);

    metaField = metadata.map(field => ({
        'id': field.id.toString(),
        'ethnicity': field.ethnicity,
        'gender': field.gender,
        'age': field.age,
        'location': field.location,
        'bbtype': field.bbtype,
        'wfreq': field.wfreq
    })); 
    console.log(metaField);
    modifyDashboard(names[0]);

}).catch(function(error) {
    console.log('Error loading the JSON file: ' + error);
});