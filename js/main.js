$(function(){
    // Global Vars
    var allCasesSpan    = $('.all-cases'),
        AlldeathesSpan  = $('.all-deaths'),
        AllRecoveredSpan= $('.all-recovered'),
        listOfDetails   = $('#list-of-details'),
        listOfCountries = $('.list-of-countries'),
        statsTable      = $('.stats-table'),
        countriesName   = [];
        window.worldConfirmed = '';
        window.worldDeathes = '';
        window.worldRecovered = '';
        window.countries = [['Country', 'Confirmed']];
    // Event To Get Stats After Select Country
    // Get Data
    getAllData(function(data,dataKey,countries){
        listOfCountries.children('li').on('click',function(){
            var selected = $(this).children('option:selected'),
                def = $('.default');
                def.attr('disabled',true);
            console.log(data[selected.val()]);
        });
    });

    function getAllData(handleData){
        $.ajax({
            url: 'https://pomber.github.io/covid19/timeseries.json',
            type: 'GET',
            dataType: 'json',
            async: true,
            success: function(data){
                var dataKey = Object.keys(data),
                    sumConfirmed = 0,
                    sumRecovered = 0,
                    sumDeaths = 0;
                //Create Country Select And Get Latest Data
                for(var i=0; i<dataKey.length;i++){  
                    var lastData = data[dataKey[0]].length -1,
                        allConfirmed = data[dataKey[i]][lastData]['confirmed'],
                        allRecovered = data[dataKey[i]][lastData]['recovered'],
                        allDeathes = data[dataKey[i]][lastData]['deaths'];
                        sumConfirmed = sumConfirmed + allConfirmed;
                        sumRecovered = sumRecovered + allRecovered;
                        sumDeaths = sumDeaths + allDeathes,
                        arr = [dataKey[i],allConfirmed];
                        window.countries.push(arr) //Set Data Varible
                        countriesName.push(dataKey[i]);
                        statsTable.append('<tr data-confirmed="'+allConfirmed+'" class="tbl-country-'+i+' tr-country"><td class="country_name">'+dataKey[i]+'</td><td class="confirmed_cases">'+numberWithCommas(allConfirmed)+'</td><td class="recovered_cases">'+numberWithCommas(allRecovered)+'</td><td class="mortality_cases">'+numberWithCommas(allDeathes)+'</td></tr>')
                        listOfCountries.append('<li data-country="'+countriesName[i].toLowerCase()+'">'+countriesName[i]+'</li>') //Set Country Search List
                        //Sorting
                        var $wrapper = $('#stats-table');
                        $wrapper.find('.tr-country').sort(function (a, b) {
                            return +b.dataset.confirmed - +a.dataset.confirmed;
                        }).appendTo( $wrapper );
                }
                allCasesSpan.text(numberWithCommas(sumConfirmed));
                AlldeathesSpan.text(numberWithCommas(sumDeaths));
                AllRecoveredSpan.text(numberWithCommas(sumRecovered));
                window.worldConfirmed = sumConfirmed;
                window.worldDeathes = sumDeaths;
                window.worldRecovered = sumRecovered;
                var s = document.createElement("script");
                s.type = "text/javascript";
                s.src = "js/charts.js";
                $('body').append(s);
                handleData(data,dataKey,countries);
            },
            error: function(){
                alert('Check Your Internet Connection And Reload Page');
            }
        });
    }
// Start Front Code
    // Function To Set Numbers With Commas
    function numberWithCommas(x) {
        var parts = x.toString().split(".");
        parts[0]=parts[0].replace(/\B(?=(\d{3})+(?!\d))/g,",");
        return parts;
    }
    // Handle Bars Click
    $('.bars').on('click',function(){
        $('.layer').fadeIn();
        listOfDetails.animate({
            'right':0
        },500);
    });
    $('.layer,.close-i').on('click',function(){
        $('.layer').fadeOut();
        listOfDetails.animate({
            'right':'-311px'
        },500);
    });
    // Set Active Class On Page
    $('.page').on('click',function(){
        $(this).addClass('active-page').siblings().removeClass('active-page');
        $('#'+$(this).data('active')).show();
        $('#'+$(this).siblings().data('active')).hide();
    });
    // Set Search List Of Countries
    var searchInpt = $('.search-inpt');
    $('body').on('click','.list-of-countries li',function(){
        $(this).parent().hide();
    })
    searchInpt.click(function(event) {
        event.stopPropagation();
    }).focus(function(){
        $(document).on('click',function(e){
            if (!$(event.target).closest(listOfCountries).length) {
                listOfCountries.hide();        
            }
        });
        listOfCountries.show();
    }).on('input',function(){
        var string = "String";
        $(this).val($(this).val().toLowerCase());
        listOfCountries.children('li').hide();
        if(listOfCountries.children('li').text().indexOf($(this).val()) != -1 && $(this).val() != "" && typeof $(this).val() == typeof string){
            var result = listOfCountries.children('li[data-country*='+$(this).val()+']');
            result.show();
        }
    });
});