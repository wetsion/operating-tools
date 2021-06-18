<template>
  <div>
      <h2>广告搜索词词频统计</h2>
      <p>
          <input type="file" ref="pathClear"
                  id="implUserExcel" @change="implUserExcel" accept=".xlsx"/>
      </p>
      <div ref="wordCloudChart" style="width: 100%;height: 1000px" v-loading="loading" element-loading-text="文件读取中">
      </div>
      <p></p>
      <!-- <div ref="wordGroupChart" v-loading="loading" element-loading-text="文件读取中"></div> -->
      <h2 v-if="showTable">搜索词分组统计</h2>
      <el-table v-if="showTable" :data="tableData" height="500" border style="width: 100%">
        <el-table-column
            prop="name"
            label="广告组名称"
            :filters="groupFilters"
            :filter-method="filterHandler"
            width="180">
        </el-table-column>
        <el-table-column
            prop="keyword"
            label="客户搜索词">
        </el-table-column>
        <el-table-column
            prop="days"
            sortable
            label="出现天数">
        </el-table-column>
        <el-table-column
            prop="sells"
            sortable
            label="销售额">
        </el-table-column>
        <el-table-column
            prop="pay"
            sortable
            label="花费">
        </el-table-column>
      </el-table>
  </div>
</template>

<script>
import XLSX from 'xlsx'
import {create, all} from 'mathjs'
const mathjs = create(all)
mathjs.config({
    number: 'BigNumber',
    precision: 2
})

// import * as echarts from 'echarts'
// import 'echarts-wordcloud'
// let echarts = require('echarts/lib/echarts')
// require('echarts-wordcloud')
// import 'echarts/theme/macarons.js'
// Echarts.use([GridComponent])

// import 'echarts/theme/macarons.js'

