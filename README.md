# NailTech

A final-year project for a nail appointment booking platform, with planned nail-design discovery and machine-learning features.

## Technology stack

| Component        | Technology |
|------------------|---|
| Frontend         | React, Vite, Tailwind CSS |
| Backend          | Java 21, Spring Boot, Gradle |
| Authentication   | Firebase Authentication |
| Database         | Cloud Firestore |
| Image storage    | Cloud Storage for Firebase |
| Machine learning | Python |

## Repository structure

```text
FYP/
├── backend/       # Spring Boot API
├── frontend/      # React application
├── docs/          # Architecture and project documentation
├── ml/            # Planned Python ML work
├── .gitignore
└── README.md
```


## Running locally

### Backend

Use JDK 21. Open the backend in IntelliJ and run `BackendApplication`, or run these commands in PowerShell from the repository root:

```powershell
cd backend
.\gradlew.bat bootRun
```

Check the backend at http://localhost:8080/api/health.

### Frontend

In a separate PowerShell terminal, starting from the repository root:

```powershell
cd frontend
npm.cmd ci
npm.cmd run dev
```

Open the address printed by Vite, normally http://localhost:5173.

Keep both applications running and click **Check backend** to verify their connection. Vite forwards local `/api` requests to Spring Boot on port 8080.

## Development checks

From `frontend/`:

```powershell
npm.cmd run lint
npm.cmd run build
```

From `backend/`:

```powershell
.\gradlew.bat test
```

## Documentation

See [Architecture blueprint](docs/architecture.md). This document is currently being developed.
