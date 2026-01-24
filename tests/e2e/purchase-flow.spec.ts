import { test, expect } from '@playwright/test';

test('Purchase Flow: View Product, Open Modal, Add to Cart', async ({ page }) => {

    await test.step('Load Home Page', async () => {
        await page.goto('/');
        await expect(page).toHaveTitle(/solar-ecommerce-mvp/i);
        // Wait for kits to load (loader to disappear)
        await expect(page.locator('.animate-spin')).not.toBeVisible({ timeout: 10000 });
    });

    await test.step('Navigate to Products', async () => {
        // Scroll to products section
        const productsSection = page.locator('#productos-grid');
        await productsSection.scrollIntoViewIfNeeded();
        await expect(productsSection).toBeVisible();
    });

    await test.step('Open Product Detail Modal', async () => {
        // Click "Ver detalles" on the first product card
        // Note: The button text might be inside an aria-label or just visually "Ver detalles"
        // Using aria-label is robust: aria-label="Ver detalles de [Product Name]"
        // Or simpler: first button with arrow-up-right icon
        const firstProductCard = page.locator('#productos-grid > div').first();
        const viewDetailsBtn = firstProductCard.locator('button', { hasText: 'Ver detalles' }).first(); // Fallback text

        // If text is hidden (icon only), we might need another selector. 
        // In ProductCard.tsx (Step 90): "Ver detalles" is NOT visible text? 
        // Wait, the button has `<ArrowUpRight />`. It does NOT have text "Ver detalles" inside <span>?
        // Let's re-read Step 90 diff.
        // <button> <ArrowUpRight ... /> </button>
        // It has `aria-label={`Ver detalles de ${title}`}`.
        // So I should select by aria-label using regex.

        await firstProductCard.getByRole('button', { name: /Ver detalles de/i }).click();

        // Verify Modal Opens - Wait for animation
        await expect(page.locator('text=Lo que incluye')).toBeVisible({ timeout: 5000 });
    });

    await test.step('Add to Cart', async () => {
        // Click "Añadir al Carrito" inside the modal
        // Using simple text selector which is often more robust for debugging
        const addToCartBtn = page.locator('button', { hasText: 'Añadir' }).first();
        await expect(addToCartBtn).toBeVisible();
        await addToCartBtn.click();

        // Verify Cart Drawer Opens or Toast appears (depending on implementation, usually drawer opens)
        // We can check if the Cart Drawer is visible.
        // CartDrawer usually has text "Tu Cesta" (from CartDrawer.tsx)
        await expect(page.locator('text=Tu Cesta')).toBeVisible({ timeout: 10000 });

        // Verify item count in cart if possible
        // Assuming cart item appears
    });

});
