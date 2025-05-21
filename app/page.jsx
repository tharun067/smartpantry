import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GiFruitBowl } from 'react-icons/gi';
import { MdOutlineInventory2 } from 'react-icons/md';
import { BsGraphUp } from 'react-icons/bs';
import { TbShoppingCartCheck } from 'react-icons/tb';

export default function Home() {
  return (
     <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed w-full bg-background/80 backdrop-blur-sm z-10 border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <MdOutlineInventory2 className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">SmartPantry</span>
          </div>
          <div className="space-x-4">
            <Link href="/login">
              <Button variant="outline">Log in</Button>
            </Link>
            <Link href="/register">
              <Button>Register</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <section className="pt-28 pb-16 px-4 md:pt-40 md:pb-24">
        <div className="container mx-auto text-center">
          <Badge variant="outline" className="mb-4 px-3 py-1">
            Intelligent Inventory Management
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Track Your Kitchen Inventory <br className="hidden md:block" />
            <span className="text-primary">With Precision</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8 text-lg">
            SmartPantry helps you monitor your food containers, automatically generates shopping lists, and provides insights to reduce waste.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Existing User? Log In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Smart Features for Modern Kitchens</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-card rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <MdOutlineInventory2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Container Tracking</h3>
              <p className="text-muted-foreground">
                Monitor weight changes in your food containers with precise measurements and timely alerts.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-card rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <TbShoppingCartCheck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Auto Shopping Lists</h3>
              <p className="text-muted-foreground">
                Automatically generate shopping lists based on containers that fall below your alert thresholds.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-card rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <BsGraphUp className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Usage Analytics</h3>
              <p className="text-muted-foreground">
                Gain insights into your food consumption patterns with detailed charts and historical data.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-card rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <GiFruitBowl className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Household Management</h3>
              <p className="text-muted-foreground">
                Connect family members to your household account to collaborate on kitchen inventory management.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-card rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Notifications</h3>
              <p className="text-muted-foreground">
                Receive timely alerts when containers are running low or items need to be restocked.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-card rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                  <path d="M12 8v4M12 16h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Data Security</h3>
              <p className="text-muted-foreground">
                Your household data is securely stored and accessible only to authorized household members.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-20 bg-gradient-to-r from-primary/20 to-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Kitchen Management?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Join thousands of households using SmartPantry to reduce food waste, save money, and streamline their kitchen inventory.
          </p>
          <Link href="/register">
            <Button size="lg">
              Get Started for Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-6 md:mb-0">
              <MdOutlineInventory2 className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">SmartPantry</span>
            </div>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-12 text-center md:text-left">
              <div>
                <h3 className="font-semibold mb-2">Product</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li><a href="#" className="hover:text-primary">Features</a></li>
                  <li><a href="#" className="hover:text-primary">Pricing</a></li>
                  <li><a href="#" className="hover:text-primary">Testimonials</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Resources</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li><a href="#" className="hover:text-primary">Help Center</a></li>
                  <li><a href="#" className="hover:text-primary">Blog</a></li>
                  <li><a href="#" className="hover:text-primary">Contact</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Company</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li><a href="#" className="hover:text-primary">About Us</a></li>
                  <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-primary">Terms of Service</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t pt-6 text-center text-muted-foreground text-sm">
            <p>&copy; {new Date().getFullYear()} SmartPantry. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
