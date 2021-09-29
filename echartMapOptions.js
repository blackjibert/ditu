// import echarts from 'echarts'
// import $ from 'jquery'
// import china from './china.js'
//import {cityNameData, provinceNameChineseToEng, cityNameChineseToEng} from './geoNameDictionary.js'
var geoCoordMap = {
	'拉萨': [91.11, 29.97],
  '上海': [121.48, 31.22],
  '福州': [119.3, 26.08],
	'南宁': [108.33, 22.84],
	'广州': [113.23, 23.16],
  '太原': [112.53, 37.87],
  '昆明': [102.73, 25.04],
  '深圳': [114.07, 22.62],
  '海口': [110.35, 20.02],
  '沈阳': [123.1238,42.1216]	,
  '银川': [106.27, 38.47],
  '南昌': [115.89, 28.68],
  '吉林': [126.57, 43.87],
  '西宁': [101.74, 36.56],
  '呼和浩特': [111.65, 40.82],
  '成都': [104.06, 30.67],
  '西安': [108.95, 34.27],
  '南京': [118.78, 32.04],
  '北京': [116.46, 39.92],
  '乌鲁木齐': [87.68, 43.77],
  '杭州': [120.19, 30.26],
  '兰州': [103.73, 36.03],
  '天津': [117.2, 39.13],
  '泰安': [117.13, 36.18],
  '郑州': [113.65, 34.76],
  '哈尔滨': [126.63, 45.75],
  '石家庄': [114.48, 38.03],
  '长沙': [113, 28.21],
  '合肥': [117.27, 31.86],

}

var convertData = function (data, provinceEngName, cityNameEng) {
  var res = []
  for (var i = 0; i < data.length; i++) {
    if (provinceEngName) {
      let ret = cityIsInclude(provinceEngName, data[i].name, cityNameEng)
      if (ret) {
        var geoCoord = geoCoordMap[data[i].name]
        if (geoCoord) {
          res.push({
            name: data[i].name,
            value: geoCoord.concat(data[i].value)
          })
        }
      }
    } else {
      let geoCoord = geoCoordMap[data[i].name]
      if (geoCoord) {
        res.push({
          name: data[i].name,
          value: geoCoord.concat(data[i].value)
        })
      }
    }
  }
  return res
}

let cityIsInclude = function (provinceEngName, cityName, cityNameEng) {
  let cities = cityNameData[`cityName_${provinceEngName}`]
  for (let city in cities) {
    if ((!cityNameEng && city.indexOf(cityName) !== -1) || (cityNameEng && city.indexOf(cityName) !== -1 && cities[city] === cityNameEng)) {
      return true
    }
  }
  return false
}

let data = [
  {name: '海门', value: 9},
  {name: '鄂尔多斯', value: 12},
  {name: '招远', value: 12},
  {name: '舟山', value: 12},
  {name: '齐齐哈尔', value: 14},
  {name: '盐城', value: 15},
  {name: '赤峰', value: 16},
  {name: '青岛', value: 18},
  {name: '乳山', value: 18},
  {name: '金昌', value: 19},
  {name: '泉州', value: 21},
  {name: '莱西', value: 21},
  {name: '潮州', value: 26},
  {name: '丹东', value: 27},
  {name: '太仓', value: 27},
  {name: '曲靖', value: 27},
  {name: '烟台', value: 28},
  {name: '福州', value: 29},
  {name: '瓦房店', value: 30},
  {name: '即墨', value: 30},
  {name: '抚顺', value: 31},
  {name: '玉溪', value: 31},
  {name: '寿光', value: 40},
  {name: '盘锦', value: 40},
  {name: '柳州', value: 54},
  {name: '三亚', value: 54},
  {name: '自贡', value: 56},
  {name: '吉林', value: 56},
  {name: '张家界', value: 59},
  {name: '宜兴', value: 59},
  {name: '北海', value: 60},
  {name: '西安', value: 61},
  {name: '金坛', value: 62},
  {name: '东营', value: 62},
  {name: '牡丹江', value: 63},
  {name: '遵义', value: 63},
  {name: '衡水', value: 80},
  {name: '包头', value: 80},
  {name: '绵阳', value: 80},
  {name: '乌鲁木齐', value: 84},
  {name: '枣庄', value: 84},
  {name: '杭州', value: 84},
  {name: '哈尔滨', value: 114},
  {name: '聊城', value: 116},
  {name: '芜湖', value: 117},
  {name: '唐山', value: 119},
  {name: '平顶山', value: 119},
  {name: '邢台', value: 119},
  {name: '德州', value: 120},
  {name: '济宁', value: 120},
  {name: '荆州', value: 127},
  {name: '宜昌', value: 130},
  {name: '合肥', value: 229},
  {name: '武汉', value: 273},
  {name: '大庆', value: 279}
]
function MapDrillDown (echartDom, obj) {
  this.chartDom = echarts.init(echartDom)
  this.optionMap = null
  // tag: 0全国 1省 2市
  this.tag = 0
  this.timer = null
  this.clickLock = true
  this.provinceOrCityName = ''
  this.lastProvinceOrCityName = ''
  // this.loadingObj = obj.$message
}

