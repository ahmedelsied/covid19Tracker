$(function () {
    // Google GeoChart
    google.charts.load('current', {
        'packages': ['geochart', 'corechart'],
        // See: https://developers.google.com/chart/interactive/docs/basic_load_libs#load-settings
        'mapsApiKey': 'AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY'
    });
    google.charts.setOnLoadCallback(drawAllCharts);

    function drawAllCharts() {
        var data = google.visualization.arrayToDataTable(window.countries),//Data For GeoChart
            options = {//Option For Geo Chart
                backgroundColor: 'transparent',
                region: 'world',
                colorAxis: { colors: ['#e07478', '#c3252b', 'darkred'] }
            },
            coreData = google.visualization.arrayToDataTable([
                ['Type', 'num'],
                ['Confirmed', window.worldConfirmed],
                ['Mortality', window.worldDeathes],
                ['Recoverd', window.worldRecovered],
            ]), //Data For Core Chart  
            coreOptions = {//Option For Core Chart
                title: 'The global percentage',
                is3D: true,
                width: 1000,
                height: 500,
                colors: ['#3e4d5a', 'black', 'skyblue'],
                backgroundColor:'transparent',
            },
            chart = new google.visualization.GeoChart(document.getElementById('regions_div'));
        core = new google.visualization.PieChart(document.getElementById('piechart'));
        chart.draw(data, options);
        core.draw(coreData, coreOptions);
    }
});