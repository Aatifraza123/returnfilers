import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import Card from '../../components/common/Card'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import Loader from '../../components/common/Loader'

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    siteTitle: '',
    primaryColor: '',
    secondaryColor: '',
    contactEmail: '',
    footerText: '',
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const { data } = await axios.get('/api/settings')
      setSettings(data.settings)
    } catch (error) {
      toast.error('Failed to fetch settings')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.put('/api/settings', settings)
      toast.success('Settings updated successfully')
    } catch (error) {
      toast.error('Failed to update settings')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    )
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-3xl font-serif font-bold mb-8">Site Settings</h1>

        <Card>
          <form onSubmit={handleSubmit} className="p-6">
            <Input
              label="Site Title"
              name="siteTitle"
              value={settings.siteTitle}
              onChange={handleChange}
            />

            <Input
              label="Primary Color"
              name="primaryColor"
              value={settings.primaryColor}
              onChange={handleChange}
            />

            <Input
              label="Secondary Color"
              name="secondaryColor"
              value={settings.secondaryColor}
              onChange={handleChange}
            />

            <Input
              label="Contact Email"
              name="contactEmail"
              value={settings.contactEmail}
              onChange={handleChange}
            />

            <Input
              label="Footer Text"
              name="footerText"
              value={settings.footerText}
              onChange={handleChange}
            />

            <Button type="submit" disabled={loading} className="mt-6">
              {loading ? 'Saving...' : 'Save Settings'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}

export default AdminSettings
