// // // import { getAuth, EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
// // // import { useState, useEffect } from "react";
// // // import { useNavigate } from "react-router-dom";
// // // import { Button } from "@/components/ui/button";
// // // import { Input } from "@/components/ui/input";
// // // import { Label } from "@/components/ui/label";
// // // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // // import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// // // import { Badge } from "@/components/ui/badge";
// // // import Navbar from "@/components/Navbar";
// // // import { ArrowLeft, Lock } from "lucide-react";

// // // const Profile = () => {
// // //   const navigate = useNavigate();

// // //   const [name, setName] = useState("");
// // //   const [email, setEmail] = useState("");

// // //   const [currentPassword, setCurrentPassword] = useState("");
// // //   const [newPassword, setNewPassword] = useState("");
// // //   const [message, setMessage] = useState("");

// // //   useEffect(() => {
// // //     const storedName = localStorage.getItem("userName");
// // //     const storedEmail = localStorage.getItem("userEmail");

// // //     if (storedName) setName(storedName);
// // //     if (storedEmail) setEmail(storedEmail);
// // //   }, []);

// // //   const handleSaveProfile = () => {
// // //     localStorage.setItem("userName", name);
// // //     setMessage("Profile updated successfully!");
// // //   };

// // // const handleChangePassword = async () => {
// // //   try {
// // //     const auth = getAuth();
// // //     const user = auth.currentUser;

// // //     if (!user || !user.email) {
// // //       setMessage("❌ User not authenticated.");
// // //       return;
// // //     }

// // //     // 🔐 Create credential with current password
// // //     const credential = EmailAuthProvider.credential(
// // //       user.email,
// // //       currentPassword
// // //     );

// // //     // 🔥 Re-authenticate
// // //     await reauthenticateWithCredential(user, credential);

// // //     // 🔥 Update password
// // //     await updatePassword(user, newPassword);

// // //     setCurrentPassword("");
// // //     setNewPassword("");
// // //     setMessage("✅ Password updated successfully!");

// // //   } catch (error: any) {
// // //     setMessage("❌ " + error.message);
// // //   }
// // // };

// // //   const initials = name
// // //     ? name.split(" ").map((n) => n[0]).join("").toUpperCase()
// // //     : "U";

// // //   return (
// // //     <div className="min-h-screen bg-background">
// // //       <Navbar />

// // //       <div className="container mx-auto px-4 py-8 max-w-3xl">
// // //         <Button variant="ghost" size="sm" className="mb-4" onClick={() => navigate(-1)}>
// // //           <ArrowLeft className="h-4 w-4 mr-1" /> Back
// // //         </Button>

// // //         {/* Profile Info */}
// // //         <Card className="mb-6">
// // //           <CardHeader>
// // //             <CardTitle>My Profile</CardTitle>
// // //           </CardHeader>

// // //           <CardContent className="space-y-6">
// // //             <div className="flex items-center gap-4">
// // //               <Avatar className="h-20 w-20">
// // //                 <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
// // //                   {initials}
// // //                 </AvatarFallback>
// // //               </Avatar>

// // //               <div>
// // //                 <h2 className="text-xl font-semibold">{name}</h2>
// // //                 <p className="text-sm text-muted-foreground">{email}</p>
// // //                 <Badge className="mt-1">Student</Badge>
// // //               </div>
// // //             </div>

// // //             <div className="space-y-2">
// // //               <Label>Full Name</Label>
// // //               <Input value={name} onChange={(e) => setName(e.target.value)} />
// // //             </div>

// // //             <Button className="w-fit" onClick={handleSaveProfile}>
// // //               Save Changes
// // //             </Button>
// // //           </CardContent>
// // //         </Card>

// // //         {/* Change Password */}
// // //         <Card>
// // //           <CardHeader>
// // //             <CardTitle className="flex items-center gap-2">
// // //               <Lock className="h-5 w-5 text-primary" /> Change Password
// // //             </CardTitle>
// // //           </CardHeader>

// // //           <CardContent className="space-y-4">
// // //             <div className="space-y-2">
// // //               <Label>Current Password</Label>
// // //               <Input
// // //                 type="password"
// // //                 value={currentPassword}
// // //                 onChange={(e) => setCurrentPassword(e.target.value)}
// // //               />
// // //             </div>

