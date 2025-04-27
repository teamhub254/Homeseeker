import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useCarouselAutoplay } from "@/hooks/use-carousel-autoplay";

const Testimonials = () => {
  const [api, setApi] = useState<CarouselApi>();
  const testimonials = [
    {
      id: 1,
      content: "When I had to relocate for work, Habix made finding a new home in an unfamiliar city so much easier. The virtual tours were especially helpful.",
      author: "David Kim",
      role: "Relocated for Work",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      id: 2,
      content: "Found the perfect rental apartment through Habix. The filtering options helped me narrow down exactly what I was looking for within my budget.",
      author: "Lisa Chen",
      role: "Rental Client",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      id: 3,
      content: "Habix helped me find my dream home in just two weeks! The platform is incredibly intuitive and the agents were always responsive.",
      author: "Sarah Johnson",
      role: "Homeowner",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg"
    }
  ];

  useCarouselAutoplay(api);

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">What Our Clients Say</h2>
        
        <Carousel className="relative" opts={{ loop: true, align: "start" }} setApi={setApi}>
          <CarouselContent className="-ml-4">
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.id} className="pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                <div className="bg-[#000000] border border-gray-800 rounded-xl p-6">
                  {/* Stars */}
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} fill="#FFC107" color="#FFC107" size={18} />
                    ))}
                  </div>
                  
                  {/* Content */}
                  <p className="text-gray-300 mb-6">{testimonial.content}</p>
                  
                  {/* Author */}
                  <div className="flex items-center">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.author} 
                      className="w-12 h-12 rounded-full mr-4" 
                    />
                    <div>
                      <h4 className="font-semibold">{testimonial.author}</h4>
                      <p className="text-gray-400 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
    </section>
  );
};

export default Testimonials;
