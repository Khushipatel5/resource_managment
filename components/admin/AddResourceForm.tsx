"use client";

import { createResource } from "@/lib/actions/resources";
import { useState } from "react";

type ResourceType = {
    resource_type_id: number;
    type_name: string;
};

type Building = {
    building_id: number;
    building_name: string;
};

export default function AddResourceForm({
    resourceTypes,
    buildings,
}: {
    resourceTypes: ResourceType[];
    buildings: Building[];
}) {
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        setMessage(null);

        const formData = new FormData(event.currentTarget);
        const res = await createResource(formData);

        setIsSubmitting(false);
        if (res.error) {
            setMessage({ type: "error", text: res.error });
        } else if (res.success) {
            setMessage({ type: "success", text: res.success });
            (event.target as HTMLFormElement).reset();
        }
    };

    return (
        <div className="glass-card p-5 animate-fade-in" style={{ maxWidth: "800px", margin: "0 auto" }}>
            <div className="mb-4 text-center">
                <h2 className="fw-bold text-dark">Add New Resource</h2>
                <p className="text-muted">Enter the details for the new resource below.</p>
            </div>

            {message && (
                <div className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"} mb-4`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="row g-3">
                    <div className="col-md-12">
                        <label htmlFor="resourceName" className="form-label fw-semibold text-secondary small">
                            Resource Name
                        </label>
                        <input type="text" className="form-control" id="resourceName" name="resourceName" required placeholder="e.g. Projector A1" />
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="resourceTypeId" className="form-label fw-semibold text-secondary small">
                            Resource Type
                        </label>
                        <select className="form-select" id="resourceTypeId" name="resourceTypeId" required defaultValue="">
                            <option value="" disabled>
                                Select Type
                            </option>
                            {resourceTypes.map((type) => (
                                <option key={type.resource_type_id} value={type.resource_type_id}>
                                    {type.type_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="buildingId" className="form-label fw-semibold text-secondary small">
                            Building
                        </label>
                        <select className="form-select" id="buildingId" name="buildingId" required defaultValue="">
                            <option value="" disabled>
                                Select Building
                            </option>
                            {buildings.map((building) => (
                                <option key={building.building_id} value={building.building_id}>
                                    {building.building_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="floorNumber" className="form-label fw-semibold text-secondary small">
                            Floor Number
                        </label>
                        <input type="number" className="form-control" id="floorNumber" name="floorNumber" required placeholder="e.g. 2" />
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="maintenanceInterval" className="form-label fw-semibold text-secondary small">
                            Maintenance Interval (Days)
                        </label>
                        <input type="number" className="form-control" id="maintenanceInterval" name="maintenanceInterval" defaultValue="30" placeholder="e.g. 30" />
                    </div>

                    <div className="col-md-12">
                        <label htmlFor="description" className="form-label fw-semibold text-secondary small">
                            Description (Optional)
                        </label>
                        <textarea className="form-control" id="description" name="description" rows={3} placeholder="Additional details..."></textarea>
                    </div>

                    <div className="col-12 mt-4">
                        <button type="submit" className="btn btn-modern w-100" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <span>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Adding...
                                </span>
                            ) : "Add Resource"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
