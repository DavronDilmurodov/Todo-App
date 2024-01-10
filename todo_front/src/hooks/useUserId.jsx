import { v4 } from 'uuid';

export const useUserId = () => {
    const id = localStorage.getItem('userId') || null;

    if (!id) {
        const userId = v4();
        localStorage.setItem('userId', userId);
    }
};
