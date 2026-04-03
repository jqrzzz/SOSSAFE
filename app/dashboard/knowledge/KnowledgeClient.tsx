"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type {
  KnowledgeCategory,
  KnowledgeImportance,
  CategoryDefinition,
} from "@/lib/knowledge-categories"
import { IMPORTANCE_LEVELS } from "@/lib/knowledge-categories"

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface KnowledgeEntry {
  id: string
  partner_id: string
  submitted_by: string
  category: KnowledgeCategory
  title: string
  content: string
  importance: KnowledgeImportance
  location_name: string | null
  location_address: string | null
  phone: string | null
  operating_hours: string | null
  estimated_response_time: string | null
  verified: boolean
  verified_by: string | null
  verified_at: string | null
  created_at: string
  updated_at: string
}

interface Props {
  entries: KnowledgeEntry[]
  categories: CategoryDefinition[]
  partnerId: string
  userId: string
  partnerName: string
  canManage: boolean
  userMap: Record<string, string>
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export function KnowledgeClient({
  entries,
  categories,
  partnerId,
  userId,
  partnerName,
  canManage,
  userMap,
}: Props) {
  const router = useRouter()
  const [activeCategory, setActiveCategory] = useState<KnowledgeCategory | "all">("all")
  const [showForm, setShowForm] = useState(false)
  const [editingEntry, setEditingEntry] = useState<KnowledgeEntry | null>(null)

  const filtered =
    activeCategory === "all"
      ? entries
      : entries.filter((e) => e.category === activeCategory)

  const verifiedCount = entries.filter((e) => e.verified).length
  const categoryBreakdown = categories.map((c) => ({
    ...c,
    count: entries.filter((e) => e.category === c.id).length,
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Local Knowledge</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Share what you know about your area — this intel helps SOSA respond
            smarter during emergencies.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingEntry(null)
            setShowForm(true)
          }}
          className="btn-primary-gradient px-4 py-2 rounded-lg text-sm font-medium text-white flex-shrink-0 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Entry
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="glass-card p-4 rounded-lg border border-border/50">
          <p className="text-xs text-muted-foreground">Total Entries</p>
          <p className="text-2xl font-bold mt-1">{entries.length}</p>
        </div>
        <div className="glass-card p-4 rounded-lg border border-border/50">
          <p className="text-xs text-muted-foreground">Verified</p>
          <p className="text-2xl font-bold mt-1 text-green-500">{verifiedCount}</p>
        </div>
        <div className="glass-card p-4 rounded-lg border border-border/50">
          <p className="text-xs text-muted-foreground">Unverified</p>
          <p className="text-2xl font-bold mt-1 text-yellow-500">
            {entries.length - verifiedCount}
          </p>
        </div>
        <div className="glass-card p-4 rounded-lg border border-border/50">
          <p className="text-xs text-muted-foreground">Categories Used</p>
          <p className="text-2xl font-bold mt-1">
            {categoryBreakdown.filter((c) => c.count > 0).length}/{categories.length}
          </p>
        </div>
      </div>

      {/* Category filter pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory("all")}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            activeCategory === "all"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          All ({entries.length})
        </button>
        {categoryBreakdown.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${
              activeCategory === cat.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={cat.iconPath} />
            </svg>
            {cat.label} ({cat.count})
          </button>
        ))}
      </div>

      {/* Entry list or empty state */}
      {filtered.length === 0 ? (
        <EmptyState
          activeCategory={activeCategory}
          categories={categories}
          onAdd={() => {
            setEditingEntry(null)
            setShowForm(true)
          }}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((entry) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              category={categories.find((c) => c.id === entry.category)!}
              userMap={userMap}
              userId={userId}
              canManage={canManage}
              onEdit={() => {
                setEditingEntry(entry)
                setShowForm(true)
              }}
              onVerify={async () => {
                const supabase = createClient()
                await supabase
                  .from("partner_local_knowledge")
                  .update({
                    verified: !entry.verified,
                    verified_by: entry.verified ? null : userId,
                    verified_at: entry.verified ? null : new Date().toISOString(),
                  })
                  .eq("id", entry.id)
                router.refresh()
              }}
              onDelete={async () => {
                if (!confirm("Delete this knowledge entry?")) return
                const supabase = createClient()
                await supabase
                  .from("partner_local_knowledge")
                  .delete()
                  .eq("id", entry.id)
                router.refresh()
              }}
            />
          ))}
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showForm && (
        <KnowledgeForm
          categories={categories}
          partnerId={partnerId}
          userId={userId}
          entry={editingEntry}
          onClose={() => {
            setShowForm(false)
            setEditingEntry(null)
          }}
          onSaved={() => {
            setShowForm(false)
            setEditingEntry(null)
            router.refresh()
          }}
        />
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Entry Card                                                         */
/* ------------------------------------------------------------------ */

function EntryCard({
  entry,
  category,
  userMap,
  userId,
  canManage,
  onEdit,
  onVerify,
  onDelete,
}: {
  entry: KnowledgeEntry
  category: CategoryDefinition
  userMap: Record<string, string>
  userId: string
  canManage: boolean
  onEdit: () => void
  onVerify: () => void
  onDelete: () => void
}) {
  const isOwn = entry.submitted_by === userId
  const importance = IMPORTANCE_LEVELS.find((i) => i.value === entry.importance)
  const submittedBy = userMap[entry.submitted_by] || entry.submitted_by.slice(0, 8)

  return (
    <div className="glass-card p-5 rounded-lg border border-border/50">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-4.5 h-4.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={category.iconPath} />
            </svg>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-sm">{entry.title}</h3>
              {entry.verified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Verified
                </span>
              )}
              {entry.importance !== "normal" && (
                <span className={`text-xs font-medium ${importance?.color}`}>
                  {importance?.label}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">
              {entry.content}
            </p>

            {/* Structured fields */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
              {entry.location_name && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {entry.location_name}
                </span>
              )}
              {entry.phone && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {entry.phone}
                </span>
              )}
              {entry.operating_hours && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {entry.operating_hours}
                </span>
              )}
              {entry.estimated_response_time && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  ~{entry.estimated_response_time}
                </span>
              )}
            </div>

            {/* Meta */}
            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
              <span>{submittedBy}</span>
              <span>
                {new Date(entry.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="text-xs">{category.label}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        {(isOwn || canManage) && (
          <div className="flex items-center gap-1 flex-shrink-0">
            {canManage && (
              <button
                onClick={onVerify}
                title={entry.verified ? "Unverify" : "Mark as verified"}
                className={`p-1.5 rounded-lg transition-colors ${
                  entry.verified
                    ? "text-green-500 hover:bg-green-100 dark:hover:bg-green-900/30"
                    : "text-muted-foreground hover:bg-muted/50"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            )}
            <button
              onClick={onEdit}
              title="Edit"
              className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted/50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            {canManage && (
              <button
                onClick={onDelete}
                title="Delete"
                className="p-1.5 rounded-lg text-muted-foreground hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Empty State                                                        */
/* ------------------------------------------------------------------ */

function EmptyState({
  activeCategory,
  categories,
  onAdd,
}: {
  activeCategory: KnowledgeCategory | "all"
  categories: CategoryDefinition[]
  onAdd: () => void
}) {
  const cat = activeCategory !== "all" ? categories.find((c) => c.id === activeCategory) : null

  return (
    <div className="glass-card p-8 rounded-lg border border-border/50 text-center">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
        <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={cat?.iconPath ?? "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"}
          />
        </svg>
      </div>
      <h3 className="font-semibold mb-1">
        {cat ? `No ${cat.label.toLowerCase()} entries yet` : "No local knowledge yet"}
      </h3>
      <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
        {cat
          ? cat.prompt
          : "Your team's local knowledge makes SOSA smarter. Share what you know about nearby medical facilities, transport, hazards, and emergency contacts."}
      </p>

      {/* Example entries */}
      {cat && cat.examples.length > 0 && (
        <div className="text-left max-w-lg mx-auto mb-6 space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Example entries:</p>
          {cat.examples.map((ex, i) => (
            <div key={i} className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3 italic">
              {ex}
            </div>
          ))}
        </div>
      )}

      <button
        onClick={onAdd}
        className="btn-primary-gradient px-4 py-2 rounded-lg text-sm font-medium text-white inline-flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add First Entry
      </button>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Add / Edit Form Modal                                              */
/* ------------------------------------------------------------------ */

function KnowledgeForm({
  categories,
  partnerId,
  userId,
  entry,
  onClose,
  onSaved,
}: {
  categories: CategoryDefinition[]
  partnerId: string
  userId: string
  entry: KnowledgeEntry | null
  onClose: () => void
  onSaved: () => void
}) {
  const isEdit = !!entry
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [category, setCategory] = useState<KnowledgeCategory>(entry?.category ?? "medical_facility")
  const [title, setTitle] = useState(entry?.title ?? "")
  const [content, setContent] = useState(entry?.content ?? "")
  const [importance, setImportance] = useState<KnowledgeImportance>(entry?.importance ?? "normal")
  const [locationName, setLocationName] = useState(entry?.location_name ?? "")
  const [locationAddress, setLocationAddress] = useState(entry?.location_address ?? "")
  const [phone, setPhone] = useState(entry?.phone ?? "")
  const [operatingHours, setOperatingHours] = useState(entry?.operating_hours ?? "")
  const [responseTime, setResponseTime] = useState(entry?.estimated_response_time ?? "")

  const activeCat = categories.find((c) => c.id === category)!

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      setError("Title and description are required.")
      return
    }

    setSaving(true)
    setError(null)

    const supabase = createClient()
    const payload = {
      partner_id: partnerId,
      submitted_by: userId,
      category,
      title: title.trim(),
      content: content.trim(),
      importance,
      location_name: locationName.trim() || null,
      location_address: locationAddress.trim() || null,
      phone: phone.trim() || null,
      operating_hours: operatingHours.trim() || null,
      estimated_response_time: responseTime.trim() || null,
    }

    const result = isEdit
      ? await supabase
          .from("partner_local_knowledge")
          .update(payload)
          .eq("id", entry.id)
      : await supabase
          .from("partner_local_knowledge")
          .insert(payload)

    if (result.error) {
      setError(result.error.message)
      setSaving(false)
      return
    }

    onSaved()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="glass-card w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl border border-border/50 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">
            {isEdit ? "Edit Entry" : "Add Local Knowledge"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted/50 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`p-2.5 rounded-lg border text-left transition-all text-xs ${
                    category === cat.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={cat.iconPath} />
                    </svg>
                    <span className="font-medium truncate">{cat.label}</span>
                  </div>
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">{activeCat.prompt}</p>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1.5">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="premium-input w-full"
              placeholder={
                category === "medical_facility"
                  ? "e.g., Bangkok Hospital Phuket"
                  : category === "hazard"
                  ? "e.g., Riptides at north beach"
                  : category === "emergency_contact"
                  ? "e.g., Tourist Police Phuket"
                  : "e.g., Brief descriptive title"
              }
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium mb-1.5">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="premium-input w-full min-h-[100px]"
              placeholder="Share the details — real travel times, quality notes, what to watch out for, anything a first responder or guest should know."
            />
          </div>

          {/* Importance */}
          <div>
            <label className="block text-sm font-medium mb-1.5">Importance</label>
            <div className="flex gap-2">
              {IMPORTANCE_LEVELS.map((level) => (
                <button
                  key={level.value}
                  type="button"
                  onClick={() => setImportance(level.value)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                    importance === level.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>

          {/* Conditional fields based on category */}
          {activeCat.showLocationFields && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="locationName" className="block text-sm font-medium mb-1.5">
                  Place Name
                </label>
                <input
                  id="locationName"
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="premium-input w-full"
                  placeholder="e.g., Vachira Hospital"
                />
              </div>
              <div>
                <label htmlFor="locationAddress" className="block text-sm font-medium mb-1.5">
                  Address
                </label>
                <input
                  id="locationAddress"
                  type="text"
                  value={locationAddress}
                  onChange={(e) => setLocationAddress(e.target.value)}
                  className="premium-input w-full"
                  placeholder="Street / area"
                />
              </div>
            </div>
          )}

          {activeCat.showContactFields && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-1.5">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="premium-input w-full"
                  placeholder="+66 76 123 4567"
                />
              </div>
              <div>
                <label htmlFor="hours" className="block text-sm font-medium mb-1.5">
                  Operating Hours
                </label>
                <input
                  id="hours"
                  type="text"
                  value={operatingHours}
                  onChange={(e) => setOperatingHours(e.target.value)}
                  className="premium-input w-full"
                  placeholder="e.g., 24/7 or 8am-6pm"
                />
              </div>
            </div>
          )}

          {activeCat.showResponseTime && (
            <div>
              <label htmlFor="responseTime" className="block text-sm font-medium mb-1.5">
                Estimated Response / Travel Time
              </label>
              <input
                id="responseTime"
                type="text"
                value={responseTime}
                onChange={(e) => setResponseTime(e.target.value)}
                className="premium-input w-full"
                placeholder="e.g., 15-20 min by car, 40 min in traffic"
              />
            </div>
          )}

          {/* Example inspiration */}
          {activeCat.examples.length > 0 && (
            <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
              <p className="text-xs font-medium text-muted-foreground mb-1.5">Example:</p>
              <p className="text-xs text-muted-foreground italic">{activeCat.examples[0]}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-border">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted/50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || !title.trim() || !content.trim()}
            className="btn-primary-gradient px-5 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50"
          >
            {saving ? "Saving..." : isEdit ? "Update Entry" : "Add Entry"}
          </button>
        </div>
      </div>
    </div>
  )
}
