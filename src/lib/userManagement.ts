import { User } from 'firebase/auth';

// Local storage for users
let localUsers: any[] = [];

export const createNewUser = async (userData: { email: string; password: string; displayName: string }) => {
  try {
    // Simulate user creation
    const newUser = {
      uid: Math.random().toString(36).substr(2, 9),
      email: userData.email,
      displayName: userData.displayName,
      role: 'user',
      createdAt: new Date()
    };
    
    localUsers.push(newUser);
    return newUser;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    // Return local users
    return localUsers;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const updateUserRole = async (userId: string, newRole: string) => {
  try {
    // Update role in local storage
    const userIndex = localUsers.findIndex(user => user.uid === userId);
    if (userIndex !== -1) {
      localUsers[userIndex].role = newRole;
    }
    return true;
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
};

export const setSuperAdmin = async (userId: string) => {
  try {
    // Update role to admin in local storage
    const userIndex = localUsers.findIndex(user => user.uid === userId);
    if (userIndex !== -1) {
      localUsers[userIndex].role = 'admin';
    }
    return true;
  } catch (error) {
    console.error('Error setting super admin:', error);
    throw error;
  }
};

export const deleteUserAccount = async (userId: string) => {
  try {
    // Remove user from local storage
    localUsers = localUsers.filter(user => user.uid !== userId);
    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}; 