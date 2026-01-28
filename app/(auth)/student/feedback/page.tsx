import { prisma } from "@/lib/prisma";
import Link from "next/link";
import FeedbackForm from "@/components/student/FeedbackForm";

export default async function StudentFeedbackPage() {
    const resources = await prisma.resources.findMany({
        select: {
            resource_id: true,
            resource_name: true
        }
    });

    return (
        <div className="container-fluid p-4">
            <div className="d-flex justify-content-between align-items-center mb-5 animate-fade-in">
                <Link href="/student" className="btn btn-modern">
                    <i className="bi bi-arrow-left me-2"></i>Back
                </Link>
            </div>

            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-6">
                    <div className="text-center mb-5 animate-fade-in">
                        <h1 className="fw-bold mb-1">
                            Share Your <span className="text-gradient">Feedback</span>
                        </h1>
                        <p className="text-muted">Help us improve the resources and services</p>
                    </div>

                    <FeedbackForm resources={resources} />
                </div>
            </div>
        </div>
    );
}
