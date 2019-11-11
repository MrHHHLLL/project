//初始化
    var map = new BMap.Map("container");// 创建地图实例
    var point = new BMap.Point(116.404, 39.915);// 创建点坐标
    map.centerAndZoom(point, 15);// 初始化地图，设置中心点坐标和地图级别
    //添加控件
    map.addControl(new BMap.NavigationControl());
    map.addControl(new BMap.ScaleControl());
    map.addControl(new BMap.OverviewMapControl());
    map.enableScrollWheelZoom(true);
    var localSearch = new BMap.LocalSearch(map);
    var weather = null;
    listen();

function listen(){
    var ac = new BMap.Autocomplete(
        {"input" : "search"
            ,"location" : map
        });
    ac.addEventListener("onconfirm", function(e) {
        var _value = e.item.value;
        var address = _value.province + _value.city + _value.district + _value.street + _value.business;
        console.log(_value.city);
        var a = _value.district.slice(0, -1); //区或市
        position(address,a);
    });
}
function position(address,cityname) {
    //var cityname = document.getElementById("search").value;
    localSearch.setSearchCompleteCallback(function (searchResult) {
        poi = searchResult.getPoi(0);
        map.centerAndZoom(poi.point,10);
        marker = new BMap.Marker(new BMap.Point(poi.point.lng, poi.point.lat));
        map.addOverlay(marker);
        getweather(marker,poi,cityname);
    })
    localSearch.search(address);
}

function getweather(marker,poi,cityname) {
    $.ajax({
        type: 'GET',
        url: 'https://www.tianqiapi.com/api/',
        data: 'version=v1&region=广州&city='+cityname+'&appid=[49741197]&appsecret=[3c1FjRGf]',
        dataType: 'JSON',
        error: function () {
            alert('网络错误');
        },
        success: function (res) {
            weather = res.data[0];
            weather= '日期：' + weather.date + '\n' + '温度：' + weather.tem + '\n' +'天气：' + weather.wea + '\n' +'风向：' + weather.win + '\n';
            message(marker,poi);
        }
    });
}

function message(marker,poi) {
    var opts = {
        width : 250,     // 信息窗口宽度
        height: 100,     // 信息窗口高度
        title : poi.title+"天气"  // 信息窗口标题
    }
    var infoWindow = new BMap.InfoWindow(weather, opts);
    map.openInfoWindow(infoWindow, poi.point);
    marker.addEventListener("click", function(){
        map.openInfoWindow(infoWindow, poi.point);
    });
}
