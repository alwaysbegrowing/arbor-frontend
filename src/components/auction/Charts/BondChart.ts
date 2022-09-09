import * as am4charts from '@amcharts/amcharts4/charts'
import * as am4core from '@amcharts/amcharts4/core'
import am4themesSpiritedaway from '@amcharts/amcharts4/themes/spiritedaway'
import { round } from 'lodash'

import { getDisplay } from '../../../utils'

import { Token } from '@/generated/graphql'

export const createGradient = (color) => {
  const gradient = new am4core.LinearGradient()
  const opacityValues = [1, 0.7, 0.24, 0]
  opacityValues.forEach((opacity) => gradient.addColor(am4core.color(color), opacity))
  gradient.rotation = 90
  return gradient
}

am4core.addLicense('ch-custom-attribution')

// Recalculates very big and very small numbers by reducing their length according to rules and applying suffix/prefix.
const numberFormatter = new am4core.NumberFormatter()
numberFormatter.numberFormat = '###.### a'
numberFormatter.smallNumberThreshold = 0
numberFormatter.bigNumberPrefixes = [
  { number: 1e3, suffix: 'K' }, // Use K only with value greater than 999.00
  { number: 1e6, suffix: 'M' }, // Million
  { number: 1e9, suffix: 'B' }, // Billion
  { number: 1e12, suffix: 'T' }, // Trillion
  { number: 1e15, suffix: 'P' }, // Quadrillion
  { number: 1e18, suffix: 'E' }, // Quintillion
  { number: 1e21, suffix: 'Z' }, // Sextillion
  { number: 1e24, suffix: 'Y' }, // Septillion
]

export interface XYBondChartProps {
  chartElement: HTMLElement
}

export const colors = {
  blue: '#1C701C',
  red: '#DB3635',
  supply: '#EDA651',
  white: '#e0e0e0',
  green: '#1C701C',
  purple: '#293327',
  grey: '#D6D6D6',
  cyan: '#1BBFE3',
  newOrder: '#D2D2D2',
  tooltipBg: '#001429',
  tooltipBorder: '#174172',
}

export const tooltipRender = (o) => {
  o.tooltip.getFillFromObject = false
  o.tooltip.background.fill = am4core.color('#181A1C')
  o.tooltip.background.filters.clear()
  o.tooltip.background.cornerRadius = 6
  o.tooltip.background.stroke = am4core.color('#2A2B2C')
  o.tooltip.label.fill = am4core.color('#D6D6D6')
  o.tooltip.label.maxWidth = 400
  o.tooltip.label.wrap = true
  o.tooltip.label.fontSize = 12
  o.tooltip.label.letterSpacing = 0.1

  return o
}