// // //             <div className="space-y-2">
// // //               <Label>New Password</Label>
// // //               <Input
// // //                 type="password"
// // //                 value={newPassword}
// // //                 onChange={(e) => setNewPassword(e.target.value)}
// // //               />
// // //             </div>

// // //             <Button variant="outline" onClick={handleChangePassword}>
// // //               Update Password
// // //             </Button>

// // //             {message && <p className="text-sm text-muted-foreground">{message}</p>}
// // //           </CardContent>
// // //         </Card>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default Profile;




// // import { useState, useEffect } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { 
// //   EmailAuthProvider, 
// //   reauthenticateWithCredential, 
// //   updatePassword,
// //   updateProfile
// // } from "firebase/auth";
// // import { auth } from "../firebase";

// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";
// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// // import { Badge } from "@/components/ui/badge";
// // import Navbar from "@/components/Navbar";
// // import { ArrowLeft, Lock } from "lucide-react";

// // const Profile = () => {
// //   const navigate = useNavigate();

// //   const [name, setName] = useState("");
// //   const [email, setEmail] = useState("");
// //   const [currentPassword, setCurrentPassword] = useState("");
// //   const [newPassword, setNewPassword] = useState("");
// //   const [message, setMessage] = useState("");

// //   useEffect(() => {
// //     const user = auth.currentUser;

// //     if (user) {
// //       setName(user.displayName || "");
// //       setEmail(user.email || "");
// //     }
// //   }, []);

// //   // 🔥 Save profile name
// //   const handleSaveProfile = async () => {
// //   try {
// //     const user = auth.currentUser;

// //     if (!user) {
// //       setMessage("❌ User not authenticated.");
// //       return;
// //     }

// //     await updateProfile(user, {
// //       displayName: name,
// //     });

// //     localStorage.setItem("userName", name);
// //     setMessage(" Profile updated successfully!");

// //   } catch (error: any) {
// //     setMessage("❌ " + error.message);
    
// //   }
// // };
// //   // 🔐 Change password properly using Firebase
// //   const [messageType, setMessageType] = useState<"success" | "error" | "">("");

// // const handleChangePassword = async () => {
// //   try {
// //     const user = auth.currentUser;

// //     if (!user || !user.email) {
// //       setMessage("User not authenticated.");
// //       setMessageType("error");
// //       return;
// //     }

// //     if (!currentPassword) {
// //       setMessage("Please enter your current password.");
// //       setMessageType("error");
// //       return;
// //     }

// //     if (!newPassword || newPassword.length < 6) {
// //       setMessage("New password must be at least 6 characters.");
// //       setMessageType("error");
// //       return;
// //     }

// //     const credential = EmailAuthProvider.credential(
// //       user.email,
// //       currentPassword
// //     );

// //     await reauthenticateWithCredential(user, credential);
// //     await updatePassword(user, newPassword);

// //     // ✅ Clear fields after success
// //     setCurrentPassword("");
// //     setNewPassword("");

// //     setMessage("Password updated successfully!");
// //     setMessageType("success");

// //   } catch (error: any) {

// //     if (error.code === "auth/wrong-password") {
// //       setMessage("Invalid password please try again");
// //     } else {
// //       setMessage(error.message);
// //     }

// //     setMessageType("error");
// //   }
// // };

// //   const initials = name
// //     ? name.split(" ").map((n) => n[0]).join("").toUpperCase()
// //     : "U";

// //   return (
// //     <div className="min-h-screen bg-background">
// //       <Navbar />

// //       <div className="container mx-auto px-4 py-8 max-w-3xl">
// //         <Button
// //           variant="ghost"
// //           size="sm"
// //           className="mb-4"
// //           onClick={() => navigate(-1)}
// //         >
// //           <ArrowLeft className="h-4 w-4 mr-1" /> Back
// //         </Button>

// //         {/* Profile Info */}
// //         <Card className="mb-6">
// //           <CardHeader>
// //             <CardTitle>My Profile</CardTitle>
// //           </CardHeader>

// //           <CardContent className="space-y-6">
// //             <div className="flex items-center gap-4">
// //               <Avatar className="h-20 w-20">
// //                 <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
// //                   {initials}
// //                 </AvatarFallback>
// //               </Avatar>

