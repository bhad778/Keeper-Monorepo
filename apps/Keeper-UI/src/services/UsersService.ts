import axios from 'axios';
import getEnvVars from '../../environment';

import { TAccountType, TMatch, TSwipe, TEmployeeSettings } from 'keeperTypes';

const { apiUrl } = getEnvVars();

// make this use user service and make updateUserSettings always have loggedInUser id and account type

const UsersService = {
  //start shared api calls
  updateUserSettings: (payload: {
    userId: string;
    accountType: string;
    newSettings: Partial<TEmployeeSettings>;
    lastUpdatedOnWeb: boolean;
    isIncomplete?: boolean;
  }) => {
    return axios
      .post(`${apiUrl}/updateUserSettings`, JSON.stringify(payload), {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(res => {
        return res.data;
      })
      .catch(error => {
        console.error('Error:', error);
      });
  },
  recordSwipe: (payload: TSwipe) => {
    return fetch(`${apiUrl}/recordSwipe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(response => response.json())
      .then(data => {
        return data;
      })
      .catch(error => {
        console.error('Error:', error);
      });
  },
  getUsersByArrayOfIds: (payload: { userIdsArray: string[]; isEmployee: boolean }) => {
    return axios
      .post(`${apiUrl}/getUsersByArrayOfIds`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => response.data);
  },
  addMatch: (payload: { accountType: TAccountType; loggedInUserMatch: TMatch; otherUserMatch: TMatch }) => {
    return fetch(`${apiUrl}/addMatch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(response => response.json())
      .then(data => {
        return data;
      })
      .catch(error => {
        console.error('Error:', error);
      });
  },
  updateUserData: (payload: { userId: string; accountType: TAccountType; updateObject: any }) => {
    return fetch(`${apiUrl}/updateUserData`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(response => response.json())
      .then(data => {
        return data;
      })
      .catch(error => {
        console.error('Error:', error);
      });
  },
  updateMatchNotification: (payload: {
    userId: string;
    accountType: TAccountType;
    matchId: string;
    hasNotification: boolean;
  }) => {
    return fetch(`${apiUrl}/updateMatchNotification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(response => response.json())
      .then(data => {
        return data;
      })
      .catch(error => {
        console.error('Update match notification has failed:', error);
      });
  },
  updateMatchForBothOwners: (payload: {
    userId: string;
    accountType: TAccountType;
    matchToUpdate: Partial<TMatch>;
  }) => {
    return fetch(`${apiUrl}/updateMatchForBothOwners`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(response => response.json())
      .then(data => {
        return data;
      })
      .catch(error => {
        console.error('Error:', error);
      });
  },
  updateOwnMatch: (payload: { userId: string; accountType: TAccountType; matchToUpdate: Partial<TMatch> }) => {
    return fetch(`${apiUrl}/updateOwnMatch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(response => response.json())
      .then(data => {
        return data;
      })
      .catch(error => {
        console.error('Error:', error);
      });
  },
  deleteMatch: (payload: { userId: string; accountType: TAccountType; matchToDeleteId: string }) => {
    return fetch(`${apiUrl}/deleteMatch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(response => response.json())
      .then(data => {
        return data;
      })
      .catch(error => {
        console.error('Error:', error);
      });
  },
  getMatches: payload => {
    return fetch(`${apiUrl}/getMatches`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(response => response.json())
      .then(data => {
        return data;
      })
      .catch(error => {
        console.error('Error:', error);
      });
  },
  //end shared api calls

  //start employee api calls
  getEmployeeData: payload => {
    return fetch(`${apiUrl}/getEmployeeData`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(response => response.json())
      .then(data => {
        return data;
      })
      .catch(error => {
        console.error('Error:', error);
      });
  },
  //end employee api calls

  //start employer api calls
  getEmployerData: payload => {
    return fetch(`${apiUrl}/getEmployerData`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(response => response.json())
      .then(data => {
        return data;
      })
      .catch(error => {
        console.error('Error:', error);
      });
  },
  onSelectJob: payload => {
    return fetch(`${apiUrl}/onSelectJob`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(response => response.json())
      .then(data => {
        return data;
      })
      .catch(error => {
        console.error('Error:', error);
      });
  },
  recordEmployeesSwipes: payload => {
    return fetch(`${apiUrl}/recordEmployeesSwipes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(response => response.json())
      .then(data => {
        return data;
      })
      .catch(error => {
        console.error('Error:', error);
      });
  },
  getEmployee: (payload: { userId: string }) => {
    return fetch(`${apiUrl}/getEmployee`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(response => response.json())
      .then(data => {
        return data;
      })
      .catch(error => {
        console.error('Error:', error);
      });
  },
  // getEmployeesForSwiping: (payload?: { preferences: TEmployeePreferences; userId: string }) => {
  getEmployeesForSwiping: (payload?: any) => {
    return fetch(`${apiUrl}/getEmployeesForSwiping`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(response => response.json())
      .then(data => {
        return data;
      })
      .catch(error => {
        console.error('Error:', error);
      });
  },
  updateEmployeePreferences: payload => {
    return fetch(`${apiUrl}/updateEmployeePreferences`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(response => {
        response.json();
      })
      .then(data => {
        return data;
      })
      .catch(error => {
        console.error('Error:', error);
      });
  },
  updateExpoPushToken: (payload: { accountType: string; expoPushToken: string; id: string }) => {
    return fetch(`${apiUrl}/updateExpoPushToken`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(response => {
        response.json();
      })
      .then(data => {
        return data;
      })
      .catch(error => {
        console.error('Error:', error);
      });
  },
  //end employer api calls
};

export default UsersService;
