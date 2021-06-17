<template>
    <div>
        <h1>周销售额折线图</h1>
        <p>
            <input type="file" ref="pathClear"
                   id="implUserExcel" @change="implUserExcel" accept=".xlsx"/>
        </p>
        <p>

        </p>
        <p>
        <div ref="weekChart" style="width: 90%;height: 800px" v-loading="loading"
             element-loading-text="文件读取中"></div>
        </p>
    </div>
</template>

<script>
    import XLSX from 'xlsx'
    import moment from 'moment'

    import {GridComponent, TitleComponent, ToolboxComponent, TooltipComponent, LegendComponent} from 'echarts/components'
    import {PieChart, LineChart, BarChart} from 'echarts/charts'
    let Echarts = require('echarts/lib/echarts')
    Echarts.use([PieChart, LineChart, BarChart, GridComponent, TitleComponent, ToolboxComponent, TooltipComponent, LegendComponent])

    export default {
        name: 'weekcharts',
        data () {
            return {
                // data for upload files
                loading: false,
                uploadFilename: null,
                uploadFiles: [],
                dialogVisible: false
            }
        },
        methods: {
            back () {
                this.$router.push('/dashboard')
            },
            implUserExcel (e) {
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
                reader.onloadstart = () => {
                    console.log('load start')
                }
                reader.onload = (e) => {
                    console.log('loading')
                    let uploadData = [];
                    //workbook存放excel的所有基本信息
                    const workbook = XLSX.read(e.target.result, {type: 'binary', cellDates: true})
                    let sheetList = workbook.SheetNames
                    console.log(sheetList)
                    sheetList.forEach((name) => {
                        let worksheet = workbook.Sheets[name]
                        uploadData.push(XLSX.utils.sheet_to_formulae(worksheet));
                    })
                    console.log(uploadData)
                    let map = this.rebuildData(uploadData)
                    this.drawWeekChart(map)
                }
                reader.onloadend = () => {
                    console.log('load end')
                    this.closeLoading()
                }
            },
            rebuildData (uploadData) {
                let map = {}
                let sheet1List = uploadData[0]
                for (let i = 0; i < sheet1List.length; i++) {
                    let row = sheet1List[i]
                    let kv = row.split('=')
                    map[kv[0]] = kv[1]
                }
                return map
            },
            drawWeekChart (map) {
                let myChart = Echarts.init(this.$refs.weekChart)
                myChart.setOption({
                    title: {
                        text: '周销售数据',
                        left: 'left'
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            crossStyle: {
                                color: '#999'
                            }
                        }
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {show: true}
                        }
                    },
                    legend: {
                        data: ['净销售额', '商品数量']
                    },
                    xAxis: [
                        {
                            type: 'category',
                            axisLabel: {
                                interval: 0,
                                rotate: 30
                            },
                            data: [
                                this.formatDate(map['A16']),
                                this.formatDate(map['A17']),
                                this.formatDate(map['A18']),
                                this.formatDate(map['A19']),
                                this.formatDate(map['A20']),
                                this.formatDate(map['A21']),
                                this.formatDate(map['A22'])
                            ],
                            axisPointer: {
                                type: 'shadow'
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            name: '净销售额',
                            axisLabel: {
                                formatter: 'US$ {value}'
                            }
                        },
                        {
                            type: 'value',
                            name: '商品数量',
                            axisLabel: {
                                formatter: '{value}'
                            }
                        }
                    ],
                    series: [
                        {
                            name: '净销售额',
                            type: 'line',
                            yAxisIndex: 0,
                            data: [map['B16'], map['B17'], map['B18'], map['B19'], map['B20'], map['B21'], map['B22']]
                        },
                        {
                            name: '商品数量',
                            type: 'bar',
                            yAxisIndex: 1,
                            data: [map['C16'], map['C17'], map['C18'], map['C19'], map['C20'], map['C21'], map['C22']]
                        }
                    ]
                })
            },
            formatDate (date) {
                return moment(date).format('YYYY-MM-DD')
            }
        }
    }
</script>

<style scoped>

</style>