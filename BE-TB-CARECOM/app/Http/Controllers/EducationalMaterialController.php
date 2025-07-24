<?php

namespace App\Http\Controllers;

use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Database\QueryException;
use App\Service\EducationalMaterialService;
use App\Http\Requests\EducationMaterial\UpdateRequest;
use App\Http\Requests\EducationMaterial\CreateEducationMaterial;
use App\Http\Requests\EducationMaterial\CreateEducationMaterialYT;

class EducationalMaterialController extends Controller
{
    use ApiResponse;

    public function __construct(
        private EducationalMaterialService $educationalMaterialService
    ) {}

    public function getAll(Request $request)
    {
        $filters = [
            'search' => $request->search,
            'per_page' => $request->per_page
        ];

        $result = $this->educationalMaterialService->getAll($filters);
        if (!$result['success']) {
            return $this->error($result['message'], $result['code'], null);
        }

        return $this->success($result['message'], 200, $result['data'], $result['pagination'], $result['current_filters']);
    }

    public function getById(int $id)
    {
        $result = $this->educationalMaterialService->getById($id);
        if (!$result['success']) {
            return $this->error($result['message'], $result['code'], null);
        }

        return $this->success($result['message'], 200, $result['data']);
    }

    public function createEducationMaterialYT(CreateEducationMaterialYT $request)
    {
        $educationalMaterial = $this->educationalMaterialService->createYoutubeLink($request->validated());
        if (!$educationalMaterial['success']) {
            return $this->error($educationalMaterial['message'], $educationalMaterial['code'], null);
        }

        return $this->success($educationalMaterial['message'], 201, $educationalMaterial['data']);
    }

    public function updateEducationMaterialYT(int $id, CreateEducationMaterialYT $request)
    {
        $educationalMaterial = $this->educationalMaterialService->updateYoutubeLink($id, $request->validated());
        if (!$educationalMaterial['success']) {
            return $this->error($educationalMaterial['message'], $educationalMaterial['code'], null);
        }

        return $this->success($educationalMaterial['message'], 201, $educationalMaterial['data']);
    }

    public function createEducationMaterial(CreateEducationMaterial $request)
    {
        $data = [
            'title' => $request->validated('title'),
            'content' => $request->validated('content'),
            'file' => $request->validated('file'),
        ];

        $educationalMaterial = $this->educationalMaterialService->create($data);
        if (!$educationalMaterial['success']) {
            return $this->error($educationalMaterial['message'], $educationalMaterial['code'], null);
        }

        return $this->success($educationalMaterial['message'], 201, $educationalMaterial['data']);
    }

    public function update(int $id, UpdateRequest $request)
    {
        $educationalMaterial = $this->educationalMaterialService->update($id, $request->validated());
        if (!$educationalMaterial['success']) {
            return $this->error($educationalMaterial['message'], $educationalMaterial['code'], null);
        }

        return $this->success($educationalMaterial['message'], 200, $educationalMaterial['data']);
    }

    public function delete(int $id)
    {
        $educationalMaterial = $this->educationalMaterialService->delete($id);
        if (!$educationalMaterial['success']) {
            return $this->error($educationalMaterial['message'], $educationalMaterial['code'], null);
        }

        return $this->success($educationalMaterial['message'], 200, null);
    }
}
