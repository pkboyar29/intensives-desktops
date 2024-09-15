import Cookies from 'js-cookie';

const waitForCookie = (
  cookieName: string,
  interval = 100,
  maxAttempts = 50
) => {
  return new Promise((resolve, reject) => {
    let attempts = 0;

    const checkCookie = () => {
      const cookie = Cookies.get(cookieName);
      if (cookie) {
        resolve(cookie);
      } else if (attempts >= maxAttempts) {
        reject(new Error('Cookie not found within the allowed attempts'));
      } else {
        attempts++;
        setTimeout(checkCookie, interval);
      }
    };

    checkCookie();
  });
};

const authHeader = async () => {
  try {
    const token = await waitForCookie('access');
    return {
      Authorization: `Bearer ${token}`,
    };
  } catch (error) {
    console.log('Error getting cookie ', error);
    throw error;
  }
};

export default authHeader;
