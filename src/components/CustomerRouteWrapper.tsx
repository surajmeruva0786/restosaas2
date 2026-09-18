import { ReactNode, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DataProvider, useData } from '../contexts/DataContext';
import { CartProvider } from '../contexts/CartContext';

// Inner component so it can access DataContext
function CustomerTitleSetter() {
    const { settings } = useData();

    useEffect(() => {
        if (settings?.name) {
            document.title = `${settings.name} | Restosas`;
        } else {
            document.title = 'Restosas';
        }
    }, [settings?.name]);

    return null;
}

export default function CustomerRouteWrapper({ children }: { children: ReactNode }) {
    const { slug } = useParams<{ slug: string }>();

    return (
        <DataProvider restaurantSlug={slug}>
            <CartProvider restaurantId={slug}>
                <CustomerTitleSetter />
                {children}
            </CartProvider>
        </DataProvider>
    );
}
