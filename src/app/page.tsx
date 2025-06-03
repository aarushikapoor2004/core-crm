"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Suspense } from "react";
import { GalleryVerticalEnd, ArrowRight, Mail } from "lucide-react"
import Link from "next/link"
import { LoginForm } from "@/components/login-form"

export default function LandingPage() {

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <GalleryVerticalEnd className="w-6 h-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Core-CRM</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href='/overview'>
                <Button className="bg-gradient-to-bl from-blue-400 via-blue-800 to-blue-600">Dashboard <ArrowRight /> </Button>
              </Link>
              <Suspense fallback={null}>
                <LoginForm asModal />
              </Suspense>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Badge className="px-3 py-1 bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-100">
                Simplified Data Management
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Build powerful database queries without writing code
              </h1>
              <p className="text-xl text-gray-600">
                Core-CRM helps you filter, analyze, and manage your customer data with an intuitive visual query
                builder.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
              </div>
            </div>
            <div className="rounded-lg bg-white shadow-xl border border-gray-200 overflow-hidden">
              <div className="p-2 bg-gray-50 border-b border-gray-200 flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <div className="ml-2 text-xs text-gray-500">Query Builder</div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 border border-blue-100 rounded-md">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-blue-800">Match when:</div>
                      <Badge variant="outline" className="text-blue-700 border-blue-200">
                        AND
                      </Badge>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                    <div className="flex items-center justify-between">
                      <div className="text-sm">Status = Active</div>
                      <Badge variant="secondary" className="text-xs">
                        Condition
                      </Badge>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                    <div className="flex items-center justify-between">
                      <div className="text-sm">Purchase Amount &gt; 1000</div>
                      <Badge variant="secondary" className="text-xs">
                        Condition
                      </Badge>
                    </div>
                  </div>
                  <div className="p-3 bg-blue-50 border border-blue-100 rounded-md">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-blue-800">OR</div>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                    <div className="flex items-center justify-between">
                      <div className="text-sm">Customer Type = Premium</div>
                      <Badge variant="secondary" className="text-xs">
                        Condition
                      </Badge>
                    </div>
                  </div>
                  <Button className="w-full">Execute Query</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center space-x-2">
                <GalleryVerticalEnd className="w-6 h-6 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">Core-CRM</span>
              </div>
              <p className="mt-4 text-gray-600 max-w-md">
                A powerful customer relationship management tool with advanced query capabilities.
              </p>
            </div>
            <div className="flex flex-col md:items-end space-y-4">
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">Built by Aarushi Kapoor</span>
                <Badge variant="outline">UID: 22BCS14907</Badge>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Mail className="w-4 h-4" />
                <span>aarushik250@gmail.com</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

