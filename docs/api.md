# API Reference

## Datum Endpoints

### GET /api/datums
Retrieves all datums.

**Response**
```typescript
{
  id: number;
  name: string;
  isAbsolute: boolean;
  zOffset: string;
  parentId: number | null;
}[]
```

### POST /api/datums
Creates a new datum.

**Request Body**
```typescript
{
  name: string;
  isAbsolute: boolean;
  zOffset: string;
  parentId: number | null;
}
```

### PUT /api/datums/:id
Updates an existing datum.

**Request Body**
```typescript
{
  name?: string;
  isAbsolute?: boolean;
  zOffset?: string;
  parentId?: number | null;
}
```

### DELETE /api/datums/:id
Deletes a datum.

## Object Endpoints

Similar structure for object-related endpoints...
