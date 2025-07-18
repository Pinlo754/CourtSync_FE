import Header from "../../components/sections/Header"
import { Button } from "../../components/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Users, Target, Heart, Award, MapPin, Phone, Mail, Star } from "lucide-react"


export default function AboutPage() {
  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      image: "/placeholder.svg?height=300&width=300",
      description: "Former professional badminton player with 15+ years of experience in sports management.",
    },
    {
      name: "Michael Chen",
      role: "CTO",
      image: "/placeholder.svg?height=300&width=300",
      description: "Tech enthusiast passionate about creating seamless digital experiences for sports lovers.",
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Operations",
      image: "/placeholder.svg?height=300&width=300",
      description: "Expert in facility management and customer service with a focus on excellence.",
    },
    {
      name: "David Kim",
      role: "Community Manager",
      image: "/placeholder.svg?height=300&width=300",
      description: "Dedicated to building strong relationships between players and court facilities.",
    },
  ]

  const stats = [
    { number: "50+", label: "Partner Courts", icon: MapPin },
    { number: "10,000+", label: "Happy Players", icon: Users },
    { number: "25,000+", label: "Bookings Made", icon: Award },
    { number: "4.9", label: "Average Rating", icon: Star },
  ]

  const values = [
    {
      icon: Target,
      title: "Our Mission",
      description:
        "To make badminton accessible to everyone by connecting players with the best courts in their area through seamless technology.",
    },
    {
      icon: Heart,
      title: "Our Passion",
      description:
        "We're passionate about badminton and believe in the power of sports to bring communities together and promote healthy living.",
    },
    {
      icon: Users,
      title: "Our Community",
      description:
        "Building a vibrant community of badminton enthusiasts, from beginners to professionals, all united by their love for the game.",
    },
  ]

  return (
    <div className="bg-gray-50 h-screen overflow-y-scroll scrollbar-hide">
      <Header/>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">About CourtBook</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            We're revolutionizing how badminton players find and book courts, making the sport more accessible and
            enjoyable for everyone.
          </p>
          <div className="flex justify-center space-x-4">
            <a href="/courts">
              <Button className="bg-white text-blue-600 hover:bg-gray-100">
                Start Booking
              </Button>
            </a>
            <Button
              variant="secondary"
              className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  CourtBook was born from a simple frustration: finding and booking badminton courts was unnecessarily
                  complicated. As passionate players ourselves, we experienced the hassle of calling multiple
                  facilities, checking availability, and dealing with outdated booking systems.
                </p>
                <p>
                  In 2023, we decided to solve this problem by creating a platform that connects players with courts
                  seamlessly. Our team of badminton enthusiasts and tech experts came together to build something that
                  would make the sport more accessible to everyone.
                </p>
                <p>
                  Today, CourtBook serves thousands of players across the region, partnering with the best facilities to
                  provide a premium booking experience. We're not just a booking platform – we're building a community
                  of badminton lovers.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="/placeholder.svg?height=500&width=600"
                alt="Badminton players in action"
                className="rounded-lg shadow-lg"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-lg shadow-lg">
                <div className="text-2xl font-bold text-blue-600">2023</div>
                <div className="text-gray-600">Founded</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Drives Us</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our core values shape everything we do, from product development to customer service.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The passionate individuals behind CourtBook who are dedicated to serving the badminton community.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200">
                    <img
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <CardDescription>
                    {member.role}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Get In Touch</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Have questions or want to partner with us? We'd love to hear from you.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Phone</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">+1 (555) 123-4567</p>
                <p className="text-sm text-gray-500">Mon-Fri 9AM-6PM</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Email</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">hello@courtbook.com</p>
                <p className="text-sm text-gray-500">We'll respond within 24 hours</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Office</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">123 Sports Avenue</p>
                <p className="text-gray-600">Downtown, ST 12345</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Play?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of players who trust CourtBook for their badminton court bookings.
          </p>
          <a href="/courts">
            <Button className="bg-white text-blue-600 hover:bg-gray-100">
              Find Courts Near You
            </Button>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">CourtBook</h3>
              <p className="text-gray-400">Making badminton accessible to everyone through seamless court booking.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="/courts" className="hover:text-white">
                    Find Courts
                  </a>
                </li>
                <li>
                  <a href="/bookings" className="hover:text-white">
                    My Bookings
                  </a>
                </li>
                <li>
                  <a href="/about" className="hover:text-white">
                    About Us
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Facebook
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Twitter
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CourtBook. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
