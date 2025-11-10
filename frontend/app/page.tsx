'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { FiUsers, FiDollarSign, FiMapPin, FiTrendingUp } from 'react-icons/fi'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/90 backdrop-blur-sm shadow-sm z-50">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-display font-bold text-primary-600">Krafti</h1>
          <div className="flex gap-4">
            <Link href="/login" className="px-4 py-2 text-gray-700 hover:text-primary-600 transition">
              Log In
            </Link>
            <Link href="/signup" className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition">
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-display font-bold text-gray-900 mb-6">
              Where Handmade <span className="text-primary-600">Dreams</span> Meet <span className="text-secondary-600">Skilled Hands</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Krafti connects small business owners with talented local makers for flexible, home-based crafting opportunities.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link 
                href="/signup?role=maker"
                className="px-8 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-lg font-semibold shadow-lg"
              >
                I'm a Maker
              </Link>
              <Link 
                href="/signup?role=business"
                className="px-8 py-4 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition text-lg font-semibold shadow-lg"
              >
                I'm a Business
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-display font-bold text-center text-gray-900 mb-16">
            Why Choose Krafti?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <FiDollarSign className="w-8 h-8" />,
                title: "AI-Powered Fair Pricing",
                description: "Our AI calculates fair pay rates that benefit both makers and businesses"
              },
              {
                icon: <FiMapPin className="w-8 h-8" />,
                title: "Local Connections",
                description: "Match with makers in your area for convenient collaboration"
              },
              {
                icon: <FiTrendingUp className="w-8 h-8" />,
                title: "Skill Progression",
                description: "Makers advance through tiers and earn more as they improve"
              },
              {
                icon: <FiUsers className="w-8 h-8" />,
                title: "Trusted Community",
                description: "Ratings and reviews ensure quality and reliability"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 bg-gray-50 rounded-xl hover:shadow-soft transition"
              >
                <div className="text-primary-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* For Makers Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-primary-50 to-primary-100">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-display font-bold text-gray-900 mb-6">
                For Makers
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Turn your passion into income on your own schedule. Perfect for stay-at-home parents, crafters, and anyone looking for flexible work.
              </p>
              <ul className="space-y-4">
                {[
                  "Work from home at your own pace",
                  "Choose tasks that match your skills",
                  "Earn fairly with transparent pricing",
                  "Build your portfolio and reputation",
                  "Advance to higher pay tiers"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-primary-600 mt-1">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link 
                href="/signup?role=maker"
                className="inline-block mt-8 px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
              >
                Start Crafting
              </Link>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-soft">
              <h3 className="text-2xl font-semibold mb-4">Example Task</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Task:</span>
                  <span className="font-medium">Crochet 10 Mini Flowers</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Complexity:</span>
                  <span className="font-medium">Beginner</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-medium">~2 hours</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-primary-600 pt-3 border-t">
                  <span>Pay:</span>
                  <span>$35.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Businesses Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-secondary-50 to-secondary-100">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-white p-8 rounded-2xl shadow-soft">
              <h3 className="text-2xl font-semibold mb-4">AI Pricing Calculator</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600">Retail Price:</label>
                  <input type="number" className="w-full mt-1 px-4 py-2 border rounded-lg" placeholder="$15.00" />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Material Cost:</label>
                  <input type="number" className="w-full mt-1 px-4 py-2 border rounded-lg" placeholder="$3.00" />
                </div>
                <div className="pt-4 border-t">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Suggested Maker Pay:</span>
                    <span className="font-bold text-primary-600">$5.50</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Your Profit:</span>
                    <span className="font-bold text-secondary-600">$6.50 (43%)</span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-4xl font-display font-bold text-gray-900 mb-6">
                For Businesses
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Scale your handmade business without sacrificing quality. Find skilled local makers to help with production.
              </p>
              <ul className="space-y-4">
                {[
                  "AI-powered fair pricing calculator",
                  "Post tasks publicly or anonymously",
                  "Match with qualified local makers",
                  "Track progress and quality",
                  "Simple payment processing"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-secondary-600 mt-1">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link 
                href="/signup?role=business"
                className="inline-block mt-8 px-8 py-3 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition"
              >
                Start Scaling
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-primary text-white">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-4xl font-display font-bold mb-6">
            Ready to Start Your Krafti Journey?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join our community of makers and businesses creating beautiful handmade products together.
          </p>
          <Link 
            href="/signup"
            className="inline-block px-8 py-4 bg-white text-primary-600 rounded-lg hover:bg-gray-100 transition text-lg font-semibold shadow-lg"
          >
            Sign Up Free Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-900 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl font-display font-bold mb-4">Krafti</h2>
          <p className="text-gray-400 mb-6">Empowering makers and businesses to grow together</p>
          <div className="flex gap-6 justify-center text-sm text-gray-400">
            <Link href="/about" className="hover:text-white transition">About</Link>
            <Link href="/how-it-works" className="hover:text-white transition">How It Works</Link>
            <Link href="/pricing" className="hover:text-white transition">Pricing</Link>
            <Link href="/support" className="hover:text-white transition">Support</Link>
          </div>
          <p className="mt-8 text-gray-500 text-sm">© 2024 Krafti. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
