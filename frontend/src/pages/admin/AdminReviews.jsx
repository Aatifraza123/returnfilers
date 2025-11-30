import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Loader from '../../components/common/Loader'

const AdminReviews = () => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get('/api/reviews')
      setReviews(data.reviews)
    } catch (error) {
      toast.error('Failed to fetch reviews')
    } finally {
      setLoading(false)
    }
  }

  const deleteReview = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return

    try {
      await axios.delete(`/api/reviews/${id}`)
      toast.success('Review deleted successfully')
      fetchReviews()
    } catch (error) {
      toast.error('Failed to delete review')
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
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif font-bold">Manage Reviews</h1>
          <Link to="/admin/reviews/add">
            <Button>Add Review</Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {reviews.map((review) => (
            <Card key={review._id}>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-500 font-bold mr-4">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold">{review.name}</h3>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-xl ${
                            i < review.rating ? 'text-yellow-400' : 'text-neutral-300'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-neutral-600 mb-4">{review.message}</p>
                <div className="space-x-2">
                  <Link to={`/admin/reviews/edit/${review._id}`}>
                    <Button size="sm" variant="secondary">Edit</Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => deleteReview(review._id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {reviews.length === 0 && (
          <div className="text-center py-20">
            <p className="text-neutral-600 text-xl">No reviews found</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminReviews
