import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: "🎯",
      title: "Daily Workout Tracking",
      description: "Track your daily workouts with precision. Log sets, reps, and weights with an intuitive interface designed for the gym."
    },
    {
      icon: "📋",
      title: "Custom Programs",
      description: "Create personalized workout programs tailored to your goals. Build structured routines that adapt to your schedule."
    },
    {
      icon: "💪",
      title: "Exercise Library",
      description: "Access a comprehensive exercise database or create your own custom exercises with detailed muscle group targeting."
    },
    {
      icon: "🔧",
      title: "Program Builder",
      description: "Design complete workout programs with our intuitive drag-and-drop builder. Plan weeks of training in minutes."
    },
    {
      icon: "📊",
      title: "Progress Analytics",
      description: "Monitor your fitness journey with detailed analytics and progress tracking across all your exercises and programs."
    },
    {
      icon: "📱",
      title: "Mobile Optimized",
      description: "Take your workouts anywhere with our fully responsive design that works seamlessly on all devices."
    }
  ];



  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-gray-950 to-black text-zinc-100">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-gray-900/30 backdrop-blur-xl border-b border-gray-800/50 transition-all duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="w-10 h-10 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-red-500/25">
                <span className="text-red-400 font-bold text-lg group-hover:scale-110 transition-transform duration-300">HT</span>
              </div>
              <div className="font-bold text-xl text-white group-hover:text-red-400 transition-colors duration-300">HyprTrain</div>
            </div>
            
            {/* Navigation Actions */}
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate("/login")}
                className="hidden sm:inline-flex hover:bg-red-500/20 hover:text-red-400 transition-all duration-300 hover:scale-105"
              >
                Login
              </Button>
              <Button 
                onClick={() => navigate("/register")} 
                className="bg-red-500 hover:bg-red-600 text-white font-medium px-6 py-2 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/25 relative overflow-hidden group"
              >
                <span className="relative z-10">Get Started</span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-transparent to-transparent animate-pulse"></div>
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-red-500/5 to-transparent opacity-50 animate-pulse" style={{animationDelay: '1s', animationDuration: '3s'}}></div>
          {/* Floating particles */}
          <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-red-400/30 rounded-full animate-ping" style={{animationDelay: '0s'}}></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-red-400/20 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-1/3 left-1/5 w-1 h-1 bg-red-400/25 rounded-full animate-ping" style={{animationDelay: '4s'}}></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            {/* Hero Logo */}
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-red-500/20 border border-red-500/30 rounded-3xl flex items-center justify-center relative group hover:scale-110 transition-all duration-500 hover:shadow-2xl hover:shadow-red-500/20">
                <span className="text-red-400 font-bold text-2xl group-hover:scale-110 transition-transform duration-300">HT</span>
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>
            
            {/* Hero Text */}
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-white tracking-tight opacity-0 animate-[fadeInUp_1s_ease-out_0.2s_forwards]">
                Elevate Your Fitness with{" "}
                <span className="font-medium text-red-400 bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent animate-[shimmer_3s_ease-in-out_infinite]">
                  HyprTrain
                </span>
              </h1>
              <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed opacity-0 animate-[fadeInUp_1s_ease-out_0.4s_forwards]">
                The ultimate workout tracking platform designed for serious athletes. 
                Create custom programs, track progress, and achieve your fitness goals with precision.
              </p>
            </div>
            
            {/* Hero CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8 opacity-0 animate-[fadeInUp_1s_ease-out_0.6s_forwards]">
              <Button 
                onClick={() => navigate("/register")}
                size="lg"
                className="bg-red-500 hover:bg-red-600 text-white font-medium px-8 py-4 text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-red-500/25 relative overflow-hidden group"
              >
                <span className="relative z-10">Start Your Journey</span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
              <Button 
                onClick={() => navigate("/login")}
                variant="outline"
                size="lg"
                className="border-gray-700 hover:border-red-500/50 hover:bg-red-500/20 hover:text-red-400 transition-all duration-300 px-8 py-4 text-lg hover:scale-105 hover:shadow-lg"
              >
                Sign In
              </Button>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex justify-center items-center gap-8 pt-16 text-gray-400 opacity-0 animate-[fadeInUp_1s_ease-out_0.8s_forwards]">
              <div className="flex items-center gap-2 hover:text-green-400 transition-colors duration-300 cursor-default">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm">Live Tracking</span>
              </div>
              <div className="flex items-center gap-2 hover:text-blue-400 transition-colors duration-300 cursor-default">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
                <span className="text-sm">Real-time Sync</span>
              </div>
              <div className="flex items-center gap-2 hover:text-red-400 transition-colors duration-300 cursor-default">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                <span className="text-sm">Always Available</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-white">
              Powerful Features for{" "}
              <span className="font-medium text-red-400">Serious Athletes</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to track, plan, and optimize your fitness journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="border border-gray-800/50 bg-gray-900/30 backdrop-blur-sm hover:bg-gray-900/50 transition-all duration-500 hover:border-red-500/30 group hover:shadow-xl hover:shadow-red-500/10 hover:-translate-y-2 opacity-0 animate-[fadeInUp_0.8s_ease-out_forwards]"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <CardContent className="p-8 text-center space-y-4 relative overflow-hidden">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-all duration-500 group-hover:rotate-12 relative z-10">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white group-hover:text-red-400 transition-colors duration-300 relative z-10">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300 relative z-10">
                    {feature.description}
                  </p>
                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 lg:py-32 bg-gray-950/50 relative">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-900/5 to-transparent"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-white opacity-0 animate-[fadeInUp_1s_ease-out_forwards]">
              Simple Yet{" "}
              <span className="font-medium text-red-400 bg-gradient-to-r from-red-400 to-red-500 bg-clip-text text-transparent">Powerful</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto opacity-0 animate-[fadeInUp_1s_ease-out_0.2s_forwards]">
              Get started in minutes with our intuitive workflow
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[1, 2, 3].map((step, index) => {
              const titles = ["Create Your Program", "Track Your Workouts", "Monitor Progress"];
              const descriptions = [
                "Use our Program Builder to design custom workout routines tailored to your goals and schedule.",
                "Log your daily workouts with precision. Track sets, reps, weights, and notes for every exercise.",
                "Watch your strength and endurance improve over time with detailed analytics and progress tracking."
              ];
              
              return (
                <div key={step} className="text-center space-y-6 opacity-0 animate-[fadeInUp_0.8s_ease-out_forwards] group" style={{animationDelay: `${0.4 + index * 0.2}s`}}>
                  <div className="w-16 h-16 bg-red-500/20 border border-red-500/30 rounded-2xl flex items-center justify-center mx-auto relative group-hover:scale-110 transition-all duration-500 hover:shadow-xl hover:shadow-red-500/25">
                    <span className="text-red-400 font-bold text-xl group-hover:scale-110 transition-transform duration-300">{step}</span>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  <h3 className="text-2xl font-semibold text-white group-hover:text-red-400 transition-colors duration-300">{titles[index]}</h3>
                  <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                    {descriptions[index]}
                  </p>
                  {/* Connection line for desktop */}
                  {index < 2 && (
                    <div className="hidden md:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-red-500/30 to-transparent opacity-30 group-hover:opacity-60 transition-opacity duration-500" style={{transform: 'translateX(-50%)'}}></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 via-red-800/10 to-red-900/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-500/10 via-transparent to-transparent animate-pulse" style={{animationDuration: '4s'}}></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="space-y-8 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-white opacity-0 animate-[fadeInUp_1s_ease-out_forwards]">
              Ready to Transform Your{" "}
              <span className="font-medium text-red-400 bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent animate-[shimmer_3s_ease-in-out_infinite]">Fitness Journey?</span>
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed opacity-0 animate-[fadeInUp_1s_ease-out_0.2s_forwards]">
              Join thousands of athletes who have already elevated their training with HyprTrain. 
              Start building your perfect workout routine today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8 opacity-0 animate-[fadeInUp_1s_ease-out_0.4s_forwards]">
              <Button 
                onClick={() => navigate("/register")}
                size="lg"
                className="bg-red-500 hover:bg-red-600 text-white font-medium px-10 py-4 text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/30 relative overflow-hidden group"
              >
                <span className="relative z-10">Get Started Free</span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping opacity-75"></div>
              </Button>
              <Button 
                onClick={() => navigate("/login")}
                variant="outline"
                size="lg"
                className="border-gray-700 hover:border-red-500/50 hover:bg-red-500/20 hover:text-red-400 transition-all duration-300 px-10 py-4 text-lg hover:scale-105 hover:shadow-xl"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 bg-gray-950/50 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-3 group">
              <div className="w-8 h-8 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-red-400 font-bold text-sm">HT</span>
              </div>
              <div className="font-bold text-lg text-white group-hover:text-red-400 transition-colors duration-300">HyprTrain</div>
            </div>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm leading-relaxed max-w-md mx-auto">
              The ultimate fitness tracking platform for serious athletes.
            </p>
          </div>
          
          <div className="border-t border-gray-800/50 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              © 2024 HyprTrain. All rights reserved.
            </div>
            <div className="flex items-center gap-4 mt-4 sm:mt-0">
              <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full font-medium text-xs animate-pulse">
                v0.1.0 Beta
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
