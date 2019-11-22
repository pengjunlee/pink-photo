<style lang="scss" scoped>
.map {
  width: 400px;
  height: 300px;
}
#allMap {
  width: 100%;
  height: 100%;
}
#bookingMap {
  width: 100%;
  height: 92%;
}
#r-result {
  width: 100%;
}
</style>
<template>
  <div id="allMap">
    <div id="r-result" style="padding: 10px;">
      <span>
        请输入:
        <input
          type="text"
          id="suggestId"
          value
          size="25"
          style="width:350px;height: 32px;line-height: 15px;padding: 4px 7px;font-size: 12px;"
        />
      </span>
      <span style="margin-left: 20px;">已选择：{{place}}</span>
      <Button
        style="float:right;margin-right:50px;width:150px;height:28px;line-height:15px"
        @click="onOkEvent"
        type="primary"
      >设为设备位置</Button>
    </div>
    <div
      id="searchResultPanel"
      style="border:1px solid #C0C0C0;width:150px;height:auto; display:none;"
    ></div>
    <div id="bookingMap"></div>
  </div>
</template>
<script>
let map;
export default {
  props: {},
  data() {
    return {
      place: "",
      top: 0
    };
  },
  mounted() {
    //初始化地图前先将scrollTop设置为0，否则会出现放大/缩小位置偏移
    this.mapOpen();
    this.initMap();
  },
  beforeDestroy() {
    map = null;
    //关闭地图前将scrollTop设置为原始值
    this.mapClose();
  },
  methods: {
    initMap() {
      //实例化地图
      map = new BMap.Map("bookingMap");
      //设置地图中心点坐标，比例大小
      var point = new BMap.Point(116.331398, 39.897445);
      map.centerAndZoom(point, 12);
      //启用滚轮放大缩小，默认禁用
      map.enableScrollWheelZoom();
      //启用地图拖拽事件，默认启用
      map.enableInertialDragging();
      //启用地图缩放，默认禁用
      map.enableContinuousZoom();
      //默认手型改为十字星
      map.setDefaultCursor("crosshair");
      //定位
      this.getPlace();
      //添加地图控制器
      this.addControl();
      //添加监听
      this.addListener();
    },
    addControl() {
      // 地图缩放控件
      const topLeftControl = new BMap.ScaleControl({
        anchor: BMAP_ANCHOR_BOTTOM_LEFT
      });
      // 城市选择控件
      const size = new BMap.Size(10, 20);
      const cityListControl = new BMap.CityListControl({
        anchor: BMAP_ANCHOR_TOP_RIGHT,
        offset: size
      });
      // 比例尺控件
      const topLeftNavigation = new BMap.NavigationControl();
      map.addControl(topLeftControl);
      map.addControl(topLeftNavigation);
      map.addControl(cityListControl);
    },
    addListener() {
      let _this = this;
      // 百度地图API功能
      function G(id) {
        return document.getElementById(id);
      }
      var geoc = new BMap.Geocoder();
      //点击监听，获得点击地址
      map.addEventListener("click", function(e) {
        _this.addMarker(e.point);
        geoc.getLocation(e.point, function(rs) {
          var addComp = rs.addressComponents;
          var address =
            addComp.province +
            addComp.city +
            addComp.district +
            addComp.street +
            addComp.streetNumber;
          _this.place = address;
        });
      });
      //输入监听
      var ac = new BMap.Autocomplete({ input: "suggestId", location: map }); //建立一个自动完成的对象
      ac.addEventListener("onhighlight", function(e) {
        //鼠标放在下拉列表上的事件
        var str = "";
        var _value = e.fromitem.value;
        var value = "";
        if (e.fromitem.index > -1) {
          value =
            _value.province +
            _value.city +
            _value.district +
            _value.street +
            _value.business;
        }
        str =
          "FromItem<br />index = " +
          e.fromitem.index +
          "<br />value = " +
          value;

        value = "";
        if (e.toitem.index > -1) {
          _value = e.toitem.value;
          value =
            _value.province +
            _value.city +
            _value.district +
            _value.street +
            _value.business;
        }
        str +=
          "<br />ToItem<br />index = " +
          e.toitem.index +
          "<br />value = " +
          value;
        G("searchResultPanel").innerHTML = str;
      });

      var myValue;
      ac.addEventListener("onconfirm", function(e) {
        //鼠标点击下拉列表后的事件
        var _value = e.item.value;
        myValue =
          _value.province +
          _value.city +
          _value.district +
          _value.street +
          _value.business;
        G("searchResultPanel").innerHTML =
          "onconfirm<br />index = " +
          e.item.index +
          "<br />myValue = " +
          myValue;
        _this.place = myValue;
        setPlace();
      });

      function setPlace() {
        map.clearOverlays(); //清除地图上所有覆盖物
        function myFun() {
          var pp = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
          map.centerAndZoom(pp, 18);
          map.addOverlay(new BMap.Marker(pp)); //添加标注
        }
        var local = new BMap.LocalSearch(map, {
          //智能搜索
          onSearchComplete: myFun
        });
        local.search(myValue);
      }
    },
    addMarker(point) {
      var marker = new BMap.Marker(point);
      map.clearOverlays();
      map.addOverlay(marker);
    },
    //定位
    getPlace() {
      let _this = this;
      function myFun(result) {
        var cityName = result.name;
        map.setCenter(cityName);
        if (cityName && cityName != "") {
          _this.place = cityName;
        }
      }
      var myCity = new BMap.LocalCity();
      myCity.get(myFun);
    },
    mapOpen() {
      this.top = this.getScrollTop();
      if (this.top) {
        this.setScrollTop(0);
      }
    },
    mapClose() {
      this.setScrollTop(this.top);
      this.top = 0;
    },
    getScrollTop() {
      let scrollTop = 0;
      if (document.documentElement && document.documentElement.scrollTop) {
        scrollTop = document.documentElement.scrollTop;
      } else if (document.body) {
        scrollTop = document.body.scrollTop;
      }
      return scrollTop;
    },
    setScrollTop(top) {
      if (!isNaN(top)) {
        if (
          document.documentElement &&
          document.documentElement.scrollTop !== undefined
        ) {
          document.documentElement.scrollTop = top;
        } else if (document.body) {
          document.body.scrollTop = top;
        }
      }
    },
    onOkEvent() {
      this.$emit("submit", this.place);
    }
  }
};
</script>