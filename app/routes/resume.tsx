import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";
import Summary from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/Details";

export const meta = () => ([
    { title: 'Resumind | Review ' },
    { name: 'description', content: 'Detailed overview of your resume' },
])

const Resume = () => {
    const { auth, isLoading, fs, kv } = usePuterStore();
    const { id } = useParams();
    const [imageUrl, setImageUrl] = useState('');
    const [resumeUrl, setResumeUrl] = useState('');
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        console.log("[Auth Check] isLoading:", isLoading, "auth:", auth);
        if (!isLoading && !auth.isAuthenticated) {
            console.warn("[Auth Check] Not authenticated. Redirecting...");
            navigate(`/auth?next=/resume/${id}`);
        }
    }, [isLoading, auth]);

    useEffect(() => {
        const loadResume = async () => {
            console.log("[loadResume] Starting resume load for id:", id);

            try {
                const resume = await kv.get(`resume:${id}`);
                console.log("[KV] Raw resume data:", resume);

                if (!resume) {
                    console.error("[KV] No resume found for id:", id);
                    return;
                }

                let data;
                try {
                    data = JSON.parse(resume);
                    console.log("[KV] Parsed resume data:", data);
                } catch (parseError) {
                    console.error("[KV] Failed to parse resume JSON:", parseError);
                    return;
                }

                if (!data.resumePath) {
                    console.error("[Data] resumePath missing in stored data");
                    return;
                }

                const resumeBlob = await fs.read(data.resumePath);
                console.log("[FS] resumeBlob:", resumeBlob ? "Blob loaded" : "No blob");

                if (!resumeBlob) return;

                const pdfBlob = new Blob([resumeBlob], { type: 'application/pdf' });
                const generatedResumeUrl = URL.createObjectURL(pdfBlob);
                setResumeUrl(generatedResumeUrl);
                console.log("[FS] Resume URL set:", generatedResumeUrl);

                if (!data.imagePath) {
                    console.error("[Data] imagePath missing in stored data");
                    return;
                }

                const imageBlob = await fs.read(data.imagePath);
                console.log("[FS] imageBlob:", imageBlob ? "Blob loaded" : "No blob");

                if (!imageBlob) return;
                const generatedImageUrl = URL.createObjectURL(imageBlob);
                setImageUrl(generatedImageUrl);
                console.log("[FS] Image URL set:", generatedImageUrl);

                if (!data.feedback) {
                    console.error("[Data] No feedback found in resume data");
                } else {
                    console.log("[Data] Feedback object found:", data.feedback);
                }

                setFeedback(data.feedback ?? null);

            } catch (err) {
                console.error("[loadResume] Error loading resume:", err);
            }
        };

        loadResume();
    }, [id, kv, fs]);

    return (
        <main className="!pt-0">
            <nav className="resume-nav">
                <Link to="/" className="back-button">
                    <img src="/icons/back.svg" alt="logo" className="w-2.5 h-2.5" />
                    <span className="text-gray-800 text-sm font-semibold">Back to Homepage</span>
                </Link>
            </nav>
            <div className="flex flex-row w-full max-lg:flex-col-reverse">
                <section className="feedback-section bg-[url('/images/bg-small.svg') bg-cover h-[100vh] sticky top-0 items-center justify-center">
                    {imageUrl && resumeUrl && (
                        <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-wxl:h-fit w-fit">
                            <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                                <img
                                    src={imageUrl}
                                    className="w-full h-full object-contain rounded-2xl"
                                    title="resume"
                                />
                            </a>
                        </div>
                    )}
                </section>
                <section className="feedback-section">
                    <h2 className="text-4xl !text-black font-bold">Resume Review</h2>
                    {feedback ? (
                        <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
                            <Summary feedback={feedback} />
                            <ATS
                                score={feedback?.ATS?.score ?? 0}
                                suggestions={feedback?.ATS?.tips ?? []}
                            />
                            <Details feedback={feedback} />
                        </div>
                    ) : (
                        <img src="/images/resume-scan-2.gif" className="w-full" />
                    )}
                </section>
            </div>
        </main>
    )
}
export default Resume;
