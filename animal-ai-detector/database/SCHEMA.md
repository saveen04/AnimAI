# MongoDB Schema – Animal Species Detector

## Database

- **Name:** `animal_detector`

## Collections

### `users`

Stores user accounts for login/signup.

| Field       | Type   | Description |
|-------------|--------|-------------|
| `_id`       | ObjectId | Auto-generated |
| `email`     | string | Unique, lowercase |
| `password`  | string | bcrypt hash |
| `name`      | string | Display name |
| `createdAt` | string | ISO 8601 |

### `detections`

Stores each detection result (upload or camera capture).

| Field         | Type     | Description |
|---------------|----------|-------------|
| `_id`         | ObjectId | Auto-generated document ID |
| `userId`      | string   | User ID (from auth) who ran the detection |
| `label`       | string   | Predicted animal species (e.g. "cat", "dog") |
| `confidence`  | number   | Confidence score between 0 and 1 |
| `description` | string  | Short description of the animal (optional) |
| `imageBase64` | string  | Base64-encoded image (optional; may be truncated for storage) |
| `createdAt`   | string  | ISO 8601 date string (e.g. "2024-01-15T10:30:00.000Z") |

#### Example document

```json
{
  "_id": ObjectId("..."),
  "label": "cat",
  "confidence": 0.92,
  "description": "A small domesticated carnivorous mammal...",
  "imageBase64": "/9j/4AAQSkZJRg...",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

#### Indexes (recommended)

- `createdAt` (descending) – for history listing:

```javascript
db.detections.createIndex({ createdAt: -1 });
```

## Connection

- **Env variable:** `MONGODB_URI` (default: `mongodb://localhost:27017`)
- **Usage:** See `lib/db.js` in the Next.js app.
