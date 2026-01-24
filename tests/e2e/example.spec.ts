import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
    await page.goto('http://localhost:5173/');

    // Pruebo que cargue la app (el titulo puede variar, pero verifica que no sea 404)
    // Ajusta según el título real de tu app
    await expect(page).toHaveTitle(/Solar Ecommerce|Vite/i);
});
