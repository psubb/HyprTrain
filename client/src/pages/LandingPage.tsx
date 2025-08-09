import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef } from "react";

// Animation component for scroll-triggered reveals
const AnimatedSection = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Parallax background component
const ParallaxBackground = ({ children, offset = 50 }: { children: React.ReactNode, offset?: number }) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, offset]);
  
  return (
    <motion.div style={{ y }} className="absolute inset-0">
      {children}
    </motion.div>
  );
};

// Staggered container for multiple items
const StaggerContainer = ({ children, staggerDelay = 0.1 }: { children: React.ReactNode, staggerDelay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
};

const StaggerItem = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1 }
      }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default function LandingPage() {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const { scrollY } = useScroll();
  
  // Parallax transforms for hero section
  const heroY = useTransform(scrollY, [0, 500], [0, -150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.8]);

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
      <motion.section 
        ref={heroRef}
        className="relative overflow-hidden"
        style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
      >
        {/* Animated Background Effects */}
        <ParallaxBackground offset={100}>
          <motion.div 
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-transparent to-transparent"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-transparent via-red-500/5 to-transparent"
            animate={{ 
              opacity: [0.2, 0.5, 0.2],
              rotate: [0, 0.5, 0]
            }}
            transition={{ 
              duration: 6, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          {/* Enhanced floating particles */}
          <motion.div 
            className="absolute top-1/4 left-1/4 w-2 h-2 bg-red-400/40 rounded-full"
            animate={{ 
              y: [-10, 10, -10],
              opacity: [0.3, 0.8, 0.3],
              scale: [0.8, 1.2, 0.8]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-red-400/30 rounded-full"
            animate={{ 
              y: [10, -15, 10],
              opacity: [0.2, 0.7, 0.2],
              scale: [1, 1.5, 1]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
          <motion.div 
            className="absolute bottom-1/3 left-1/5 w-1 h-1 bg-red-400/35 rounded-full"
            animate={{ 
              y: [-5, 8, -5],
              opacity: [0.4, 0.9, 0.4],
              scale: [0.9, 1.3, 0.9]
            }}
            transition={{ 
              duration: 5, 
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
        </ParallaxBackground>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            {/* Hero Logo */}
            <motion.div 
              className="flex justify-center mb-8"
              initial={{ opacity: 0, scale: 0.5, rotateY: -180 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            >
              <motion.div 
                className="w-20 h-20 bg-red-500/20 border border-red-500/30 rounded-3xl flex items-center justify-center relative group cursor-pointer"
                whileHover={{ 
                  scale: 1.15, 
                  rotateY: 15,
                  boxShadow: "0 25px 50px -12px rgba(239, 68, 68, 0.25)"
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <motion.span 
                  className="text-red-400 font-bold text-2xl"
                  whileHover={{ scale: 1.1, rotateZ: 5 }}
                >
                  HT
                </motion.span>
                <motion.div 
                  className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-red-500/10 to-transparent"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            </motion.div>
            
            {/* Hero Text */}
            <div className="space-y-6">
              <motion.h1 
                className="text-4xl sm:text-5xl lg:text-6xl font-light text-white tracking-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Elevate Your Fitness with{" "}
                <motion.span 
                  className="font-medium text-red-400 bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent"
                  animate={{ 
                    backgroundPosition: ["0%", "100%", "0%"]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  HyprTrain
                </motion.span>
              </motion.h1>
              <motion.p 
                className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                The ultimate workout tracking platform designed for serious athletes. 
                Create custom programs, track progress, and achieve your fitness goals with precision.
              </motion.p>
            </div>
            
            {/* Hero CTA */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Button 
                  onClick={() => navigate("/register")}
                  size="lg"
                  className="bg-red-500 hover:bg-red-600 text-white font-medium px-8 py-4 text-lg transition-all duration-300 hover:shadow-xl hover:shadow-red-500/25 relative overflow-hidden group"
                >
                  <span className="relative z-10">Start Your Journey</span>
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-500"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Button 
                  onClick={() => navigate("/login")}
                  variant="outline"
                  size="lg"
                  className="border-gray-700 hover:border-red-500/50 hover:bg-red-500/20 hover:text-red-400 transition-all duration-300 px-8 py-4 text-lg hover:shadow-lg"
                >
                  Sign In
                </Button>
              </motion.div>
            </motion.div>
            
            {/* Trust Indicators */}
            <motion.div 
              className="flex justify-center items-center gap-8 pt-16 text-gray-400"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <motion.div 
                className="flex items-center gap-2 cursor-default"
                whileHover={{ scale: 1.1, color: "#4ade80" }}
                transition={{ duration: 0.2 }}
              >
                <motion.div 
                  className="w-2 h-2 bg-green-400 rounded-full"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-sm">Live Tracking</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-2 cursor-default"
                whileHover={{ scale: 1.1, color: "#60a5fa" }}
                transition={{ duration: 0.2 }}
              >
                <motion.div 
                  className="w-2 h-2 bg-blue-400 rounded-full"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="text-sm">Real-time Sync</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-2 cursor-default"
                whileHover={{ scale: 1.1, color: "#f87171" }}
                transition={{ duration: 0.2 }}
              >
                <motion.div 
                  className="w-2 h-2 bg-red-400 rounded-full"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                />
                <span className="text-sm">Always Available</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="pt-12 pb-20 lg:pt-16 lg:pb-32 relative">
        <ParallaxBackground offset={30}>
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-red-900/5 via-transparent to-red-900/5"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
        </ParallaxBackground>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection delay={0.2} className="text-center space-y-4 mb-16">
            <motion.h2 
              className="text-3xl sm:text-4xl lg:text-5xl font-light text-white"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              Powerful Features for{" "}
              <motion.span 
                className="font-medium text-red-400"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Serious Athletes
              </motion.span>
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-400 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Everything you need to track, plan, and optimize your fitness journey
            </motion.p>
          </AnimatedSection>
          
          <StaggerContainer staggerDelay={0.15}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <StaggerItem key={index}>
                  <motion.div
                    whileHover={{ 
                      y: -8, 
                      scale: 1.02,
                      rotateY: 5,
                      boxShadow: "0 25px 50px -12px rgba(239, 68, 68, 0.15)"
                    }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <Card className="border border-gray-800/50 bg-gray-900/30 backdrop-blur-sm hover:bg-gray-900/50 transition-all duration-500 hover:border-red-500/30 group h-full">
                      <CardContent className="p-8 text-center space-y-4 relative overflow-hidden">
                        <motion.div 
                          className="text-4xl mb-4 relative z-10"
                          whileHover={{ 
                            scale: 1.2, 
                            rotateZ: 12,
                            y: -5
                          }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                          {feature.icon}
                        </motion.div>
                        <motion.h3 
                          className="text-xl font-semibold text-white group-hover:text-red-400 transition-colors duration-300 relative z-10"
                          whileHover={{ scale: 1.05 }}
                        >
                          {feature.title}
                        </motion.h3>
                        <motion.p 
                          className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300 relative z-10"
                          whileHover={{ scale: 1.02 }}
                        >
                          {feature.description}
                        </motion.p>
                        {/* Hover effect overlay */}
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent"
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      </CardContent>
                    </Card>
                  </motion.div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 lg:py-32 bg-gray-950/50 relative">
        {/* Background decoration */}
        <ParallaxBackground offset={-20}>
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-red-900/5 to-transparent"
            animate={{ 
              backgroundPosition: ["0%", "100%", "0%"],
              opacity: [0.3, 0.7, 0.3]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </ParallaxBackground>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <AnimatedSection delay={0.2} className="text-center space-y-4 mb-16">
            <motion.h2 
              className="text-3xl sm:text-4xl lg:text-5xl font-light text-white"
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              Simple Yet{" "}
              <motion.span 
                className="font-medium text-red-400 bg-gradient-to-r from-red-400 to-red-500 bg-clip-text text-transparent"
                initial={{ opacity: 0, rotateX: -90 }}
                whileInView={{ opacity: 1, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                Powerful
              </motion.span>
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-400 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              Get started in minutes with our intuitive workflow
            </motion.p>
          </AnimatedSection>
          
          <StaggerContainer staggerDelay={0.2}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              {[1, 2, 3].map((step, index) => {
                const titles = ["Create Your Program", "Track Your Workouts", "Monitor Progress"];
                const descriptions = [
                  "Use our Program Builder to design custom workout routines tailored to your goals and schedule.",
                  "Log your daily workouts with precision. Track sets, reps, weights, and notes for every exercise.",
                  "Watch your strength and endurance improve over time with detailed analytics and progress tracking."
                ];
                
                return (
                  <StaggerItem key={step}>
                    <motion.div 
                      className="text-center space-y-6 group relative"
                      whileHover={{ y: -5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div 
                        className="w-16 h-16 bg-red-500/20 border border-red-500/30 rounded-2xl flex items-center justify-center mx-auto relative"
                        whileHover={{ 
                          scale: 1.15, 
                          rotateY: 10,
                          boxShadow: "0 20px 40px -12px rgba(239, 68, 68, 0.3)"
                        }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      >
                        <motion.span 
                          className="text-red-400 font-bold text-xl"
                          whileHover={{ scale: 1.1, rotateZ: 5 }}
                        >
                          {step}
                        </motion.span>
                        <motion.div 
                          className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-red-500/10 to-transparent"
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      </motion.div>
                      <motion.h3 
                        className="text-2xl font-semibold text-white group-hover:text-red-400 transition-colors duration-300"
                        whileHover={{ scale: 1.05 }}
                      >
                        {titles[index]}
                      </motion.h3>
                      <motion.p 
                        className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300"
                        whileHover={{ scale: 1.02 }}
                      >
                        {descriptions[index]}
                      </motion.p>
                      {/* Enhanced connection line for desktop */}
                      {index < 2 && (
                        <motion.div 
                          className="hidden md:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-red-500/30 to-transparent opacity-30"
                          style={{transform: 'translateX(-50%)'}}
                          animate={{ 
                            opacity: [0.3, 0.8, 0.3],
                            scaleX: [0.8, 1.2, 0.8]
                          }}
                          transition={{ 
                            duration: 3, 
                            repeat: Infinity,
                            delay: index * 0.5
                          }}
                        />
                      )}
                    </motion.div>
                  </StaggerItem>
                );
              })}
            </div>
          </StaggerContainer>
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        {/* Animated background */}
        <ParallaxBackground offset={60}>
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-red-900/20 via-red-800/10 to-red-900/20"
            animate={{ 
              backgroundPosition: ["0%", "100%", "0%"],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
        </ParallaxBackground>
        <motion.div 
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-500/10 via-transparent to-transparent"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <AnimatedSection delay={0.2}>
            <div className="space-y-8 max-w-3xl mx-auto">
              <motion.h2 
                className="text-3xl sm:text-4xl lg:text-5xl font-light text-white"
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
              >
                Ready to Transform Your{" "}
                <motion.span 
                  className="font-medium text-red-400 bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent"
                  animate={{ 
                    backgroundPosition: ["0%", "100%", "0%"]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  Fitness Journey?
                </motion.span>
              </motion.h2>
              <motion.p 
                className="text-xl text-gray-300 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Join thousands of athletes who have already elevated their training with HyprTrain. 
                Start building your perfect workout routine today.
              </motion.p>
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button 
                    onClick={() => navigate("/register")}
                    size="lg"
                    className="bg-red-500 hover:bg-red-600 text-white font-medium px-10 py-4 text-lg transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/30 relative overflow-hidden group"
                  >
                    <span className="relative z-10">Get Started Free</span>
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-500"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button 
                    onClick={() => navigate("/login")}
                    variant="outline"
                    size="lg"
                    className="border-gray-700 hover:border-red-500/50 hover:bg-red-500/20 hover:text-red-400 transition-all duration-300 px-10 py-4 text-lg hover:shadow-xl"
                  >
                    Sign In
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 bg-gray-950/50 relative">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
          <AnimatedSection delay={0.1}>
            <motion.div 
              className="flex justify-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.div 
                className="flex items-center gap-3 group cursor-pointer"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div 
                  className="w-8 h-8 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center justify-center"
                  whileHover={{ 
                    scale: 1.15, 
                    rotateY: 10,
                    boxShadow: "0 10px 20px -5px rgba(239, 68, 68, 0.2)"
                  }}
                >
                  <span className="text-red-400 font-bold text-sm">HT</span>
                </motion.div>
                <motion.div 
                  className="font-bold text-lg text-white group-hover:text-red-400 transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                >
                  HyprTrain
                </motion.div>
              </motion.div>
            </motion.div>
            <motion.div 
              className="text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p className="text-gray-400 text-sm leading-relaxed max-w-md mx-auto">
                The ultimate fitness tracking platform for serious athletes.
              </p>
            </motion.div>
            
            <motion.div 
              className="border-t border-gray-800/50 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="text-gray-400 text-sm">
                © 2024 HyprTrain. All rights reserved.
              </div>
              <div className="flex items-center gap-4 mt-4 sm:mt-0">
                <motion.span 
                  className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full font-medium text-xs"
                  animate={{ 
                    scale: [1, 1.05, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  v0.1.0 Beta
                </motion.span>
              </div>
            </motion.div>
          </AnimatedSection>
        </div>
      </footer>
    </div>
  );
}
