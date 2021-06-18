<template>
    <div>
        <h1>上周本周同期对比</h1>
        <p>
            <input type="file" ref="pathClear"
                   id="implUserExcel" @change="implUserExcel" accept=".xlsx"/>
        </p>
        <p>

        </p>
        <p>
        <div ref="contrastChart" style="width: 90%;height: 400px" v-loading="loading"
             element-loading-text="文件读取中"></div>
        </p>
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

    export default {
        name: 'contrast',
        data () {
            return {
                loading: false
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
                    let lastWeekMap = this.rebuildLastData(uploadData)
                    this.drawSummaryChart(map, lastWeekMap)
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
            rebuildLastData (uploadData) {
                let map = {}
                let sheet1List = uploadData[1]
                for (let i = 0; i < sheet1List.length; i++) {
                    let row = sheet1List[i]
                    let kv = row.split('=')
                    map[kv[0]] = kv[1]
                }
                return map
            },
            drawSummaryChart (map, lastWeekMap) {
                let myChart = this.$echarts.init(this.$refs.contrastChart)
                myChart.setOption({
                    title: {
                        text: '上周本周增长率',
                        left: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/> {b} : {c}%'
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {show: true}
                        }
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                    },
                    series: [
                        {
                            name: '增长率',
                            type: 'pie',
                            radius: '50%',
                            data: [
                                {value: this.cpt(map['A12'], lastWeekMap['A12']), name: '订单商品种类数'},
                                {value: this.cpt(map['B12'], lastWeekMap['B12']), name: '已订购商品数量'},
                                {value: this.cpt(map['C12'], lastWeekMap['C12']), name: '已订购商品销售量'},
                                {value: this.cpt(map['D12'], lastWeekMap['D12']), name: '平均每种订单商品数量'},
                                {value: this.cpt(map['E12'], lastWeekMap['E12']), name: '平均每种订单商品金额'}
                            ],
                            emphasis: {
                                itemStyle: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                })
            },
            cpt (current, last) {
                console.log('compute')
                console.log(current)
                console.log(last)
                let a = current * 100 - last * 100
                console.log(a)
                // let result = (mathjs.bignumber(current) - mathjs.bignumber(last))/mathjs.bignumber(last)
                let result = mathjs.divide(a, last * 100)
                console.log(result)
                let r = mathjs.number(result).toFixed(2) * 100
                console.log(r.toFixed(2))
                return r.toFixed(2)
            }
        }
    }
</script>

<style scoped>

</style>