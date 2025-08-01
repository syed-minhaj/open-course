"use client"

import { SquareArrowOutUpRight } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import Image from "next/image";

type Course = {
    id : string,
    name : string,
    image : string
}

const Discover = ({courses}:{courses: Course[] }) => {
    
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const [isPaused, setIsPaused] = useState<boolean>(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const autoSwipeIntervalRef = useRef<NodeJS.Timeout | null>(null);
    
    useEffect(() => {
      const startAutoSwipe = () => {
        autoSwipeIntervalRef.current = setInterval(() => {
          if (!isPaused) {
            setCurrentIndex(prevIndex => 
              prevIndex === courses.length - 1 ? 0 : prevIndex + 1
            );
          }
        }, 5000);
      };
    
      startAutoSwipe();
    
      return () => {
        if (autoSwipeIntervalRef.current) {
          clearInterval(autoSwipeIntervalRef.current);
        }
      };
    }, [courses.length, isPaused]);
    
    const minSwipeDistance = 50;
    
    const onTouchStart = (e: React.TouchEvent) => {
      setIsPaused(true);
      setTouchEnd(null);
      setTouchStart(e.targetTouches[0].clientX);
    };
    
    const onTouchMove = (e: React.TouchEvent) => {
      setTouchEnd(e.targetTouches[0].clientX);
    };
    
    const onTouchEnd = () => {
      setIsPaused(false);
      
      if (!touchStart || !touchEnd) return;
      
      const distance = touchStart - touchEnd;
      const isLeftSwipe = distance > minSwipeDistance;
      const isRightSwipe = distance < -minSwipeDistance;
      
      if (isLeftSwipe) {
        nextSlide();
      } else if (isRightSwipe) {
        prevSlide();
      }
    };
    
    const nextSlide = (): void => {
      setCurrentIndex(prevIndex => 
        prevIndex === courses.length - 1 ? 0 : prevIndex + 1
      );
    };
    
    const prevSlide = (): void => {
      setCurrentIndex(prevIndex => 
        prevIndex === 0 ? courses.length - 1 : prevIndex - 1
      );
    };
    
    const handleDotClick = (index: number): void => {
      setIsPaused(true);
      setCurrentIndex(index);
      
      setTimeout(() => {
        setIsPaused(false);
      }, 2000);
    };

    return (
        <div className="bg-prePrimary rounded-lg  col-span-full h-[280px] w-full  shadow-sm shadow-slate-700 
            dark:shadow-black drop-shadow-sm ">
                <div className="w-full h-full relative overflow-hidden rounded-lg">
                    <h1 className="absolute top-6 left-6 text-2xl text-gray-100 z-10 ">Descover</h1>
                    <div className="overflow-hidden touch-pan-y h-full w-full" ref={containerRef} 
                        onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} 
                        onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}
                    >
                        <div className="flex transition-transform duration-500 ease-out h-full"
                        style={{ transform: `translateX(-${currentIndex * 100}%)` }} >
                            {courses.map((course) => (
                                <div key={course.id} className="w-full flex-shrink-0 relative">
                                    <Image src={course.image} alt={course.name} className="w-full h-full object-cover" fill />
                                    <div className="absolute bottom-10 left-6  text-gray-100  z-10">
                                        {course.name}
                                        <a href={`/course/${course.id}`} >
                                            <SquareArrowOutUpRight size={20} className="inline ml-2 font-medium text-accent " />
                                        </a>
                                    </div>
                                    <div className="h-full w-full bg-gradient-to-tr from-black via-black/80 to-black/0 
                                    absolute left-0 top-0 " ></div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="absolute bottom-4 left-0 right-0">
                        <div className="flex justify-center">
                        {courses.map((_, index) => (
                            <button key={index} onClick={() => handleDotClick(index)}
                            className={`mx-1 w-3 h-3 rounded-full ${currentIndex === index ? 'bg-white' : 'bg-gray-400 bg-opacity-70'}`}
                            aria-label={`Go to slide ${index + 1}`} />
                        ))}
                        </div>
                    </div>
                </div>
        </div>
    )
}



export default Discover;