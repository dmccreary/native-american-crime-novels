# Tony Hillerman Book Sales

An interactive horizontal bar chart showing estimated total sales for each of Tony Hillerman's Leaphorn & Chee novels.

[View the Chart](./main.html){ .md-button }

## Overview

Tony Hillerman's mystery series featuring Navajo Tribal Police officers Joe Leaphorn and Jim Chee has sold over **30 million copies worldwide**. This chart visualizes estimated sales figures for each of the 18 novels in the series, sorted from highest to lowest.

## Key Insights

- **Skinwalkers (1986)** - The first novel featuring both Leaphorn and Chee together became the series' bestseller
- **A Thief of Time (1988)** - Archaeological mystery achieved critical and commercial success
- **Dance Hall of the Dead (1973)** - Edgar Award winner established Hillerman's reputation
- Early novels continue strong backlist sales decades after publication
- Later novels (2002-2006) had smaller but dedicated readership

## Features

### Interactive Elements

- **Hover tooltips** - View exact sales figures and notes about each book
- **Color gradient** - Visual representation of relative sales (gold = highest)
- **Smooth animation** - Bars animate on page load

### Data Notes

Sales figures are estimates based on:

- Publisher reports and industry sources
- Award recognition impact
- Film/TV adaptation effects
- Longevity of backlist sales

## Customization

### Changing the Data

Edit `data.json` to update sales figures:

```json
{
  "title": "Book Title (Year)",
  "sales": 2.5,
  "year": 1990,
  "note": "Description for tooltip"
}
```

### Adjusting Colors

Modify the color gradient in `main.html`:

```javascript
const r = Math.round(255 - (ratio * 100));
const g = Math.round(180 + (ratio * 30));
const b = Math.round(100 + (ratio * 100));
```

## Technical Details

- **Library**: Chart.js 4.4.0
- **Chart Type**: Horizontal Bar (`indexAxis: 'y'`)
- **Data Source**: `data.json` (loaded dynamically)
- **Browser Support**: All modern browsers

## References

- [Publishers Weekly - Tony Hillerman](https://www.publishersweekly.com/)
- [Mystery Writers of America](https://mysterywriters.org/)
- [Chart.js Documentation](https://www.chartjs.org/docs/latest/)
