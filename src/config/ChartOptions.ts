const pink = {};
const blue = {};

export const getOptions = ( type: string)=> {
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
            title: {
                text: "",
            },
            labels:{
                style: {
                    color: "#9ca3af"
                }
            },
            gridLineWidth: 0,
            tickLength: 0,
            lineWidth: 0,
            crosshair: {
                width: 1,
                color: "#ffffff22",
                zIndex: 3,
            },
        },
        yAxis: {
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
            headerFormat: '<span style="color: #9ca3af;font-size: 1.2em">${point.y}</span><br/>',
            pointFormat: '<span style="font-size: 0.8em">{point.x}</span>',
        },
        plotOptions: {
            area: {
                lineWidth: 1,
                pointStart: 1940,
                color: type === "pink" ? "#d51e7a":"#06b6d4",
                fillColor: {
                    linearGradient: { x1: 0, x2: 0, y1: 0, y2: 2 },
                    stops: [
                        [0, type === "pink" ? "#d51e7acc" : "#06b6d4cc"],
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
                data: [
                    2, 9, 13, 50, 170, 299, 438, 841, 1169, 1703, 2422, 3692, 5543, 7345, 12298, 18638, 22229, 25540, 28133,
                    29463, 31139, 31175, 31255, 29561, 27552, 26008, 25830, 26516, 27835, 28537, 27519, 25914, 25542, 24418,
                    24138, 24104, 23208, 22886, 23305, 23459, 23368, 23317, 23575, 23205, 22217, 21392, 19008, 13708, 11511,
                    10979, 10904, 11011, 10903, 10732, 10685, 10577, 10526, 10457, 10027, 8570, 8360, 7853, 5709, 5273, 5113,
                    5066, 4897, 4881, 4804, 4717, 4571, 4018, 3822, 3785, 3805, 3750, 3708, 3708, 3708, 3708,
                ],
            },
        ],
    }
    return options;
};