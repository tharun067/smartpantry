import Provider from '@/components/Provider';
import '@/styles/global.css';

export const metadata = {
  title: "SmartPantry",
  description: "Mange your household pantry efficiently",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className='min-h-screen bg-gray-50'>
        <Provider>
        {children}
        </Provider>
      </body>
    </html>
  );
}
