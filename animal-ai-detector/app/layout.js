import './globals.css';
import ClientLayout from '@/components/ClientLayout';
import { AuthProvider } from '@/components/AuthProvider';

export const metadata = {
  title: 'ANIMAI | Advanced Species Discovery',
  description: 'AI-powered animal species detection using deep learning and geospatial research hubs',
  icons: {
    icon: '/Modern_Emblem-Style_Logo_for_AnimAi-removebg-preview.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#020202] text-slate-200 selection:bg-indigo-500/30 overflow-hidden">
        <AuthProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
