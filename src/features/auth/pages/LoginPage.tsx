import { LoginForm } from '../components/LoginForm';
import { Layout } from '../../../components/layout/Layout';

export function LoginPage() {
    return (
        <Layout>
            <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <LoginForm />
            </div>
        </Layout>
    );
}
