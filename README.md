# CoDomain Expansion - Cloud IDE

## 🌐 Overview

A comprehensive Cloud-based Integrated Development Environment (IDE) that enables developers to code from anywhere using a web browser, with isolated project environments and powerful development tools.

## ✨ Current Features

- **Cloud-Based Development**:
  - Code from any device with a web browser
  - Multiple projects with isolated Docker container environments
- **Code Editor**: 
  - Syntax highlighting
  - Integrated file system navigation
  - React-based editor with Monaco integration
- **Integrated Development Tools**:
  - Direct terminal access to the container within the IDE

## ✨ Upcoming Features

- **Enhanced Language Support**:
  - Multi-language programming environments (Nix-powered)
  - Intelligent code completion
- **Collaboration Tools**:
  - Real-time project sharing
  - Pair programming capabilities
- **Advanced Development Features**:
  - Integrated version control
  - Built-in debugging tools
- **Workspace Customization**:
  - Theme customization
  - Extensions and plugin support
- **Enterprise-Grade Infrastructure**:
  - Secure cloud-based storage
  - Automatic backup systems
  - Robust security measures

## 🚀 Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Docker installed on the server machine
- Node.js and npm

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/HartyPotter/CoDomain-Expansion.git
   cd CoDomain-Expansion
   ```

2. Install dependencies
   ```bash
   # Install root dependencies
   npm install

   # Install backend dependencies
   cd Backend
   npm install

   # Install frontend dependencies
   cd ../Frontend
   npm install
   ```

3. Configure Environment Variables
   Create a `.env` file in the `Backend` directory with the following:
   ```
   DATABASE_URL=your_database_connection_string
   REDIS_PW=your_redis_password
   REDIS_HOST=your_redis_host
   REDIS_PORT=your_redis_port
   JWT_SECRET=your_jwt_secret
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   DOCKER_VOLUMES_PATH=/path/to/docker/volumes
   ```

4. Start the Development Server
   ```bash
   # From the project root
   npm run start
   ```

## 📦 Technologies Used

- **Frontend**: 
  - React
  - Chakra UI
  - Monaco Editor
  - File Tree Component by [duguosheng](https://github.com/USTCWebIDE/react-monaco-file-tree)
- **Backend**:
  - Node.js
  - Nest.js
  - Prisma ORM
  - Docker
- **Database**:
  - PostgreSQL
  - Redis

## 🤝 Contributing

Contributions are welcome! Follow these steps:

1. Fork the repository
2. Create a feature branch 
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. Commit your changes
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. Push to the branch
   ```bash
   git push origin feature/AmazingFeature
   ```
5. Open a Pull Request
