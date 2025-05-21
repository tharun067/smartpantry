import Image from "next/image";
import Link from "next/link";
import RegisterForm from "@/components/auth/register-form";
import { MdOutlineInventory2 } from "react-icons/md";

function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center px-5 py-12 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          <div className="flex items-center space-x-2 mb-8">
            <MdOutlineInventory2 className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">SmartPantry</span>
          </div>

          <h2 className="mt-6 text-3xl font-extrabold">Create your account</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:text-primary/90"
            >
              Log in
            </Link>
          </p>

          <div className="mt-8">
            <RegisterForm />
          </div>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:flex lg:flex-1 relative bg-muted">
        <Image
          src="https://images.pexels.com/photos/4226896/pexels-photo-4226896.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Kitchen pantry"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-primary/10 backdrop-blur-sm"></div>
        <div className="absolute inset-0 flex flex-col justify-center p-12 bg-gradient-to-r from-background/80 to-transparent">
          <blockquote className="text-2xl font-semibold max-w-lg">
            "SmartPantry has completely transformed how we manage our kitchen
            inventory. No more surprises about running out of essentials!"
          </blockquote>
          <p className="mt-6 text-lg">— Sarah Johnson, Family of Four</p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
