<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\FakeStoreClient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Response;

class ProductController extends Controller
{
    public function __construct(private readonly FakeStoreClient $client)
    {
    }

    public function index(Request $request)
    {
        $key = 'products:all';
        $cached = Cache::get($key);
        if (!$cached) {
            $data = $this->client->listProducts();
            $etag = 'W/"'.sha1(json_encode($data)).'"';
            $lastModified = now()->toRfc7231String();
            $cached = ['data' => $data, 'etag' => $etag, 'last_modified' => $lastModified];
            Cache::put($key, $cached, now()->addMinutes(2));
        }

        if ($request->headers->get('If-None-Match') === $cached['etag']) {
            return response('', 304)->header('ETag', $cached['etag'])->header('Last-Modified', $cached['last_modified']);
        }

        return Response::json($cached['data'])
            ->header('ETag', $cached['etag'])
            ->header('Last-Modified', $cached['last_modified']);
    }

    public function show(Request $request, int $id)
    {
        $key = "products:{$id}";
        $cached = Cache::get($key);
        if (!$cached) {
            $data = $this->client->showProduct($id);
            $etag = 'W/"'.sha1(json_encode($data)).'"';
            $lastModified = now()->toRfc7231String();
            $cached = ['data' => $data, 'etag' => $etag, 'last_modified' => $lastModified];
            Cache::put($key, $cached, now()->addMinutes(5));
        }

        if ($request->headers->get('If-None-Match') === $cached['etag']) {
            return response('', 304)->header('ETag', $cached['etag'])->header('Last-Modified', $cached['last_modified']);
        }

        return Response::json($cached['data'])
            ->header('ETag', $cached['etag'])
            ->header('Last-Modified', $cached['last_modified']);
    }
}

