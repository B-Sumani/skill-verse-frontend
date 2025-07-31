# Skill Verse Frontend

A React-based frontend for the Skill Verse platform, built with Material-UI and modern React practices.

## 🚀 Features

- **Authentication System**: Complete signup/signin with JWT tokens
- **Modern UI**: Material-UI components with responsive design
- **Form Validation**: Yup schema validation with Formik
- **Protected Routes**: Authentication-based route protection
- **API Integration**: Axios-based API service layer

## 📦 Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the frontend directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── api/
│   │   └── api.js              # API service layer
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── LoginForm.jsx   # Signin form
│   │   │   └── SignupForm.jsx  # Signup form
│   │   └── ...                 # Other components
│   ├── contexts/
│   │   └── AuthContext.jsx     # Authentication context
│   ├── App.jsx                 # Main app component
│   └── index.js                # Entry point
```

## 🔐 Authentication

### Signup Form Fields:
- ✅ **Name** - Full name
- ✅ **Email** - Valid email address
- ✅ **Password** - Minimum 6 characters
- ✅ **Confirm Password** - Must match password
- ✅ **Skill to Teach** - Dropdown selection
- ✅ **Skill to Learn** - Dropdown selection
- ✅ **LinkedIn** - Optional LinkedIn profile URL

### Signin Form Fields:
- ✅ **Email** - User's email address
- ✅ **Password** - User's password

## 🎨 UI Components

- **Material-UI**: Modern, responsive design system
- **Form Validation**: Real-time validation with error messages
- **Loading States**: Proper loading indicators
- **Error Handling**: User-friendly error messages
- **Responsive Design**: Works on all device sizes

## 🔧 Development

### Available Scripts:
- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

### Key Dependencies:
- **React 19** - Latest React version
- **Material-UI 7** - UI component library
- **React Router 7** - Client-side routing
- **Axios** - HTTP client for API calls
- **Formik + Yup** - Form handling and validation

## 🌐 API Integration

The frontend connects to the backend API at `http://localhost:5000/api` with the following endpoints:

- **Authentication**: `/auth/signup`, `/auth/signin`, `/auth/me`
- **Algorand**: `/algorand/*` - Blockchain operations
- **Users**: `/users/*` - User management
- **Sessions**: `/sessions/*` - Learning sessions
- **Messages**: `/messages/*` - Messaging system
- **Feedback**: `/feedback/*` - User feedback
- **Credentials**: `/credentials/*` - Digital credentials

## 🔒 Security Features

- **JWT Token Management**: Automatic token storage and refresh
- **Protected Routes**: Authentication-based access control
- **Form Validation**: Client-side and server-side validation
- **Error Handling**: Secure error messages
- **Token Interception**: Automatic token injection in API calls

## 🚀 Getting Started

1. **Clone the repository**
2. **Install dependencies**: `npm install`
3. **Create .env file**: Copy from .env.example
4. **Start backend**: `cd ../backend && npm run dev`
5. **Start frontend**: `npm start`
6. **Open browser**: Navigate to `http://localhost:3000`

## 📱 Usage

1. **Sign Up**: Create a new account with your skills
2. **Sign In**: Log in with your credentials
3. **Dashboard**: Access your personalized dashboard
4. **Profile**: Manage your profile and preferences

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
