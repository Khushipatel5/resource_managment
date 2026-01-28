"use client";

import { createResourceType, deleteResourceType, createBuilding, deleteBuilding } from "@/lib/actions/inventory";
import { useState } from "react";

export default function InventoryClient({
    types,
    buildings
}: {
    types: any[],
    buildings: any[]
}) {
    const [activeTab, setActiveTab] = useState<'types' | 'buildings'>('types');
    const [loading, setLoading] = useState(false);

    async function handleCreateType(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        await createResourceType(formData);
        (e.target as HTMLFormElement).reset();
        setLoading(false);
    }

    async function handleCreateBuilding(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        await createBuilding(formData);
        (e.target as HTMLFormElement).reset();
        setLoading(false);
    }

    return (
        <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-bottom-0 pb-0">
                <ul className="nav nav-tabs card-header-tabs">
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'types' ? 'active fw-bold text-primary' : 'text-muted'}`}
                            onClick={() => setActiveTab('types')}
                        >
                            Resource Types
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'buildings' ? 'active fw-bold text-primary' : 'text-muted'}`}
                            onClick={() => setActiveTab('buildings')}
                        >
                            Buildings
                        </button>
                    </li>
                </ul>
            </div>
            <div className="card-body p-4">
                {activeTab === 'types' && (
                    <div className="animate-fade-in">
                        <h5 className="fw-bold mb-3">Resource Types</h5>
                        <form onSubmit={handleCreateType} className="d-flex gap-2 mb-4">
                            <input type="text" name="typeName" className="form-control" placeholder="New Type Name (e.g. Lab Equipment)" required />
                            <button className="btn btn-primary px-4" disabled={loading}>
                                {loading ? '...' : 'Add'}
                            </button>
                        </form>
                        <ul className="list-group">
                            {types.map(t => (
                                <li key={t.resource_type_id} className="list-group-item d-flex justify-content-between align-items-center">
                                    {t.type_name}
                                    <button onClick={() => deleteResourceType(t.resource_type_id)} className="btn btn-sm btn-outline-danger border-0">
                                        <i className="bi bi-trash"></i>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {activeTab === 'buildings' && (
                    <div className="animate-fade-in">
                        <h5 className="fw-bold mb-3">Buildings</h5>
                        <form onSubmit={handleCreateBuilding} className="row g-2 mb-4 align-items-end">
                            <div className="col-md-5">
                                <label className="small secondary">Name</label>
                                <input type="text" name="buildingName" className="form-control" placeholder="e.g. Science Block" required />
                            </div>
                            <div className="col-md-3">
                                <label className="small secondary">No.</label>
                                <input type="text" name="buildingNumber" className="form-control" placeholder="e.g. B-101" required />
                            </div>
                            <div className="col-md-2">
                                <label className="small secondary">Floors</label>
                                <input type="number" name="totalFloors" className="form-control" placeholder="5" required />
                            </div>
                            <div className="col-md-2">
                                <button className="btn btn-primary w-100" disabled={loading}>
                                    {loading ? '...' : 'Add'}
                                </button>
                            </div>
                        </form>
                        <div className="table-responsive">
                            <table className="table table-sm align-middle">
                                <thead><tr><th>Name</th><th>Number</th><th>Floors</th><th>Action</th></tr></thead>
                                <tbody>
                                    {buildings.map(b => (
                                        <tr key={b.building_id}>
                                            <td>{b.building_name}</td>
                                            <td>{b.building_number}</td>
                                            <td>{b.total_floors}</td>
                                            <td>
                                                <button onClick={() => deleteBuilding(b.building_id)} className="btn btn-sm btn-outline-danger border-0">
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
