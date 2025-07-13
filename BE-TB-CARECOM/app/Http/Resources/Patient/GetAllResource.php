<?php

namespace App\Http\Resources\Patient;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GetAllResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'address' => $this->address,
            'gender' => $this->gender,
            'no_telp' => $this->no_telp,
            'start_treatment_date' => $this->start_treatment_date,
            'status' => $this->status,
            'pmo' => $this->pmo ? [
                'name' => $this->pmo->name,
                'gender' => $this->pmo->gender,
                'no_telp' => $this->pmo->no_telp,
                'relationship' => $this->pmo->relationship,
            ] : null,
            'assignedNurse' => $this->assignedNurse ? [
                'name' => $this->assignedNurse->name,
                'email' => $this->assignedNurse->email,
                'rs' => $this->assignedNurse->rs,
            ] : null,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