MapDrillDown.prototype = {
  // 设置区域颜色
  setRegions: function (regionsJson) {
    var colors = ['#083967', '#13548d', '#1c74b2']
    var colorsLen = colors.length
    var features = regionsJson.features
    var echatsRegions = []
    // var echatsRegions=[{
    //     name: '南海诸岛',
    //     value: 0,
    //     itemStyle: {
    //         normal: {
    //             opacity: 0,
    //             label: {
    //                 show: false
    //             }
    //         }
    //     }
    // }];

    for (var i = 0, len = features.length; i < len; i++) {
      var regionsItem = {
        name: features[i].properties.name,
        itemStyle: {
          normal: {
            areaColor: colors[Math.floor(Math.random() * colorsLen)]
          }
        }
      }
      echatsRegions.push(regionsItem)
    }
    return echatsRegions
  },
  setMap: function () {
    this.optionMap = {
      tooltip: {
        trigger: 'item',
        // triggerOn:'click', // 鼠标点击时触发
        enterable: true, // 鼠标是否能进入提示框内
        formatter: function (params) {
          var content = ''
          if (params.value !== undefined) {
            content = `<p style='text-align: center;min-width: 100px;'><span class='dpb' style='padding: 5px 8px;font-family: 微软雅黑;font-size: 18px;color: #ffffff;'>${params.name}</span><br></p>`
          }
          return content
        }
      },
      geo: {
        map: 'china',
        label: {
          normal: {
            show: true,
            color: '#639bc3'
          }
        },
        itemStyle: {
          normal: {
            areaColor: '#083967',
            borderColor: '#48c7ff',
            borderWidth: 2
          },
          emphasis: {
            areaColor: '#48c7ff' // 高亮效果
          }
        }
      },
      series: [
        {
          name: '正常',
          type: 'scatter',
          coordinateSystem: 'geo',
          opacity: 1,
          data: convertData(data),
          // data: [],
          symbolSize: 8, // 散点图的大小
          label: {
            normal: {
              show: false
            }
          },
          itemStyle: {
            normal: {
              color: '#00d0e4',
              borderColor: '#fff',
              borderWidth: 2
            },
            emphasis: {
              borderColor: '#fff',
              borderWidth: 2
            }
          }
        }
      ]
    }
    // 图表自适应
    window.addEventListener('resize', function () {
      this.chartDom.resize()
    }.bind(this))

    this.optionMap.geo.regions = this.setRegions(china) // 设置区域颜色
    this.chartDom.setOption(this.optionMap)
  },
  setClick: function () {
    let that = this
    // 点击事件
    that.chartDom.on('click', function (params) { // 点击事件
      clearTimeout(that.timer)
      that.timer = setTimeout(function () {
        if (!that.clickLock) return
        if (params.componentType === 'geo') { // 点击地图区域
          that.reFreshMap(params.name)
        }
        that.clickLock = true
      }, 300)
    })

    // 双击事件
    that.chartDom.on('dblclick', function (params) {
      that.clickLock = false
      clearTimeout(that.timer)
      that.tag = 0
      that.optionMap.series[0].data = convertData(data)
      that.optionMap.geo.map = 'china'
      that.chartDom.setOption(that.optionMap)
      that.clickLock = true
    })
  },
  reFreshMap: function (paramsName) {
    let that = this
    // this.loadingObj.showLoading({
    //   title: '正在加载...'
    // })
    if (that.tag === 0) {
      this.provinceOrCityName = paramsName
      that.tag++
      let provinceEngName = provinceNameChineseToEng(this.provinceOrCityName)
      $.get('https://orangleli.github.io/imagesResources/echartMapResources/geoProvince/' + provinceEngName + '.json', function (mapJson) {
        // that.loadingObj.hideLoading()
        that.optionMap.series[0].data = convertData(data, provinceEngName)
        that.optionMap.geo.map = provinceEngName
        echarts.registerMap(provinceEngName, mapJson)
        that.chartDom.setOption(that.optionMap)
      })
      this.lastProvinceOrCityName = this.provinceOrCityName
    } else if (that.tag === 1) {
      if (this.lastProvinceOrCityName.includes('直辖市') > 0) return
      this.provinceOrCityName = paramsName
      that.tag++
      var provinceEngName = provinceNameChineseToEng(this.lastProvinceOrCityName)
      let cityNameEng = cityNameChineseToEng(that.provinceOrCityName, provinceEngName)
      $.get('https://orangleli.github.io/imagesResources/echartMapResources/city/' + provinceEngName + '/' + cityNameEng + '.json', function (mapJson) {
        // that.loadingObj.hideLoading()
        that.optionMap.series[0].data = convertData(data, provinceEngName, cityNameEng)
        that.optionMap.geo.map = provinceEngName
        echarts.registerMap(provinceEngName, mapJson)
        that.chartDom.setOption(that.optionMap)
      })
    } else {
      // that.loadingObj.hideLoading()
    }
  },
  init () {
    this.setMap()
    this.setClick()
  }
}
// export {
//   MapDrillDown
// }
