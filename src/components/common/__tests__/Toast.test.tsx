import { render, screen, act, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToastProvider, useToast } from '../Toast';
import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className }: any) => <div className={className}>{children}</div>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Componente helper para usar el hook
const TestComponent = ({ message, type }: { message: string, type?: 'success' | 'error' | 'info' }) => {
    const { showToast } = useToast();
    return (
        <button onClick={() => showToast(message, type)}>
            Show Toast
        </button>
    );
};

describe('Toast Component', () => {
    beforeEach(() => {
        cleanup();
        document.body.innerHTML = '';
        vi.useRealTimers();
    });

    it('shows toast when called', async () => {
        const user = userEvent.setup();
        const { unmount } = render(
            <ToastProvider>
                <TestComponent message="Test Message" />
            </ToastProvider>
        );

        await user.click(screen.getByText('Show Toast'));

        expect(await screen.findByText('Test Message')).toBeInTheDocument();
        unmount();
    });

    it.skip('removes toast after timeout', async () => {
        vi.useFakeTimers();
        const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

        const { unmount } = render(
            <ToastProvider>
                <TestComponent message="Auto Remove" />
            </ToastProvider>
        );

        await user.click(screen.getByText('Show Toast'));
        expect(screen.getByText('Auto Remove')).toBeInTheDocument();

        // Advance past 3000ms
        act(() => {
            vi.advanceTimersByTime(3500);
        });

        // Should be gone
        await expect.poll(() => screen.queryByText('Auto Remove')).toBeNull();
        unmount();
    });

    it.skip('removes toast on close click', async () => {
        const user = userEvent.setup();
        const { unmount } = render(
            <ToastProvider>
                <TestComponent message="Close Me" />
            </ToastProvider>
        );

        await user.click(screen.getByText('Show Toast'));
        const toast = await screen.findByText('Close Me');
        expect(toast).toBeInTheDocument();

        const closeButton = screen.getByRole('button');
        await user.click(closeButton);

        await expect.poll(() => screen.queryByText('Close Me')).toBeNull();
        unmount();
    });
});
