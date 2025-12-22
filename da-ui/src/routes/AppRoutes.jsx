import { Suspense, useEffect, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

const LandingPage = lazy(() => import('../pages/LandingPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

const EXTERNAL_LINKS = [
    { id: 'instagram', url: 'https://www.instagram.com/danielhs/' },
    { id: 'x', url: 'https://www.x.com/danielalipio' },
    { id: 'linkedin', url: 'https://www.linkedin.com/in/danielalipio/' },
    { id: 'github', url: 'https://www.github.com/danielalipio' },
];

const ExternalRedirect = ({ to }) => {
    useEffect(() => {
        window.location.href = to;
    }, [to]);

    return null;
};

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="*" element={<NotFoundPage />} />

            {EXTERNAL_LINKS.map(link => (
                <Route
                    key={link.id}
                    path={`/${link.id}`}
                    element={<ExternalRedirect to={link.url} />}
                />
            ))}
        </Routes>
    );
}
