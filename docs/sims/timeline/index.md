# Tony Hillerman Timeline

An interactive timeline visualization of Tony Hillerman's life, novels, and awards spanning from 1925 to 2008.

[View the Timeline](./main.html){ .md-button }

## Overview

This timeline chronicles the life and literary career of Tony Hillerman, creator of the beloved Leaphorn and Chee mystery series. It covers:

- **Life Events**: Birth, military service, education, career moves, and death
- **Novels**: All 18 Leaphorn and Chee novels from *The Blessing Way* (1970) to *The Shape Shifter* (2006)
- **Awards**: Major recognitions including the Edgar Award and Grand Master Award

## Features

### Interactive Elements

- **Category Filtering**: Filter by Life Events, Novels, or Awards
- **Zoom and Pan**: Use navigation buttons to explore the timeline
- **Event Details**: Click any event to see full description and historical context
- **Hover Tooltips**: Quick context notes on hover

### Visual Design

- **Color-coded categories**: Red for life events, green for novels, gold for awards
- **Dark theme**: Easy on the eyes with high contrast
- **Responsive layout**: Works on desktop and mobile devices

## Key Milestones

| Year | Event |
|------|-------|
| 1925 | Tony Hillerman born in Sacred Heart, Oklahoma |
| 1970 | *The Blessing Way* - First novel, introduces Lt. Joe Leaphorn |
| 1974 | Edgar Award for *Dance Hall of the Dead* |
| 1980 | *People of Darkness* - Introduces Officer Jim Chee |
| 1986 | *Skinwalkers* - First Leaphorn-Chee collaboration |
| 1987 | Special Friend of the Dineh Award from Navajo Tribal Council |
| 1991 | Grand Master Award from Mystery Writers of America |
| 2006 | *The Shape Shifter* - Final novel |
| 2008 | Tony Hillerman dies in Albuquerque at age 83 |

## Data Structure

The timeline data is stored in `data.json` following this format:

```json
{
  "start_date": { "year": "1970" },
  "text": {
    "headline": "The Blessing Way",
    "text": "First novel published..."
  },
  "group": "Novel",
  "notes": "Additional context for tooltips"
}
```

## Customization

### Adding New Events

1. Open `data.json`
2. Add a new event object to the `events` array
3. Include required fields: `start_date`, `text.headline`, `text.text`, `group`
4. Reload the page

### Changing Colors

Edit the `categoryColors` object in `main.html`:

```javascript
const categoryColors = {
    'Life': '#e74c3c',
    'Novel': '#27ae60',
    'Award': '#f39c12'
};
```

## Technical Details

- **Library**: vis-timeline 7.7.3
- **Data Format**: Custom JSON compatible with vis-timeline
- **Browser Support**: Modern browsers (Chrome, Firefox, Safari, Edge)

## References

- [Tony Hillerman - Wikipedia](https://en.wikipedia.org/wiki/Tony_Hillerman)
- [The Tony Hillerman Portal](https://www.unm.edu/~lathrop/)
- [Mystery Writers of America](https://mysterywriters.org/)