export const XYSimpleBondChart = (props: XYBondChartProps): am4charts.XYChart => {
  const { chartElement } = props

  am4core.useTheme(am4themesSpiritedaway)

  const chart = am4core.create(chartElement, am4charts.XYChart)

  // Create axes
  const priceAxis = chart.yAxes.push(new am4charts.ValueAxis())
  priceAxis.renderer.grid.template.stroke = am4core.color(colors.grey)
  priceAxis.renderer.grid.template.strokeOpacity = 0
  priceAxis.title.fill = am4core.color(colors.grey)
  priceAxis.renderer.labels.template.fill = am4core.color(colors.grey)
  priceAxis.numberFormatter = numberFormatter
  priceAxis.extraTooltipPrecision = 3
  priceAxis.adjustLabelPrecision = false
  priceAxis.tooltip.disabled = true
  tooltipRender(priceAxis)

  const dateAxis = chart.xAxes.push(new am4charts.DateAxis())
  dateAxis.renderer.grid.template.strokeOpacity = 0
  dateAxis.title.fill = am4core.color(colors.grey)
  dateAxis.renderer.labels.template.fill = am4core.color(colors.grey)
  dateAxis.tooltipDateFormat = 'MMM dd, YYYY'
  dateAxis.renderer.labels.template.location = 0.5
  dateAxis.renderer.grid.template.location = 0.5
  tooltipRender(dateAxis)

  const faceValue = chart.series.push(new am4charts.StepLineSeries())
  faceValue.dataFields.dateX = 'date'
  faceValue.dataFields.valueY = 'faceValueY'
  faceValue.strokeWidth = 2
  faceValue.stroke = am4core.color(colors.red)
  faceValue.zIndex = 10
  faceValue.fill = faceValue.stroke
  faceValue.startLocation = 0.5
  faceValue.name = 'FACE VALUE'
  faceValue.dummyData = {
    description:
      'Amount each bond is redeemable for at maturity assuming a default does not occur.',
  }
  tooltipRender(faceValue)

  const collateralValue = chart.series.push(new am4charts.StepLineSeries())
  collateralValue.dataFields.dateX = 'date'
  collateralValue.dataFields.valueY = 'collateralValueY'
  collateralValue.strokeWidth = 2
  collateralValue.stroke = am4core.color(colors.green)
  collateralValue.fill = createGradient(colors.green)
  collateralValue.fillOpacity = 0.25
  collateralValue.startLocation = 0.5
  collateralValue.name = 'COLLATERAL VALUE'
  collateralValue.dummyData = {
    description:
      'Value of collateral securing each bond. If a bond is defaulted on, the bondholder is able to exchange each bond for these collateral tokens.',
  }
  tooltipRender(collateralValue)

  // Add cursor
  chart.cursor = new am4charts.XYCursor()
  // chart.cursor.snapToSeries = [collateralValue, askSeries]
  chart.cursor.lineX.stroke = am4core.color(colors.grey)
  chart.cursor.lineX.strokeWidth = 1
  chart.cursor.lineX.strokeOpacity = 0.6
  chart.cursor.lineX.strokeDasharray = '4'

  // Button configuration
  chart.zoomOutButton.background.cornerRadius(5, 5, 5, 5)
  chart.zoomOutButton.background.fill = am4core.color('#3f3f3f')
  chart.zoomOutButton.background.states.getKey('hover').properties.fill = am4core.color('#606271')
  chart.zoomOutButton.icon.stroke = am4core.color('#e0e0e0')
  chart.zoomOutButton.icon.strokeWidth = 2
  chart.zoomOutButton.tooltip.text = 'Zoom out'

  chart.tooltip.getFillFromObject = false
  chart.tooltip.background.fill = am4core.color('#181A1C')
  chart.tooltip.background.filters.clear()
  chart.tooltip.background.cornerRadius = 6
  chart.tooltip.background.stroke = am4core.color('#2A2B2C')

  return chart
}

export const XYConvertBondChart = (props: XYBondChartProps): am4charts.XYChart => {
  const chart = XYSimpleBondChart(props)

  const convertibleTokenValue = chart.series.push(new am4charts.StepLineSeries())
  convertibleTokenValue.dataFields.dateX = 'date'
  convertibleTokenValue.dataFields.valueY = 'convertibleValueY'
  convertibleTokenValue.strokeWidth = 2
  convertibleTokenValue.stroke = am4core.color(colors.purple)
  convertibleTokenValue.fill = createGradient(colors.purple)
  convertibleTokenValue.fillOpacity = 0.25
  convertibleTokenValue.startLocation = 0.5
  convertibleTokenValue.name = 'CONVERTIBLE TOKEN VALUE'
  convertibleTokenValue.dummyData = {
    description: 'Value of tokens each bond is convertible into up until the maturity date.',
  }
  tooltipRender(convertibleTokenValue)

  return chart
}

interface DrawInformation {
  chart: am4charts.XYChart
  collateralToken: Token
  convertibleToken: Token
}

export const drawInformation = (props: DrawInformation) => {
  const { chart, convertibleToken } = props
  const convertibleTokenLabel = getDisplay(convertibleToken)

  const collateralValueSeries = chart.series.values[1]
  collateralValueSeries.adapter.add('tooltipText', (text, target) => {
    const valueY = target?.tooltipDataItem?.values?.valueY?.value ?? 0
    const volume = round(valueY, 3)

    return `Collateral value:  ${volume} ${convertibleTokenLabel}`
  })

  const faceValueSeries = chart.series.values[0]
  faceValueSeries.adapter.add('tooltipText', (text, target) => {
    const valueY = target?.tooltipDataItem?.values?.valueY?.value ?? 0

    return `Face value: ${valueY} ${convertibleTokenLabel}`
  })

  if (chart.series.values.length > 2) {
    const convertibleValueSeries = chart.series.values[2]
    convertibleValueSeries.adapter.add('tooltipText', (text, target) => {
      const valueY = target?.tooltipDataItem?.values?.valueY?.value ?? 0
      const convertibleValue = round(valueY, 3)
      return `Convertible value:  ${convertibleValue} ${convertibleTokenLabel}`
    })
  }
}
