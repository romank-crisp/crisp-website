"use client";

import { useRef, CSSProperties, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SharedContentSplit } from "@/components/blocks/SharedContentSplit";
import { SharedCenteredQuote } from "@/components/blocks/SharedCenteredQuote";
import { SharedStatsBlock } from "@/components/blocks/SharedStatsBlock";
import { SharedTestimonials } from "@/components/blocks/SharedTestimonials";
import { SharedClientLogos } from "@/components/blocks/SharedClientLogos";
import { SharedVideoScrollingCTA } from "@/components/blocks/SharedVideoScrollingCTA";
import { HomeHorizontalMasonry, MasonryColumn } from "@/components/blocks/HomeHorizontalMasonry";
import { HomeWhereWeCanHelp } from "@/components/blocks/HomeWhereWeCanHelp";
import { HomePartnerStatement } from "@/components/blocks/HomePartnerStatement";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
  HomeHeroData,
  WhereWeCanHelpData,
  PartnerStatementData,
  HomeClientsData,
  HomeStatsData,
  HomeTestimonialsData,
  HeroText,
  HomeQuoteData,
  HomeFAQData
} from "@/types/home";

import { SharedFAQ } from "@/components/blocks/SharedFAQ";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
const SplineScene = dynamic(() => import("@/components/blocks/HomeHeroSpline").then((mod) => mod.HomeHeroSpline), { ssr: false });

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function LottieAnimation({ src }: { src?: string }) {
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    if (!src) return;
    fetch(src)
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch((err) => console.error("Failed to load Lottie animation:", err));
  }, [src]);

  if (!animationData) {
    return <div className="w-full h-full flex items-center justify-center" />;
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Lottie
        animationData={animationData}
        loop
        autoplay
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}

function DistortionImage({ src, alt }: { src?: string; alt?: string }) {
  const imageRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!imageRef.current || !containerRef.current) return;

    const handleMouseEnter = () => {
      gsap.to(imageRef.current, {
        scale: 1.1,
        rotationY: 5,
        rotationX: -3,
        duration: 0.6,
        ease: "power2.out",
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || !imageRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      gsap.to(imageRef.current, {
        rotationY: x * 15,
        rotationX: -y * 15,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(imageRef.current, {
        scale: 1,
        rotationY: 0,
        rotationX: 0,
        duration: 0.6,
        ease: "power2.out",
      });
    };

    const container = containerRef.current;
    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative w-full h-full" style={{ perspective: "1000px" }}>
      <div
        ref={imageRef}
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
      >
        <Image
          src={src || "/img/home-hero/home-hero-03.png"}
          alt={alt || "Hero Illustration"}
          fill
          className="object-contain object-bottom"
        />
      </div>
    </div>
  );
}

function HeroContent({ data }: { data: HeroText }) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!container.current) return;

    const megaWords = container.current.querySelectorAll(".mega-word-inner");
    const taglineWords = container.current.querySelectorAll(".tagline-word");

    const tl = gsap.timeline();

    // Mask reveal animation: Words slide up from overflow-hidden container
    tl.from(megaWords, {
      y: "110%",
      opacity: 0,
      stagger: 0.2,
      duration: 1.2,
      ease: "expo.out"
    })
      // Staggered word-by-word reveal for the tagline, starting slightly after 'FOR' appears
      .from(taglineWords, {
        opacity: 0,
        y: 10,
        stagger: 0.03,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.6");

  }, { scope: container });

  const tagline = data.tagline;
  const taglineWords = tagline.split(" ");
  const firstLineWords = taglineWords.slice(0, 2);
  const secondLineWords = taglineWords.slice(2, 5);
  const thirdLineWords = taglineWords.slice(5);

  return (
    <div
      ref={container}
      className="flex flex-col font-mega text-mega-h1 uppercase text-brand w-fit"
      style={{
        WebkitTextStrokeWidth: '4px',
        WebkitTextStrokeColor: 'currentColor',
      }}
    >
      {/* WORD 1: BOLD */}
      <div className="overflow-hidden">
        <span className="mega-word-inner inline-block">{data.words[0]}</span>
      </div>

      {/* WORD 2: STUFF */}
      <div className="overflow-hidden">
        <span className="mega-word-inner inline-block">{data.words[1]}</span>
      </div>

      <div className="flex flex-row items-center gap-4 md:gap-64">
        <div className="overflow-hidden">
          <span className="mega-word-inner inline-block">{data.words[2]}</span>
        </div>

        {/* Desktop Tagline */}
        <div
          className="hidden md:flex flex-col text-text font-text text-text-lg normal-case leading-tight tracking-normal"
          style={{ WebkitTextStrokeWidth: '0px' }}
        >
          <div className="flex gap-x-[0.25em]">
            {firstLineWords.map((word, i) => (
              <span key={`l1-${i}`} className="tagline-word inline-block">{word}</span>
            ))}
          </div>
          <div className="flex gap-x-[0.25em]">
            {secondLineWords.map((word, i) => (
              <span key={`l2-${i}`} className="tagline-word inline-block">{word}</span>
            ))}
          </div>
          <div className="flex gap-x-[0.25em]">
            {thirdLineWords.map((word, i) => (
              <span key={`l3-${i}`} className="tagline-word inline-block">{word}</span>
            ))}
          </div>
        </div>

        {/* Mobile Tagline - Moved here near FOR */}
        <div
          className="md:hidden flex flex-col text-text font-text text-text-sm normal-case leading-tight tracking-normal"
          style={{ WebkitTextStrokeWidth: '0px' }}
        >
          <div className="flex gap-x-[0.25em]">
            {firstLineWords.map((word, i) => (
              <span key={`ml1-${i}`} className="tagline-word inline-block">{word}</span>
            ))}
          </div>
          <div className="flex gap-x-[0.25em]">
            {secondLineWords.map((word, i) => (
              <span key={`ml2-${i}`} className="tagline-word inline-block">{word}</span>
            ))}
          </div>
          <div className="flex gap-x-[0.25em]">
            {thirdLineWords.map((word, i) => (
              <span key={`ml3-${i}`} className="tagline-word inline-block">{word}</span>
            ))}
          </div>
        </div>
      </div>



      {/* WORD 4: BRANDS */}
      <div className="overflow-hidden">
        <span className="mega-word-inner inline-block">{data.words[3]}</span>
      </div>
    </div >
  );
}

