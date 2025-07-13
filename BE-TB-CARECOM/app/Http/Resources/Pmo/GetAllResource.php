<?php

namespace App\Http\Resources\Pmo;

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
            'no_telp' => $this->no_telp,
            'relationship' => $this->relationship,
            'patient' => $this->patient ? [
                'name' => $this->patient->name,
                'address' => $this->patient->address,
                'no_telp' => $this->patient->no_telp,
                'status' => $this->patient->status,
            ] : null,
            'user' => $this->user ? [
                'name' => $this->user->name,
                'email' => $this->user->email,
                'rs' => $this->user->rs,
            ] : null,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
