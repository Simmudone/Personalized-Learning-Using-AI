
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAuth,
  updateProfile,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";

import AdminNavbar from "../components/AdminNavbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Lock } from "lucide-react";

const AdminProfile = () => {
  const navigate = useNavigate();
  const auth = getAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // ✅ Load Firebase user info
  // useEffect(() => {
  //   const user = auth.currentUser;

  //   if (user) {
  //     setName(user.displayName || "");
  //     setEmail(user.email || "");
  //   }
  // }, []);
  useEffect(() => {
  const loadUser = async () => {
    const user = auth.currentUser;

    if (user) {
      await user.reload(); // 🔥 FORCE refresh from Firebase

      setName(user.displayName || "");
      setEmail(user.email || "");
    }
  };

  loadUser();
}, []);

  // ✅ Update Display Name
  const handleSaveProfile = async () => {
    try {
      const user = auth.currentUser;

      if (!user) {
        setMessage("User not authenticated.");
        setIsSuccess(false);
        return;
      }

      await updateProfile(user, { displayName: name });

      setMessage("Profile updated successfully!");
      setIsSuccess(true);
    } catch (error: any) {
      setMessage(error.message);
      setIsSuccess(false);
    }
  };

  // ✅ Change Password
  const handleChangePassword = async () => {
    try {
      const user = auth.currentUser;

      if (!user || !user.email) {
        setMessage("User not authenticated.");
        setIsSuccess(false);
        return;
      }

      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );

      await reauthenticateWithCredential(user, credential);

      await updatePassword(user, newPassword);

      setMessage("Password updated successfully!");
      setIsSuccess(true);

      // ✅ Clear fields after success
      setCurrentPassword("");
      setNewPassword("");
    } catch (error: any) {
      setMessage("Invalid password. Please try again.");
      setIsSuccess(false);
    }
  };

  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "A";

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar />

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* 🔙 Back Button */}
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate("/admin-dashboard")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* 👤 Profile Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Admin Profile</CardTitle>
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
                <Badge className="mt-1">Admin</Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <Button onClick={handleSaveProfile}>
              Save Changes
            </Button>
          </CardContent>
        </Card>

        {/* 🔐 Change Password */}
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
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>New Password</Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <Button variant="outline" onClick={handleChangePassword}>
              Update Password
            </Button>

            {/* ✅ Status Message */}
            {message && (
              <p
                className={`text-sm font-medium ${
                  isSuccess ? "text-green-600" : "text-red-600"
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

export default AdminProfile;