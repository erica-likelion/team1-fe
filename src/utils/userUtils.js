import userData from '@assets/user/user.json';

export const getUserData = () => {
    return userData.user;
};

export const getUserName = () => {
    return userData.user.name || '사용자';
};