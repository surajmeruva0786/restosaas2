import { ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import { DataProvider } from '../contexts/DataContext';

export default function CustomerRouteWrapper({ children }: { children: ReactNode }) {
    const { slug } = useParams<{ slug: string }>();

    return (
        <DataProvider restaurantSlug={slug}>
            {children}
        </DataProvider>
    );
}
