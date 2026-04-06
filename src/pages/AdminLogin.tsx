// import { sendPasswordResetEmail } from "firebase/auth";
// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { signInWithEmailAndPassword, signOut } from "firebase/auth";
// import { auth } from "../firebase";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import { Shield, Eye, EyeOff } from "lucide-react";


// const AdminLogin = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     try {
//       const userCredential = await signInWithEmailAndPassword(
//         auth,
//         email,
//         password
//       );

//       // 🔥 Get custom claims
//       const idTokenResult =
//         await userCredential.user.getIdTokenResult(true);

//       // ❌ If not admin → block
//       if (idTokenResult.claims.role !== "admin") {
//         alert("You are not authorized as Admin");
//         await signOut(auth);
//         return;
//       }

//       // ✅ Store details
//       localStorage.setItem("token", idTokenResult.token);
//       localStorage.setItem("role", "admin");
//       localStorage.setItem("userEmail", email);

//       navigate("/admin-dashboard");

//     } catch (error: any) {
//       alert("Admin Login Failed: " + error.message);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
//       <Card className="w-full max-w-md">
//         <CardHeader className="text-center">
//           <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
//             <Shield className="h-7 w-7 text-destructive" />
//           </div>
//           <CardTitle className="text-2xl font-serif">
//             Admin Login
//           </CardTitle>
//           <CardDescription>
//             Only authorized admins can access
//           </CardDescription>
//         </CardHeader>

//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="space-y-2">
//               <Label>Email</Label>
//               <Input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//             </div>

//             <div className="space-y-2">
//               <Label>Password</Label>
//               <div className="relative">
//                 <Input
//                   type={showPassword ? "text" : "password"}
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                 />
//                 <button
//                   type="button"
//                   className="absolute right-3 top-3"
//                   onClick={() => setShowPassword(!showPassword)}
//                 >
//                   {showPassword ? <EyeOff /> : <Eye />}
//                 </button>
//               </div>
//             </div>
            

//             <Button type="submit" className="w-full">
//               Sign In as Admin
//             </Button>
//           </form>

//           <div className="mt-4 text-center">
//             <Link
//               to="/student-login"
//               className="text-xs text-muted-foreground hover:text-primary"
//             >
//               Student? Login here
//             </Link>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default AdminLogin;






// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import {
//   signInWithEmailAndPassword,
//   signOut,
//   sendPasswordResetEmail,
// } from "firebase/auth";
// import { auth } from "../firebase";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import { Shield, Eye, EyeOff } from "lucide-react";

// const AdminLogin = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleForgotPassword = async () => {
//     if (!email) {
//       alert("Please enter your email first.");
//       return;
//     }

//     try {
//       await sendPasswordResetEmail(auth, email);
//       alert("Password reset email sent successfully!");
//     } catch (error: any) {
//       alert("Error: " + error.message);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     try {
//       const userCredential = await signInWithEmailAndPassword(
//         auth,
//         email,
//         password
//       );

//       const idTokenResult =
//         await userCredential.user.getIdTokenResult(true);

//       if (idTokenResult.claims.role !== "admin") {
//         alert("You are not authorized as Admin");
//         await signOut(auth);
//         return;
//       }

//       localStorage.setItem("token", idTokenResult.token);
//       localStorage.setItem("role", "admin");
//       localStorage.setItem("userEmail", email);

//       navigate("/admin-dashboard");

//     } catch (error: any) {
//       alert("Admin Login Failed: " + error.message);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
//       <Card className="w-full max-w-md">
//         <CardHeader className="text-center">
//           <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
//             <Shield className="h-7 w-7 text-destructive" />
//           </div>
//           <CardTitle className="text-2xl font-serif">
//             Admin Login
//           </CardTitle>
//           <CardDescription>
//             Only authorized admins can access
//           </CardDescription>
//         </CardHeader>

//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-4">

//             <div className="space-y-2">
//               <Label>Email</Label>
//               <Input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//             </div>

//             <div className="space-y-2">
//               <Label>Password</Label>
//               <div className="relative">
//                 <Input
//                   type={showPassword ? "text" : "password"}
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                 />
//                 <button
//                   type="button"
//                   className="absolute right-3 top-3"
//                   onClick={() => setShowPassword(!showPassword)}
//                 >
//                   {showPassword ? <EyeOff /> : <Eye />}
//                 </button>
//               </div>
//             </div>

//             {/* <div className="text-right text-sm">
//               <button
//                 type="button"
//                 onClick={handleForgotPassword}
//                 className="text-primary hover:underline"
//               >
//                 Forgot Password?
//               </button>
//             </div> */}
//             <Link
//               to="/forgot-password"
//               className="text-sm text-primary hover:underline">
//               Forgot Password?
//             </Link>

//             <Button type="submit" className="w-full">
//               Sign In as Admin
//             </Button>
//           </form>

//           <div className="mt-4 text-center">
//             <Link
//               to="/student-login"
//               className="text-xs text-muted-foreground hover:text-primary"
//             >
//               Student? Login here
//             </Link>
//           </div>

//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default AdminLogin;




import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Shield, Eye, EyeOff } from "lucide-react";

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const idTokenResult =
        await userCredential.user.getIdTokenResult(true);

      // ❌ Block if not admin
      if (idTokenResult.claims.role !== "admin") {
        alert("You are not authorized as Admin");
        await signOut(auth);
        return;
      }

      localStorage.setItem("token", idTokenResult.token);
      localStorage.setItem("role", "admin");
      localStorage.setItem("userEmail", email);

      navigate("/admin-dashboard");

    } catch (error: any) {
      alert("Admin Login Failed: " + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
            <Shield className="h-7 w-7 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-serif">
            Admin Login
          </CardTitle>
          <CardDescription>
            Only authorized admins can access
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            <div className="text-right text-sm">
              <Link
                to="/forgot-password"
                className="text-primary hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <Button type="submit" className="w-full">
              Sign In as Admin
            </Button>

          </form>

          <div className="mt-4 text-center">
            <Link
              to="/student-login"
              className="text-xs text-muted-foreground hover:text-primary"
            >
              Student? Login here
            </Link>
          </div>

        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;