export default {
    name: 'wordcount',
    data () {
        return {
            loading: false,
            showTable: false,
            groupFilters: [],
            tableData: []
        }
    },
    methods: {
        implUserExcel (e) {
            // let loading = this.openLoading()
            console.log('excel')
            this.openLoading()
            setTimeout(() => {
                this.readExcel(e.target.files[0])
            }, 1000)

        },
        openLoading () {
            this.loading = true
        },
        closeLoading () {
            console.log('close loading')
            this.loading = false
        },
        readExcel (fileName) {
            console.log(fileName)
            if (!fileName) {
                // this.closeLoading(loading)
                this.closeLoading()
                return
            }
            let reader = new FileReader()
            reader.readAsBinaryString(fileName)
            //onload在文件被读取时自动触发
            reader.onload = (e) => {
                this.openLoading()
                let uploadData = [];
                //workbook存放excel的所有基本信息
                const workbook = XLSX.read(e.target.result, {type: 'binary', cellDates: true})
                let sheetList = workbook.SheetNames
                console.log(sheetList)
                sheetList.forEach((name) => {
                    let worksheet = workbook.Sheets[name]
                    uploadData.push(XLSX.utils.sheet_to_json(worksheet));
                })
                console.log(uploadData[0])
                let wordMap = this.getAllWord(uploadData[0])
                this.drawWordCloudChart(wordMap)
                this.buildTableData(uploadData[0])
                // this.drawWordGroupChart(uploadData[0])
            }
            reader.onloadend = () => {
                this.closeLoading()
            }
        },
        getAllWord (sheetList) {
            let wordMap = {}
            for (let index = 0; index < sheetList.length; index++) {
                const element = sheetList[index];
                let word = element['客户搜索词']
                if (!word) {
                    continue
                }
                if (!wordMap[word]) {
                    wordMap[word] = 1
                } else {
                    wordMap[word] = wordMap[word] + 1
                }
            }
            console.log(wordMap)
            return wordMap
        },
        drawWordCloudChart (wordMap) {
            let wordArray = []
            for(let k in wordMap) {
                wordArray.push({name: k, value: wordMap[k]})
            }
            let wordCloudChart = this.$echarts.init(this.$refs.wordCloudChart)
            wordCloudChart.setOption({
                title: {
                    text: '客户搜索词云',
                    left: 'center'
                },
                toolbox: {
                    show: true,
                    orient: 'vertical',
                    left: 'right',
                    top: 'top',
                    feature: {
                        saveAsImage: {show: true}
                    }
                },
                series: [
                    {
                        name: '客户搜索词云',
                        type: 'wordCloud',
                        shape: 'circle',
                        gridSize: 3,
                        left: 'center',
                        top: 'center',
                        right: null,
                        bottom: null,
                        rotationRange: [-90, 90],
                        autoSize: {
                            enable: true,
                            minSize: 6
                        },
                        sizeRange: [6, 60],
                        textStyle: {
                            normal: {
                                fontFamily: 'sans-serif',
                                fontWeight: 'bold',
                                // Color can be a callback function or a color string
                                color: function () {
                                    // Random color
                                    return 'rgb(' + [
                                        Math.round(Math.random() * 256),
                                        Math.round(Math.random() * 256),
                                        Math.round(Math.random() * 256)
                                    ].join(',') + ')';
                                }
                            }
                        },
                        emphasis: {
                            shadowBlur: 10,
                            shadowColor: '#333'
                        },
                        data: wordArray
                    }
                ]
            })
        },
        /**
         * 获取广告分组数据
         */
        getGroup (sheetList) {
            let groupMap = {}
            for (let index = 0; index < sheetList.length; index++) {
                const element = sheetList[index];
                let word = element['广告组名称']
                if (!word) {
                    continue
                }
                if (!groupMap[word]) {
                    groupMap[word] = []
                    groupMap[word].push(element)
                } else {
                    groupMap[word].push(element)
                }
            }
            return groupMap
        },
        /**
         * 获取分组下按词分组的map
         */
        getGroupWordMap (groupValueArray) {
            let gwMap = {}
            for (let index = 0; index < groupValueArray.length; index++) {
                const element = groupValueArray[index];
                let word = element['客户搜索词']
                if (!word) {
                    continue
                }
                if (!gwMap[word]) {
                    gwMap[word] = []
                    gwMap[word].push(element)
                } else {
                    gwMap[word].push(element)
                }
            }
            return gwMap
        },
        /**
         * 获取广告组名列表
         */
        getGroupNameArray (groupMap) {
            let groupNameArray = []
            for (let k in groupMap) {
                groupNameArray.push(k)
            }
            return groupNameArray
        },
        buildTableData (sheetList) {
            this.tableData = []
            this.groupFilters = []
            let tdata = []
            let gFilters = []
            let groupMap = this.getGroup(sheetList)
            console.log(groupMap)
            let groupNameArray = this.getGroupNameArray(groupMap)
            console.log(groupNameArray)
            for (let j = 0; j < groupNameArray.length; j++) {
                const element = groupNameArray[j];
                let filterObj = {
                    text: element,
                    value: element
                }
                gFilters.push(filterObj)
            }
            this.groupFilters = gFilters

            for (let gk in groupMap) {
                const gvArray = groupMap[gk]
                let gwMap = this.getGroupWordMap(gvArray)
                console.log(gwMap)
                for (let gwk in gwMap) {
                    let gwArray = gwMap[gwk]
                    let dayCount = gwArray.length
                    let sells = 0
                    let pay = 0

                    for (let index = 0; index < gwArray.length; index++) {
                        const element = gwArray[index];
                        sells += element['7天总销售额']
                        pay += element['花费']
                    }

                    let rowData = {
                        name: gk,
                        keyword: gwk,
                        days: dayCount,
                        sells: mathjs.number(sells.toFixed(2)),
                        pay: mathjs.number(pay.toFixed(2))
                    }
                    tdata.push(rowData)
                }
            }
            console.log(tdata)
            this.tableData = tdata
            this.showTable = true
        },
        filterHandler(value, row, column) {
            return row.name === value;
        }
        // drawWordGroupChart (sheetList) {
        //     let groupMap = this.getGroup(sheetList)
        //     console.log(groupMap)
        //     let groupNameArray = this.getGroupNameArray(groupMap)
        //     console.log(groupNameArray)
        //     for (let gk in groupMap) {
        //         const gvArray = groupMap[gk]
        //         let gwMap = this.getGroupWordMap(gvArray)
        //         console.log(gwMap)
        //     }

        //     let wordGroupChart = this.$echarts.init(this.$refs.wordGroupChart)
        //     wordGroupChart.setOption({
        //         title: {
        //             text: '搜索词转化情况',
        //             left: 'center'
        //         },
        //         xAxis: {
        //             min: 0,
        //             scale: true
        //         },
        //         yAxis: {
        //             data: groupNameArray
        //         },
        //     })
        // }
    }
}
</script>

<style>

</style>