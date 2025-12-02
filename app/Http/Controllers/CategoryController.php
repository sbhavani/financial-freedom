<?php

namespace App\Http\Controllers;

use App\Http\Requests\Categories\StoreCategoryRequest;
use App\Http\Requests\Categories\UpdateCategoryRequest;
use App\Models\Category;
use App\Services\Categories\DeleteCategory;
use App\Services\Categories\StoreCategory;
use App\Services\Categories\UpdateCategory;
use App\Services\Groups\IndexGroups;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index( Request $request )
    {
        $groups = ( new IndexGroups() )->index( $request );

        if ($request->wantsJson()) {
            return response()->json($groups);
        }

        return Inertia::render('Settings/Categories/Index', [
            'group' => 'settings',
            'subGroup' => 'categories',
            'groups' => fn () => $groups,
        ]);
    }

    public function store( StoreCategoryRequest $request )
    {
        ( new StoreCategory() )->store( $request );

        if ($request->wantsJson()) {
            return response()->json(['message' => 'Category created.']);
        }

        return redirect()->back();
    }

    public function update( UpdateCategoryRequest $request, Category $category )
    {
        ( new UpdateCategory() )->update( $request, $category );

        if ($request->wantsJson()) {
            return response()->json(['message' => 'Category updated.']);
        }

        return redirect()->back();
    }

    public function destroy( Request $request, Category $category )
    {
        ( new DeleteCategory() )->delete( $category );

        if ($request->wantsJson()) {
            return response()->json(['message' => 'Category deleted.']);
        }

        return redirect()->back();
    }
}
