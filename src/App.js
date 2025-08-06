import React, { useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import UseCases from './components/UseCases';
import HowItWorks from './components/HowItWorks';
import AIShowcase from './components/AIShowcase';
import InteractiveDemo from './components/InteractiveDemo';
import Security from './components/Security';
import Testimonials from './components/Testimonials';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import './App.css';

function App() {
  useEffect(() => {
    // Scroll reveal animation
    function revealOnScroll() {
        const reveals = document.querySelectorAll('.scroll-reveal');
        
        for (let i = 0; i < reveals.length; i++) {
            const windowHeight = window.innerHeight;
            const elementTop = reveals[i].getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < windowHeight - elementVisible) {
                reveals[i].classList.add('revealed');
            }
        }
    }

    // FAQ Toggle
    function initFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all FAQ items
                faqItems.forEach(faq => faq.classList.remove('active'));
                
                // Open clicked item if it wasn't active
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
    }

    // Demo Chat Functionality
    function initDemoChat() {
        const demoInput = document.getElementById('demoInput');
        const demoSend = document.getElementById('demoSend');
        const chatInterface = document.getElementById('chatInterface');

        const demoResponses = [
            "That's a great question! I can help you with a wide variety of tasks including analysis, creative writing, problem-solving, and much more. What specific area would you like to explore?",
            "I'd be happy to assist with that! My capabilities include natural language processing, image analysis, multilingual communication, and creative collaboration. How can I help you today?",
            "Excellent! I can provide detailed explanations, analyze complex topics, help with research, or even assist with creative projects. What would you like to work on together?",
            "I'm designed to be your intelligent companion for any task. Whether it's professional work, learning, creativity, or just having an engaging conversation - I'm here to help!",
            "That sounds interesting! I can adapt my responses to your specific needs and provide personalized assistance. Tell me more about what you're looking for.",
            "I love helping with diverse projects! From technical challenges to creative endeavors, I can provide insights, suggestions, and detailed analysis. What's on your mind?"
        ];

        function addMessage(text, isUser = false) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `chat-message ${isUser ? 'user-message' : 'ai-message'}`;
            
            const bubbleDiv = document.createElement('div');
            bubbleDiv.className = 'message-bubble';
            bubbleDiv.textContent = text;
            
            messageDiv.appendChild(bubbleDiv);
            chatInterface.appendChild(messageDiv);
            
            // Scroll to bottom
            chatInterface.scrollTop = chatInterface.scrollHeight;
        }

        function addTypingIndicator() {
            const typingDiv = document.createElement('div');
            typingDiv.className = 'chat-message ai-message';
            typingDiv.id = 'typing-indicator';
            
            const bubbleDiv = document.createElement('div');
            bubbleDiv.className = 'message-bubble';
            bubbleDiv.innerHTML = `
                                    <div class="loading-dots">
                                        <div class="loading-dot"></div>
                                        <div class="loading-dot"></div>
                                        <div class="loading-dot"></div>
                                    </div>
                                `;

            
            typingDiv.appendChild(bubbleDiv);
            chatInterface.appendChild(typingDiv);
            chatInterface.scrollTop = chatInterface.scrollHeight;
            
            return typingDiv;
        }

        function removeTypingIndicator(indicator) {
            if (indicator && indicator.parentNode) {
                indicator.parentNode.removeChild(indicator);
            }
        }

        function sendMessage() {
            const message = demoInput.value.trim();
            if (!message) return;

            // Add user message
            addMessage(message, true);
            demoInput.value = '';

            // Add typing indicator
            const typingIndicator = addTypingIndicator();

            // Simulate AI response delay
            setTimeout(() => {
                removeTypingIndicator(typingIndicator);
                const randomResponse = demoResponses[Math.floor(Math.random() * demoResponses.length)];
                addMessage(randomResponse);
            }, 1500 + Math.random() * 1000);
        }

        demoSend.addEventListener('click', sendMessage);
        demoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    // Newsletter form handling
    function initNewsletter() {
        const newsletterForm = document.querySelector('.newsletter-form');
        
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('.newsletter-input').value;
            
            // Simple email validation
            if (email && email.includes('@')) {
                alert('Thank you for subscribing! You\'ll receive updates about Zara AI.');
                newsletterForm.querySelector('.newsletter-input').value = '';
            } else {
                alert('Please enter a valid email address.');
            }
        });
    }

    // Smooth scrolling for navigation links
    function initSmoothScrolling() {
        const navLinks = document.querySelectorAll('a[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80; // Account for fixed nav
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Navigation background change on scroll
    function initNavScroll() {
        const nav = document.querySelector('nav');
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                nav.style.background = 'transparent';
            } else {
                nav.style.background = 'transparent';
            }
        });
    }

    // Parallax effect for hero section
    function initParallax() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroContent = document.querySelector('.hero-content');
            const threeCanvas = document.getElementById('three-canvas');
            
            if (heroContent && scrolled < window.innerHeight) {
                heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
                if (threeCanvas) {
                  threeCanvas.style.transform = `translateY(${scrolled * 0.3}px)`;
                }
            }
        });
    }

    // Intersection Observer for animations
    function initIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, observerOptions);

        // Observe all scroll-reveal elements
        document.querySelectorAll('.scroll-reveal').forEach(el => {
            observer.observe(el);
        });
    }

    // Add some interactive hover effects
    function initHoverEffects() {
        // Add subtle mouse tracking to feature cards
        const featureCards = document.querySelectorAll('.feature-card');
        
        featureCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-20px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            });
        });
    }

    // Performance optimization: Debounce scroll events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Use debounced scroll for better performance
    const debouncedScrollHandler = debounce(() => {
        revealOnScroll();
    }, 16); // ~60fps

    initFAQ();
    initDemoChat();
    initNewsletter();
    initSmoothScrolling();
    initNavScroll();
    initParallax();
    initIntersectionObserver();
    initHoverEffects();
    
    // Legacy scroll reveal for browsers without Intersection Observer
    window.addEventListener('scroll', revealOnScroll);
    window.addEventListener('scroll', debouncedScrollHandler);
    
    // Initial reveal check
    revealOnScroll();

    return () => {
      window.removeEventListener('scroll', revealOnScroll);
      window.removeEventListener('scroll', debouncedScrollHandler);
    }
  }, []);

  return (
    <div className="App">
      <Header />
      <Hero />
      <Features />
      <UseCases />
      <HowItWorks />
      <AIShowcase />
      <InteractiveDemo />
      <Security />
      <Newsletter />
      <Testimonials />
      <Footer />
    </div>
  );
}

export default App;
