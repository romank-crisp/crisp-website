export interface TeamMember {
    name: string;
    title: string;
    bio: string;
    image?: string;
}

export const teamMembers: TeamMember[] = [
    {
        name: "Sarah Johnson",
        title: "Creative Director",
        bio: "With over 15 years of experience in brand strategy and creative direction, Sarah leads our team in crafting compelling visual narratives that resonate with audiences and drive business results."
    },
    {
        name: "Michael Chen",
        title: "Lead Developer",
        bio: "Michael brings a wealth of technical expertise and a passion for clean, efficient code. He specializes in building scalable web applications that deliver exceptional user experiences."
    },
    {
        name: "Emma Rodriguez",
        title: "UX/UI Designer",
        bio: "Emma's user-centered design approach combines research, creativity, and attention to detail to create intuitive interfaces that users love. She believes great design is invisible."
    },
    {
        name: "David Park",
        title: "Brand Strategist",
        bio: "David helps clients discover and articulate their unique brand voice. His strategic insights have helped numerous companies stand out in competitive markets."
    }
];
