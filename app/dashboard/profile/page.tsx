"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/dashboard/PageHeader"

interface PartnerFormData {
  name: string
  type: "accommodation" | "tour_operator"
  country: string
  region: string
  city: string
  address: string
  phone: string
  email: string
  website: string
}

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [hasExistingProfile, setHasExistingProfile] = useState(false)
  const [partnerId, setPartnerId] = useState<string | null>(null)
  const router = useRouter()

  const [formData, setFormData] = useState<PartnerFormData>({
    name: "",
    type: "accommodation",
    country: "",
    region: "",
    city: "",
    address: "",
    phone: "",
    email: "",
    website: "",
  })

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      // Set defaults from user metadata
      setFormData(prev => ({
        ...prev,
        name: user.user_metadata?.organization_name || "",
        type: user.user_metadata?.partner_type || "accommodation",
        email: user.email || "",
      }))

      // Check for existing partner profile
      const { data: membership } = await supabase
        .from("partner_memberships")
        .select("*, partners(*)")
        .eq("user_id", user.id)
        .single()

      if (membership?.partners) {
        const partner = membership.partners as PartnerFormData & { id: string }
        setHasExistingProfile(true)
        setPartnerId(membership.partner_id)
        setFormData({
          name: partner.name || "",
          type: partner.type || "accommodation",
          country: partner.country || "",
          region: partner.region || "",
          city: partner.city || "",
          address: partner.address || "",
          phone: partner.phone || "",
          email: partner.email || "",
          website: partner.website || "",
        })
      }

      setIsLoading(false)
    }

    loadProfile()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)
    setSuccess(false)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) throw new Error("Not authenticated")

      if (hasExistingProfile && partnerId) {
        // Update existing partner
        const { error: updateError } = await supabase
          .from("partners")
          .update({
            name: formData.name,
            type: formData.type,
            country: formData.country,
            region: formData.region,
            city: formData.city,
            address: formData.address,
            phone: formData.phone,
            email: formData.email,
            website: formData.website,
          })
          .eq("id", partnerId)

        if (updateError) throw updateError
      } else {
        // Create new partner and membership
        const { data: newPartner, error: partnerError } = await supabase
          .from("partners")
          .insert({
            name: formData.name,
            type: formData.type,
            country: formData.country,
            region: formData.region,
            city: formData.city,
            address: formData.address,
            phone: formData.phone,
            email: formData.email,
            website: formData.website,
          })
          .select()
          .single()

        if (partnerError) throw partnerError

        // Create membership linking user to partner
        const { error: membershipError } = await supabase
          .from("partner_memberships")
          .insert({
            partner_id: newPartner.id,
            user_id: user.id,
            role: "owner",
            is_primary_contact: true,
            accepted_at: new Date().toISOString(),
          })

        if (membershipError) throw membershipError

        setHasExistingProfile(true)
        setPartnerId(newPartner.id)
      }

      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl space-y-6">
      <PageHeader
        title="Partner Profile"
        subtitle={hasExistingProfile
          ? "Manage your organization details"
          : "Set up your organization profile to get started"}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-sm flex items-center justify-between">
            <span>Profile saved successfully!</span>
            <button onClick={() => setSuccess(false)} className="text-green-500 hover:text-green-700 ml-4 text-lg leading-none">&times;</button>
          </div>
        )}

        <div className="glass-card p-6 rounded-lg border border-border/50 space-y-4">
          <h2 className="font-semibold">Basic Information</h2>

          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Organization Name
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Grand Hotel Bangkok"
              required
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium mb-2">
              Organization Type
            </label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as PartnerFormData["type"] }))}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="accommodation">Accommodation Provider</option>
              <option value="tour_operator">Tour Operator</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="contact@hotel.com"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-2">
                Phone
              </label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="+66 2 123 4567"
              />
            </div>
          </div>

          <div>
            <label htmlFor="website" className="block text-sm font-medium mb-2">
              Website
            </label>
            <input
              id="website"
              type="url"
              value={formData.website}
              onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="https://www.hotel.com"
            />
          </div>
        </div>

        <div className="glass-card p-6 rounded-lg border border-border/50 space-y-4">
          <h2 className="font-semibold">Location</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="country" className="block text-sm font-medium mb-2">
                Country
              </label>
              <input
                id="country"
                type="text"
                value={formData.country}
                onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Thailand"
              />
            </div>
            <div>
              <label htmlFor="region" className="block text-sm font-medium mb-2">
                Region / Province
              </label>
              <input
                id="region"
                type="text"
                value={formData.region}
                onChange={(e) => setFormData(prev => ({ ...prev, region: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Bangkok"
              />
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium mb-2">
                City
              </label>
              <input
                id="city"
                type="text"
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Bangkok"
              />
            </div>
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium mb-2">
              Full Address
            </label>
            <textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[80px]"
              placeholder="123 Sukhumvit Road, Watthana District"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="btn-primary-gradient px-6 py-3 rounded-lg font-medium text-white transition-all duration-300 premium-hover disabled:opacity-50"
          >
            {isSaving ? "Saving..." : hasExistingProfile ? "Update Profile" : "Create Profile"}
          </button>
        </div>
      </form>
    </div>
  )
}