// //               <div>
// //                 <h2 className="text-xl font-semibold">{name}</h2>
// //                 <p className="text-sm text-muted-foreground">{email}</p>
// //                 <Badge className="mt-1">Student</Badge>
// //               </div>
// //             </div>

// //             <div className="space-y-2">
// //               <Label>Full Name</Label>
// //               <Input
// //                 value={name}
// //                 onChange={(e) => setName(e.target.value)}
// //               />
// //             </div>

// //             <Button className="w-fit" onClick={handleSaveProfile}>
// //               Save Changes
// //             </Button>
// //           </CardContent>
// //         </Card>

// //         {/* Change Password */}
// //         <Card>
// //           <CardHeader>
// //             <CardTitle className="flex items-center gap-2">
// //               <Lock className="h-5 w-5 text-primary" />
// //               Change Password
// //             </CardTitle>
// //           </CardHeader>

// //           <CardContent className="space-y-4">
// //             <div className="space-y-2">
// //               <Label>Current Password</Label>
// //               <Input
// //                 type="password"
// //                 value={currentPassword}
// //                 onChange={(e) => setCurrentPassword(e.target.value)}
// //               />
// //             </div>

// //             <div className="space-y-2">
// //               <Label>New Password</Label>
// //               <Input
// //                 type="password"
// //                 value={newPassword}
// //                 onChange={(e) => setNewPassword(e.target.value)}
// //               />
// //             </div>

// //             <Button variant="outline" onClick={handleChangePassword}>
// //               Update Password
// //             </Button>

// //             {message && (
// //               <p className="text-sm text-muted-foreground">{message}</p>
// //             )}
// //           </CardContent>
// //         </Card>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Profile;




// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   EmailAuthProvider,
//   reauthenticateWithCredential,
//   updatePassword,
//   updateProfile,
// } from "firebase/auth";
// import { auth } from "../firebase";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import Navbar from "@/components/Navbar";
// import { ArrowLeft, Lock } from "lucide-react";