interface HomeProps {
  heroData: HomeHeroData;
  servicesData: WhereWeCanHelpData;
  partnerData: PartnerStatementData;
  clientsData: HomeClientsData;
  statsData: HomeStatsData;
  testimonialsData: HomeTestimonialsData;
  quoteData: HomeQuoteData;
  faqData: HomeFAQData;
}

export default function Home({
  heroData,
  servicesData,
  partnerData,
  clientsData,
  statsData,
  testimonialsData,
  quoteData,
  faqData
}: HomeProps) {
  const mainRef = useRef<HTMLElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!mainRef.current || !quoteRef.current) return;

    // Animate background color from White to Dark (color-text)
    gsap.to(mainRef.current, {
      backgroundColor: "rgb(18, 12, 42)", // --color-text
      ease: "none",
      scrollTrigger: {
        trigger: quoteRef.current,
        start: "top bottom", // When top of quote hits bottom of viewport
        end: "center center", // When center of quote hits center of viewport
        scrub: true,
      }
    });
  }, { scope: mainRef });

  // Map masonryColumns from heroData
  const masonryColumns: MasonryColumn[] = heroData.columns.map((col) => ({
    id: col.id,
    width: col.width,
    cells: col.cells.map((cell) => {
      let content: React.ReactNode = null;

      if (cell.contentType === 'hero-text') {
        content = <HeroContent data={heroData.heroText} />;
      } else if (cell.contentType === 'video' && cell.contentProps?.videoSrc) {
        content = (
          <div className="relative w-full h-full">
            <video
              src={cell.contentProps.videoSrc}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
        );
      } else if (cell.contentType === 'distortion-image') {
        content = <DistortionImage src={cell.contentProps?.src} alt={cell.contentProps?.alt} />;
      } else if (cell.contentType === 'lottie') {
        content = <LottieAnimation src={cell.contentProps?.lottieSrc} />;
      } else if (cell.contentType === 'image' && cell.contentProps?.src) {
        content = (
          <div className="relative w-full h-full">
            <Image
              src={cell.contentProps.src}
              alt={cell.contentProps.alt || ""}
              fill
              className="object-cover"
            />
          </div>
        );
      } else if (cell.contentType === 'spline' && cell.contentProps?.splineUrl) {
        content = (
          <SplineScene sceneUrl={cell.contentProps.splineUrl} />
        );
      }

      return {
        id: cell.id,
        height: cell.height,
        className: cell.className,
        content
      };
    })
  }));

  return (
    <main ref={mainRef} className="min-h-screen bg-white pb-32 md:pb-0">
      {/* Horizontal Masonry Block */}
      <HomeHorizontalMasonry columns={masonryColumns} />

      {/* Quote */}
      <div ref={quoteRef} className="relative z-10">
        <SharedCenteredQuote
          quote={quoteData.quote}
          author={quoteData.author}
        />
      </div>

      {/* Where We Can Help */}
      <HomeWhereWeCanHelp data={servicesData} />

      {/* Partner Statement */}
      <HomePartnerStatement data={partnerData} />

      {/* Client Logos */}
      <SharedClientLogos data={clientsData.clients} />

      {/* Testimonials */}
      <SharedTestimonials testimonials={testimonialsData.testimonials} />

      {/* Stats Block */}
      <SharedStatsBlock stats={statsData.stats} />

      {/* FAQ Block */}
      <SharedFAQ data={faqData} />

      {/* Video Scrolling CTA */}
      <SharedVideoScrollingCTA />
    </main>
  );
}
