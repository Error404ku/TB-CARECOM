<?php

namespace App\Http\Resources\EducationalMaterial;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GetResource extends JsonResource
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
            'title' => $this->title,
            'content' => $this->content,
            'public_id' => $this->public_id,
            'url_file' => $this->url_file,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
