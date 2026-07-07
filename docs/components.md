# Component Documentation

## DatumManager
Main component that orchestrates the datum management interface.

### Props
None

### State
- `editDatum`: Currently edited datum
- `deleteDatum`: Datum pending deletion
- `datums`: Array of all datums

### Sub-components
- DatumList
- ElevationView
- DatumForm

## DatumList
Displays a list of all datums with their relationships.

### Props
```typescript
{
  datums: Datum[];
  onEdit: (datum: Datum) => void;
  onDelete: (datum: Datum) => void;
}
```

## ElevationView
Provides a visual representation of datum relationships.

### Props
```typescript
{
  datums: Datum[];
  objects?: Object[];
  width?: number;
  height?: number;
}
```

## MeasurementTools
Tools for measuring distances between datums.

### Props
```typescript
{
  datums: Datum[];
  calculateAbsoluteOffset: (datum: Datum, datums: Datum[]) => number;
}
```
