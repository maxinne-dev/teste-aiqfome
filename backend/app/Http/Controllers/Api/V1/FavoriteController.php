<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreFavoriteRequest;
use App\Http\Resources\FavoriteResource;
use App\Models\Customer;
use App\Models\Favorite;
use Illuminate\Http\Response;

class FavoriteController extends Controller
{
    public function index(Customer $customer)
    {
        $favorites = Favorite::query()
            ->where('customer_id', $customer->id)
            ->latest('id')
            ->paginate(15);

        return FavoriteResource::collection($favorites);
    }

    public function store(StoreFavoriteRequest $request, Customer $customer)
    {
        $productId = (int) $request->validated()['product_id'];

        $favorite = Favorite::firstOrCreate([
            'customer_id' => $customer->id,
            'product_id' => $productId,
        ]);

        $resource = new FavoriteResource($favorite);
        $status = $favorite->wasRecentlyCreated ? Response::HTTP_CREATED : Response::HTTP_OK;

        return $resource->response()->setStatusCode($status);
    }

    public function destroy(Customer $customer, int $productId)
    {
        Favorite::query()
            ->where('customer_id', $customer->id)
            ->where('product_id', $productId)
            ->delete();

        return response()->noContent();
    }
}

