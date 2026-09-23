# BioShop Management System

A full-stack internal retail management platform built for **BioShop** to manage products, inventory batches, expiry dates, stock movements, and sales from a centralized system.

The project is currently under active development and is designed around real retail workflows rather than demo-only functionality.

## Overview

BioShop Management System is being developed to improve the management of daily store operations, including:

* Product management
* Inventory tracking
* Batch and expiry management
* Low-stock and out-of-stock detection
* Stock movement history
* Sales management
* Automatic stock deduction using FEFO
* Operational dashboard summaries

The long-term goal is to create a complete internal back-office platform that supports BioShop's inventory and sales workflows and can later be extended with authentication, analytics, cloud deployment, and intelligent features.

## Tech Stack

### Frontend

* React
* TypeScript
* Vite
* React Router
* Axios
* Bootstrap
* Custom CSS

### Backend

* NestJS
* TypeScript
* REST APIs
* class-validator
* class-transformer

### Database

* PostgreSQL
* Prisma ORM

### Infrastructure & Development

* Docker
* Docker Compose
* Git
* GitHub
* Postman

## Features

### Product Management

* Add and edit products
* Activate and deactivate products
* Manage brands, categories, and product types
* Store cost and selling prices
* Configure product-specific low-stock thresholds

### Inventory Management

* Batch-based inventory
* Add stock
* Multiple expiry dates per product
* Total stock calculation
* Low-stock and out-of-stock detection
* Expiry alerts
* Inventory summary
* Product inventory details
* Stock movement history

### Sales

* Sales history
* Sale details
* Multi-product sale creation
* Stock validation
* Automatic stock deduction
* FEFO (First Expired, First Out)
* Transaction rollback on failed sales
* SALE stock movement tracking

### Dashboard

* Total products
* Low-stock products
* Out-of-stock products
* Expiring products
* Today's sales

## Project Structure

```text
bioshop-management-system/
├── backend/
│   ├── prisma/
│   └── src/
│       ├── brands/
│       ├── categories/
│       ├── dashboard/
│       ├── inventory/
│       ├── prisma/
│       ├── products/
│       ├── product-types/
│       └── sales/
│
├── frontend/
│   └── src/
│       ├── components/
│       ├── services/
│       ├── types/
│       ├── App.tsx
│       └── main.tsx
│
├── docker-compose.yml
└── README.md
```

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/saralozi/bioshop-management-system.git
cd bioshop-management-system
```

### 2. Start PostgreSQL

```bash
docker compose up -d
```

### 3. Backend

```bash
cd backend
npm install
npx prisma generate
npm run start:dev
```

Create a `.env` file inside the backend folder:

```env
DATABASE_URL="postgresql://bioshop_user:bioshop_password@localhost:5433/bioshop_db?schema=public"
```

Backend runs on:

```text
http://localhost:3000
```

### 4. Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

## Current Status

### Completed

* Product management
* Batch-based inventory
* Add stock workflow
* Expiry monitoring
* Low-stock and out-of-stock detection
* Inventory summary and details
* Stock movement tracking
* Sales history and sale details
* Multi-product sale creation
* FEFO stock deduction
* Transaction rollback
* Basic operational dashboard
* React frontend connected to NestJS backend

### Planned

* Authentication
* JWT session handling
* Role-based access control
* Protected routes
* Improved analytics dashboard
* Testing
* Swagger / OpenAPI documentation
* CI/CD
* Cloud deployment
* Optional AI-powered recommendations and semantic search
* Possible POS integration
