"use client";

import { useState } from "react";
import { HeroVideo } from "@/components/HeroVideo";
import { CaseStudyDetails } from "@/components/CaseStudyDetails";
import { StatsBlock } from "@/components/StatsBlock";
import { ScrollRevealImage } from "@/components/ScrollRevealImage";
import { TextReveal } from "@/components/TextReveal";
import { Navbar } from "@/components/Navbar";

export default function CentroGreenPage() {
  const [isHeroPlaying, setIsHeroPlaying] = useState(false);

  const introText = "CentroGreen is a new air purification brand created for a wholesale company in the United Arab Emirates. The client distributes premium air purifiers in a fast-growing category and needed a clear, credible presence in the local market.";

  const sections = [
    {
      title: "The Case",
      content: (
        <p>
          We were asked to build the brand from the ground up, including strategy, visual identity, visual communication, a marketing website, product pages, 3D product visualisations, and a digital design system to support ongoing launch activities.
        </p>
      )
    },
    {
      title: "Problem",
      content: (
        <div className="space-y-6">
          <p>
            The product and brand strategy were not yet defined when we started, so we had to create the brand foundation and voice from scratch while the market window was already open. Budget and timing were tight for a new product, and there were no usable product images, only basic photos.
          </p>
          <p>
            The challenge was to design a locally relevant, premium brand system that could quickly support launch, differentiate from strong competitors, and stay flexible for future e-commerce and campaigns.
          </p>
        </div>
      )
    },
    {
      title: "Solution and Deliverables",
      content: (
        <div className="space-y-6">
          <p>
            The product and brand strategy were not yet defined when we started, so we had to create the brand foundation and voice from scratch while the market window was already open. Budget and timing were tight for a new product, and there were no usable product images, only basic photos.
          </p>
          <p>
            The challenge was to design a locally relevant, premium brand system that could quickly support launch, differentiate from strong competitors, and stay flexible for future e-commerce and campaigns.
          </p>
        </div>
      )
    },
    {
      title: "AI-Assisted Workflows",
      content: (
        <div className="space-y-6">
          <p>
            AI supported the project in research, information structuring, naming options, copy drafts, visual exploration, design system workflows, and code generation for the website.
          </p>
          <p>
            We used detailed prompts and inputs so the outputs were targeted and useful from the first iterations.
          </p>
          <p>
            Brand strategy, visual identity, logo, key visuals, and final messaging were defined by the design and project teams, with AI used as a supporting tool rather than a decision maker.
          </p>
        </div>
      )
    }
  ];

  const sidebar = [
    { label: "Year", value: "2025" },
    { label: "CLIENT / LOCATION", value: "CentroGreen (UAE)" },
    {
      label: "INDUSTRY",
      value: (
        <>
          <p>eCommerce</p>
          <p>Manufacturing</p>
        </>
      )
    },
    {
      label: "DELIVERABLES",
      value: (
        <>
          <p>Branding</p>
          <p>Website</p>
          <p>Visual Communication Assets</p>
        </>
      )
    },
    {
      label: "AI-ASSISTED WORKFLOWS",
      isRed: true,
      value: (
        <>
          <p>Messaging and Tone of Voice</p>
          <p>Product Visuals</p>
        </>
      )
    }
  ];

  return (
    <main className="min-h-screen bg-white">
      <Navbar isHidden={isHeroPlaying} />

      <HeroVideo
        title="Centrogreen"
        subtitle="Launching a bespoke air quality solutions brand in Emirates"
        videoPath="/img/imgcases/centrogreen/centrogreen-reel.webm"
        posterPath="/img/imgcases/centrogreen/cg-image-01.jpg"
        tags={["Brand Identity", "Web Experience", "Product Visualization"]}
        onPlayChange={setIsHeroPlaying}
      />

      <section className="space-y-4 md:space-y-8 py-20">
        <div className="container mx-auto px-4 md:px-8 py-12 md:py-24">
          <TextReveal
            text="CentroGreen (UAE) is a regional leader in sustainable infrastructure and ecological innovation. "
            className="text-large w-full md:w-[60%] text-left font-body text-black/90"
          />
        </div>

        <div className="container mx-auto px-4 md:px-8">
          <ScrollRevealImage
            src="/img/imgcases/centrogreen/cg-image-01.jpg"
            alt="CentroGreen Visual 01"
            aspectRatio="aspect-video"
          />
        </div>

        <div className="container mx-auto px-4 md:px-8">
          <ScrollRevealImage
            src="/img/imgcases/centrogreen/cg-image-02.jpg"
            alt="CentroGreen Visual 02"
            aspectRatio="aspect-video"
          />
        </div>

        <div className="container mx-auto px-4 md:px-8">
          <ScrollRevealImage
            src="/img/imgcases/centrogreen/cg-image-03.jpg"
            alt="CentroGreen Visual 03"
            aspectRatio="aspect-video"
          />
        </div>

        <div className="container mx-auto px-4 md:px-8 py-12 md:py-24">
          <TextReveal
            text="CentroGreen (UAE) is a regional leader in sustainable infrastructure and ecological innovation. Our task was to redefine their digital footprint, blending high-tech precision with the organic warmth of their environmental mission."
            className="text-large w-full md:w-[60%] text-left font-body text-black/90"
          />
        </div>

        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            <ScrollRevealImage
              src="/img/imgcases/centrogreen/cg-image-04.jpg"
              alt="CentroGreen Visual 04"
              aspectRatio="aspect-square"
            />
            <ScrollRevealImage
              src="/img/imgcases/centrogreen/cg-image-05.jpg"
              alt="CentroGreen Visual 05"
              aspectRatio="aspect-square"
            />
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-8 py-12 md:py-24">
          <TextReveal
            text="The visual system relies on a palette of deep forest greens balanced by stark, laboratory whites. This duality reflects their commitment to both cutting-edge science and the preservation of natural landscapes."
            className="text-large w-full md:w-[60%] text-left font-body text-black/90"
          />
        </div>

        <div className="container mx-auto px-4 md:px-8">
          <ScrollRevealImage
            src="/img/imgcases/centrogreen/cg-image-06.jpg"
            alt="CentroGreen Visual 06"
            aspectRatio="aspect-video"
          />
        </div>

        <div className="container mx-auto px-4 md:px-8">
          <ScrollRevealImage
            src="/img/imgcases/centrogreen/cg-image-08.jpg"
            alt="CentroGreen Visual 08"
            aspectRatio="aspect-[16/9]"
          />
        </div>

        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            <ScrollRevealImage
              src="/img/imgcases/centrogreen/cg-image-09.jpg"
              alt="CentroGreen Visual 09"
              aspectRatio="aspect-[6/5]"
            />
            <ScrollRevealImage
              src="/img/imgcases/centrogreen/cg-image-10.jpg"
              alt="CentroGreen Visual 10"
              aspectRatio="aspect-[6/5]"
            />
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            <ScrollRevealImage
              src="/img/imgcases/centrogreen/cg-image-01.jpg"
              alt="CentroGreen Visual 11 Placeholder"
              aspectRatio="aspect-[4/5]"
            />
            <ScrollRevealImage
              src="/img/imgcases/centrogreen/cg-image-02.jpg"
              alt="CentroGreen Visual 12 Placeholder"
              aspectRatio="aspect-[4/5]"
            />
            <ScrollRevealImage
              src="/img/imgcases/centrogreen/cg-image-03.jpg"
              alt="CentroGreen Visual 13 Placeholder"
              aspectRatio="aspect-[4/5]"
            />
          </div>
        </div>

        <CaseStudyDetails
          intro={introText}
          sections={sections}
          sidebar={sidebar}
        />

        <StatsBlock stats={[
          { value: "40d", label: "Delivered in " },
          { value: "30+", label: "Brand Assets" },
          { value: "6", label: "Roles involved" },
          { value: "+15%/mo", label: "Traffic Growth" },
        ]} />
      </section>

      <footer className="bg-black text-white py-32 text-center">
        <div className="container mx-auto px-8">
          <h2 className="text-hero leading-none hover:text-accent transition-colors cursor-pointer">
            Next Case
          </h2>
          <p className="mt-8 text-white/50">Lets work together! </p>
        </div>
      </footer>
    </main>
  );
}

