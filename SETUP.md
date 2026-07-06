# ERP Ecosystem Setup Guide

This guide will help you set up and run the ERP Ecosystem on your local machine.

## Prerequisites

- Node.js (>= 18.0.0)
- npm or yarn
- Git

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ERP
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   This will install dependencies for all packages (core, api, web).

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file with your configuration:
   - `PORT`: API server port (default: 3000)
   - `JWT_SECRET`: Secret key for JWT tokens (change in production)
   - `DATA_DIR`: Directory for JSON data storage (default: ./data)

## Running the Application

### Development Mode

1. **Start the API server**
   ```bash
   cd apps/api
   npm run dev
   ```
   The API will run on `http://localhost:3000`

2. **Start the web application** (in a new terminal)
   ```bash
   cd apps/web
   npm run dev
   ```
   The web app will run on `http://localhost:5173`

### Production Mode

1. **Build the packages**
   ```bash
   npm run build
   ```

2. **Start the API server**
   ```bash
   cd apps/api
   npm start
   ```

3. **Build and serve the web app**
   ```bash
   cd apps/web
   npm run build
   npm run preview
   ```

## Project Structure

```
ERP/
├── apps/
│   ├── api/           # REST API server (Node.js/Express)
│   └── web/           # Web application (React/Vite)
├── packages/
│   ├── core/          # Core utilities (storage, auth)
│   ├── modules/       # Domain models and types
│   └── shared/        # Shared utilities
├── data/              # JSON data storage
├── docs/              # Documentation
└── tests/             # Test files
```

## Available Modules

- **Finance**: Accounts, transactions, invoices, payments, financial reports
- **Inventory**: Products, warehouses, stock management, transfers
- **Sales**: Customers, orders, quotes, opportunities
- **Procurement**: Vendors, purchase orders, requisitions
- **HR**: Employees, departments, payroll, leave management

## API Endpoints

### Health Check
- `GET /health` - Server health status

### Authentication
- `POST /api/auth/login` - User login

### Finance Module
- `GET /api/finance/accounts` - List all accounts
- `POST /api/finance/accounts` - Create account
- `GET /api/finance/transactions` - List transactions
- `POST /api/finance/transactions` - Create transaction
- `GET /api/finance/invoices` - List invoices
- `POST /api/finance/invoices` - Create invoice

### Inventory Module
- `GET /api/inventory/products` - List products
- `POST /api/inventory/products` - Create product
- `GET /api/inventory/warehouses` - List warehouses
- `POST /api/inventory/warehouses` - Create warehouse
- `GET /api/inventory/stock` - List stock levels
- `POST /api/inventory/stock/movements` - Record stock movement

### Sales Module
- `GET /api/sales/customers` - List customers
- `POST /api/sales/customers` - Create customer
- `GET /api/sales/orders` - List orders
- `POST /api/sales/orders` - Create order
- `GET /api/sales/quotes` - List quotes
- `POST /api/sales/quotes` - Create quote

### Procurement Module
- `GET /api/procurement/vendors` - List vendors
- `POST /api/procurement/vendors` - Create vendor
- `GET /api/procurement/purchase-orders` - List purchase orders
- `POST /api/procurement/purchase-orders` - Create purchase order
- `GET /api/procurement/requisitions` - List requisitions
- `POST /api/procurement/requisitions` - Create requisition

### HR Module
- `GET /api/hr/employees` - List employees
- `POST /api/hr/employees` - Create employee
- `GET /api/hr/departments` - List departments
- `POST /api/hr/departments` - Create department
- `GET /api/hr/payroll` - List payroll records
- `POST /api/hr/payroll` - Create payroll record
- `GET /api/hr/leave-requests` - List leave requests
- `POST /api/hr/leave-requests` - Create leave request

## Development

### Adding New Features

1. **Add domain models** in `packages/modules/[module-name]/types.ts`
2. **Create API routes** in `apps/api/src/routes/[module-name].ts`
3. **Create UI pages** in `apps/web/src/pages/[Module].tsx`
4. **Update navigation** in `apps/web/src/components/Layout.tsx`

### Running Tests

```bash
npm test
```

### Linting

```bash
npm run lint
```

## Troubleshooting

### Port Already in Use
If port 3000 or 5173 is already in use, you can change the port in:
- API: Set `PORT` environment variable
- Web: Modify `port` in `apps/web/vite.config.ts`

### Data Directory Issues
Ensure the `data` directory exists and is writable. The application will create it automatically on first run.

### Module Not Found Errors
Make sure you've installed all dependencies with `npm install` from the root directory.

## Security Notes

- Change the `JWT_SECRET` in production
- Use environment variables for sensitive configuration
- Enable HTTPS in production
- Implement proper authentication and authorization
- Regularly update dependencies

## Next Steps

1. Implement user authentication and authorization
2. Add data validation and error handling
3. Create comprehensive test suites
4. Set up CI/CD pipeline
5. Add database migration support
6. Implement real-time features with WebSockets
7. Add reporting and analytics capabilities

## Support

For issues and questions, please refer to the project documentation or create an issue in the repository.