// const Profile = () => {
//   const navigate = useNavigate();

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [currentPassword, setCurrentPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [message, setMessage] = useState("");
//   const [messageType, setMessageType] = useState<"success" | "error" | "">("");

//   useEffect(() => {
//     const user = auth.currentUser;
//     if (user) {
//       setName(user.displayName || "");
//       setEmail(user.email || "");
//     }
//   }, []);

//   // ✅ Update Profile Name
//   const handleSaveProfile = async () => {
//     try {
//       const user = auth.currentUser;
//       if (!user) {
//         setMessage("User not authenticated.");
//         setMessageType("error");
//         return;
//       }

//       await updateProfile(user, {
//         displayName: name,
//       });

//       setMessage("Profile updated successfully!");
//       setMessageType("success");
//     } catch (error: any) {
//       setMessage(error.message);
//       setMessageType("error");
//     }
//   };

//   // 🔐 Change Password
//   const handleChangePassword = async () => {
//     try {
//       const user = auth.currentUser;

//       if (!user || !user.email) {
//         setMessage("User not authenticated.");
//         setMessageType("error");
//         return;
//       }

//       if (!currentPassword) {
//         setMessage("Please enter your current password.");
//         setMessageType("error");
//         return;
//       }

//       if (!newPassword || newPassword.length < 6) {
//         setMessage("New password must be at least 6 characters.");
//         setMessageType("error");
//         return;
//       }

//       const credential = EmailAuthProvider.credential(
//         user.email,
//         currentPassword
//       );

//       await reauthenticateWithCredential(user, credential);
//       await updatePassword(user, newPassword);

//       // ✅ Clear fields after success
//       setCurrentPassword("");
//       setNewPassword("");

//       setMessage("Password updated successfully!");
//       setMessageType("success");

//     } catch (error: any) {
//       if (error.code === "auth/wrong-password") {
//         setMessage("Invalid password please try again");
//       } else {
//         setMessage(error.message);
//       }
//       setMessageType("error");
//     }
//   };

//   const initials = name
//     ? name.split(" ").map((n) => n[0]).join("").toUpperCase()
//     : "U";

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />

//       <div className="container mx-auto px-4 py-8 max-w-3xl">
//         <Button
//           variant="ghost"
//           size="sm"
//           className="mb-4"
//           onClick={() => navigate(-1)}
//         >
//           <ArrowLeft className="h-4 w-4 mr-1" /> Back
//         </Button>

//         {/* Profile Card */}
//         <Card className="mb-6">
//           <CardHeader>
//             <CardTitle>My Profile</CardTitle>
//           </CardHeader>

//           <CardContent className="space-y-6">
//             <div className="flex items-center gap-4">
//               <Avatar className="h-20 w-20">
//                 <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
//                   {initials}
//                 </AvatarFallback>
//               </Avatar>

//               <div>
//                 <h2 className="text-xl font-semibold">{name}</h2>
//                 <p className="text-sm text-muted-foreground">{email}</p>
//                 <Badge className="mt-1">Student</Badge>
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label>Full Name</Label>
//               <Input
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//               />
//             </div>

//             <Button className="w-fit" onClick={handleSaveProfile}>
//               Save Changes
//             </Button>
//           </CardContent>
//         </Card>

//         {/* Change Password Card */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Lock className="h-5 w-5 text-primary" />
//               Change Password
//             </CardTitle>
//           </CardHeader>

//           <CardContent className="space-y-4">
//             <div className="space-y-2">
//               <Label>Current Password</Label>
//               <Input
//                 type="password"
//                 value={currentPassword}
//                 onChange={(e) => setCurrentPassword(e.target.value)}
//               />
//             </div>

//             <div className="space-y-2">
//               <Label>New Password</Label>
//               <Input
//                 type="password"
//                 value={newPassword}
//                 onChange={(e) => setNewPassword(e.target.value)}
//               />
//             </div>

//             <Button variant="outline" onClick={handleChangePassword}>
//               Update Password
//             </Button>

//             {/* ✅ Colored Message */}
//             {message && (
//               <p
//                 className={`text-sm font-medium ${
//                   messageType === "success"
//                     ? "text-green-600"
//                     : "text-red-500"
//                 }`}
//               >
//                 {message}
//               </p>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default Profile;





import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import { ArrowLeft, Lock } from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<
    "success" | "error" | ""
  >("");

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setName(user.displayName || "");
      setEmail(user.email || "");
    }
  }, []);

  // ✅ Auto-hide message
  const showMessage = (text: string, type: "success" | "error") => {
    setMessage(text);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  };

  // ✅ Update Profile Name
  const handleSaveProfile = async () => {
    try {
      const user = auth.currentUser;

      if (!user) {
        showMessage("User not authenticated.", "error");
        return;
      }

      await updateProfile(user, {
        displayName: name,
      });

      await user.reload();

      const updatedUser = auth.currentUser;
      setName(updatedUser?.displayName || "");

      showMessage("Profile updated successfully!", "success");

    } catch (error: any) {
      showMessage(error.message, "error");
    }
  };

  // 🔐 Change Password
  const handleChangePassword = async () => {
    try {
      const user = auth.currentUser;

      if (!user || !user.email) {
        showMessage("User not authenticated.", "error");
        return;
      }

      if (!currentPassword) {
        showMessage("Please enter your current password.", "error");
        return;
      }

      if (!newPassword || newPassword.length < 6) {
        showMessage(
          "New password must be at least 6 characters.",
          "error"
        );
        return;
      }

      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );

      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);

      setCurrentPassword("");
      setNewPassword("");

      showMessage("Password updated successfully!", "success");

    } catch (error: any) {
      if (error.code === "auth/wrong-password") {
        showMessage("Invalid password please try again", "error");
      } else {
        showMessage(error.message, "error");
      }
    }
  };

  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Button
          variant="ghost"
          size="sm"
          className="mb-4"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>

        {/* Profile Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>My Profile</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div>
                <h2 className="text-xl font-semibold">{name}</h2>
                <p className="text-sm text-muted-foreground">{email}</p>
                <Badge className="mt-1">Student</Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <Button className="w-fit" onClick={handleSaveProfile}>
              Save Changes
            </Button>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Change Password
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Current Password</Label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) =>
                  setCurrentPassword(e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label>New Password</Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(e.target.value)
                }
              />
            </div>

            <Button
              variant="outline"
              onClick={handleChangePassword}
            >
              Update Password
            </Button>

            {message && (
              <p
                className={`text-sm font-medium ${
                  messageType === "success"
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {message}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;