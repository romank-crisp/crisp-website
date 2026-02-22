import { motion, Variants } from "framer-motion";
import { TextFormatter } from "@/components/ui/TextFormatter";

interface WorksStepsProps {
    steps: string[];
}

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.1,
        }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: "easeOut"
        }
    }
};

export const WorksSteps: React.FC<WorksStepsProps> = ({ steps }) => {
    if (!steps || steps.length === 0) return null;

    return (
        <section className="w-full relative px-6 md:px-12 max-w-[1440px] mx-auto">
            <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-x-12"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
            >
                {steps.map((stepText, index) => (
                    <motion.div
                        key={index}
                        className="flex flex-col items-start text-left"
                        variants={itemVariants}
                    >
                        {/* Circle Number */}
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-gray-300 flex items-center justify-center font-text text-lg md:text-xl font-medium text-gray-800 mb-6 shrink-0">
                            {index + 1}
                        </div>
                        {/* Text Content */}
                        <p className="font-text text-xl md:text-2xl text-text leading-snug whitespace-pre-wrap">
                            <TextFormatter text={stepText} />
                        </p>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
};
