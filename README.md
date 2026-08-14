# Organization Asset Management System

A professional Full-Stack web application developed for the **RARAS Technologies PLC Assessment**. This system allows organizations to manage their hierarchical structure, track company assets, and securely store associated documents.

## 🚀 Key Features

- **Clean Architecture:** Strictly followed the 4-layer separation (Domain, Application, Infrastructure, API) for maximum maintainability and scalability.
- **Organization Hierarchy:** Managed via a recursive tree structure with full CRUD support.
- **Asset Management:** Complete inventory system with asset identification, classification (Categories), and assignment.
- **Document Management:** Secure file upload system (PDFs/Images) with physical storage and database tracking.
- **Role-Based Access Control (RBAC):**
  - **Administrator:** Full system control, user management, and deletion rights.
  - **Manager:** Can manage assets and organization units but cannot delete or manage users.
  - **Viewer:** Read-only access to the dashboard and details.
- **Dynamic Dashboard:** Real-time filtering where clicking an organization unit filters the asset table instantly.
- **Password Security:** Administrative privilege to reset user passwords.

## 🛠️ Tech Stack

- **Backend:** .NET 10 Web API, Entity Framework Core.
- **Frontend:** Angular 18/19, Angular Material UI, SCSS.
- **Database:** SQL Server.
- **Authentication:** JWT (JSON Web Tokens).

## 🏁 Getting Started

### 1. Prerequisites

- .NET 8/10 SDK
- Node.js (LTS version)
- SQL Server (LocalDB or Express)

### 2. Backend Setup (.NET)

1.  Open `AssetManagement.slnx` in **Visual Studio 2022**.
2.  Open `AssetManagement.Api/appsettings.json` and update the `ConnectionStrings` to match your local SQL Server instance.
3.  Open the **Terminal** or **Package Manager Console** and run the following to create the database:
    ```bash
    dotnet ef database update --project AssetManagement.Infrastructure --startup-project AssetManagement.Api
    ```
4.  Press **F5** to run the API. The server will start at `http://localhost:5000`.

### 3. Frontend Setup (Angular)

1.  Navigate to the `AssetManagementUI` folder.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    ng serve
    ```
4.  Open `http://localhost:4200` in your browser.

## 🔑 Test Accounts

The system is automatically seeded with the following accounts for testing:

| Role              | Email            | Password  |
| :---------------- | :--------------- | :-------- |
| **Administrator** | admin@raras.com  | admin123  |
| **Viewer**        | viewer@raras.com | viewer123 |
| **Manager**        | manager@raras.com |123456 |


## 🏗️ Project Structure (Clean Architecture)

- **Domain:** Core entities (Asset, User, OrganizationUnit) and business rules.
- **Application:** DTOs, Interfaces, and Business Logic (Services).
- **Infrastructure:** Database Context (EF Core), Migrations, and Data Seeding.
- **API:** Controllers, JWT Configuration, and File Serving logic.

## 📄 Major Design Decisions

- **Recursive Logic:** Used a self-referencing table for Organization Units to allow infinite nesting depth.
- **DTO Pattern:** Implemented Data Transfer Objects to prevent exposing sensitive database schemas to the client.
- **Static File Mapping:** Configured a manual physical file provider in .NET to securely serve uploaded asset documents.
- **UI/UX:** Leveraged Angular Material for a professional, "clean" enterprise feel as requested in the functional requirements.

---

**Developed by:** Tadele G/her  
**For:** RARAS Technologies PLC Assessment
