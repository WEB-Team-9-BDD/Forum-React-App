let id = 0;
const nextId = () => id++;

export const postCategories = [
    {
        id: nextId(),
        title: 'Health and Fitness',
        path: '/fitness',
    },
    {
        id: nextId(),
        title: 'Mental health',
        path: '/mental-health',
    },
    {
        id: nextId(),
        title: 'Social skills',
        path: '/social-skills',
    },
    {
        id: nextId(),
        title: 'Emotional intelligence',
        path: '/emotional-intelligence',
    },
]
