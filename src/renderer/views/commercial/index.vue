<template>
    <div>
        <h2>广告数据分析</h2>
        <p><input type="file" ref="pathClear"
                  id="implUserExcel" @change="implUserExcel" accept=".xlsx"/>
        <p>

        </p>
        <div ref="commercialChart" style="width: 90%;height: 800px" v-loading="loading"
             element-loading-text="文件读取中"></div>
        <p></p>
    </div>
</template>

<script>
    import XLSX from 'xlsx'
    import moment from 'moment'
    require('echarts/lib/chart/bar')
    import {GridComponent, TitleComponent, ToolboxComponent, TooltipComponent, LegendComponent} from 'echarts/components'
    let Echarts = require('echarts/lib/echarts')
    Echarts.use([GridComponent, TitleComponent, ToolboxComponent, TooltipComponent, LegendComponent])


    export default {
        name: 'commercial',
        data () {
            return {
                loading: false,
                dateXAxis: [],
                chartData: [],
                chartSeries: []
            }
        },
        mounted () {
            // this.drawCommercialChart(this.dateXAxis, this.chartSeries)
        },
        methods: {
            back () {
                this.$router.push('/dashboard')
            },
            drawCommercialChart (xAxisData, seriesData) {
                let colors = ['#5793f3', '#d14a61', '#675bba'];
                let myChart = Echarts.init(this.$refs.commercialChart)
                myChart.setOption({
                    title: {
                        text: '广告数据'
                    },
                    width: 'auto',
                    height: 'auto',
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
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
                    legend: {
                        orient: 'vertical',
                        left: 'right',
                        top: 'middle',
                        data: ['曝光量', '点击率', '花费', '销售额', 'ACOS']
                    },
                    yAxis: {
                        type: 'category',
                        axisLabel: {
                            interval: 0,
                            rotate: 30
                        },
                        data: xAxisData
                    },
                    xAxis: [
                        {
                            type: 'value',
                            name: '曝光量',
                            // min: 0,
                            // max: 20000,
                            position: 'top',
                            offset: 0,
                            axisLine: {
                                lineStyle: {
                                    color: colors[0]
                                }
                            },
                            axisLabel: {
                                formatter: '{value}'
                            }
                        },
                        {
                            type: 'value',
                            name: '点击率',
                            // min: 0,
                            // max: 100,
                            position: 'top',
                            offset: 20,
                            axisLine: {
                                lineStyle: {
                                    color: colors[1]
                                }
                            },
                            axisLabel: {
                                formatter: '{value} %'
                            }
                        },
                        {
                            type: 'value',
                            name: '花费',
                            position: 'bottom',
                            offset: 0,
                            axisLine: {
                                lineStyle: {
                                    color: colors[2]
                                }
                            },
                            axisLabel: {
                                formatter: '{value}'
                            }
                        },
                        {
                            type: 'value',
                            name: '销售额',
                            position: 'bottom',
                            offset: 20,
                            axisLine: {
                                lineStyle: {
                                    color: colors[0]
                                }
                            },
                            axisLabel: {
                                formatter: '{value}'
                            }
                        },
                        {
                            type: 'value',
                            name: 'ACOS',
                            // min: 0,
                            // max: 100,
                            position: 'bottom',
                            offset: 40,
                            axisLine: {
                                lineStyle: {
                                    color: colors[1]
                                }
                            },
                            axisLabel: {
                                formatter: '{value} %'
                            }
                        }
                    ],
                    series: seriesData
                });
            },
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
                    console.log(uploadData)

                    this.drawCommercialChart(this.buildXAxiasData(uploadData), this.buildSeriesData(uploadData))
                }
                reader.onloadend = () => {
                    this.closeLoading()
                }
            },
            buildXAxiasData (uploadData) {
                if (!uploadData) {
                    return
                }
                let sheet1List = uploadData[0]
                let dateArray = []
                for (var i = 0; i < sheet1List.length; i++) {
                    let row = sheet1List[i]
                    let date = row['日期']
                    console.log(moment(date).format('YYYY-MM-DD'))
                    dateArray.push(moment(date).format('YYYY-MM-DD'))
                }
                console.log(dateArray)
                return dateArray
            },
            buildSeriesData (uploadData) {
                if (!uploadData) {
                    return
                }
                let sheet1List = uploadData[0]
                let baoguangliang = []
                let ctr = []
                let cost = []
                let sells = []
                let acos = []
                for (var i = 0; i < sheet1List.length; i++) {
                    let row = sheet1List[i]
                    baoguangliang.push(row['曝光量'])
                    ctr.push((row['点击率 (CTR)'] * 10000)/100)
                    cost.push(row['花费(USD)'])
                    sells.push(row['销售额(USD)'])
                    acos.push((row['ACOS'] * 10000)/100)
                }
                let labelOption = {
                    show: true,
                    position: 'insideBottom',
                    distance: 15,
                    align: 'left',
                    verticalAlign: 'middle',
                    rotate: 90,
                    formatter: '{c}  {name|{a}}',
                    fontSize: 6,
                    rich: {
                        name: {
                            textBorderColor: '#fff'
                        }
                    }
                };
                let sd = [
                    {
                        name: '曝光量',
                        type: 'bar',
                        barGap: 0,
                        emphasis: {
                            focus: 'series'
                        },
                        // label: labelOption,
                        data: baoguangliang
                    },
                    {
                        name: '点击率',
                        type: 'bar',
                        emphasis: {
                            focus: 'series'
                        },
                        // label: labelOption,
                        // yAxisIndex: 1,
                        xAxisIndex: 1,
                        data: ctr
                    },
                    {
                        name: '花费',
                        type: 'bar',
                        emphasis: {
                            focus: 'series'
                        },
                        // label: labelOption,
                        // yAxisIndex: 2,
                        xAxisIndex: 2,
                        data: cost
                    },
                    {
                        name: '销售额',
                        type: 'bar',
                        emphasis: {
                            focus: 'series'
                        },
                        // label: labelOption,
                        // yAxisIndex: 3,
                        xAxisIndex: 3,
                        data: sells
                    },
                    {
                        name: 'ACOS',
                        type: 'bar',
                        emphasis: {
                            focus: 'series'
                        },
                        // label: labelOption,
                        // yAxisIndex: 4,
                        xAxisIndex: 4,
                        data: acos
                    }
                ]
                return sd
            },
            openLoading () {
                console.log('open loading')
                this.loading = true
            },
            closeLoading () {
                console.log('close loading')
                this.loading = false
            }
        }
    }
</script>

<style scoped>

</style>