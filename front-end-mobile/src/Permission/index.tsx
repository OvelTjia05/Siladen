import {
  check,
  request,
  PERMISSIONS,
  PermissionStatus,
  RESULTS,
} from 'react-native-permissions';
import {Platform} from 'react-native';

type PlatformPermissionType = {
  web?: string;
  android?: string;
  ios?: string;
  macos?: string;
  windows?: string;
  // Add more platforms if necessary
};

const PLATFORM_NOTIFICATIONS_PERMISSIONS = {
  web: undefined,
  windows: undefined,
  macos: undefined,
  ios: undefined,
  android: PERMISSIONS.ANDROID.POST_NOTIFICATIONS,
};

const REQUEST_PERMISSION_TYPE: any = {
  notifications: PLATFORM_NOTIFICATIONS_PERMISSIONS,
};

const PERMISSIONS_TYPE = {
  notifications: 'notifications',
};

class AppPermission {
  checkPermission = async (type: string): Promise<boolean> => {
    console.log('apppermission type:', type);
    const permissions = REQUEST_PERMISSION_TYPE[type][Platform.OS];
    console.log('apppermission checkpermission permission: ', permissions);
    if (!permissions) {
      return true;
    }
    try {
      const result = await check(permissions); // Pass 'permissions' directly here
      if (result === RESULTS.GRANTED) return true;
      return this.requestPermission(permissions);
    } catch (error) {
      return false;
    }
  };

  requestPermission = async (permissions: any): Promise<boolean> => {
    try {
      const result = await request(permissions); // Pass 'permissions' directly here
      return result === RESULTS.GRANTED;
    } catch (error) {
      return false;
    }
  };
}

const Permission = new AppPermission();
export {Permission, PERMISSIONS_TYPE};
