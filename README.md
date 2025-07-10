# StellarVault - Space Station Storage Management System

A comprehensive storage management system for space stations, featuring 3D visualization, inventory tracking, waste management, and time simulation.

## Backend Architecture

The backend of StellarVault is built using:

- **Next.js API Routes**: Server-side API endpoints
- **MongoDB**: NoSQL database for data storage
- **Mongoose**: ODM (Object Document Mapper) for MongoDB
- **NextAuth.js**: Authentication system
- **JWT**: Token-based authentication
- **Zod**: Schema validation

## Database Schema

### User
- `name`: User's full name
- `email`: User's email address (unique)
- `password`: Hashed password
- `role`: User role (admin, astronaut, ground-control)

### Item
- `itemId`: Unique identifier for the item
- `name`: Item name
- `width`, `depth`, `height`: Item dimensions
- `mass`: Item mass in kg
- `priority`: Item priority (0-100)
- `expiryDate`: Date when the item expires (if applicable)
- `usageLimit`: Maximum number of uses
- `usesLeft`: Remaining uses
- `preferredZone`: Preferred storage zone
- `containerId`: ID of the container where the item is stored
- `position`: 3D position within the container
- `isWaste`: Whether the item is waste
- `wasteReason`: Reason for being waste (Expired, Out of Uses, Damaged)
- `createdBy`: User who created the item

### Container
- `containerId`: Unique identifier for the container
- `zone`: Storage zone
- `width`, `depth`, `height`: Container dimensions
- `maxWeight`: Maximum weight capacity
- `currentWeight`: Current weight of items
- `itemCount`: Number of items in the container
- `utilization`: Space utilization percentage

### Activity
- `userId`: User who performed the action
- `userName`: Name of the user
- `action`: Type of action (add, remove, update, retrieve, move, waste)
- `itemId`: ID of the item involved
- `itemName`: Name of the item
- `containerId`: ID of the container involved
- `details`: Additional details about the activity
- `timestamp`: When the activity occurred

## API Endpoints

### Authentication
- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Login and get JWT token

### Items
- `GET /api/items`: Get all items (with optional filters)
- `POST /api/items`: Create a new item
- `GET /api/items/:id`: Get item by ID
- `PUT /api/items/:id`: Update item
- `DELETE /api/items/:id`: Delete item

### Containers
- `GET /api/containers`: Get all containers (with optional filters)
- `POST /api/containers`: Create a new container
- `GET /api/containers/:id`: Get container by ID (includes items)
- `PUT /api/containers/:id`: Update container
- `DELETE /api/containers/:id`: Delete container

### Activities
- `GET /api/activities`: Get activity log (with pagination and filters)

### Waste Management
- `POST /api/waste/identify`: Identify waste items

### Simulation
- `POST /api/simulate/day`: Simulate passage of time

## Authentication and Security

The system uses a dual authentication approach:

1. **JWT Tokens**: For API authentication
2. **NextAuth.js**: For web interface authentication

Security features include:
- Password hashing with bcrypt
- JWT token validation
- Role-based access control
- Input validation with Zod
- Secure MongoDB connection

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables in `.env.local`
4. Start MongoDB locally or use a cloud provider
5. Run the development server: `npm run dev`

## Environment Variables

Create a `.env.local` file with the following variables:

\`\`\`
MONGODB_URI=mongodb://localhost:27017/space-station
JWT_SECRET=your-secret-key-change-this-in-production
NEXTAUTH_SECRET=your-nextauth-secret-change-this-in-production
NEXTAUTH_URL=http://localhost:3000
\`\`\`

## Deployment

For production deployment:

1. Update environment variables with production values
2. Build the application: `npm run build`
3. Start the production server: `npm start`
