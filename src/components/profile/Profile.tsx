"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { User, UserUpdateInput } from "@/types/user"
import { userService } from "@/services/userService"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Loader2,
  Camera,
  Save,
  Trash2,
  ChevronLeft,
  UserIcon,
  Mail,
  Phone,
  MapPin,
  Edit3,
  Shield,
  Bell,
  Globe,
  Smartphone,
  Check,
  X,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { useNavigate } from "react-router-dom"

export function Profile() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<UserUpdateInput>({})
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    marketing: true,
  })
  const navigate = useNavigate()

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      const userData = await userService.getCurrentUser()
      setUser(userData)
      setFormData(userData)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load user data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return

    try {
      setSaving(true)
      const result = await userService.uploadAvatar(e.target.files[0])
      setUser((prev) => (prev ? { ...prev, avatar_url: result.avatar_url } : null))
      toast({
        title: "Success",
        description: "Profile picture updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload profile picture",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSaving(true)
      const updatedUser = await userService.updateProfile(formData)
      setUser(updatedUser)
      toast({
        title: "Success",
        description: "Profile updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return
    }

    try {
      await userService.deleteAccount()
      window.location.href = "/login"
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete account",
        variant: "destructive",
      })
    }
  }

  const toggleNotification = (type: "email" | "push" | "marketing") => {
    setNotifications((prev) => ({
      ...prev,
      [type]: !prev[type],
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600" />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Back Button */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Button>
        </div>

        {/* Header Section */}
        <div className="relative">
          <Card className="overflow-hidden border-0 shadow-lg bg-white dark:bg-gray-800">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative group">
                  <Avatar className="h-32 w-32 border-4 border-emerald-100 dark:border-emerald-900/30 shadow-lg transition-transform duration-300 group-hover:scale-105">
                    <AvatarImage src={user?.avatar_url || "/placeholder.svg"} alt={user?.name} />
                    <AvatarFallback className="text-2xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                      {user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <label
                    htmlFor="avatar-upload"
                    className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full bg-emerald-600 text-white shadow-lg hover:bg-emerald-700 transition-all duration-200 cursor-pointer flex items-center justify-center"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                      disabled={saving}
                    />
                  </label>
                </div>

                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">{user?.name || "User Profile"}</h1>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">{user?.bio || "No bio available"}</p>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    <Badge variant="secondary" className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                      <Mail className="h-3 w-3 mr-1" />
                      {user?.email}
                    </Badge>
                    {user?.location && (
                      <Badge variant="secondary" className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                        <MapPin className="h-3 w-3 mr-1" />
                        {user.location}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Personal Information */}
            <Card className="shadow-lg border-0 bg-white dark:bg-gray-800 transition-all duration-300 hover:shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <UserIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  Personal Information
                </CardTitle>
                <CardDescription>Manage your personal details and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                      Full Name
                    </Label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        id="name"
                        name="name"
                        value={formData.name || ""}
                        onChange={handleInputChange}
                        disabled={saving}
                        className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-emerald-500"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email || ""}
                        onChange={handleInputChange}
                        disabled={saving}
                        className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-emerald-500"
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                      Phone Number
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone || ""}
                        onChange={handleInputChange}
                        disabled={saving}
                        className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-emerald-500"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                      Location
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        id="location"
                        name="location"
                        value={formData.location || ""}
                        onChange={handleInputChange}
                        disabled={saving}
                        className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-emerald-500"
                        placeholder="Enter your location"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bio & Notifications */}
            <div className="space-y-6">
              {/* Bio Section */}
              <Card className="shadow-lg border-0 bg-white dark:bg-gray-800 transition-all duration-300 hover:shadow-xl">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Edit3 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    About Me
                  </CardTitle>
                  <CardDescription>Tell others about yourself</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio || ""}
                    onChange={handleInputChange}
                    disabled={saving}
                    placeholder="Write something about yourself..."
                    className="min-h-[120px] transition-all duration-200 focus:ring-2 focus:ring-emerald-500"
                    rows={4}
                  />
                </CardContent>
              </Card>

              {/* Notification Preferences */}
              <Card className="shadow-lg border-0 bg-white dark:bg-gray-800 transition-all duration-300 hover:shadow-xl">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Bell className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    Notifications
                  </CardTitle>
                  <CardDescription>Manage your notification preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-gray-500">Receive updates via email</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant={notifications.email ? "default" : "outline"}
                      size="sm"
                      className={`rounded-full w-16 ${notifications.email ? "bg-emerald-600 hover:bg-emerald-700" : "bg-gray-100 hover:bg-gray-200"}`}
                      onClick={() => toggleNotification("email")}
                    >
                      {notifications.email ? (
                        <Check className="h-4 w-4 text-white" />
                      ) : (
                        <X className="h-4 w-4 text-gray-500" />
                      )}
                    </Button>
                  </div>

                  <div className="border-t border-gray-200 my-4"></div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="font-medium">Push Notifications</p>
                        <p className="text-sm text-gray-500">Receive push notifications</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant={notifications.push ? "default" : "outline"}
                      size="sm"
                      className={`rounded-full w-16 ${notifications.push ? "bg-emerald-600 hover:bg-emerald-700" : "bg-gray-100 hover:bg-gray-200"}`}
                      onClick={() => toggleNotification("push")}
                    >
                      {notifications.push ? (
                        <Check className="h-4 w-4 text-white" />
                      ) : (
                        <X className="h-4 w-4 text-gray-500" />
                      )}
                    </Button>
                  </div>

                  <div className="border-t border-gray-200 my-4"></div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Globe className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="font-medium">Marketing Updates</p>
                        <p className="text-sm text-gray-500">Receive marketing communications</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant={notifications.marketing ? "default" : "outline"}
                      size="sm"
                      className={`rounded-full w-16 ${notifications.marketing ? "bg-emerald-600 hover:bg-emerald-700" : "bg-gray-100 hover:bg-gray-200"}`}
                      onClick={() => toggleNotification("marketing")}
                    >
                      {notifications.marketing ? (
                        <Check className="h-4 w-4 text-white" />
                      ) : (
                        <X className="h-4 w-4 text-gray-500" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Action Buttons Section */}
          <Card className="shadow-lg border-0 bg-white dark:bg-gray-800 transition-all duration-300 hover:shadow-xl mt-6">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Shield className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                Account Actions
              </CardTitle>
              <CardDescription>Save your changes or manage your account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg transition-all duration-200 flex-1 sm:flex-none"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  disabled={saving}
                  className="transition-all duration-200 hover:bg-red-600 flex-1 sm:flex-none"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  )
}
