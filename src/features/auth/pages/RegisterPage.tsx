import { RegisterForm } from '../components/RegisterForm';
import { Layout } from '../../../components/layout/Layout';

export function RegisterPage() {
    return (
        <Layout>
            <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <RegisterForm />
            </div>
        </Layout>
    );
}
