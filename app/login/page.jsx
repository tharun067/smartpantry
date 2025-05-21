import Image from "next/image";
import Link from "next/link";
import LoginForm from "@/components/auth/login-form";
import { MdOutlineInventory2 } from "react-icons/md";

function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center px-5 py-12 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm">
          <div className="flex items-center space-x-2 mb-8">
            <MdOutlineInventory2 className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">SmartPantry</span>
          </div>

          <h2 className="mt-6 text-3xl font-extrabold">Welcome back</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-primary hover:text-primary/90"
            >
              Sign up
            </Link>
          </p>

          <div className="mt-8">
            <LoginForm />
          </div>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:flex lg:flex-1 relative bg-muted">
        <Image
          src="https://images.pexels.com/photos/6969267/pexels-photo-6969267.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Kitchen pantry"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-primary/10 backdrop-blur-sm"></div>
        <div className="absolute inset-0 flex flex-col justify-center p-12 bg-gradient-to-r from-background/80 to-transparent">
          <h2 className="text-3xl font-bold mb-4">
            Track Your Kitchen Inventory
          </h2>
          <p className="text-lg max-w-md">
            Manage your pantry efficiently and never run out of essential items
            again.
          </p>
        </div>
      </div>
    </div>
  );
}
export default LoginPage;
