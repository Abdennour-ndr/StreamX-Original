const { setSuperAdmin } = require('../lib/userManagement');

async function main() {
  const userId = 'zdbuEZTSgngTRNbvlt8D8LmvSXm2';
  try {
    const success = await setSuperAdmin(userId);
    if (success) {
      console.log('Successfully set user as superadmin');
    } else {
      console.error('Failed to set user as superadmin');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

main(); 