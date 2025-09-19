# RentHub - Rental Property Management App

A React Native mobile application built with Expo, TypeScript, Firebase Auth, and Cloud Firestore for managing rental properties. The app supports both landlords (property owners) and tenants (property seekers).

## Features

### For Landladies/Landlords

- Create and manage property listings
- Upload property images
- List/de-list properties
- Receive and manage rental requests
- Approve or deny rental applications
- View property details with map integration

### For Tenants

- Search and browse available properties
- Filter properties by location, price, bedrooms, etc.
- View detailed property information
- Save properties to shortlist/favorites
- Send rental requests to landlords
- Track request status

### Common Features

- User authentication (login/register)
- User profile management
- Real-time data synchronization
- Map integration for property locations
- Image upload and management
- Push notifications (ready for implementation)

## Screenshots (Auth)

<img width="661" height="718" alt="auth" src="https://github.com/user-attachments/assets/8fda39fc-f563-4664-8ab9-30e78a53c657" />

## Screenshots (Tenant)

<img width="923" height="668" alt="tenant" src="https://github.com/user-attachments/assets/95a2a3c6-71de-461a-bb70-5db2aea7329a" />

## Screenshots (Landlady/Landlord)

<img width="666" height="725" alt="landlord-tabs" src="https://github.com/user-attachments/assets/b8d1e082-7400-4c06-9e32-4bd0c1e3d5c7" />

<img width="986" height="716" alt="landlord-list-edit" src="https://github.com/user-attachments/assets/74495a95-5263-4943-ba38-1198b7c30661" />

## Screenshots (Shared)

<img width="921" height="668" alt="shared" src="https://github.com/user-attachments/assets/9dd2bb7b-7860-48b2-80d9-82486759b362" />

## Technology Stack

- **Frontend**: React Native with Expo
- **Language**: TypeScript
- **Authentication**: Firebase Auth
- **Database**: Cloud Firestore
- **Storage**: Firebase Storage
- **Maps**: React Native Maps
- **Navigation**: React Navigation v6
- **State Management**: React Context API
- **UI Components**: React Native + Expo Vector Icons

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Firebase project with Firestore and Authentication enabled
- Android Studio (for Android development) or Xcode (for iOS development)

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd RentHub
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Firebase Setup**

   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication with Email/Password provider
   - Enable Cloud Firestore
   - Enable Firebase Storage
   - Download the configuration file and create a `.env.local` file in the root of the project with your Firebase configuration. Example:

     ```
     API_KEY=your-api-key
     AUTH_DOMAIN=your-project.firebaseapp.com
     PROJECT_ID=your-project-id
     STORAGE_BUCKET=your-project.appspot.com
     MESSAGING_SENDER_ID=your-sender-id
     APP_ID=your-app-id
     ```

4. **Run Application**
   ```bash
   firebase deploy --only firestore:rules
   ```

## Running the Application

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start the Expo development server**

   ```bash
   npx expo start
   ```

   Or, to run with tunneling for external access:

   ```bash
   npx expo start --tunnel
   ```

3. Follow the instructions in the Expo CLI to open the app on your device or emulator.

## Firebase Configuration

### Firestore Collections

The app uses four main collections:

1. **users** - User profiles and authentication data
2. **properties** - Property listings created by landlords
3. **rentalRequests** - Rental requests from tenants to landlords
4. **shortlists** - Properties saved by tenants

### Security Rules

The Firestore security rules ensure:

- Users can only access their own data
- Landlords can only manage their own properties
- Tenants can only create requests for listed properties
- Proper validation for all data operations

## Key Features Implementation

### Authentication Flow

- User registration with role selection (landlord/tenant)
- Email/password authentication via Firebase Auth
- Persistent login state with AsyncStorage
- Profile management and updates

### Property Management

- CRUD operations for property listings
- Image upload to Firebase Storage
- Map integration for property locations
- Search and filtering capabilities

### Request System

- Tenants can send rental requests
- Landlords can approve/deny requests
- Real-time status updates
- Request history tracking

### Shortlist Feature

- Save/remove properties from favorites
- Quick access to saved properties
- Shortlist management for tenants

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

For support and questions:

- Create an issue in the repository
- Contact the development team
- Check the documentation

## Future Enhancements

- Push notifications for new requests
- In-app messaging between landlords and tenants
- Payment integration
- Property viewing scheduling
- Reviews and ratings system
- Advanced search with AI recommendations
- Multi-language support
- Dark mode theme
