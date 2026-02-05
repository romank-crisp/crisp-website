/**
 * Team Members Content
 * 
 * How to add/edit team members:
 * 1. Add a new object to the teamMembers array below
 * 2. Ensure all required fields are filled: id, name, position, photo, bio, tags
 * 3. Photo should be a path to an image in /public/img/team/
 * 4. Tags should be an array of strings representing skills/expertise
 */

export interface TeamMember {
    id: string;
    name: string;
    position: string;
    photo: string;
    bio: string;
    tags: string[];
}

export const teamMembers: TeamMember[] = [
    {
        id: "roman-kovbasyuk",
        name: "Roman Kovbasyuk",
        position: "Founder, Head of Design",
        photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop",
        bio: "Founder and creative visionary leading Crisp Studio's design direction. Roman combines strategic thinking with exceptional design expertise to deliver award-winning digital experiences.",
        tags: ["Design Leadership", "Strategy", "Creative Direction"]
    },
    {
        id: "ira-davydenko",
        name: "Ira Davydenko",
        position: "Lead UX/UI Designer",
        photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop",
        bio: "Leading user experience design with a focus on creating intuitive and delightful interfaces. Ira combines research insights with creative design to solve complex UX challenges.",
        tags: ["UX Design", "UI Design", "User Research"]
    },
    {
        id: "iryna-chubur",
        name: "Iryna Chubur",
        position: "Branding and Marketing Architect",
        photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop",
        bio: "Crafting compelling brand narratives and marketing strategies that resonate with audiences. Iryna brings brands to life through thoughtful positioning and creative storytelling.",
        tags: ["Branding", "Marketing Strategy", "Brand Identity"]
    },
    {
        id: "anastasiia-zibla",
        name: "Anastasiia Zibla",
        position: "Project and Client Success",
        photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=500&fit=crop",
        bio: "Ensuring seamless project delivery and exceptional client experiences. Anastasiia orchestrates complex projects with precision while maintaining strong client relationships.",
        tags: ["Project Management", "Client Relations", "Operations"]
    },
    {
        id: "alina-romashko",
        name: "Alina Romashko",
        position: "Web & Visual Designer",
        photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop",
        bio: "Creating beautiful and functional web experiences with attention to detail. Alina blends visual aesthetics with user-centered design principles.",
        tags: ["Web Design", "Visual Design", "UI Design"]
    },
    {
        id: "danil-shepilov",
        name: "Danil Shepilov",
        position: "Visual Designer",
        photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=500&fit=crop",
        bio: "Bringing creative concepts to life through stunning visual design. Danil's work combines artistic vision with strategic design thinking.",
        tags: ["Visual Design", "Graphic Design", "Creative Concepts"]
    },
    {
        id: "vlad-baranov",
        name: "Vlad Baranov",
        position: "Visual Designer",
        photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop",
        bio: "Crafting impactful visual solutions that communicate brand messages effectively. Vlad's designs are both aesthetically pleasing and strategically sound.",
        tags: ["Visual Design", "Brand Design", "Digital Art"]
    },
    {
        id: "daria-sobal",
        name: "Daria Sobal",
        position: "Visual Designer",
        photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=500&fit=crop",
        bio: "Designing with passion and precision to create memorable visual experiences. Daria's work showcases a perfect balance of creativity and functionality.",
        tags: ["Visual Design", "Creative Design", "Brand Visuals"]
    },
    {
        id: "stepan-strizhak",
        name: "Stepan Strizhak",
        position: "Visual Designer",
        photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop",
        bio: "Transforming ideas into compelling visual narratives. Stepan brings fresh perspectives and innovative design solutions to every project.",
        tags: ["Visual Design", "Creative Solutions", "Design Innovation"]
    },
    {
        id: "kravtsova-anastasiia",
        name: "Kravtsova Anastasiia",
        position: "Web & UX/UI Designer",
        photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop",
        bio: "Designing seamless web experiences with a user-first approach. Anastasiia specializes in creating interfaces that are both beautiful and highly functional.",
        tags: ["Web Design", "UX/UI Design", "Interaction Design"]
    },
    {
        id: "andrii-zalizniak",
        name: "Andrii Zalizniak",
        position: "Front-End Developer",
        photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=500&fit=crop",
        bio: "Building performant and scalable web applications with modern technologies. Andrii brings designs to life with clean, efficient code.",
        tags: ["Front-End Development", "React", "JavaScript"]
    },
    {
        id: "dmytro-desiatov",
        name: "Dmytro Desiatov",
        position: "Front-End Developer",
        photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop",
        bio: "Crafting exceptional user interfaces with attention to performance and accessibility. Dmytro excels at turning complex requirements into elegant solutions.",
        tags: ["Front-End Development", "TypeScript", "Web Performance"]
    },
    {
        id: "denys-yanov",
        name: "Denys Yanov",
        position: "Digital Marketing Specialist",
        photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop",
        bio: "Driving digital growth through data-driven marketing strategies. Denys specializes in creating campaigns that deliver measurable results.",
        tags: ["Digital Marketing", "SEO", "Analytics"]
    }
];
