import { DayData } from "@/api/getTokens";
import { getAbr } from "@/utils/math";

const getData = (data: DayData[], type: string) => {
    let chart = <number[][]>[];
    data.map((dayData) => {
        chart.push([Number(dayData.date + "000"), Number(type === "tvl" ? dayData.totalLiquidityUSD: dayData.dailyVolumeUSD)])
    })
    return chart;
}

export const getOptions = ( type: string, data: DayData[] )=> {
    const chartData = getData(data, type);
    const options: Highcharts.Options = {
        chart: {
            type: "area",
            backgroundColor: "transparent",
            height: "340px",
        },
        accessibility: {
            description: "None",
        },
        legend: {
            enabled: false,
        },
        title: {
            text: "",
        },
        xAxis: {
            type: 'datetime',
            // accessibility: {
            //     rangeDescription: 'Range: Jul 8th 2024 to Aug 4 2024.'
            // },
            title: {
                text: "",
            },
            labels:{
                style: {
                    color: "#9ca3af"
                },
                step: 2,
                format:"{value:%b %d}"
            },
            gridLineWidth: 0,
            tickLength: 0,
            tickAmount: 8,
            lineWidth: 0,
            crosshair: {
                width: 1,
                color: "#ffffff22",
                zIndex: 3,
            },
        },
        yAxis: {
            maxPadding: 0.3,
            visible: false,
            crosshair: {
                width: 1,
                color: "#ffffff22",
                zIndex: 3,
            },
        },
        tooltip: {
            nullFormat: "Value is {series.name}.",
            useHTML: true,
            backgroundColor: "transparent",
            style: {
                color: "#9ca3af",
                font: "26px __Plus_Jakarta_Sans_e3c363, __Plus_Jakarta_Sans_Fallback_e3c363, sans-serif",
            },
            positioner: function () {
                return {
                    x: 0,
                    y: 10,
                };
            },
            formatter: function ()
            {
                return '<span style="color: #9ca3af;font-size: 1.2em">$'+ getAbr(Number(this.y))+'</span><br/><span style="font-size: 0.8em">'+new Date(Number(this.x)).toLocaleDateString('en-us',{month: 'long',day: 'numeric',})+'</span>';
            },
            // xDateFormat: '%A, %b %e',
            // pointFormat: '<span style="color: #9ca3af;font-size: 1.2em">${point.y}</span><br/>',
        },
        plotOptions: {
            area: {
                lineWidth: 1,
                color: type === "tvl" ? "#ec4899":"#2563eb",
                fillColor: {
                    linearGradient: { x1: 0, x2: 0, y1: 0, y2: 2 },
                    stops: [
                        [0, type === "tvl" ? "#ec489988" : "#2563eb88"],
                        [1, "transparent"],
                    ],
                },
                marker: {
                    enabled: false,
                    symbol: "circle",
                    radius: 2,
                    states: {
                        hover: {
                            enabled: true,
                        },
                    },
                },
            },
        },
        series: [
            {
                type: "area",
                name: "SAFU",
                data: chartData,
            },
        ],
    }
    return options;
};
