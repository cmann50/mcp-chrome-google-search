# Google Search URL Specification

## Basic Search URLs

```
# Basic search
https://www.google.com/search?q=news

# Site-specific search
https://www.google.com/search?q=site:apple.com+news

# Site-specific search with time filter
https://www.google.com/search?q=site:apple.com+news&tbs=qdr:d
```

## Time Filter Parameters

Relative time filters using `tbs=qdr:X`:
```
h : past hour
d : past 24 hours
w : past week
m : past month
y : past year
```

Custom date range using `tbs=cdr:1,cd_min:MM/DD/YYYY,cd_max:MM/DD/YYYY`:
```
Example: tbs=cdr:1,cd_min:12/1/2024,cd_max:12/31/2024
```

## TypeScript Interface

```typescript
interface SearchParams {
  query_text: string;  // Plain text to search for (no Google operators)

  site?: string;          // Optional site restriction (e.g. "apple.com")
  timeframe?: {
    type: 'relative';     // For qdr: filters
    period: 'h' | 'd' | 'w' | 'm' | 'y';
  } | {
    type: 'custom';       // For custom date range
    startDate: Date;      // Will be formatted as MM/DD/YYYY
    endDate: Date;
  };
}
```

Note: The query_text parameter and date portions in custom date ranges require URL encoding.