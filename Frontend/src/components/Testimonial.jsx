import React from "react"

export default function Testimonial() {
  const testimonials = [
    {
      name: "Aman Verma",
      role: "B.Sc Student",
      content:
        "Success Library has completely transformed the way I study. The peaceful environment and helpful staff make it my go-to place every day.",
      rating: 5,
    },
    {
      name: "Riya Sharma",
      role: "UPSC Aspirant",
      content:
        "I love the facilities and the discipline here. It's the perfect place to focus and stay motivated for long hours.",
      rating: 4,
    },
    {
      name: "Mohit Singh",
      role: "Engineering Student",
      content:
        "Reliable power, fast internet, and clean surroundings — everything a serious student needs is right here at Success Library.",
      rating: 5,
    },
  ]

  const Star = () => (
    <svg
      className="h-4 w-4 text-yellow-400 fill-current"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.184 3.64a1 1 0 00.95.69h3.834c.969 0 1.371 1.24.588 1.81l-3.1 2.253a1 1 0 00-.364 1.118l1.184 3.64c.3.921-.755 1.688-1.54 1.118l-3.1-2.253a1 1 0 00-1.176 0l-3.1 2.253c-.785.57-1.84-.197-1.54-1.118l1.184-3.64a1 1 0 00-.364-1.118L2.493 9.067c-.783-.57-.38-1.81.588-1.81h3.834a1 1 0 00.95-.69l1.184-3.64z" />
    </svg>
  )

  return (
    <section className="py-20 bg-white" id="testimonials">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Students Say</h2>
          <p className="text-xl text-gray-600">
            Hear from our successful students about their experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-blue-100 p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="space-y-4">
                <div className="flex space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} />
                  ))}
                </div>
                <p className="text-gray-600 italic">"{testimonial.content}"</p>
                <div className="border-t pt-4">
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
