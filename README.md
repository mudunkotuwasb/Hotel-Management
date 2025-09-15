# Hotel Management System Frontend

A modern, responsive hotel management system frontend built with React, TypeScript, and Tailwind CSS. Designed for small hotels (10-20 rooms) with comprehensive modules for managing all aspects of hotel operations.

## Features

### 🏨 Core Modules
- **Dashboard** - Key metrics, charts, and recent activity overview
- **Room Management** - Room status tracking, availability, and maintenance
- **Bookings & Reservations** - Calendar view, guest management, and booking sources
- **Housekeeping** - Task management and room cleaning status
- **Dining & Menu** - Menu management and order tracking
- **Inventory Management** - Stock tracking with low-stock alerts
- **Billing** - Guest billing and payment tracking
- **Reports & Analytics** - Performance insights and data visualization

### 👥 User Roles
- **Admin** - Full access to all modules and system settings
- **Receptionist** - Room management, bookings, and billing access
- **Housekeeping** - Task management and room status updates
- **Kitchen Staff** - Menu and order management

### 🎨 UI/UX Features
- Clean, modern dashboard design with sidebar navigation
- Responsive design for mobile, tablet, and desktop
- Status indicators with color coding
- Interactive charts and data visualization
- Card-based layout for easy information scanning
- Toast notifications for user feedback

### 📱 Responsive Design
- Mobile-first approach
- Collapsible sidebar navigation
- Touch-friendly interface
- Optimized for all screen sizes

## Technology Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Recharts** - Data visualization
- **Lucide React** - Beautiful icons
- **React Hook Form** - Form management
- **React Hot Toast** - Notifications
- **Date-fns** - Date manipulation

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd hotel-management-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Building for Production

```bash
npm run build
```

This builds the app for production to the `build` folder.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout/         # Layout components (Sidebar, Header)
│   ├── Dashboard/      # Dashboard-specific components
│   ├── Rooms/          # Room management components
│   ├── Bookings/       # Booking system components
│   ├── Housekeeping/   # Housekeeping components
│   ├── Dining/         # Dining and menu components
│   ├── Inventory/      # Inventory management components
│   └── Billing/        # Billing components
├── pages/              # Main page components
├── types/              # TypeScript type definitions
├── data/               # Mock data for development
└── App.tsx             # Main application component
```

## Key Features by Module

### Dashboard
- Real-time occupancy statistics
- Revenue tracking
- Upcoming check-ins/check-outs
- Low stock alerts
- Interactive charts and graphs

### Room Management
- Visual room status indicators
- Filtering by status, type, and floor
- Grid and list view options
- Quick status updates
- Room details and amenities

### Bookings & Reservations
- Calendar view with booking visualization
- Support for multiple booking sources (Booking.com, TripAdvisor, Expedia)
- Guest information management
- Booking packages (Room only, B&B, Half Board, Full Board)
- Check-in/check-out workflow

### Housekeeping
- Task assignment and tracking
- Room cleaning status updates
- Staff workload management
- Priority-based task organization

### Dining & Menu
- Menu item management
- Order tracking with status updates
- Category-based organization
- Kitchen workflow management

### Inventory Management
- Stock level tracking
- Low stock alerts
- Category-based organization
- Supplier information
- Cost tracking

### Billing
- Guest billing management
- Payment status tracking
- PDF export functionality
- Revenue reporting

### Reports & Analytics
- Occupancy rate analysis
- Revenue trends
- Guest satisfaction tracking
- Exportable reports

## Customization

### Styling
The application uses Tailwind CSS for styling. You can customize the design by:
- Modifying the color scheme in `tailwind.config.js`
- Updating component styles in individual component files
- Adding custom CSS classes in `src/index.css`

### Data
Mock data is provided in `src/data/mockData.ts`. Replace this with real API calls when integrating with a backend.

### User Roles
User role permissions are defined in the sidebar navigation component. Modify the `navigationItems` array in `src/components/Layout/Sidebar.tsx` to adjust role-based access.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

For support and questions, please open an issue in the repository.

---




